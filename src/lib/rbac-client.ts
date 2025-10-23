// Client-side RBAC Helper Functions
// Comprehensive role-based access control utilities for client components

import { supabase } from './supabase';
import { 
  UserRole, 
  OrgRole, 
  ResourceType, 
  ActionType, 
  Profile, 
  Organization, 
  OrgMember,
  UserContext,
  RBACError,
  PermissionDeniedError,
  OrganizationNotFoundError,
  InsufficientRoleError
} from './types/rbac';

// Get user profile with role information (client-side)
export async function getUserProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
}

// Get user's organizations (client-side)
export async function getUserOrganizations(userId: string): Promise<Organization[]> {
  try {
    // First get the user's organization memberships
    const { data: memberships, error: membershipsError } = await supabase
      .from('org_members')
      .select('org_id, role, status')
      .eq('user_id', userId)
      .eq('status', 'active');

    if (membershipsError) {
      console.error('Error fetching user memberships:', membershipsError);
      return [];
    }

    if (!memberships || memberships.length === 0) {
      console.log('No active memberships found for user:', userId);
      return [];
    }

    // Then get the organization details
    const orgIds = memberships.map(m => m.org_id);
    const { data: organizations, error: orgsError } = await supabase
      .from('organizations')
      .select('*')
      .in('id', orgIds);

    if (orgsError) {
      console.error('Error fetching organizations:', orgsError);
      return [];
    }

    return organizations || [];
  } catch (error) {
    console.error('Error in getUserOrganizations:', error);
    return [];
  }
}

// Get user's role in a specific organization (client-side)
export async function getUserRoleInOrg(userId: string, orgId: string): Promise<OrgRole | null> {
  const { data, error } = await supabase
    .from('org_members')
    .select('role')
    .eq('user_id', userId)
    .eq('org_id', orgId)
    .eq('status', 'active')
    .single();

  if (error) {
    console.error('Error fetching user role in org:', error);
    return null;
  }

  return data?.role || null;
}

// Check if user is platform admin (client-side)
export async function isPlatformAdmin(userId: string): Promise<boolean> {
  const profile = await getUserProfile(userId);
  return profile?.is_platform_admin || false;
}

// Check if user is organization owner (client-side)
export async function isOrgOwner(userId: string, orgId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('organizations')
    .select('owner_id')
    .eq('id', orgId)
    .single();

  if (error) {
    console.error('Error checking org ownership:', error);
    return false;
  }

  return data?.owner_id === userId;
}

