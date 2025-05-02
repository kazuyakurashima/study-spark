"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { saveUserName } from "@/services/profile-service"

export function NameInput() {
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (name.length < 1) {
      setError("名前を入力してください")
      return
    }

    if (name.length > 12) {
      setError("名前は12文字以内で入力してください")
      return
    }

    setIsLoading(true)

    try {
      await saveUserName(name)
      router.push("/onboarding/complete")
    } catch (error) {
      console.error("Error saving user name:", error)
      setError("名前の保存に失敗しました。もう一度お試しください。")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">名前を入力</CardTitle>
        <CardDescription className="text-center">アプリ内で使用する名前を入力してください</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">名前（1〜12文字）</Label>
            <Input id="name" value={name} onChange={handleNameChange} placeholder="名前を入力" maxLength={12} />
            <p className="text-xs text-gray-500 text-right">{name.length}/12文字</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full bg-[#03a9f4] hover:bg-[#0288d1] text-white" disabled={isLoading}>
            {isLoading ? "保存中..." : "登録する"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
