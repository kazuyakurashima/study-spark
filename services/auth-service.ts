import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { UserProfile } from "@/types/user";
import { saveUserProfile } from "./profile-service";

const supabase = createClientComponentClient();

// ログイン状態確認
export async function isLoggedIn(): Promise<boolean> {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return !!data.session;
  } catch (error) {
    console.error("Error checking login status:", error);
    return false;
  }
}

export async function loginWithEmail(email: string, password: string): Promise<{ success: boolean; message?: string }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Error during login:", error);
    return { 
      success: false, 
      message: error.message || "ログインに失敗しました。" 
    };
  }
}

export async function loginWithGoogle(): Promise<{ success: boolean; message?: string }> {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Error during Google login:", error);
    return { 
      success: false, 
      message: error.message || "Googleログインに失敗しました。" 
    };
  }
}

export async function register(email: string, password: string): Promise<{ success: boolean; message?: string }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Error during registration:", error);
    return { 
      success: false, 
      message: error.message || "ユーザー登録に失敗しました。" 
    };
  }
}

// ログアウト
export async function logout(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
}

// 認証ユーザー取得
export async function getAuthUser(): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    
    if (data.user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (userError && userError.code !== 'PGRST116') { // PGRST116 = not found
        console.error("Error fetching user profile:", userError);
        return null;
      }
      
      if (userData) {
        return {
          id: userData.id,
          name: userData.display_name,
          email: userData.email,
          avatarUrl: userData.avatar_key ? `/avatars/${userData.avatar_key}` : undefined,
          createdAt: new Date(userData.created_at),
          updatedAt: new Date(userData.updated_at),
          onboardingCompleted: userData.onboarding_completed,
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error getting auth user:", error);
    return null;
  }
}
