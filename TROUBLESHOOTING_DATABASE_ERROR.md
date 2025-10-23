# Troubleshooting "Database error granting user" Error

## Problem Description
You're encountering a `Database error granting user` error with status 500 during authentication. This typically occurs when the database trigger that creates user profiles fails.

## Root Causes

### 1. Database Schema Not Set Up
The RBAC schema hasn't been properly applied to your Supabase database.

### 2. Row Level Security (RLS) Policy Conflicts
The RLS policies are preventing user profile creation.

### 3. Database Trigger Failures
The `sync_auth_to_profiles()` function is failing due to permission or constraint issues.

## Solutions

### Step 1: Apply Database Fix
Run the `FIX_DATABASE_ERROR.sql` script in your Supabase SQL Editor:

```sql
-- Copy and paste the contents of FIX_DATABASE_ERROR.sql
-- This will create the necessary tables and functions with error handling
```

### Step 2: Verify Database Setup
Check if the following tables exist in your Supabase database:
- `public.profiles`
- `public.organizations` 
- `public.org_members`
- `public.tokens`
- `public.audit_logs`

### Step 3: Test User Profile Creation
Use the Supabase SQL Editor to test:

```sql
-- Test if you can create a profile manually
SELECT create_user_profile('test-user-id', 'test@example.com');

-- Check if the function exists
SELECT user_profile_exists('test-user-id');
```

### Step 4: Check RLS Policies
Verify that RLS policies allow user profile creation:

```sql
-- Check current RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';
```

### Step 5: Manual Profile Creation
If automatic profile creation fails, the system will now attempt to create profiles manually using the new `ensureUserProfile` function.

## Debugging Steps

### 1. Check Browser Console
Look for detailed error messages in the browser console that will show:
- Supabase configuration status
- Authentication flow details
- Profile creation attempts
- Specific error messages

### 2. Use Debug Tools
The login page now includes debug tools:
- **Environment Check**: Verifies Supabase configuration
- **Check Auth Status**: Shows current authentication state
- **Auth Debugger**: Comprehensive authentication debugging (development only)

### 3. Check Supabase Logs
In your Supabase dashboard:
1. Go to **Logs** → **Database**
2. Look for errors related to:
   - `sync_auth_to_profiles`
   - `create_user_profile`
   - RLS policy violations

### 4. Test Database Functions
Run these queries in Supabase SQL Editor:

```sql
-- Test profile creation
INSERT INTO public.profiles (id, email, created_at, last_active_at)
VALUES ('00000000-0000-0000-0000-000000000001', 'test@example.com', now(), now());

-- Test the sync function
SELECT sync_auth_to_profiles();

-- Check if RLS is blocking access
SET row_security = off;
SELECT * FROM public.profiles LIMIT 1;
SET row_security = on;
```

## Common Solutions

### Solution 1: Disable RLS Temporarily
If RLS is causing issues, temporarily disable it:

```sql
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
-- Test user creation
-- Re-enable after testing
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

### Solution 2: Grant Proper Permissions
Ensure the authenticated role has proper permissions:

```sql
GRANT ALL ON public.profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
```

### Solution 3: Use Manual Profile Creation
The updated code now includes fallback mechanisms:
- If database triggers fail, the system will attempt manual profile creation
- The middleware will retry user context creation after profile creation
- Authentication will continue even if profile creation has issues

## Prevention

### 1. Proper Database Setup
Always run the complete RBAC schema before deploying:
```sql
\i RBAC_SCHEMA.sql
```

### 2. Test User Creation
After setting up the database, test user creation:
```sql
-- Create a test user profile
SELECT create_user_profile('test-id', 'test@example.com');
```

### 3. Monitor Database Logs
Regularly check Supabase logs for database errors and fix them promptly.

## Getting Help

If the issue persists:

1. **Check the browser console** for detailed error messages
2. **Use the debug tools** in the login page
3. **Check Supabase logs** for database errors
4. **Verify your environment variables** are correctly set
5. **Test database functions** manually in Supabase SQL Editor

The enhanced error handling and debugging tools should provide much more specific information about what's causing the issue.
