"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Trash2, Eye, EyeOff, AlertTriangle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function MyPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState("")
  const [isPasswordMatch, setIsPasswordMatch] = useState<boolean | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    grade: user?.grade || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    const { newPassword, confirmPassword } = formData

    // 둘 다 비어있으면 메시지 안보임
    if (!newPassword && !confirmPassword) {
      setPasswordMessage("")
      setIsPasswordMatch(null)
      return
    }

    if (confirmPassword.length === 0) {
      setPasswordMessage("")
      setIsPasswordMatch(null)
      return
    }

    if (newPassword === confirmPassword) {
      setPasswordMessage("비밀번호가 일치합니다.")
      setIsPasswordMatch(true)
    } else {
      setPasswordMessage("비밀번호가 일치하지 않습니다.")
      setIsPasswordMatch(false)
    }
  }, [formData.newPassword, formData.confirmPassword])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleGradeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      grade: value,
    }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      router.push("/dashboard")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWithdraw = async () => {
    if (!window.confirm("정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      return
    }

    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      router.push("/")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) return null

  return (
    <AppLayout>
      <div className="mb-8">
        <Button
          onClick={() => router.back()}
          size="sm"
          className="group p-0 h-auto bg-transparent hover:bg-transparent shadow-none text-muted-foreground hover:text-violet-600"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          뒤로가기
        </Button>
        <h1 className="text-2xl font-bold text-foreground mt-4">내 정보 수정</h1>
        <p className="mt-1 text-muted-foreground">
          개인 정보를 수정하거나 비밀번호를 변경할 수 있습니다.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Edit Form */}
        <div className="lg:col-span-2">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base font-semibold">기본 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="이름을 입력하세요"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="이메일을 입력하세요"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">연락처</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="01012345678"
                  />
                </div>

                {/* Grade */}
                <div className="space-y-2">
                  <Label htmlFor="grade">학년</Label>
                  <Select value={formData.grade} onValueChange={handleGradeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="학년을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="중학교 1학년">중학교 1학년</SelectItem>
                      <SelectItem value="중학교 2학년">중학교 2학년</SelectItem>
                      <SelectItem value="중학교 3학년">중학교 3학년</SelectItem>
                      <SelectItem value="고등학교 1학년">고등학교 1학년</SelectItem>
                      <SelectItem value="고등학교 2학년">고등학교 2학년</SelectItem>
                      <SelectItem value="고등학교 3학년">고등학교 3학년</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-sm font-semibold text-foreground mb-4">비밀번호 변경</h3>

                  {/* Current Password */}
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="currentPassword">현재 비밀번호</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        placeholder="현재 비밀번호를 입력하세요"
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

                  {/* New Password */}
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="newPassword">새 비밀번호</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        placeholder="새 비밀번호를 입력하세요"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="비밀번호를 다시 입력하세요"
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
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "저장 중..." : "정보 저장"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Danger Zone */}
        <div className="lg:flex lg:flex-col lg:justify-end">
          <Card className="border-red-200 bg-red-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-red-700">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
                주의
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-600 mb-4">
                계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.
              </p>
              <Button
                variant="destructive"
                className="w-full gap-2"
                onClick={handleWithdraw}
                disabled={isSubmitting}
              >
                <Trash2 className="h-4 w-4" />
                {isSubmitting ? "처리 중..." : "계정 탈퇴"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
