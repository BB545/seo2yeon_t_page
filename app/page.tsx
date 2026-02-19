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
    } else {
      login("student")
    }
    router.push("/dashboard")
  }

  const handleQuickLogin = (role: "student" | "admin") => {
    if (role === "admin") {
      setEmail("admin@example.com")
      setPassword("admin1234")
    } else {
      setEmail("minjun@example.com")
      setPassword("student1234")
    }
    login(role)
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

            {/* Quick login section */}
            {/* <div className="mt-6">
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-3 text-muted-foreground">테스트 계정으로 바로 로그인</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleQuickLogin("student")}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:bg-primary/5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-sm font-bold text-blue-600">
                    학
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">학생 계정</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">김민준 (고2)</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin("admin")}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:bg-primary/5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-sm font-bold text-emerald-600">
                    관
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">관리자 계정</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">박선생 (관리자)</p>
                  </div>
                </button>
              </div>
            </div> */}

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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
