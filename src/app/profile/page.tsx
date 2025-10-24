'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, User, Mail, Calendar, Shield, Building, Users, Settings } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getUserContext } from '@/lib/rbac-client'
import { UserContext } from '@/lib/types/rbac'

interface ProfileData {
  id: string
  email: string
  full_name?: string
  role: string
  is_platform_admin: boolean
  created_at: string
  last_active_at: string
}

interface OrganizationData {
  id: string
  name: string
  slug: string
  role: string
  status: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [userContext, setUserContext] = useState<UserContext | null>(null)
  const [organizations, setOrganizations] = useState<OrganizationData[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    full_name: '',
    email: ''
  })
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        console.log('Profile: Initializing profile page...')
        
        // Get authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
          console.error('Profile: Auth error:', userError)
          router.push('/login')
          return
        }
        
        setUser(user)
        console.log('Profile: User authenticated:', user.id)

        // Get user context with RBAC information
        const context = await getUserContext(user.id)
        if (!context) {
          console.error('Profile: Failed to get user context')
          router.push('/dashboard')
          return
        }

        setUserContext(context)
        setProfile(context.user as ProfileData)
        setEditForm({
          full_name: context.user.full_name || '',
          email: context.user.email
        })

        // Get user's organizations with roles
        const { data: orgMemberships, error: orgError } = await supabase
          .from('org_members')
          .select(`
            org_id,
            role,
            status,
            organizations (
              id,
              name,
              slug
            )
          `)
          .eq('user_id', user.id)
          .eq('status', 'active')

        if (orgError) {
          console.error('Profile: Error fetching organizations:', orgError)
        } else {
          const orgs = orgMemberships?.map(membership => ({
            id: membership.org_id,
            name: membership.organizations.name,
            slug: membership.organizations.slug,
            role: membership.role,
            status: membership.status
          })) || []
          setOrganizations(orgs)
        }

      } catch (error) {
        console.error('Profile: Error initializing:', error)
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    initializeProfile()
  }, [router])

  const handleSaveProfile = async () => {
    if (!user || !profile) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editForm.full_name,
          email: editForm.email,
          last_active_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) {
        console.error('Error updating profile:', error)
        return
      }

      // Update local state
      setProfile(prev => prev ? {
        ...prev,
        full_name: editForm.full_name,
        email: editForm.email
      } : null)

      setIsEditing(false)
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'platform_admin':
        return 'destructive'
      case 'org_owner':
        return 'default'
      case 'org_editor':
        return 'secondary'
      case 'org_viewer':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'platform_admin':
        return 'Platform Admin'
      case 'org_owner':
        return 'Organization Owner'
      case 'org_editor':
        return 'Organization Editor'
      case 'org_viewer':
        return 'Organization Viewer'
      default:
        return role
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile || !userContext) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
          <p className="text-muted-foreground mb-4">Unable to load your profile information</p>
          <Button onClick={() => router.push('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your account and organization access</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      Your personal account details and preferences
                    </CardDescription>
                  </div>
                  {!isEditing && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={editForm.full_name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleSaveProfile}
                        disabled={saving}
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false)
                          setEditForm({
                            full_name: profile.full_name || '',
                            email: profile.email
                          })
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{profile.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Full Name</p>
                        <p className="text-sm text-muted-foreground">
                          {profile.full_name || 'Not provided'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Member Since</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(profile.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Role</p>
                        <Badge variant={getRoleBadgeVariant(profile.role)}>
                          {getRoleDisplayName(profile.role)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Organization Access & Permissions */}
          <div className="space-y-6">
            {/* Current Organization */}
            {userContext.current_org && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Current Organization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">{userContext.current_org.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {userContext.current_org.slug}
                      </p>
                    </div>
                    {userContext.role_in_current_org && (
                      <Badge variant={getRoleBadgeVariant(`org_${userContext.role_in_current_org}`)}>
                        {getRoleDisplayName(`org_${userContext.role_in_current_org}`)}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* All Organizations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Organization Access
                </CardTitle>
                <CardDescription>
                  Organizations you have access to
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {organizations.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No organization memberships found
                    </p>
                  ) : (
                    organizations.map((org) => (
                      <div key={org.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{org.name}</p>
                          <p className="text-xs text-muted-foreground">{org.slug}</p>
                        </div>
                        <Badge variant={getRoleBadgeVariant(`org_${org.role}`)}>
                          {getRoleDisplayName(`org_${org.role}`)}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Permissions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Permissions
                </CardTitle>
                <CardDescription>
                  Your current permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {userContext.permissions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No specific permissions assigned
                    </p>
                  ) : (
                    userContext.permissions.map((permission, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">{permission}</span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                  <Link href="/settings" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Account Settings
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
