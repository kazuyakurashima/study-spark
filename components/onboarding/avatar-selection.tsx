"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { saveAvatar } from "@/services/profile-service"

const avatars = [
  { id: "avatar1", type: "male", src: "/placeholder.svg?height=100&width=100" },
  { id: "avatar2", type: "male", src: "/placeholder.svg?height=100&width=100" },
  { id: "avatar3", type: "female", src: "/placeholder.svg?height=100&width=100" },
  { id: "avatar4", type: "female", src: "/placeholder.svg?height=100&width=100" },
  { id: "avatar5", type: "neutral", src: "/placeholder.svg?height=100&width=100" },
  { id: "avatar6", type: "neutral", src: "/placeholder.svg?height=100&width=100" },
]

export function AvatarSelection() {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleContinue = async () => {
    if (selectedAvatar !== null) {
      try {
        setIsLoading(true)
        await saveAvatar(selectedAvatar)
        router.push("/onboarding/name")
      } catch (error) {
        console.error("Error saving avatar:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">アバターを選択</CardTitle>
        <CardDescription className="text-center">あなたを表すアバターを選んでください</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {avatars.map((avatar) => (
            <div
              key={avatar.id}
              className={`cursor-pointer rounded-lg p-2 border-2 transition-all ${
                selectedAvatar === avatar.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedAvatar(avatar.id)}
            >
              <Image
                src={avatar.src || "/placeholder.svg"}
                alt={`Avatar ${avatar.id}`}
                width={100}
                height={100}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-[#03a9f4] hover:bg-[#0288d1] text-white"
          onClick={handleContinue}
          disabled={selectedAvatar === null || isLoading}
        >
          {isLoading ? "保存中..." : "名前入力へ"}
        </Button>
      </CardFooter>
    </Card>
  )
}
