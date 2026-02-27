"use client"

import React, { useEffect } from "react"

import { useState, useMemo, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookOpen, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

type SchoolResult = {
  name: string
  address?: string
  kind?: string
}

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordMessage, setPasswordMessage] = useState("")
  const [isPasswordMatch, setIsPasswordMatch] = useState<boolean | null>(null)

  const [schoolQuery, setSchoolQuery] = useState("")
  const [schoolResults, setSchoolResults] = useState<SchoolResult[]>([])
  const [isSchoolLoading, setIsSchoolLoading] = useState(false)
  const [schoolError, setSchoolError] = useState<string | null>(null)
  const [selectedSchool, setSelectedSchool] = useState<SchoolResult | null>(null)
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false)
  const [region, setRegion] = useState<string>("")
  const [grade, setGrade] = useState("")

  const [isEmailSent, setIsEmailSent] = useState(false)
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [timer, setTimer] = useState(180) // 3분
  const [isExpired, setIsExpired] = useState(false)

  const schoolBoxRef = useRef<HTMLDivElement | null>(null)

  const KEY = "키값" // 테스트용

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!schoolBoxRef.current) return
      if (!schoolBoxRef.current.contains(e.target as Node)) {
        setShowSchoolDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  // 비밀번호 확인
  useEffect(() => {
    if (!password || !confirmPassword) {
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

  // 🔥 학교 검색
  useEffect(() => {
    if (selectedSchool && schoolQuery === selectedSchool.name) return

    const q = schoolQuery.trim()
    if (q.length < 2) {
      setSchoolResults([])
      return
    }

    setIsSchoolLoading(true)

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://open.neis.go.kr/hub/schoolInfo?KEY=${KEY}&Type=json&SCHUL_NM=${encodeURIComponent(q)}${region ? `&LCTN_SC_NM=${encodeURIComponent(region)}` : ""
          }`
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
      } catch (e) {
        setSchoolResults([])
      } finally {
        setIsSchoolLoading(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [schoolQuery, region, selectedSchool])

  const selectSchool = (s: SchoolResult) => {
    setSelectedSchool(s)
    setSchoolQuery(s.name)
    setShowSchoolDropdown(false)
  }

  useEffect(() => {
    if (!isEmailSent || isEmailVerified) return

    if (timer <= 0) {
      setIsExpired(true)
      setIsEmailSent(false)
      return
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isEmailSent, timer, isEmailVerified])

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
                <div className="flex gap-2">
                  <Input id="signup-email" type="email" placeholder="이메일을 입력하세요" />
                  {!isEmailVerified && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEmailSent(true)
                        setIsExpired(false)
                        setTimer(180)
                      }}
                    >
                      이메일 인증하기
                    </Button>
                  )}
                </div>

                {isEmailSent && !isEmailVerified && (
                  <div className="mt-2 space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="인증번호 입력"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          if (verificationCode.length === 6) {
                            setIsEmailVerified(true)
                            setIsEmailSent(false)
                          }
                        }}
                      >
                        인증 완료
                      </Button>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      남은 시간: {Math.floor(timer / 60)}:
                      {(timer % 60).toString().padStart(2, "0")}
                    </div>
                  </div>
                )}

                {isEmailVerified && (
                  <p className="text-sm text-emerald-600">이메일 인증이 완료되었습니다.</p>
                )}

                {isExpired && (
                  <p className="text-sm text-red-600">인증 시간이 만료되었습니다.</p>
                )}
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
              <div className="space-y-2">
                <Label htmlFor="phone">연락처</Label>
                <Input id="phone" type="tel" placeholder="01012345678" />
              </div>
              <div className="space-y-2" ref={schoolBoxRef}>
                <Label>학교</Label>

                <div className="flex gap-2">
                  <div className="w-1/3">
                    <Select onValueChange={(v) => setRegion(v)}>
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

                  <div className="w-2/3 relative">
                    <Input
                      placeholder="학교명을 입력하세요"
                      value={schoolQuery}
                      onChange={(e) => {
                        setSchoolQuery(e.target.value)
                        setSelectedSchool(null)
                      }}
                    />

                    {showSchoolDropdown && (
                      <div className="absolute z-50 mt-2 w-full rounded-md border bg-white shadow-sm max-h-60 overflow-auto">
                        {isSchoolLoading && (
                          <div className="p-2 text-sm text-muted-foreground">
                            검색 중...
                          </div>
                        )}

                        {!isSchoolLoading &&
                          schoolResults.map((s, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => selectSchool(s)}
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
                {/* 선택 강제 안내(원하면 삭제 가능) */}
                {!selectedSchool && schoolQuery.trim().length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    검색 결과에서 학교를 선택해주세요.
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">학년</Label>
                <Select
                  onValueChange={(value) => {
                    if (!selectedSchool?.kind) return
                    const finalValue = `${selectedSchool.kind} ${value}`
                    setGrade(finalValue)
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
    </div >
  )
}
