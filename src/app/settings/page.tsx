'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, User, Calendar, Trash2, Palette } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { ThemeShowcase } from '@/components/ui/theme-showcase'
import { useTheme } from '@/contexts/ThemeContext'

export default function SettingsPage() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showThemeShowcase, setShowThemeShowcase] = useState(false)
  const router = useRouter()
  const { theme, resolvedTheme } = useTheme()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }
        setUser(user)
      } catch (error) {
        console.error('Error fetching user:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    try {
      // Delete user's token files first
      const { error: deleteError } = await supabase
        .from('token_files')
        .delete()
        .eq('user_id', user.id)

      if (deleteError) throw deleteError

      // Delete user account
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id)
      if (authError) throw authError

      router.push('/login')
    } catch (error: unknown) {
      console.error('Error deleting account:', error)
      const errorObj = error as { message?: string }
      alert('Error deleting account: ' + (errorObj.message || 'Unknown error'))
    } finally {
      setIsDeleting(false)
    }
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Not authenticated</h1>
          <p className="text-muted-foreground mb-4">Please sign in to access settings.</p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="mr-2 h-5 w-5" />
                Theme Preferences
              </CardTitle>
              <CardDescription>
                Customize the appearance of your interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="theme">Theme Mode</Label>
                <div className="mt-2 flex items-center gap-4">
                  <ThemeToggle />
                  <div className="text-sm text-muted-foreground">
                    Current: <span className="font-medium capitalize">{theme}</span>
                    {theme === 'system' && (
                      <span className="ml-1">
                        (using {resolvedTheme})
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Choose between light, dark, or system preference
                </p>
              </div>

              <div className="border-t pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowThemeShowcase(!showThemeShowcase)}
                  className="w-full"
                >
                  <Palette className="mr-2 h-4 w-4" />
                  {showThemeShowcase ? 'Hide' : 'View'} Theme Showcase
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  Explore the complete design system tokens
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Account Information
              </CardTitle>
              <CardDescription>
                Your account details and profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user.email}
                  disabled
                  className="mt-1"
                />
              </div>
              
              {user.user_metadata?.full_name && (
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={user.user_metadata.full_name}
                    disabled
                    className="mt-1"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="provider">Authentication Provider</Label>
                <div className="mt-1">
                  <Badge variant="secondary">
                    {user.app_metadata?.provider || 'email'}
                  </Badge>
                </div>
              </div>

              <div>
                <Label htmlFor="created">Account Created</Label>
                <div className="mt-1 flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1 h-3 w-3" />
                  {new Date(user.created_at).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
              <CardDescription>
                Manage your account and data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Button variant="outline" onClick={handleSignOut} className="w-full">
                  Sign Out
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  Sign out of your account on this device
                </p>
              </div>

              <div className="border-t pt-4">
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="w-full"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isDeleting ? 'Deleting...' : 'Delete Account'}
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  Permanently delete your account and all data
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {showThemeShowcase && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Design System Theme Showcase</CardTitle>
              <CardDescription>
                Complete overview of all design tokens in the current theme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ThemeShowcase />
            </CardContent>
          </Card>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>About Design System Advisor</CardTitle>
            <CardDescription>
              Information about this application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Version:</strong> 1.0.0
              </p>
              <p>
                <strong>Built with:</strong> Next.js 14, TypeScript, TailwindCSS, Supabase
              </p>
              <p>
                <strong>Purpose:</strong> Manage and organize design tokens for your design system
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