// Check if user has permission for a specific action (client-side)
export async function hasPermission(
  userId: string,
  orgId: string,
  resource: ResourceType,
  action: ActionType
): Promise<boolean> {
  try {
    // Check if user is platform admin
    if (await isPlatformAdmin(userId)) {
      return true;
    }

    // Check if user is org owner
    if (await isOrgOwner(userId, orgId)) {
      return true;
    }

    // Check user's role in organization
    const orgRole = await getUserRoleInOrg(userId, orgId);
    if (!orgRole) {
      return false;
    }

    // Check role-based permissions
    const { data, error } = await supabase
      .from('role_permissions')
      .select('*')
      .eq('role', orgRole)
      .eq('resource', resource)
      .eq('action', action)
      .single();

    if (error) {
      console.error('Error checking permissions:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in hasPermission:', error);
    return false;
  }
}

// Get user context with all necessary information (client-side)
export async function getUserContext(userId: string, currentOrgId?: string): Promise<UserContext | null> {
  try {
    const profile = await getUserProfile(userId);
    if (!profile) {
      console.log('getUserContext: No profile found for user:', userId);
      return null;
    }

    const organizations = await getUserOrganizations(userId);
    console.log('getUserContext: Profile current_org_id:', (profile as any).current_org_id);
    console.log('getUserContext: Available organizations:', organizations.map(org => ({ id: org.id, name: org.name })));
    
    // Use current_org_id from profile if available, otherwise use provided currentOrgId or first org
    const effectiveOrgId = (profile as any).current_org_id || currentOrgId;
    console.log('getUserContext: Effective org ID:', effectiveOrgId);
    
    let currentOrg = null;
    if (effectiveOrgId) {
      // First try to find in user's organizations
      currentOrg = organizations.find(org => org.id === effectiveOrgId);
      
      // If not found in user's organizations, try to fetch the organization directly
      if (!currentOrg) {
        console.log('getUserContext: Organization not found in user orgs, fetching directly...');
        const { data: directOrg, error: directOrgError } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', effectiveOrgId)
          .single();
        
        if (!directOrgError && directOrg) {
          console.log('getUserContext: Found organization directly:', { id: directOrg.id, name: directOrg.name });
          currentOrg = directOrg;
        } else {
          console.log('getUserContext: Could not fetch organization directly:', directOrgError);
        }
      }
    } else {
      currentOrg = organizations[0];
    }
    
    console.log('getUserContext: Current org found:', currentOrg ? { id: currentOrg.id, name: currentOrg.name } : 'None');

    const roleInCurrentOrg = currentOrg 
      ? await getUserRoleInOrg(userId, currentOrg.id)
      : null;

    // Get user permissions
    const permissions = await getUserPermissions(userId, currentOrg?.id);

    return {
      user: profile,
      organizations,
      current_org: currentOrg,
      role_in_current_org: roleInCurrentOrg || undefined,
      permissions
    };
  } catch (error) {
    console.error('Error getting user context:', error);
    return null;
  }
}

// Get user permissions for an organization (client-side)
export async function getUserPermissions(userId: string, orgId?: string): Promise<string[]> {
  const permissions: string[] = [];
  
  try {
    // Platform admin has all permissions
    if (await isPlatformAdmin(userId)) {
      return ['*']; // Wildcard for all permissions
    }

    if (!orgId) {
      return permissions;
    }

    // Check org ownership
    if (await isOrgOwner(userId, orgId)) {
      permissions.push('org:manage', 'tokens:manage', 'members:manage');
      return permissions;
    }

    // Get role-based permissions
    const orgRole = await getUserRoleInOrg(userId, orgId);
    if (!orgRole) {
      return permissions;
    }

    const { data, error } = await supabase
      .from('role_permissions')
      .select('resource, action')
      .eq('role', orgRole);

    if (error) {
      console.error('Error fetching permissions:', error);
      return permissions;
    }

    // Convert to permission strings
    data?.forEach(perm => {
      permissions.push(`${perm.resource}:${perm.action}`);
    });

    return permissions;
  } catch (error) {
    console.error('Error getting user permissions:', error);
    return permissions;
  }
}

// Validate permission and throw error if denied (client-side)
export async function requirePermission(
  userId: string,
  orgId: string,
  resource: ResourceType,
  action: ActionType
): Promise<void> {
  const hasAccess = await hasPermission(userId, orgId, resource, action);
  
  if (!hasAccess) {
    throw new PermissionDeniedError(resource, action);
  }
}

// Validate organization access (client-side)
export async function requireOrgAccess(userId: string, orgId: string): Promise<void> {
  const hasAccess = await hasPermission(userId, orgId, 'organizations', 'read');
  
  if (!hasAccess) {
    throw new OrganizationNotFoundError(orgId);
  }
}

// Validate minimum role requirement (client-side)
export async function requireMinimumRole(
  userId: string,
  orgId: string,
  requiredRole: OrgRole
): Promise<void> {
  const userRole = await getUserRoleInOrg(userId, orgId);
  
  if (!userRole) {
    throw new InsufficientRoleError('org_viewer', 'org_viewer');
  }

  const roleHierarchy: Record<OrgRole, number> = {
    'owner': 1,
    'editor': 2,
    'viewer': 3
  };

  if (roleHierarchy[userRole] > roleHierarchy[requiredRole]) {
    // Convert OrgRole to UserRole for error message
    const userRoleMap: Record<OrgRole, UserRole> = {
      'owner': 'org_owner',
      'editor': 'org_editor', 
      'viewer': 'org_viewer'
    };
    const requiredUserRoleMap: Record<OrgRole, UserRole> = {
      'owner': 'org_owner',
      'editor': 'org_editor',
      'viewer': 'org_viewer'
    };
    throw new InsufficientRoleError(requiredUserRoleMap[requiredRole], userRoleMap[userRole]);
  }
}

// Log audit event (client-side)
export async function logAuditEvent(
  orgId: string,
  userId: string,
  action: string,
  resourceType: string,
  resourceId?: string,
  details?: Record<string, any>
): Promise<void> {
  try {
    await supabase
      .from('audit_logs')
      .insert({
        org_id: orgId,
        user_id: userId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        details: details || {}
      });
  } catch (error) {
    console.error('Error logging audit event:', error);
  }
}
