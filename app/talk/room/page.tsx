"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { BottomNavigation } from "@/components/layout/bottom-navigation"
import TalkRoom from "@/components/talk/talk-room"

function TalkRoomLoading() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )
}

function PageLoading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center pb-20">
      <p>読み込み中...</p>
    </main>
  )
}

function TalkRoomContent() {
  const router = useRouter()
  const [coachName, setCoachName] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // コーチが選択済みかチェック
    try {
      const selectedCoach = localStorage.getItem("selectedCoach")
      if (selectedCoach) {
        const coach = JSON.parse(selectedCoach)
        setCoachName(coach.name || "")
        setLoading(false)
      } else {
        // コーチが選択されていない場合は選択画面に戻る
        router.push("/talk")
      }
    } catch (error) {
      console.error("Error checking coach selection:", error)
      router.push("/talk")
    }
  }, [router])

  if (loading) {
    return <PageLoading />
  }

  return (
    <main className="flex min-h-screen flex-col pb-20">
      <Header title={`${coachName}コーチとのトーク`} />
      <Suspense fallback={<TalkRoomLoading />}>
        <TalkRoom />
      </Suspense>
      <BottomNavigation />
    </main>
  )
}

export default function TalkRoomPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <TalkRoomContent />
    </Suspense>
  )
}
