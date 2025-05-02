import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          response.cookies.delete({
            name,
            ...options,
          });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // 保護されたルートの場合はログインを要求
  if (!session && (
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/profile') ||
    request.nextUrl.pathname.startsWith('/onboarding')
  )) {
    const redirectUrl = new URL('/auth/login', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // ログイン済みの場合は認証ページへのアクセスを防ぐ
  if (session && (
    request.nextUrl.pathname.startsWith('/auth/login') ||
    request.nextUrl.pathname.startsWith('/auth/register')
  )) {
    const redirectUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  if (session && request.nextUrl.pathname.startsWith('/dashboard')) {
    const { data: userData } = await supabase
      .from('users')
      .select('onboarding_completed')
      .eq('id', session.user.id)
      .single();
    
    if (userData && !userData.onboarding_completed) {
      const redirectUrl = new URL('/onboarding/avatar', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

// 認証チェックを適用するパス（ここに指定したパスにのみmiddlewareが実行される）
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/auth/:path*',
    '/onboarding/:path*'
  ],
}; 