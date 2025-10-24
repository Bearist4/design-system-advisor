'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ensureUserProfile } from '@/lib/user-profile-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthDebugger() {
  const [authState, setAuthState] = useState<{ user: unknown; session: unknown } | null>(null)
  const [loading, setLoading] = useState(false)

  const checkAuthState = async () => {
    setLoading(true)
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      setAuthState({
        user: user,
        session: session,
        userError: userError,
        sessionError: sessionError,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      setAuthState({
        error: error,
        timestamp: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      await checkAuthState()
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setLoading(false)
    }
  }

  const testSignIn = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'testpassword'
      })
      
      if (error) throw error
      console.log('Test sign in successful:', data)
      await checkAuthState()
    } catch (error) {
      console.error('Test sign in error:', error)
    } finally {
      setLoading(false)
    }
  }

  const testProfileCreation = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const profile = await ensureUserProfile(
          user.id,
          user.email || '',
          user.user_metadata?.full_name || user.user_metadata?.name
        )
        console.log('Profile creation result:', profile)
        await checkAuthState()
      } else {
        alert('No user logged in')
      }
    } catch (error) {
      console.error('Profile creation error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuthState()
  }, [])

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Authentication Debugger</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Button onClick={checkAuthState} disabled={loading}>
            {loading ? 'Loading...' : 'Check Auth State'}
          </Button>
          <Button onClick={signOut} disabled={loading} variant="outline">
            Sign Out
          </Button>
          <Button onClick={testSignIn} disabled={loading} variant="secondary">
            Test Sign In
          </Button>
          <Button onClick={testProfileCreation} disabled={loading} variant="destructive">
            Test Profile Creation
          </Button>
        </div>

        {authState && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Current State:</h4>
              <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(authState, null, 2)}
              </pre>
            </div>

            <div>
              <h4 className="font-medium mb-2">Environment Variables:</h4>
              <div className="text-xs space-y-1">
                <div>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</div>
                <div>NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Browser Info:</h4>
              <div className="text-xs space-y-1">
                <div>URL: {typeof window !== 'undefined' ? window.location.href : 'N/A'}</div>
                <div>Cookies: {typeof document !== 'undefined' ? document.cookie : 'N/A'}</div>
                <div>User Agent: {typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
