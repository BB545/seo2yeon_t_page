"use client"

import React, { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Trash2, Eye, EyeOff, AlertTriangle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

type SchoolResult = {
  name: string
  address?: string
  kind?: string
}

export default function MyPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState("")
  const [isPasswordMatch, setIsPasswordMatch] = useState<boolean | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [schoolQuery, setSchoolQuery] = useState(user?.school || "")
  const [selectedSchool, setSelectedSchool] = useState<SchoolResult | null>(null)
  const [schoolResults, setSchoolResults] = useState<SchoolResult[]>([])
  const [isSchoolLoading, setIsSchoolLoading] = useState(false)
  const [isUserTyping, setIsUserTyping] = useState(false)
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false)
  const [region, setRegion] = useState<string>(user?.region || "")
  const schoolBoxRef = useRef<HTMLDivElement | null>(null)

  const KEY = "키값"

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

  useEffect(() => {
    if (!isUserTyping) return
    const q = schoolQuery.trim()
    if (q.length < 2) {
      setSchoolResults([])
      return
    }

    setIsSchoolLoading(true)

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://open.neis.go.kr/hub/schoolInfo?KEY=${KEY}&Type=json&SCHUL_NM=${encodeURIComponent(q)}${region ? `&LCTN_SC_NM=${encodeURIComponent(region)}` : ""}`
        )

        const data = await res.json()
        const rows = data.schoolInfo?.[1]?.row ?? []

        const parsed = rows.map((item: any) => ({
          name: item.SCHUL_NM,
          address: item.ORG_RDNMA,
          kind: item.SCHUL_KND_SC_NM
        }))

        setSchoolResults(parsed)
        setShowSchoolDropdown(true)
      } catch {
        setSchoolResults([])
      } finally {
        setIsSchoolLoading(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [schoolQuery, region])

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
                    readOnly
                    className="text-gray-400"
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
                    readOnly
                    className="text-gray-400"
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

                {/* School */}
                <div className="space-y-2" ref={schoolBoxRef}>
                  <Label>학교</Label>

                  <div className="flex gap-2">
                    {/* Region */}
                    <div className="w-1/3">
                      <Select value={region} onValueChange={(v) => setRegion(v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="지역" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="서울특별시">서울</SelectItem>
                          <SelectItem value="경기도">경기</SelectItem>
                          <SelectItem value="부산광역시">부산</SelectItem>
                          <SelectItem value="대구광역시">대구</SelectItem>
                          <SelectItem value="인천광역시">인천</SelectItem>
                          <SelectItem value="광주광역시">광주</SelectItem>
                          <SelectItem value="대전광역시">대전</SelectItem>
                          <SelectItem value="울산광역시">울산</SelectItem>
                          <SelectItem value="세종특별자치시">세종</SelectItem>
                          <SelectItem value="강원특별자치도">강원</SelectItem>
                          <SelectItem value="충청북도">충북</SelectItem>
                          <SelectItem value="충청남도">충남</SelectItem>
                          <SelectItem value="전북특별자치도">전북</SelectItem>
                          <SelectItem value="전라남도">전남</SelectItem>
                          <SelectItem value="경상북도">경북</SelectItem>
                          <SelectItem value="경상남도">경남</SelectItem>
                          <SelectItem value="제주특별자치도">제주</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* School Search */}
                    <div className="w-2/3 relative">
                      <Input
                        placeholder="학교명을 입력하세요"
                        value={schoolQuery}
                        onChange={(e) => {
                          setIsUserTyping(true)
                          setSchoolQuery(e.target.value)
                          setSelectedSchool(null)
                        }}
                      />

                      {showSchoolDropdown && (
                        <div className="absolute z-50 mt-2 w-full rounded-md border bg-white shadow-sm max-h-60 overflow-auto">
                          {isSchoolLoading && (
                            <div className="p-2 text-sm text-muted-foreground">검색 중...</div>
                          )}

                          {!isSchoolLoading &&
                            schoolResults.map((s, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => {
                                  setSelectedSchool(s)
                                  setSchoolQuery(s.name)
                                  setShowSchoolDropdown(false)

                                  setFormData((prev) => ({
                                    ...prev,
                                    grade: ""
                                  }))
                                }}
                                className="w-full px-3 py-2 text-left hover:bg-gray-100"
                              >
                                <div className="font-medium">{s.name}</div>
                                {s.address && (
                                  <div className="text-xs text-muted-foreground">
                                    {s.address}
                                  </div>
                                )}
                              </button>
                            ))}

                          {!isSchoolLoading && schoolResults.length === 0 && (
                            <div className="p-2 text-sm text-muted-foreground">
                              검색 결과 없음
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Grade */}
                <Select
                  value={formData.grade}
                  onValueChange={(value) => {
                    if (!selectedSchool?.kind) return
                    const finalValue = `${selectedSchool.kind} ${value}`
                    handleGradeChange(finalValue)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="학년을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1학년">1학년</SelectItem>
                    <SelectItem value="2학년">2학년</SelectItem>
                    <SelectItem value="3학년">3학년</SelectItem>
                  </SelectContent>
                </Select>

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
                계정을 삭제하면 30일 이내에 동일한 이메일로 재가입이 불가하며 <br />모든 데이터가 영구적으로 삭제됩니다.
                탈퇴하시겠습니까?
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
