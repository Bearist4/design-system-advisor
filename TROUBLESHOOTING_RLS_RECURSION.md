# Troubleshooting RLS Infinite Recursion Error

## Problem Description
You're encountering an "infinite recursion detected in policy for relation 'profiles'" error (PostgreSQL error code 42P17). This happens when Row Level Security (RLS) policies create circular dependencies.

## Root Cause
The RLS policies on the `profiles` table are referencing other tables or creating circular dependencies, causing PostgreSQL to detect infinite recursion when trying to evaluate the policies.

## Immediate Solution

### Step 1: Run the RLS Fix Script
Execute the `FIX_RLS_RECURSION.sql` script in your Supabase SQL Editor:

```sql
-- Copy and paste the contents of FIX_RLS_RECURSION.sql
-- This will fix the circular dependency issues
```

### Step 2: Verify the Fix
After running the script, test if the policies work:

```sql
-- Test the policies
SELECT test_profile_policies();

-- Check if you can query profiles
SELECT * FROM public.profiles LIMIT 1;
```

## What the Fix Does

1. **Disables RLS temporarily** to clean up existing policies
2. **Drops ALL existing policies** to remove circular dependencies
3. **Creates simple, non-recursive policies** that only check `auth.uid()`
4. **Re-enables RLS** with the clean policies
5. **Tests the setup** to ensure it works

## Common Causes of RLS Recursion

### 1. Policies Referencing Other Tables
```sql
-- BAD: This can cause recursion if the other table references profiles
CREATE POLICY "bad_policy" ON public.profiles
  FOR SELECT USING (
    EXISTS(SELECT 1 FROM public.organizations WHERE owner_id = profiles.id)
  );
```

### 2. Policies Referencing the Same Table
```sql
-- BAD: This creates circular dependency
CREATE POLICY "bad_policy" ON public.profiles
  FOR SELECT USING (
    EXISTS(SELECT 1 FROM public.profiles WHERE id = profiles.id)
  );
```

### 3. Complex Policy Logic
```sql
-- BAD: Complex logic can cause recursion
CREATE POLICY "bad_policy" ON public.profiles
  FOR SELECT USING (
    auth.uid() = id OR 
    EXISTS(SELECT 1 FROM public.org_members WHERE user_id = profiles.id)
  );
```

## Good RLS Policy Examples

### Simple User Profile Policies
```sql
-- GOOD: Simple, direct policies
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

## Prevention

### 1. Keep Policies Simple
- Avoid complex logic in RLS policies
- Don't reference other tables unless absolutely necessary
- Use direct comparisons with `auth.uid()`

### 2. Test Policies Before Deployment
```sql
-- Test if policies work without recursion
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM public.profiles WHERE id = auth.uid();
```

### 3. Monitor for Recursion Errors
Watch for these error patterns in your logs:
- `infinite recursion detected in policy`
- Error code `42P17`
- Policy evaluation timeouts

## Debugging Steps

### 1. Check Current Policies
```sql
-- See all policies on profiles table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';
```

### 2. Test Policy Evaluation
```sql
-- Test if policies cause recursion
SET row_security = on;
SELECT * FROM public.profiles WHERE id = 'your-user-id';
```

### 3. Check for Circular Dependencies
```sql
-- Look for policies that might reference each other
SELECT 
  p1.policyname as policy1,
  p2.policyname as policy2,
  p1.qual as policy1_condition,
  p2.qual as policy2_condition
FROM pg_policies p1
JOIN pg_policies p2 ON p1.tablename = p2.tablename
WHERE p1.policyname != p2.policyname
AND (p1.qual LIKE '%' || p2.tablename || '%' OR p2.qual LIKE '%' || p1.tablename || '%');
```

## Alternative Solutions

### Option 1: Disable RLS Temporarily
```sql
-- If you need immediate access, temporarily disable RLS
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
-- Do your operations
-- Re-enable with simple policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

### Option 2: Use SECURITY DEFINER Functions
```sql
-- Create functions that bypass RLS for specific operations
CREATE OR REPLACE FUNCTION create_user_profile_safe(user_id uuid, user_email text)
RETURNS boolean AS $$
BEGIN
  -- This function runs with elevated privileges
  INSERT INTO public.profiles (id, email, created_at, last_active_at)
  VALUES (user_id, user_email, now(), now())
  ON CONFLICT (id) DO UPDATE SET
    email = user_email,
    last_active_at = now();
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Verification

After applying the fix, verify that:

1. **No more recursion errors** in the logs
2. **User profiles can be created** successfully
3. **Authentication works** without database errors
4. **RLS policies are simple** and non-recursive

## Getting Help

If the issue persists:

1. **Check the database logs** for specific recursion details
2. **Run the test function** to verify policies work
3. **Simplify any remaining complex policies**
4. **Consider using SECURITY DEFINER functions** for complex operations

The `FIX_RLS_RECURSION.sql` script should resolve this issue by creating simple, non-recursive policies that don't cause circular dependencies.
