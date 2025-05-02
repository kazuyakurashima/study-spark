import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { UserProfile, UserPreferences } from "@/types/user";

const supabase = createClientComponentClient();

// ユーザープロフィール取得
export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) throw error;
    
    if (data) {
      return {
        id: data.id,
        name: data.display_name,
        email: data.email,
        avatarUrl: data.avatar_key ? `/avatars/${data.avatar_key}` : undefined,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        onboardingCompleted: data.onboarding_completed,
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

// ユーザープロフィール保存
export async function saveUserProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    
    if (!user) throw new Error("認証されていません");
    
    const { data, error } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email: profile.email || user.email!,
        display_name: profile.name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        avatar_key: profile.avatarUrl?.split('/').pop(),
        onboarding_completed: profile.onboardingCompleted ?? false,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    
    if (data) {
      return {
        id: data.id,
        name: data.display_name,
        email: data.email,
        avatarUrl: data.avatar_key ? `/avatars/${data.avatar_key}` : undefined,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        onboardingCompleted: data.onboarding_completed,
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw error;
  }
}

// ユーザープロフィール更新
export async function updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile | null> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    
    if (!user) throw new Error("認証されていません");
    
    const updateData: any = {};
    if (updates.name) updateData.display_name = updates.name;
    if (updates.avatarUrl) updateData.avatar_key = updates.avatarUrl.split('/').pop();
    if (updates.onboardingCompleted !== undefined) updateData.onboarding_completed = updates.onboardingCompleted;
    updateData.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) throw error;
    
    if (data) {
      return {
        id: data.id,
        name: data.display_name,
        email: data.email,
        avatarUrl: data.avatar_key ? `/avatars/${data.avatar_key}` : undefined,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        onboardingCompleted: data.onboarding_completed,
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

// ユーザー設定取得
export async function getUserPreferences(): Promise<UserPreferences | null> {
  try {
    return {
      theme: 'light',
      notifications: true,
      studyReminders: true,
    };
  } catch (error) {
    console.error("Error getting user preferences:", error);
    return null;
  }
}

// ユーザー設定保存
export async function saveUserPreferences(preferences: UserPreferences): Promise<UserPreferences> {
  try {
    return preferences;
  } catch (error) {
    console.error("Error saving user preferences:", error);
    throw error;
  }
}

// ユーザー設定更新
export async function updateUserPreferences(updates: Partial<UserPreferences>): Promise<UserPreferences | null> {
  try {
    const currentPreferences = await getUserPreferences();
    if (!currentPreferences) {
      throw new Error("User preferences not found");
    }

    return { ...currentPreferences, ...updates };
  } catch (error) {
    console.error("Error updating user preferences:", error);
    throw error;
  }
}

// オンボーディング完了状態の更新
export async function setOnboardingCompleted(completed: boolean): Promise<UserProfile | null> {
  try {
    return await updateUserProfile({ onboardingCompleted: completed });
  } catch (error) {
    console.error("Error setting onboarding status:", error);
    throw error;
  }
}

export async function saveAvatar(avatarKey: string): Promise<UserProfile | null> {
  try {
    return await updateUserProfile({ avatarUrl: `/avatars/${avatarKey}` });
  } catch (error) {
    console.error("Error saving avatar:", error);
    throw error;
  }
}

export async function saveUserName(name: string): Promise<UserProfile | null> {
  try {
    return await updateUserProfile({ name });
  } catch (error) {
    console.error("Error saving user name:", error);
    throw error;
  }
}
