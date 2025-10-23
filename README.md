# Design System Advisor

A full-stack MVP for managing design tokens built with Next.js 14, TypeScript, TailwindCSS, and Supabase.

## Features

- 🔐 **Authentication** - Email/password and GitHub OAuth login
- 📁 **Token Upload** - Drag-and-drop JSON file upload with auto-categorization
- 🏷️ **Auto-Categorization** - Automatically categorizes tokens (foundation, brand, component, spacing, platform, misc)
- 📊 **Dashboard** - View all uploaded tokens with filters and search
- 🔍 **Token Details** - Hierarchical view of token data
- 🎨 **Design System** - Custom UI components built on TailwindCSS

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Database & Auth:** Supabase
- **File Storage:** Supabase Storage
- **UI Components:** Custom design system

## Setup Instructions

### 1. Clone and Install

```bash
cd design-system-advisor
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Schema

Run this SQL in your Supabase SQL editor:

```sql
-- Create token_files table
CREATE TABLE token_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  category TEXT NOT NULL,
  file_url TEXT NOT NULL,
  token_data JSONB NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for token files
INSERT INTO storage.buckets (id, name, public) VALUES ('token-files', 'token-files', true);

-- Set up RLS policies
ALTER TABLE token_files ENABLE ROW LEVEL SECURITY;

-- Users can only see their own files
CREATE POLICY "Users can view own token files" ON token_files
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own files
CREATE POLICY "Users can insert own token files" ON token_files
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own files
CREATE POLICY "Users can update own token files" ON token_files
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own files
CREATE POLICY "Users can delete own token files" ON token_files
  FOR DELETE USING (auth.uid() = user_id);

-- Storage policies
CREATE POLICY "Public read access for token files" ON storage.objects
  FOR SELECT USING (bucket_id = 'token-files');

CREATE POLICY "Authenticated users can upload token files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'token-files' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own token files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'token-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own token files" ON storage.objects
  FOR DELETE USING (bucket_id = 'token-files' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 4. Run the Application

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── dashboard/         # Dashboard page
│   ├── login/             # Authentication page
│   ├── upload/            # Token upload page
│   └── tokens/[id]/       # Token detail page
├── components/ui/         # Design system components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ...
├── lib/                   # Utilities and configurations
│   ├── supabase/          # Supabase client configurations
│   └── utils.ts           # Helper functions
└── middleware.ts          # Authentication middleware
```

## Design System Components

The app includes a custom design system built on TailwindCSS:

- **Button** - Multiple variants (primary, secondary, outline, ghost)
- **Card** - Container with header, content, and footer
- **Input** - Form input with consistent styling
- **Badge** - Category tags with color coding
- **Table** - Data display with sorting
- **Modal** - Overlay dialogs
- **Navbar** - Top navigation with user menu
- **Sidebar** - Navigation menu

## Token Categorization

The app automatically categorizes uploaded tokens based on filename and content:

- **Foundation** - Colors, typography, fonts
- **Spacing** - Spacing, grid, layout tokens
- **Brand** - Brand-specific tokens
- **Component** - Component-specific tokens (buttons, inputs)
- **Platform** - Platform-specific tokens (iOS, Android, web)
- **Misc** - Other tokens

## Features in Detail

### Authentication
- Email/password registration and login
- GitHub OAuth integration
- Protected routes with middleware
- User session management

### Token Upload
- Drag-and-drop file upload
- JSON file validation
- Real-time preview
- Auto-categorization
- File storage in Supabase

### Dashboard
- Overview statistics
- Recent token files
- Category-based filtering
- Search functionality
- Quick actions

### Token Details
- Hierarchical data display
- Raw JSON view
- File metadata
- Category badges
- Navigation breadcrumbs

## Development

The project uses:
- TypeScript for type safety
- TailwindCSS for styling
- Supabase for backend services
- Next.js 14 App Router for routing
- Custom design system components

## Deployment

The app can be deployed to Vercel, Netlify, or any platform that supports Next.js applications. Make sure to set up your environment variables in your deployment platform.