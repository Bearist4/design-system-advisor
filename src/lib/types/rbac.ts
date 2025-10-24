// RBAC Types for Design System Platform
// Comprehensive type definitions for Role-Based Access Control

export type UserRole = 'platform_admin' | 'org_owner' | 'org_editor' | 'org_viewer';

export type OrgRole = 'owner' | 'editor' | 'viewer';

export type ResourceType = 'tokens' | 'organizations' | 'members' | 'audit_logs';

export type ActionType = 'create' | 'read' | 'update' | 'delete' | 'publish' | 'invite';

export type OrgStatus = 'active' | 'suspended' | 'archived';

export type MemberStatus = 'pending' | 'active' | 'suspended';

export type PlanType = 'free' | 'pro' | 'enterprise';

// Core Profile interface
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  is_platform_admin: boolean;
  created_at: string;
  last_active_at: string;
}

// Organization interface
export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  owner_id: string;
  settings: Record<string, unknown>;
  plan: PlanType;
  status: OrgStatus;
  created_at: string;
  updated_at: string;
}

// Organization member interface
export interface OrgMember {
  id: string;
  user_id: string;
  org_id: string;
  role: OrgRole;
  permissions: Record<string, unknown>;
  status: MemberStatus;
  invited_by?: string;
  invited_at?: string;
  joined_at?: string;
  created_at: string;
}

// Design token interface
export interface Token {
  id: string;
  org_id: string;
  category: string;
  name: string;
  value: Record<string, unknown>;
  description?: string;
  tags: string[];
  is_public: boolean;
  is_deprecated: boolean;
  version: number;
  parent_id?: string;
  created_by: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

// Audit log interface
export interface AuditLog {
  id: string;
  org_id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// Role permission interface
export interface RolePermission {
  id: string;
  role: UserRole;
  resource: ResourceType;
  action: ActionType;
  conditions: Record<string, unknown>;
  created_at: string;
}

// Permission checking interface
export interface PermissionCheck {
  user_id: string;
  org_id: string;
  resource: ResourceType;
  action: ActionType;
  granted: boolean;
  reason?: string;
}

// User context interface for middleware
export interface UserContext {
  user: Profile;
  organizations: Organization[];
  current_org?: Organization;
  role_in_current_org?: OrgRole;
  permissions: string[];
}

// API response interfaces
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Permission matrix interface
export interface PermissionMatrix {
  [key: string]: {
    [key: string]: boolean;
  };
}

// Role hierarchy interface
export interface RoleHierarchy {
  level: number;
  role: UserRole;
  description: string;
  scope: 'global' | 'organization';
  permissions: {
    [K in ResourceType]: ActionType[];
  };
}

// Constants for role hierarchy
export const ROLE_HIERARCHY: RoleHierarchy[] = [
  {
    level: 1,
    role: 'platform_admin',
    description: 'Platform Admin - Global access to entire platform',
    scope: 'global',
    permissions: {
      tokens: ['create', 'read', 'update', 'delete', 'publish'],
      organizations: ['create', 'read', 'update', 'delete'],
      members: ['create', 'read', 'update', 'delete', 'invite'],
      audit_logs: ['read']
    }
  },
  {
    level: 2,
    role: 'org_owner',
    description: 'Organization Owner - Full control over their organization',
    scope: 'organization',
    permissions: {
      tokens: ['create', 'read', 'update', 'delete', 'publish'],
      organizations: ['read', 'update'],
      members: ['create', 'read', 'update', 'delete', 'invite'],
      audit_logs: ['read']
    }
  },
  {
    level: 3,
    role: 'org_editor',
    description: 'Organization Editor - Can create and edit tokens',
    scope: 'organization',
    permissions: {
      tokens: ['create', 'read', 'update'],
      organizations: ['read'],
      members: ['read'],
      audit_logs: ['read']
    }
  },
  {
    level: 4,
    role: 'org_viewer',
    description: 'Organization Viewer - Read-only access',
    scope: 'organization',
    permissions: {
      tokens: ['read'],
      organizations: ['read'],
      members: ['read'],
      audit_logs: ['read']
    }
  }
];

// Permission checking functions
export const hasPermission = (
  userRole: UserRole,
  resource: ResourceType,
  action: ActionType
): boolean => {
  const roleConfig = ROLE_HIERARCHY.find(r => r.role === userRole);
  if (!roleConfig) return false;
  
  return roleConfig.permissions[resource]?.includes(action) || false;
};

export const canAccessOrganization = (
  userRole: UserRole,
  orgRole?: OrgRole
): boolean => {
  if (userRole === 'platform_admin') return true;
  return orgRole !== undefined;
};

export const canManageTokens = (
  userRole: UserRole,
  orgRole?: OrgRole
): boolean => {
  if (userRole === 'platform_admin') return true;
  if (userRole === 'org_owner') return true;
  return orgRole === 'owner' || orgRole === 'editor';
};

export const canDeleteTokens = (
  userRole: UserRole,
  orgRole?: OrgRole
): boolean => {
  if (userRole === 'platform_admin') return true;
  if (userRole === 'org_owner') return true;
  return orgRole === 'owner';
};

export const canManageMembers = (
  userRole: UserRole,
  orgRole?: OrgRole
): boolean => {
  if (userRole === 'platform_admin') return true;
  if (userRole === 'org_owner') return true;
  return orgRole === 'owner';
};

// Error types
export class RBACError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 403
  ) {
    super(message);
    this.name = 'RBACError';
  }
}

export class PermissionDeniedError extends RBACError {
  constructor(resource: ResourceType, action: ActionType) {
    super(
      `Permission denied: Cannot ${action} ${resource}`,
      'PERMISSION_DENIED',
      403
    );
  }
}

export class OrganizationNotFoundError extends RBACError {
  constructor(orgId: string) {
    super(`Organization not found: ${orgId}`, 'ORGANIZATION_NOT_FOUND', 404);
  }
}

export class InsufficientRoleError extends RBACError {
  constructor(requiredRole: UserRole, currentRole: UserRole) {
    super(
      `Insufficient role: Required ${requiredRole}, current ${currentRole}`,
      'INSUFFICIENT_ROLE',
      403
    );
  }
}
