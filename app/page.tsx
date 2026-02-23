"use client"

import React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookOpen, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email === "admin@example.com") {
      login("admin")
    } else if (email === "sohn.hyunwoo@example.com") {
      login("assistant_admin")
    } else {
      login("student")
    }
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
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
          {/* <h1 className="text-2xl font-bold text-foreground">서이연 수학</h1>
          <p className="text-sm text-muted-foreground">학생 관리 사이트</p> */}
        </div>

        <Card className="border-border shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">로그인</CardTitle>
            <CardDescription>계정에 로그인하여 서비스를 이용하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="이메일을 입력하세요"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative">
                  <Input
                    id="password"
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
              <Button type="submit" className="w-full">
                로그인
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">계정이 없으신가요?</span>{" "}
              <Link href="/signup" className="font-medium text-violet-600 hover:underline">
                회원가입
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Test credentials info */}
        <Card className="mt-4 border-border bg-muted/50">
          <CardContent className="p-4">
            <p className="mb-2 text-xs font-semibold text-muted-foreground">테스트 계정 정보</p>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>학생: minjun@example.com</span>
                <span>student1234</span>
              </div>
              <div className="flex justify-between">
                <span>관리자: admin@example.com</span>
                <span>admin1234</span>
              </div>
              <div className="flex justify-between">
                <span>조교: sohn.hyunwoo@example.com</span>
                <span>assistant1234</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
