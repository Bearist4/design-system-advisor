'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Building2, Plus, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Organization {
  id: string
  name: string
  slug: string
  description?: string
  owner_id: string
  created_at: string
}

export default function OnboardingPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newOrgName, setNewOrgName] = useState('')
  const [newOrgDescription, setNewOrgDescription] = useState('')
  const [creating, setCreating] = useState(false)
  const [selecting, setSelecting] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        router.push('/login')
        return
      }
      setUser(user)
    }

    const getOrganizations = async () => {
      try {
        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching organizations:', error)
          setOrganizations([])
        } else {
          setOrganizations(data || [])
        }
      } catch (error) {
        console.error('Error fetching organizations:', error)
        setOrganizations([])
      } finally {
        setLoading(false)
      }
    }

    getUser()
    getOrganizations()
  }, [router])

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newOrgName.trim()) return

    setCreating(true)
    try {
      console.log('Creating organization with data:', {
        name: newOrgName.trim(),
        slug: newOrgName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        description: newOrgDescription.trim() || null,
        owner_id: user.id,
        settings: {},
        plan: 'free',
        status: 'active'
      })

      // First, ensure user profile exists
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          created_at: new Date().toISOString(),
          last_active_at: new Date().toISOString()
        })

      if (profileError) {
        console.error('Profile upsert error:', profileError)
        throw new Error(`Failed to ensure user profile: ${profileError.message}`)
      }

      console.log('User profile ensured')

      // Create organization
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: newOrgName.trim(),
          slug: newOrgName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          description: newOrgDescription.trim() || null,
          owner_id: user.id,
          settings: {},
          plan: 'free',
          status: 'active'
        })
        .select()
        .single()

      if (orgError) {
        console.error('Organization creation error:', orgError)
        throw new Error(`Failed to create organization: ${orgError.message}`)
      }

      console.log('Organization created successfully:', org)

      // Add user as owner member
      const { error: memberError } = await supabase
        .from('org_members')
        .insert({
          user_id: user.id,
          org_id: org.id,
          role: 'owner',
          status: 'active'
        })

      if (memberError) {
        console.error('Member creation error:', memberError)
        throw new Error(`Failed to add user as member: ${memberError.message}`)
      }

      console.log('User added as organization member successfully')

      // Set as current organization and mark onboarding as completed
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          current_org_id: org.id,
          onboarding_completed: true,
          last_active_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (updateError) {
        console.error('Error updating profile after organization creation:', updateError)
        throw new Error(`Failed to update profile: ${updateError.message}`)
      }

      console.log('Onboarding completed successfully')
      
      // Add a small delay to ensure the database update is processed
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Redirect to dashboard
      window.location.href = '/dashboard'
    } catch (error) {
      console.error('Error creating organization:', error)
      alert(`Failed to create organization: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setCreating(false)
    }
  }

  const handleSelectOrganization = async (orgId: string) => {
    if (!user) return
    
    try {
      setSelecting(orgId)
      console.log('Selecting organization:', orgId)
      console.log('User ID:', user.id)
      
      // First, ensure the user profile exists
      console.log('Ensuring user profile exists...')
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          created_at: new Date().toISOString(),
          last_active_at: new Date().toISOString()
        })

      if (profileError) {
        console.error('Error ensuring profile exists:', profileError)
        alert('Failed to ensure profile exists. Please try again.')
        return
      }

      // Update user profile with current organization and mark onboarding as completed
      console.log('Attempting to update profile with current_org_id:', orgId)
      const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .update({ 
          current_org_id: orgId,
          onboarding_completed: true,
          last_active_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()

      console.log('Update result:', { updateData, updateError })

      if (updateError) {
        console.error('Error updating current organization:', updateError)
        alert('Failed to select organization. Please try again.')
        return
      }

      if (!updateData || updateData.length === 0) {
        console.error('No data returned from update - profile might not exist')
        alert('Failed to update profile. Please try again.')
        return
      }

      console.log('Organization selected successfully, updated profile:', updateData)
      console.log('Onboarding completed successfully')
      
      // Add a small delay to ensure the database update is processed
      await new Promise(resolve => setTimeout(resolve, 500))
      
      console.log('Redirecting to dashboard...')
      // Use window.location for a hard redirect to ensure middleware runs
      window.location.href = '/dashboard'
    } catch (error) {
      console.error('Error selecting organization:', error)
      alert('Failed to select organization. Please try again.')
    } finally {
      setSelecting(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading organizations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Welcome to Design System Advisor</h1>
          <p className="text-muted-foreground mt-2">
            Let&apos;s get you set up with an organization to manage your design tokens
          </p>
        </div>

        {organizations.length === 0 && !showCreateForm ? (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Organizations Found</h2>
            <p className="text-muted-foreground mb-6">
              You don&apos;t have access to any organizations yet. Create your first organization to get started.
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Organization
            </Button>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Select an Organization</h2>
              <p className="text-muted-foreground">
                Choose an organization to continue, or create a new one
              </p>
            </div>

            <div className="grid grid-cols-fluid gap-fluid-md">
              {organizations.map((org) => (
                <Card key={org.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building2 className="mr-2 h-5 w-5" />
                      {org.name}
                    </CardTitle>
                    <CardDescription>{org.description || 'No description'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <Users className="mr-1 h-4 w-4" />
                      Owner
                    </div>
                    <Button 
                      onClick={() => handleSelectOrganization(org.id)}
                      className="w-full"
                      disabled={selecting === org.id}
                    >
                      {selecting === org.id ? 'Selecting...' : 'Select Organization'}
                    </Button>
                  </CardContent>
                </Card>
              ))}

              <Card className="border-dashed border-2 hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="mr-2 h-5 w-5" />
                    Create New
                  </CardTitle>
                  <CardDescription>Start a new organization</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => setShowCreateForm(true)}
                    variant="outline"
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Organization
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {showCreateForm && (
          <div className="mt-8 max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Create New Organization</CardTitle>
                <CardDescription>
                  Create a new organization to manage your design tokens
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateOrganization} className="space-y-4">
                  <div>
                    <Label htmlFor="orgName">Organization Name</Label>
                    <Input
                      id="orgName"
                      value={newOrgName}
                      onChange={(e) => setNewOrgName(e.target.value)}
                      placeholder="My Design System"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="orgDescription">Description (Optional)</Label>
                    <Textarea
                      id="orgDescription"
                      value={newOrgDescription}
                      onChange={(e) => setNewOrgDescription(e.target.value)}
                      placeholder="A brief description of your organization"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={creating || !newOrgName.trim()}>
                      {creating ? 'Creating...' : 'Create Organization'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowCreateForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
    </div>
  )
}
