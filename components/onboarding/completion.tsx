"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SparkIcon } from "@/components/ui/spark-icon"
import { setOnboardingCompleted } from "@/services/profile-service"

export function OnboardingCompletion() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  useEffect(() => {
    const markOnboardingComplete = async () => {
      try {
        await setOnboardingCompleted(true)
      } catch (error) {
        console.error("Error marking onboarding as completed:", error)
      }
    }
    
    markOnboardingComplete()
  }, [])

  const handleContinue = async () => {
    try {
      setIsLoading(true)
      router.push("/dashboard")
    } catch (error) {
      console.error("Error navigating to dashboard:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative w-full h-full min-h-screen flex items-center justify-center overflow-hidden">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center rainbow-text">登録完了！</CardTitle>
          <div className="rainbow-line-container">
            <div className="rainbow-line"></div>
          </div>
          <CardDescription className="text-center flex items-center justify-center">
            <SparkIcon className="h-4 w-4 mr-1 text-[#00c6ff]" />
            StudySparkへようこそ！
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p>これからあなたの学習をサポートします。</p>
          <p>まずは目標を設定して、学習を始めましょう！</p>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-[#03a9f4] hover:bg-[#0288d1] text-white" 
            onClick={handleContinue}
            disabled={isLoading}
          >
            {isLoading ? "読み込み中..." : "始める"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
