'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Sidebar } from '@/components/ui/sidebar'
import { Navbar } from '@/components/ui/navbar'
import { ThemeToggleIcon } from '@/components/ui/theme-toggle'

interface User {
  id: string
  email?: string
  user_metadata?: Record<string, unknown>
  app_metadata?: Record<string, unknown>
}

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Pages that should not show the sidebar
  const noSidebarPages = ['/login', '/onboarding']
  const shouldShowSidebar = !noSidebarPages.includes(pathname)

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error) {
          console.error('Auth error:', error)
          if (pathname !== '/login') {
            router.push('/login')
          }
          return
        }
        
        if (!user) {
          if (pathname !== '/login') {
            router.push('/login')
          }
          return
        }
        
        setUser(user)
      } catch (error) {
        console.error('Error fetching user:', error)
        if (pathname !== '/login') {
          router.push('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [router, pathname])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // For pages that don't need sidebar, render children directly
  if (!shouldShowSidebar) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar 
          defaultCollapsed={sidebarCollapsed}
          onCollapseChange={setSidebarCollapsed}
        />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Navigation */}
          <Navbar 
            user={user} 
            onSignOut={handleSignOut}
          />
          
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
