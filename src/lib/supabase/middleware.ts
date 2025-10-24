import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getUserContext, isPlatformAdmin } from '../rbac'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log('Middleware: Checking authentication for', request.nextUrl.pathname)
  console.log('Middleware: User found:', !!user)
  console.log('Middleware: User details:', user ? { id: user.id, email: user.email } : 'No user')

  // Basic authentication check
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth') &&
    !request.nextUrl.pathname.startsWith('/api/auth') &&
    !request.nextUrl.pathname.startsWith('/onboarding')
  ) {
    console.log('Middleware: No user found, redirecting to login')
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Enhanced RBAC checks for authenticated users
  if (user) {
    try {
      const userContext = await getUserContext(user.id);
      
      if (!userContext) {
        console.log('Middleware: User context not found, attempting to create user profile...')
        
        // Try to create user profile if it doesn't exist
        try {
          // Create user profile directly using server client
          const { data: userProfile, error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email || '',
              full_name: user.user_metadata?.full_name || user.user_metadata?.name,
              role: 'org_viewer',
              is_platform_admin: false,
              created_at: new Date().toISOString(),
              last_active_at: new Date().toISOString()
            })
            .select()
            .single();
          
          if (userProfile && !profileError) {
            console.log('Middleware: User profile created successfully, retrying context fetch...')
            // Retry getting user context
            const retryUserContext = await getUserContext(user.id);
            if (retryUserContext) {
              console.log('Middleware: User context retrieved after profile creation')
              // Continue with the retry context
              const pathname = request.nextUrl.pathname;
              const isProtectedRoute = pathname.startsWith('/dashboard') || 
                                    pathname.startsWith('/tokens') || 
                                    pathname.startsWith('/api/');

              if (isProtectedRoute && !retryUserContext.current_org) {
                if (!pathname.startsWith('/dashboard/select-org')) {
                  console.log('Middleware: No organization access, redirecting to org selection')
                  const url = request.nextUrl.clone()
                  url.pathname = '/dashboard/select-org'
                  return NextResponse.redirect(url)
                }
              }

              return supabaseResponse;
            }
          } else {
            console.error('Middleware: Error creating user profile:', profileError);
            
            // Check if it's an RLS recursion error
            const errorObj = profileError as { code?: string; message?: string }
            if (errorObj.code === '42P17' || errorObj.message?.includes('infinite recursion')) {
              console.error('Middleware: RLS recursion error detected. Database policies need to be fixed.');
              console.error('Middleware: Please run FIX_RLS_RECURSION.sql in your Supabase SQL Editor');
            }
          }
        } catch (profileError) {
          console.error('Middleware: Error creating user profile:', profileError)
          
          // Check if it's an RLS recursion error
          const errorObj = profileError as { code?: string; message?: string }
          if (errorObj.code === '42P17' || errorObj.message?.includes('infinite recursion')) {
            console.error('Middleware: RLS recursion error detected. Database policies need to be fixed.');
            console.error('Middleware: Please run FIX_RLS_RECURSION.sql in your Supabase SQL Editor');
          }
        }
        
        console.log('Middleware: User context still not found after profile creation attempt, redirecting to login')
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
      }

      // Check for organization access on protected routes
      const pathname = request.nextUrl.pathname;
      const isProtectedRoute = pathname.startsWith('/dashboard') || 
                              pathname.startsWith('/tokens') || 
                              pathname.startsWith('/api/');
      
      // Skip organization check for onboarding
      if (pathname.startsWith('/onboarding')) {
        console.log('Middleware: Onboarding page, skipping organization check')
        return supabaseResponse
      }

      console.log('Middleware: Checking organization access for path:', pathname);
      console.log('Middleware: User context current_org:', userContext.current_org ? { id: userContext.current_org.id, name: userContext.current_org.name } : 'None');
      console.log('Middleware: User organizations:', userContext.organizations.map(org => ({ id: org.id, name: org.name })));
      console.log('Middleware: Onboarding completed:', (userContext.user as { onboarding_completed?: boolean }).onboarding_completed);

      if (isProtectedRoute && (!userContext.current_org || !(userContext.user as { onboarding_completed?: boolean }).onboarding_completed)) {
        // User has no organization access or hasn't completed onboarding, redirect to onboarding
        if (!pathname.startsWith('/onboarding')) {
          console.log('Middleware: No organization access or onboarding not completed, redirecting to onboarding')
          const url = request.nextUrl.clone()
          url.pathname = '/onboarding'
          return NextResponse.redirect(url)
        }
      }

      // Platform admin bypass for all routes
      if (await isPlatformAdmin(user.id)) {
        console.log('Middleware: Platform admin access granted')
        return supabaseResponse
      }

      // Check organization-specific access
      const orgId = extractOrgIdFromPath();
      if (orgId && userContext.current_org?.id !== orgId) {
        // Check if user has access to this specific organization
        const hasOrgAccess = userContext.organizations.some(org => org.id === orgId);
        if (!hasOrgAccess) {
          console.log('Middleware: No access to organization', orgId, 'redirecting to dashboard')
          const url = request.nextUrl.clone()
          url.pathname = '/dashboard'
          return NextResponse.redirect(url)
        }
      }

      console.log('Middleware: User authenticated with proper access')
    } catch (error) {
      console.error('Middleware: Error checking user context:', error)
      // On error, allow access but log the issue
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object instead of the supabaseResponse object

  return supabaseResponse
}

// Helper function to extract organization ID from path
function extractOrgIdFromPath(): string | null {
  // Only check specific paths that should contain organization IDs
  // For now, we don't have org-specific paths, so return null
  // This can be extended later if we add paths like /dashboard/{orgId}/...
  
  // Example patterns for future use:
  // /dashboard/{orgId}/settings
  // /tokens/{orgId}/...
  // /organizations/{orgId}/...
  
  return null;
}
