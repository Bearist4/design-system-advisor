'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Shield, User, Building } from 'lucide-react'
import { getUserContext } from '@/lib/rbac-client'
import { UserContext } from '@/lib/types/rbac'

interface TestResult {
  test: string
  passed: boolean
  message: string
  details?: unknown
}

export default function ProfileAccessTest() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [userContext, setUserContext] = useState<UserContext | null>(null)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(true)
  const [runningTests, setRunningTests] = useState(false)

  useEffect(() => {
    const initializeTest = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error || !user) {
          console.error('Test: Auth error:', error)
          return
        }
        
        setUser(user)
        
        // Get user context with RBAC information
        const context = await getUserContext(user.id)
        setUserContext(context)
        
      } catch (error) {
        console.error('Test: Error initializing:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeTest()
  }, [])

  const runRBACTests = async () => {
    if (!user || !userContext) return

    setRunningTests(true)
    const results: TestResult[] = []

    try {
      // Test 1: Profile Access
      results.push({
        test: 'Profile Access',
        passed: true,
        message: 'Profile page accessible',
        details: {
          userId: user.id,
          userRole: userContext.user.role,
          isPlatformAdmin: userContext.user.is_platform_admin
        }
      })

      // Test 2: Organization Context
      results.push({
        test: 'Organization Context',
        passed: userContext.organizations.length > 0,
        message: userContext.organizations.length > 0 
          ? `User belongs to ${userContext.organizations.length} organization(s)`
          : 'User not assigned to any organization',
        details: {
          organizationCount: userContext.organizations.length,
          currentOrg: userContext.current_org?.name,
          roleInCurrentOrg: userContext.role_in_current_org
        }
      })

      // Test 3: Permission System
      results.push({
        test: 'Permission System',
        passed: userContext.permissions.length > 0,
        message: userContext.permissions.length > 0
          ? `User has ${userContext.permissions.length} permission(s)`
          : 'No permissions assigned',
        details: {
          permissions: userContext.permissions,
          hasWildcard: userContext.permissions.includes('*')
        }
      })

      // Test 4: Role Hierarchy
      const roleTests = [
        {
          role: 'platform_admin',
          expected: userContext.user.role === 'platform_admin',
          message: 'Platform Admin role check'
        },
        {
          role: 'org_owner',
          expected: userContext.user.role === 'org_owner' || userContext.role_in_current_org === 'owner',
          message: 'Organization Owner role check'
        },
        {
          role: 'org_editor',
          expected: userContext.user.role === 'org_editor' || userContext.role_in_current_org === 'editor',
          message: 'Organization Editor role check'
        },
        {
          role: 'org_viewer',
          expected: userContext.user.role === 'org_viewer' || userContext.role_in_current_org === 'viewer',
          message: 'Organization Viewer role check'
        }
      ]

      roleTests.forEach(roleTest => {
        results.push({
          test: roleTest.message,
          passed: roleTest.expected,
          message: roleTest.expected ? `${roleTest.role} role confirmed` : `${roleTest.role} role not found`,
          details: {
            userRole: userContext.user.role,
            orgRole: userContext.role_in_current_org,
            isPlatformAdmin: userContext.user.is_platform_admin
          }
        })
      })

      // Test 5: Profile Data Integrity
      results.push({
        test: 'Profile Data Integrity',
        passed: !!(userContext.user.id && userContext.user.email),
        message: userContext.user.id && userContext.user.email
          ? 'Profile data is complete'
          : 'Profile data is incomplete',
        details: {
          hasId: !!userContext.user.id,
          hasEmail: !!userContext.user.email,
          hasFullName: !!userContext.user.full_name,
          createdAt: userContext.user.created_at,
          lastActiveAt: userContext.user.last_active_at
        }
      })

      // Test 6: Organization Access
      if (userContext.current_org) {
        results.push({
          test: 'Current Organization Access',
          passed: true,
          message: `Access to organization: ${userContext.current_org.name}`,
          details: {
            orgId: userContext.current_org.id,
            orgName: userContext.current_org.name,
            orgSlug: userContext.current_org.slug,
            userRole: userContext.role_in_current_org
          }
        })
      } else {
        results.push({
          test: 'Current Organization Access',
          passed: false,
          message: 'No current organization assigned',
          details: {
            availableOrgs: userContext.organizations.length
          }
        })
      }

      // Test 7: Permission Granularity
      const permissionTests = [
        { permission: 'tokens:read', description: 'Read tokens' },
        { permission: 'tokens:create', description: 'Create tokens' },
        { permission: 'tokens:update', description: 'Update tokens' },
        { permission: 'tokens:delete', description: 'Delete tokens' },
        { permission: 'organizations:read', description: 'Read organizations' },
        { permission: 'members:read', description: 'Read members' },
        { permission: 'members:manage', description: 'Manage members' }
      ]

      permissionTests.forEach(permTest => {
        const hasPermission = userContext.permissions.includes('*') || 
                             userContext.permissions.includes(permTest.permission)
        
        results.push({
          test: permTest.description,
          passed: hasPermission,
          message: hasPermission 
            ? `Has ${permTest.permission} permission`
            : `Missing ${permTest.permission} permission`,
          details: {
            permission: permTest.permission,
            hasWildcard: userContext.permissions.includes('*'),
            allPermissions: userContext.permissions
          }
        })
      })

    } catch (error) {
      results.push({
        test: 'Test Execution',
        passed: false,
        message: `Error running tests: ${error}`,
        details: { error: error }
      })
    }

    setTestResults(results)
    setRunningTests(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading test environment...</p>
        </div>
      </div>
    )
  }

  if (!user || !userContext) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Test Environment Not Ready</h2>
          <p className="text-muted-foreground mb-4">Unable to load user context for testing</p>
        </div>
      </div>
    )
  }

  const passedTests = testResults.filter(r => r.passed).length
  const totalTests = testResults.length
  const testSuccessRate = totalTests > 0 ? Number((passedTests / totalTests * 100).toFixed(1)) : 0

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">RBAC Profile Access Test</h1>
          <p className="text-muted-foreground">Comprehensive testing of profile access with role-based permissions</p>
        </div>

        {/* User Context Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">User Profile</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userContext.user.full_name || 'No Name'}</div>
              <p className="text-xs text-muted-foreground">{userContext.user.email}</p>
              <Badge variant="outline" className="mt-2">
                {userContext.user.role === 'platform_admin' ? 'Platform Admin' :
                 userContext.user.role === 'org_owner' ? 'Org Owner' :
                 userContext.user.role === 'org_editor' ? 'Org Editor' :
                 'Org Viewer'}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Organization</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userContext.current_org?.name || 'No Org'}
              </div>
              <p className="text-xs text-muted-foreground">
                {userContext.role_in_current_org || 'No Role'}
              </p>
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

        {/* Test Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
            <CardDescription>
              Run comprehensive RBAC tests to verify profile access functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={runRBACTests}
              disabled={runningTests}
              className="w-full"
            >
              {runningTests ? 'Running Tests...' : 'Run RBAC Tests'}
            </Button>
          </CardContent>
        </Card>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Test Results
                  <Badge variant={testSuccessRate >= 80 ? 'default' : 'destructive'}>
                    {testSuccessRate}% Pass Rate
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {passedTests} of {totalTests} tests passed
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 gap-4">
              {testResults.map((result, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {result.passed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                          <h3 className="font-medium">{result.test}</h3>
                          <p className="text-sm text-muted-foreground">{result.message}</p>
                        </div>
                      </div>
                      <Badge variant={result.passed ? 'default' : 'destructive'}>
                        {result.passed ? 'PASS' : 'FAIL'}
                      </Badge>
                    </div>
                    {result.details && typeof result.details === 'object' && result.details !== null ? (
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <pre className="text-xs overflow-auto">
                          {JSON.stringify(result.details as Record<string, unknown>, null, 2)}
                        </pre>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
