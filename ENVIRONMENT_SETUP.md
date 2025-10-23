# Environment Setup Guide

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: For server-side operations
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## How to Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (optional)

## Example .env.local file

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Troubleshooting

### Common Issues:

1. **"Supabase configuration is missing"**
   - Check that your `.env.local` file exists in the project root
   - Verify the environment variable names are correct
   - Restart your development server after adding environment variables

2. **"Invalid login credentials"**
   - Check that the user exists in your Supabase Auth
   - Verify the email and password are correct
   - Check if email confirmation is required

3. **"Authentication failed - no user session found"**
   - This usually indicates a session handling issue
   - Check browser console for detailed error messages
   - Try clearing browser cookies and localStorage

### Debug Steps:

1. Use the "Environment Check" button in the login page to verify configuration
2. Use the "Check Auth Status" button to see current authentication state
3. Check browser console for detailed error messages
4. Verify your Supabase project has the correct database schema (see RBAC_SCHEMA.sql)

## Database Setup

Make sure your Supabase database has the required tables. Run the SQL from `RBAC_SCHEMA.sql` in your Supabase SQL editor to set up the necessary tables and relationships.
