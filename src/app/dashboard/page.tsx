'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { LoadingSpinner, StatusIndicator, StatusDot, EmptyState } from '@/components/ui/feedback'
import { Upload, FileText, Calendar, User, Settings, Shield, Building, Users, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getUserContext } from '@/lib/rbac-client'
import { UserContext } from '@/lib/types/rbac'

interface TokenFile {
  id: string
  filename: string
  category: string
  created_at: string
  user_id: string
  file_url: string
  token_data: Record<string, unknown>
}

interface User {
  id: string
  email?: string
  user_metadata?: Record<string, unknown>
  app_metadata?: Record<string, unknown>
}

export default function DashboardPage() {
  const [tokens, setTokens] = useState<TokenFile[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [userContext, setUserContext] = useState<UserContext | null>(null)
  const router = useRouter()

  useEffect(() => {
    console.log('Dashboard: Component mounted, starting initialization...')
    
    const getUser = async () => {
      console.log('Dashboard: Checking user authentication...')
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        console.log('Dashboard: User check result:', { user, error })
        
        if (error) {
          console.error('Dashboard: Auth error:', error)
          router.push('/login')
          return
        }
        
        if (!user) {
          console.log('Dashboard: No user found, redirecting to login')
          router.push('/login')
          return
        }
        console.log('Dashboard: User found, setting user state')
        setUser(user)
        
        // Get user context with RBAC information
        const context = await getUserContext(user.id)
        if (context) {
          setUserContext(context)
          console.log('Dashboard: User context loaded:', {
            role: context.user.role,
            orgCount: context.organizations.length,
            currentOrg: context.current_org?.name
          })
        }
      } catch (error) {
        console.error('Dashboard: Error in getUser:', error)
        router.push('/login')
      }
    }

    const getTokens = async () => {
      try {
        console.log('Dashboard: Fetching tokens...')
        const { data, error } = await supabase
          .from('token_files')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Dashboard: Error fetching tokens:', error)
          // Don't throw error, just set empty array
          setTokens([])
        } else {
          console.log('Dashboard: Tokens fetched successfully:', data?.length || 0)
          setTokens(data || [])
        }
      } catch (error) {
        console.error('Dashboard: Exception in getTokens:', error)
        setTokens([])
      } finally {
        console.log('Dashboard: Setting loading to false')
        setLoading(false)
      }
    }

    getUser()
    getTokens()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
          <p className="mt-1 text-xs text-muted-foreground">Please wait while we set up your dashboard</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState
          icon="error"
          title="Authentication Required"
          description="Please log in to access your dashboard"
          action={{
            label: "Go to Login",
            onClick: () => router.push('/login')
          }}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
        <div className="mb-8">
          <div>
            <h2 className="text-3xl font-bold">Dashboard</h2>
            <p className="text-muted-foreground">Manage your design tokens</p>
          </div>
        </div>

        {/* Profile & Organization Context */}
        {userContext && (
          <div className="grid grid-cols-fluid gap-fluid-md mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Organization</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userContext.current_org?.name || 'No Organization'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {userContext.current_org?.slug || 'Not assigned to any organization'}
                </p>
                {userContext.role_in_current_org && (
                  <div className="flex items-center gap-2 mt-2">
                    <StatusDot 
                      variant={userContext.role_in_current_org === 'owner' ? 'success' : 
                              userContext.role_in_current_org === 'editor' ? 'warning' : 'info'} 
                    />
                    <Badge variant="outline">
                      {userContext.role_in_current_org === 'owner' ? 'Owner' :
                       userContext.role_in_current_org === 'editor' ? 'Editor' :
                       'Viewer'}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Organizations</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userContext.organizations.length}</div>
              <p className="text-xs text-muted-foreground">Organizations you belong to</p>
              {userContext.organizations.length > 0 && (
                <div className="flex items-center gap-1 mt-2">
                  <StatusDot variant="success" />
                  <span className="text-xs text-green-600 dark:text-green-400">Active</span>
                </div>
              )}
            </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Permissions</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userContext.permissions.length}</div>
              <p className="text-xs text-muted-foreground">
                {userContext.permissions.includes('*') ? 'All permissions' : 'Specific permissions'}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <StatusDot 
                  variant={userContext.permissions.includes('*') ? 'success' : 'warning'} 
                />
                <span className="text-xs text-muted-foreground">
                  {userContext.permissions.includes('*') ? 'Full access' : 'Limited access'}
                </span>
              </div>
            </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-fluid gap-fluid-md mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tokens.length}</div>
              <p className="text-xs text-muted-foreground">Token files uploaded</p>
              {tokens.length > 0 && (
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                  <span className="text-xs text-green-600 dark:text-green-400">Growing</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Badge variant="secondary">6</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(tokens.map(t => t.category)).size}
              </div>
              <p className="text-xs text-muted-foreground">Different categories</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {Array.from(new Set(tokens.map(t => t.category))).slice(0, 3).map(category => (
                  <Badge key={category} variant={category as any} className="text-xs">
                    {category}
                  </Badge>
                ))}
                {new Set(tokens.map(t => t.category)).size > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{new Set(tokens.map(t => t.category)).size - 3} more
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Upload</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tokens.length > 0 ? new Date(tokens[0].created_at).toLocaleDateString() : 'None'}
              </div>
              <p className="text-xs text-muted-foreground">Latest upload date</p>
              {tokens.length > 0 && (
                <div className="flex items-center gap-1 mt-2">
                  <Clock className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs text-blue-600 dark:text-blue-400">
                    {new Date(tokens[0].created_at).toLocaleTimeString()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Token Files</CardTitle>
                <CardDescription>Your uploaded design token files</CardDescription>
              </div>
              <Link href="/upload">
                <Button icon={Upload} iconPosition="left">
                  Upload Tokens
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {tokens.length === 0 ? (
              <EmptyState
                icon="file"
                title="No tokens uploaded yet"
                description="Upload your first design token file to get started"
                action={{
                  label: "Upload Tokens",
                  onClick: () => router.push('/upload')
                }}
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Filename</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tokens.map((token) => (
                    <TableRow key={token.id}>
                      <TableCell className="font-medium">{token.filename}</TableCell>
                      <TableCell>
                        <Badge variant={token.category as "default" | "secondary" | "destructive" | "outline" | "foundation" | "spacing" | "brand" | "component" | "platform" | "misc"}>{token.category}</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(token.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link href={`/tokens/${token.id}`}>
                            <Button variant="outline" size="sm">View</Button>
                          </Link>
                          <StatusDot variant="success" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
    </div>
  )
}
