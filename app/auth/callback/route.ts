import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Error exchanging code for session:', error);
      return NextResponse.redirect(new URL('/auth/login?error=auth_callback_error', request.url));
    }
    
    if (data?.user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', data.user.email)
        .single();
      
      if (userError && userError.code !== 'PGRST116') { // PGRST116 = not found
        console.error('Error checking user existence:', userError);
      }
      
      if (!userData) {
        const displayName = data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User';
        
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            display_name: displayName,
            onboarding_completed: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (insertError) {
          console.error('Error creating user profile:', insertError);
        }
        
        // オンボーディングにリダイレクト
        return NextResponse.redirect(new URL('/onboarding/avatar', request.url));
      }
    }
  }

  // ダッシュボードにリダイレクト
  return NextResponse.redirect(new URL('/dashboard', request.url));
}       