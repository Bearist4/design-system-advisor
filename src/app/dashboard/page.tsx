'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Upload, FileText, Calendar, User, Settings, Shield, Building, Users } from 'lucide-react'
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
  token_data: any
}

export default function DashboardPage() {
  const [tokens, setTokens] = useState<TokenFile[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
          <p className="mt-1 text-xs text-muted-foreground">Please wait while we set up your dashboard</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-4">Please log in to access your dashboard</p>
          <Button onClick={() => router.push('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" aria-label="Main navigation">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold">Design System Advisor</h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-3">
              {userContext && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{userContext.user.full_name || userContext.user.email}</span>
                  <Badge variant="outline" className="text-xs">
                    {userContext.user.role === 'platform_admin' ? 'Platform Admin' :
                     userContext.user.role === 'org_owner' ? 'Org Owner' :
                     userContext.user.role === 'org_editor' ? 'Org Editor' :
                     'Org Viewer'}
                  </Badge>
                </div>
              )}
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Link href="/test-profile">
                <Button variant="outline" size="sm">
                  <Shield className="h-4 w-4 mr-2" />
                  Test RBAC
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
            
            {/* Mobile Navigation Menu */}
            <div className="md:hidden" aria-label="Mobile navigation menu">
              <Button variant="outline" size="sm" aria-label="Open mobile menu">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div>
            <h2 className="text-3xl font-bold">Dashboard</h2>
            <p className="text-muted-foreground">Manage your design tokens</p>
          </div>
        </div>

        {/* Profile & Organization Context */}
        {userContext && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                  <Badge variant="outline" className="mt-2">
                    {userContext.role_in_current_org === 'owner' ? 'Owner' :
                     userContext.role_in_current_org === 'editor' ? 'Editor' :
                     'Viewer'}
                  </Badge>
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
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tokens.length}</div>
              <p className="text-xs text-muted-foreground">Token files uploaded</p>
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
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Tokens
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {tokens.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tokens uploaded yet</h3>
                <p className="text-muted-foreground mb-4">
                  Upload your first design token file to get started
                </p>
                <Link href="/upload">
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Tokens
                  </Button>
                </Link>
              </div>
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
                        <Badge variant={token.category as any}>{token.category}</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(token.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Link href={`/tokens/${token.id}`}>
                          <Button variant="outline" size="sm">View</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
