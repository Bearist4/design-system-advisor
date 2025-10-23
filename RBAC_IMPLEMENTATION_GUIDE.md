# RBAC Implementation Guide
## Role-Based Access Control for Design System Platform

This guide explains how to implement and use the comprehensive RBAC system for your Design System Platform.

## 🏗️ Architecture Overview

### Role Hierarchy
```
Level 1: Platform Admin (Global)
├── Full access to all organizations
├── Can manage users across the platform
└── Can view all audit logs

Level 2: Organization Owner (Organization)
├── Full control over their organization
├── Can manage tokens and members
└── Can view organization audit logs

Level 3: Organization Editor (Organization)
├── Can create and edit tokens
├── Can view organization data
└── Read-only access to members

Level 4: Organization Viewer (Organization)
├── Read-only access to tokens
├── Can view organization data
└── No modification permissions
```

## 🚀 Quick Start

### 1. Database Setup
```sql
-- Run the RBAC schema
\i RBAC_SCHEMA.sql
```

### 2. Create Your First Platform Admin
```sql
-- Insert a platform admin user
INSERT INTO public.profiles (id, email, full_name, role, is_platform_admin)
VALUES ('your-user-id', 'admin@yourcompany.com', 'Platform Admin', 'platform_admin', true);
```

### 3. Create an Organization
```typescript
import { createClient } from './lib/supabase/server';
import { logAuditEvent } from './lib/rbac';

const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();

// Create organization
const { data: org, error } = await supabase
  .from('organizations')
  .insert({
    name: 'My Design System',
    slug: 'my-design-system',
    owner_id: user.id
  })
  .select()
  .single();

// Add user as owner member
await supabase
  .from('org_members')
  .insert({
    user_id: user.id,
    org_id: org.id,
    role: 'owner',
    status: 'active'
  });

// Log the creation
await logAuditEvent(org.id, user.id, 'created', 'organizations', org.id);
```

## 🔐 Permission System

### Core Permissions Matrix

| Resource | Platform Admin | Org Owner | Org Editor | Org Viewer |
|----------|---------------|-----------|------------|------------|
| **Organizations** | CRUD | R, U | R | R |
| **Tokens** | CRUD | CRUD | CRU | R |
| **Members** | CRUD | CRUD | R | R |
| **Audit Logs** | R | R | R | R |

### Permission Checking in Code

```typescript
import { hasPermission, requirePermission } from './lib/rbac';

// Check permission before action
const canCreate = await hasPermission(userId, orgId, 'tokens', 'create');
if (!canCreate) {
  throw new Error('Permission denied');
}

// Or use the helper that throws on denial
await requirePermission(userId, orgId, 'tokens', 'create');
```

## 🛡️ API Route Protection

### Example: Protected Token API Route
```typescript
// app/api/orgs/[orgId]/tokens/route.ts
import { checkAPIPermission } from '@/lib/rbac';

export async function POST(request: Request, { params }: { params: { orgId: string } }) {
  try {
    // Check permissions
    const { userId, orgId, userContext } = await checkAPIPermission(
      request, 
      'tokens', 
      'create'
    );

    // Proceed with token creation
    const body = await request.json();
    const supabase = await createClient();
    
    const { data: token, error } = await supabase
      .from('tokens')
      .insert({
        ...body,
        org_id: orgId,
        created_by: userId
      })
      .select()
      .single();

    if (error) throw error;

    // Log the action
    await logAuditEvent(orgId, userId, 'created', 'tokens', token.id);

    return Response.json({ data: token });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 403 });
  }
}
```

## 🎯 Frontend Integration

### User Context Hook
```typescript
// hooks/useUserContext.ts
import { useState, useEffect } from 'react';
import { getUserContext } from '@/lib/rbac';

export function useUserContext() {
  const [userContext, setUserContext] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContext() {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const context = await getUserContext(user.id);
        setUserContext(context);
      }
      setLoading(false);
    }
    
    loadContext();
  }, []);

  return { userContext, loading };
}
```

