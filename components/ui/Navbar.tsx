'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // ユーザー情報を取得
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };

    getUser();

    // 認証状態の変更を監視
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };

  return (
    <nav className="bg-white border-b border-gray-200 py-3 shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <img src="/images/star-logo.svg" alt="Star" className="w-7 h-7" />
          <span className="text-xl font-bold text-gray-900">StudySpark</span>
        </Link>
        
        <div className="flex items-center">
          {user && (
            <div className="hidden md:flex mr-6 space-x-6">
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-500 font-medium">
                ダッシュボード
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-blue-500 font-medium">
                マイプロフィール
              </Link>
            </div>
          )}
          
          {loading ? (
            <div className="h-9 w-24 rounded-lg bg-gray-200 animate-pulse"></div>
          ) : user ? (
            <div className="flex items-center space-x-4">
              <span className="hidden md:block text-sm text-gray-700">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                ログアウト
              </button>
            </div>
          ) : (
            <div className="flex space-x-3">
              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                ログイン
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
              >
                登録
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 