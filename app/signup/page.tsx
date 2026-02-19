"use client"

import React, { useEffect } from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookOpen, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordMessage, setPasswordMessage] = useState("")
  const [isPasswordMatch, setIsPasswordMatch] = useState<boolean | null>(null)

  useEffect(() => {
    if (!password && !confirmPassword) {
      setPasswordMessage("")
      setIsPasswordMatch(null)
      return
    }

    if (confirmPassword.length === 0) {
      setPasswordMessage("")
      setIsPasswordMatch(null)
      return
    }

    if (password === confirmPassword) {
      setPasswordMessage("비밀번호가 일치합니다.")
      setIsPasswordMatch(true)
    } else {
      setPasswordMessage("비밀번호가 일치하지 않습니다.")
      setIsPasswordMatch(false)
    }
  }, [password, confirmPassword])


  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex items-center justify-center pt-10">
            <Image
              src="/images/logo/logo_s2y.png"
              alt="Logo"
              width={150}
              height={30}
            />
          </div>
          {/* <h1 className="text-2xl font-bold text-foreground">EduManager</h1>
          <p className="text-sm text-muted-foreground">학생 관리 시스템</p> */}
        </div>

        <Card className="border-border shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">회원가입</CardTitle>
            <CardDescription>새 계정을 만들어 학습을 시작하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input id="name" placeholder="이름을 입력하세요" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">이메일</Label>
                <Input id="signup-email" type="email" placeholder="이메일을 입력하세요" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">연락처</Label>
                <Input id="phone" type="tel" placeholder="01012345678" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">학년</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="학년을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mid-1">중학교 1학년</SelectItem>
                    <SelectItem value="mid-2">중학교 2학년</SelectItem>
                    <SelectItem value="mid-3">중학교 3학년</SelectItem>
                    <SelectItem value="high-1">고등학교 1학년</SelectItem>
                    <SelectItem value="high-2">고등학교 2학년</SelectItem>
                    <SelectItem value="high-3">고등학교 3학년</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">비밀번호</Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">비밀번호 확인</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirm ? "text" : "password"}
                    placeholder="비밀번호를 다시 입력하세요"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordMessage && (
                  <p
                    className={`text-sm mt-2 ${isPasswordMatch ? "text-emerald-600" : "text-red-600"
                      }`}
                  >
                    {passwordMessage}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full">
                회원가입
              </Button>
            </form>
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">이미 계정이 있으신가요?</span>{" "}
              <Link href="/" className="font-medium text-violet-600 hover:underline">
                로그인
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
