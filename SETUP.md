# Quick Setup Guide

## The Issue
Your sign-in is not working because the Supabase environment variables are not configured.

## Solution

1. **Create a `.env.local` file** in the root directory with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. **Get your Supabase credentials:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project or use an existing one
   - Go to Settings > API
   - Copy your Project URL and anon/public key

3. **Example `.env.local` file:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. **Restart your development server:**
```bash
npm run dev
```

## Database Setup

**IMPORTANT:** You need to run the SQL setup in your Supabase project to create the required database tables and storage bucket.

### Option 1: Use the provided SQL file
1. Open the `SUPABASE_SETUP.sql` file in this project
2. Copy the entire contents
3. Go to your Supabase project → SQL Editor
4. Paste and run the SQL

### Option 2: Manual setup
Run this SQL in your Supabase SQL editor:

```sql
-- Create token_files table
CREATE TABLE IF NOT EXISTS token_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  category TEXT NOT NULL,
  file_url TEXT NOT NULL,
  token_data JSONB NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for token files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('token-files', 'token-files', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS and create policies
ALTER TABLE token_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view own token files" ON token_files
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own token files" ON token_files
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own token files" ON token_files
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete own token files" ON token_files
  FOR DELETE USING (auth.uid() = user_id);

-- Storage policies
CREATE POLICY IF NOT EXISTS "Public read access for token files" ON storage.objects
  FOR SELECT USING (bucket_id = 'token-files');

CREATE POLICY IF NOT EXISTS "Authenticated users can upload token files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'token-files' AND auth.role() = 'authenticated');
```

## Debug Information

The login page now shows debug information to help identify configuration issues. Look for:
- ✅ Configured - Environment variable is set
- ❌ Missing - Environment variable is not set

## After Setup

Once configured, you should be able to:
1. Sign up with email/password
2. Sign in with email/password  
3. Sign in with GitHub OAuth
4. Access the dashboard after authentication
