// Server-side User Profile Management
// Handles user profile creation and management with error recovery
// NOTE: This file is for SERVER-SIDE use only. Use user-profile-client.ts for client components.

import { createClient } from './supabase/server';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  is_platform_admin: boolean;
  created_at: string;
  last_active_at: string;
}

// Create or update user profile
export async function createOrUpdateUserProfile(userId: string, email: string, fullName?: string): Promise<UserProfile | null> {
  try {
    const supabase = await createClient();
    
    // First, check if profile already exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (existingProfile && !fetchError) {
      // Profile exists, update it
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({
          email,
          full_name: fullName,
          last_active_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating user profile:', updateError);
        return null;
      }

      return updatedProfile;
    }

    // Profile doesn't exist, create it
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email,
        full_name: fullName,
        role: 'org_viewer',
        is_platform_admin: false,
        created_at: new Date().toISOString(),
        last_active_at: new Date().toISOString()
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating user profile:', createError);
      
      // Try using the database function as fallback
      const { error: functionError } = await supabase
        .rpc('create_user_profile', {
          user_id: userId,
          user_email: email
        });

      if (functionError) {
        console.error('Error using database function:', functionError);
        return null;
      }

      // If the function succeeded, try to fetch the profile
      const { data: profile, error: fetchError2 } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError2) {
        console.error('Error fetching profile after function call:', fetchError2);
        return null;
      }

      return profile;
    }

    return newProfile;
  } catch (error) {
    console.error('Unexpected error in createOrUpdateUserProfile:', error);
    return null;
  }
}

// Check if user profile exists
export async function userProfileExists(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking user profile:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Unexpected error in userProfileExists:', error);
    return false;
  }
}

// Get user profile
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const supabase = await createClient();
    
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
  } catch (error) {
    console.error('Unexpected error in getUserProfile:', error);
    return null;
  }
}

// Ensure user has a profile (create if missing)
export async function ensureUserProfile(userId: string, email: string, fullName?: string): Promise<UserProfile | null> {
  try {
    // Check if profile exists
    const exists = await userProfileExists(userId);
    
    if (exists) {
      // Profile exists, just update last active
      const supabase = await createClient();
      await supabase
        .from('profiles')
        .update({ last_active_at: new Date().toISOString() })
        .eq('id', userId);
      
      return await getUserProfile(userId);
    } else {
      // Profile doesn't exist, create it
      return await createOrUpdateUserProfile(userId, email, fullName);
    }
  } catch (error) {
    console.error('Unexpected error in ensureUserProfile:', error);
    return null;
  }
}
