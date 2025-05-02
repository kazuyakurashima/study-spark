"use client"

import { Suspense } from "react"
import { useRouter, usePathname } from "next/navigation"
import { User, ChevronLeft, Home } from "lucide-react"

interface HeaderProps {
  title: string
  showBackButton?: boolean
  backUrl?: string
}

function HeaderLoading({ title }: { title: string }) {
  return (
    <header className="header">
      <div className="flex items-center">
        <div className="h-6 w-6 mr-3 bg-gray-200 rounded-full animate-pulse"></div>
        {title && <h1 className="page-title">{title}</h1>}
      </div>
      <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
    </header>
  )
}

function HeaderContent({ title, showBackButton = false, backUrl = "/home" }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()

  // ホームページにいるかどうかを判定
  const isHomePage = pathname === "/home"

  return (
    <header className="header">
      <div className="flex items-center">
        {/* ホームアイコンを追加 - ホームページにいる時だけ水色で表示 */}
        <button className="mr-3" onClick={() => router.push("/home")} aria-label="ホーム">
          <Home className={`h-6 w-6 ${isHomePage ? "text-[#00c6ff]" : "text-gray-600"}`} />
        </button>

        {showBackButton && (
          <button className="mr-2" onClick={() => router.push(backUrl)} aria-label="戻る">
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        <h1 className="page-title">{title}</h1>
      </div>
      <button className="profile-icon" onClick={() => router.push("/profile")}>
        <User className="h-6 w-6" />
      </button>
    </header>
  )
}

export function Header(props: HeaderProps) {
  return (
    <Suspense fallback={<HeaderLoading title={props.title} />}>
      <HeaderContent {...props} />
    </Suspense>
  )
}
