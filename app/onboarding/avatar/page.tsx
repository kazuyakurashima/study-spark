"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AvatarSelection } from "@/components/onboarding/avatar-selection"
import { saveAvatar } from "../../../services/profile-service"

export default function AvatarPage() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(false)
      } catch (error) {
        console.error("Error checking auth:", error)
        router.push("/auth/login")
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">オンボーディング</h1>
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">1</div>
              <div className="ml-2 font-medium">アバター選択</div>
            </div>
            <div className="flex-1 mx-4 h-1 bg-gray-200">
              <div className="h-full bg-blue-500 w-0"></div>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">2</div>
              <div className="ml-2 text-gray-500">名前設定</div>
            </div>
          </div>
        </div>
        
        <AvatarSelection />
      </div>
    </div>
  )
}