### Permission-Based UI Components
```typescript
// components/PermissionGate.tsx
import { useUserContext } from '@/hooks/useUserContext';

interface PermissionGateProps {
  resource: ResourceType;
  action: ActionType;
  orgId: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGate({ 
  resource, 
  action, 
  orgId, 
  children, 
  fallback = null 
}: PermissionGateProps) {
  const { userContext } = useUserContext();
  
  if (!userContext) return fallback;
  
  const hasAccess = userContext.permissions.includes(`${resource}:${action}`) ||
                   userContext.permissions.includes('*');
  
  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

// Usage
<PermissionGate resource="tokens" action="create" orgId={orgId}>
  <CreateTokenButton />
</PermissionGate>
```

## 🔍 Audit Logging

### Automatic Audit Logging
The system automatically logs all changes to:
- Tokens (create, update, delete)
- Organizations (create, update, delete)
- Organization members (add, remove, role changes)

### Manual Audit Logging
```typescript
import { logAuditEvent } from '@/lib/rbac';

// Log custom events
await logAuditEvent(
  orgId,
  userId,
  'published',
  'tokens',
  tokenId,
  { version: '1.2.0', environment: 'production' }
);
```

## 🚨 Error Handling

### Custom RBAC Errors
```typescript
import { 
  RBACError, 
  PermissionDeniedError, 
  OrganizationNotFoundError,
  InsufficientRoleError 
} from '@/lib/types/rbac';

try {
  await requirePermission(userId, orgId, 'tokens', 'delete');
} catch (error) {
  if (error instanceof PermissionDeniedError) {
    // Handle permission denied
    return Response.json({ error: 'You cannot delete tokens' }, { status: 403 });
  }
  
  if (error instanceof OrganizationNotFoundError) {
    // Handle organization not found
    return Response.json({ error: 'Organization not found' }, { status: 404 });
  }
}
```

## 🔧 Database Functions

### Available Helper Functions
```sql
-- Check if user is platform admin
SELECT is_platform_admin('user-id');

-- Check if user owns organization
SELECT is_org_owner('user-id', 'org-id');

-- Get user's role in organization
SELECT get_user_role_in_org('user-id', 'org-id');

-- Check specific permission
SELECT has_permission('user-id', 'org-id', 'tokens', 'create');

-- Log audit event
SELECT log_audit_event('org-id', 'user-id', 'created', 'tokens', 'token-id', '{"details": "..."}');
```

## 📊 Monitoring and Analytics

### Query Audit Logs
```sql
-- Recent activity by user
SELECT 
  u.email,
  al.action,
  al.resource_type,
  al.created_at
FROM audit_logs al
JOIN profiles u ON al.user_id = u.id
WHERE al.org_id = 'your-org-id'
ORDER BY al.created_at DESC
LIMIT 100;

-- Permission usage statistics
SELECT 
  resource,
  action,
  COUNT(*) as usage_count
FROM audit_logs
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY resource, action
ORDER BY usage_count DESC;
```

## 🚀 Deployment Checklist

### 1. Database Migration
- [ ] Run `RBAC_SCHEMA.sql` on your Supabase instance
- [ ] Verify all tables and functions are created
- [ ] Test RLS policies with sample data

### 2. Application Updates
- [ ] Update middleware to use RBAC functions
- [ ] Add permission checks to API routes
- [ ] Update frontend components with permission gates
- [ ] Test all user flows with different roles

### 3. User Management
- [ ] Create initial platform admin user
- [ ] Set up organization structure
- [ ] Invite users with appropriate roles
- [ ] Test role transitions and permissions

### 4. Monitoring
- [ ] Set up audit log monitoring
- [ ] Create alerts for permission violations
- [ ] Monitor organization access patterns
- [ ] Review and optimize RLS policies

## 🔒 Security Best Practices

1. **Always validate permissions server-side** - Never trust client-side permission checks
2. **Use RLS policies** - Let the database enforce access control
3. **Log all sensitive operations** - Maintain comprehensive audit trails
4. **Regular permission reviews** - Audit user permissions periodically
5. **Principle of least privilege** - Grant minimum required permissions
6. **Secure role transitions** - Validate role changes through proper channels

## 📚 Additional Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Security Best Practices](https://www.postgresql.org/docs/current/security.html)
- [RBAC Design Patterns](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html)

---

This RBAC system provides a robust, scalable foundation for your Design System Platform with comprehensive security controls and audit capabilities.
