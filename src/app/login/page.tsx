'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Github } from 'lucide-react'
import { useRouter } from 'next/navigation'
import AuthDebugger from '@/components/AuthDebugger'
import { ensureUserProfile } from '@/lib/user-profile-client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [debugInfo, setDebugInfo] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check Supabase configuration
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    setDebugInfo(`
Supabase URL: ${supabaseUrl ? '✅ Configured' : '❌ Missing'}
Supabase Key: ${supabaseKey ? '✅ Configured' : '❌ Missing'}
    `.trim())
  }, [])

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Enhanced Supabase configuration check
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      console.log('Supabase URL configured:', !!supabaseUrl)
      console.log('Supabase Key configured:', !!supabaseKey)
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase configuration is missing. Please check your environment variables:\n- NEXT_PUBLIC_SUPABASE_URL\n- NEXT_PUBLIC_SUPABASE_ANON_KEY')
      }

      if (isSignUp) {
        console.log('Attempting sign up for:', email)
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        
        if (error) {
          console.error('Sign up error:', error)
          throw error
        }
        
        console.log('Sign up successful:', data)
        alert('Check your email for the confirmation link!')
      } else {
        console.log('Attempting sign in for:', email)
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) {
          console.error('Sign in error:', error)
          throw error
        }
        
        console.log('Sign in successful:', data)
        console.log('Session data:', data.session)
        console.log('User data:', data.user)
        
        // Wait for session to be fully established
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) {
          console.error('Session error:', sessionError)
          throw new Error(`Session error: ${sessionError.message}`)
        }
        
        console.log('Current session:', session)
        
        // Verify the user is actually signed in
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) {
          console.error('User fetch error:', userError)
          throw new Error(`User fetch error: ${userError.message}`)
        }
        
        if (user) {
          console.log('User confirmed:', user)
          console.log('User email:', user.email)
          console.log('User ID:', user.id)
          
          // Ensure user has a profile in the database
          console.log('Ensuring user profile exists...')
          try {
            const userProfile = await ensureUserProfile(
              user.id, 
              user.email || '', 
              user.user_metadata?.full_name || user.user_metadata?.name
            )
            
            if (userProfile) {
              console.log('User profile ensured:', userProfile)
            } else {
              console.warn('Failed to ensure user profile, but continuing with authentication')
            }
          } catch (profileError) {
            console.error('Error ensuring user profile:', profileError)
            // Don't fail authentication if profile creation fails
            console.warn('Continuing with authentication despite profile error')
          }
          
          console.log('Attempting redirect to /dashboard...')
          
          // Use router.push instead of window.location for better Next.js integration
          router.push('/dashboard')
        } else {
          throw new Error('Authentication failed - no user session found')
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error)
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        statusText: error.statusText,
        code: error.code
      })
      
      // More detailed error messages
      let errorMessage = 'Authentication failed'
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials.'
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and click the confirmation link before signing in.'
      } else if (error.message.includes('Too many requests')) {
        errorMessage = 'Too many login attempts. Please wait a moment and try again.'
      } else {
        errorMessage = `Authentication failed: ${error.message}`
      }
      
      alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGitHubAuth = async () => {
    setIsLoading(true)
    try {
      // Enhanced Supabase configuration check
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase configuration is missing. Please check your environment variables:\n- NEXT_PUBLIC_SUPABASE_URL\n- NEXT_PUBLIC_SUPABASE_ANON_KEY')
      }

      console.log('Initiating GitHub OAuth...')
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })
      
      if (error) {
        console.error('GitHub OAuth error:', error)
        throw error
      }
      
      console.log('GitHub OAuth initiated:', data)
    } catch (error: any) {
      console.error('GitHub OAuth error:', error)
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        statusText: error.statusText,
        code: error.code
      })
      
      let errorMessage = 'GitHub authentication failed'
      if (error.message.includes('OAuth provider not enabled')) {
        errorMessage = 'GitHub authentication is not enabled. Please contact your administrator.'
      } else {
        errorMessage = `GitHub authentication failed: ${error.message}`
      }
      
      alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl space-y-6">
        <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Design System Advisor</CardTitle>
          <CardDescription>
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGitHubAuth}
            disabled={isLoading}
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>

          <div className="text-center">
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>

          {/* Debug Information */}
          <div className="mt-4 p-3 bg-muted rounded-md">
            <h4 className="text-sm font-medium mb-2">Debug Information:</h4>
            <pre className="text-xs text-muted-foreground whitespace-pre-wrap">{debugInfo}</pre>
            <div className="mt-2 space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.href = '/dashboard'}
              >
                Test Dashboard Access
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={async () => {
                  try {
                    const { data: { user }, error: userError } = await supabase.auth.getUser()
                    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
                    
                    console.log('Current user:', user)
                    console.log('Current session:', session)
                    console.log('User error:', userError)
                    console.log('Session error:', sessionError)
                    console.log('Cookies:', document.cookie)
                    
                    if (userError) {
                      alert(`User error: ${userError.message}`)
                    } else if (sessionError) {
                      alert(`Session error: ${sessionError.message}`)
                    } else if (user) {
                      alert(`Logged in as: ${user.email}`)
                    } else {
                      alert('Not logged in')
                    }
                  } catch (error) {
                    console.error('Debug check error:', error)
                    alert(`Debug check failed: ${error}`)
                  }
                }}
              >
                Check Auth Status
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  console.log('Environment check:')
                  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
                  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set')
                  console.log('Current URL:', window.location.href)
                  console.log('User Agent:', navigator.userAgent)
                }}
              >
                Environment Check
              </Button>
            </div>
          </div>
        </CardContent>
        </Card>
        
        {/* Auth Debugger - only show in development */}
        {process.env.NODE_ENV === 'development' && (
          <AuthDebugger />
        )}
      </div>
    </div>
  )
}
