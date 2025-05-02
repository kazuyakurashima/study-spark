"use client"

import { Suspense } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Flag, Calendar, MessageCircle, Sparkles } from "lucide-react"

function NavigationLoading() {
  return (
    <div className="bottom-nav">
      <div className="nav-item">
        <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
        <span className="h-4 w-16 bg-gray-200 rounded animate-pulse mt-1"></span>
      </div>
      <div className="nav-item">
        <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
        <span className="h-4 w-16 bg-gray-200 rounded animate-pulse mt-1"></span>
      </div>
      <div className="nav-item">
        <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
        <span className="h-4 w-16 bg-gray-200 rounded animate-pulse mt-1"></span>
      </div>
      <div className="nav-item">
        <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
        <span className="h-4 w-16 bg-gray-200 rounded animate-pulse mt-1"></span>
      </div>
    </div>
  )
}

function NavigationContent() {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="bottom-nav">
      <button className="nav-item" onClick={() => router.push("/goal")}>
        <Flag className={`nav-icon h-5 w-5 ${isActive("/goal") ? "text-[#00c6ff]" : "text-gray-500"}`} />
        <span className={isActive("/goal") ? "text-[#00c6ff]" : "text-gray-500"}>ゴールナビ</span>
      </button>
      <button className="nav-item" onClick={() => router.push("/countdown")}>
        <Calendar className={`nav-icon h-5 w-5 ${isActive("/countdown") ? "text-[#00c6ff]" : "text-gray-500"}`} />
        <span className={isActive("/countdown") ? "text-[#00c6ff]" : "text-gray-500"}>カウントダウン</span>
      </button>
      <button className="nav-item" onClick={() => router.push("/spark")}>
        <Sparkles className={`nav-icon h-5 w-5 ${isActive("/spark") ? "text-[#00c6ff]" : "text-gray-500"}`} />
        <span className={isActive("/spark") ? "text-[#00c6ff]" : "text-gray-500"}>スパーク</span>
      </button>
      <button className="nav-item" onClick={() => router.push("/talk")}>
        <MessageCircle className={`nav-icon h-5 w-5 ${isActive("/talk") ? "text-[#00c6ff]" : "text-gray-500"}`} />
        <span className={isActive("/talk") ? "text-[#00c6ff]" : "text-gray-500"}>トークルーム</span>
      </button>
    </div>
  )
}

export function BottomNavigation() {
  return (
    <Suspense fallback={<NavigationLoading />}>
      <NavigationContent />
    </Suspense>
  )
}
