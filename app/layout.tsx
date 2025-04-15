import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { TaskProvider } from "@/contexts/task-context"
import { GoalProvider } from "@/contexts/goal-context"
import { ProfileProvider } from "@/contexts/profile-context"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "StudySpark - 定期テスト学習アプリ",
  description: "中高生のための定期テスト学習サポートアプリ",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ProfileProvider>
            <GoalProvider>
              <TaskProvider>{children}</TaskProvider>
            </GoalProvider>
          </ProfileProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}


import './globals.css'