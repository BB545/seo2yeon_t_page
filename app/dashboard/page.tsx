"use client"

import React, { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  MessageSquareMore,
  Video,
  GraduationCap,
  ClipboardList,
  ArrowRight,
  CalendarDays,
  Clock,
  Bell,
  Users,
  Shield,
  X,
} from "lucide-react"
import { type Student, assignments, qnaPosts, consultations, students, submissions } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  onClick,
  href,
}: {
  icon: React.ElementType
  label: string
  value: string
  color: string
  onClick?: () => void
  href?: string
}) {
  const content = (
    <Card className="border-border cursor-pointer transition-all hover:shadow-md hover:border-violet-500/50">
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border-2 ${color}`}
        >
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  if (onClick) {
    return <div onClick={onClick}>{content}</div>
  }

  return content
}

function StudentDashboard() {
  const pendingAssignments = assignments.filter((a) => a.status === "진행중").length
  const myQnaPosts = qnaPosts.filter((q) => q.authorId === "user-1")
  const myConsultations = consultations.filter((c) => c.authorId === "user-1")

  return (
    <>
      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/assignments">
          <StatCard
            icon={ClipboardList}
            label="진행중 과제"
            value={`${pendingAssignments}건`}
            color="border-primary text-primary"
          />
        </Link>
        <Link href="/my-qna">
          <StatCard
            icon={MessageSquareMore}
            label="내 질문"
            value={`${myQnaPosts.length}건`}
            color="border-emerald-500 text-emerald-500"
          />
        </Link>
        <Link href="/my-consultation">
          <StatCard
            icon={GraduationCap}
            label="상담 내역"
            value={`${myConsultations.length}건`}
            color="border-amber-500 text-amber-500"
          />
        </Link>
        <Link href="/lectures">
          <StatCard
            icon={Video}
            label="수강 강좌"
            value="4개"
            color="border-rose-500 text-rose-500"
          />
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Assignments */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">다가오는 과제</CardTitle>
            <Link href="/assignments">
              <Button
                variant="ghost"
                size="sm"
                className="group p-0 h-auto bg-transparent hover:bg-transparent shadow-none text-muted-foreground hover:text-violet-600"
              >
                전체보기 <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {assignments
              .filter((a) => a.status === "진행중")
              .slice(0, 3)
              .map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"
                >
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-foreground">
                      {assignment.title}
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {assignment.dueDate}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {assignment.subject}
                      </Badge>
                    </div>
                  </div>
                  <Badge className="ml-3 flex-shrink-0 bg-primary/10 text-primary hover:bg-primary/10">
                    {assignment.status}
                  </Badge>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Recent Q&A */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">최근 질의응답</CardTitle>
            <Link href="/my-qna">
              <Button
                variant="ghost"
                size="sm"
                className="group p-0 h-auto bg-transparent hover:bg-transparent shadow-none text-muted-foreground hover:text-violet-600"
              >
                전체보기 <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {qnaPosts
              .filter((q) => q.authorId === "user-1")
              .slice(0, 3)
              .map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"
                >
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-foreground">
                      {post.title}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{post.createdAt}</p>
                  </div>
                  <Badge
                    className={`ml-3 flex-shrink-0 ${
                      post.answer
                        ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10"
                        : "bg-amber-500/10 text-amber-600 hover:bg-amber-500/10"
                    }`}
                  >
                    {post.answer ? "답변완료" : "대기중"}
                  </Badge>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-border lg:col-span-2">
          <CardHeader className="flex flex-row items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle className="text-base font-semibold">알림</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3">
              <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  미적분 연습문제 마감이 6일 남았습니다
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  과제 제출 기한: 2026-02-15
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3">
              <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                <MessageSquareMore className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  질문에 대한 답변이 등록되었습니다
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  수학 미적분 문제 질문드립니다 - 답변완료
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3">
              <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/10">
                <GraduationCap className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  학습 상담 답변이 완료되었습니다
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  수학 학습 방향 상담 요청합니다 - 답변완료
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

function StudentListModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const studentsByGrade = students.reduce(
    (acc, student) => {
      const grade = student.grade || "미지정"
      if (!acc[grade]) {
        acc[grade] = []
      }
      acc[grade].push(student)
      return acc
    },
    {} as Record<string, Student[]>
  )

  const sortedGrades = Object.keys(studentsByGrade).sort((a, b) => {
    if (a === "미지정") return 1
    if (b === "미지정") return -1
    return a.localeCompare(b)
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle>등록 학생 목록</CardTitle>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-0">
          {sortedGrades.map((grade) => (
            <div key={grade} className="border-b last:border-b-0">
              <div className="sticky top-0 bg-muted/50 px-6 py-3 font-semibold text-sm">
                {grade}
              </div>
              <div className="divide-y">
                {studentsByGrade[grade].map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between px-6 py-3 hover:bg-muted/30 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground">{student.name}</p>
                      <p className="text-xs text-muted-foreground">ID: {student.id}</p>
                    </div>
                    <Badge className="text-xs bg-violet-200 text-secondary-foreground hover:bg-violet-200 border-transparent">
                      {student.grade}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function AdminDashboard() {
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false)
  const totalStudents = students.length
  const totalAssignments = assignments.length
  const pendingQna = qnaPosts.filter((q) => !q.answer).length
  const pendingConsultations = consultations.filter(
    (c) => c.status !== "답변완료"
  ).length

  return (
    <>
      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div onClick={() => setIsStudentModalOpen(true)}>
          <StatCard
            icon={Users}
            label="등록 학생"
            value={`${totalStudents}명`}
            color="border-primary text-primary"
          />
        </div>
        <Link href="/assignments">
          <StatCard
            icon={ClipboardList}
            label="전체 과제"
            value={`${totalAssignments}건`}
            color="border-emerald-500 text-emerald-500"
          />
        </Link>
        <Link href="/qna">
          <StatCard
            icon={MessageSquareMore}
            label="미답변 질문"
            value={`${pendingQna}건`}
            color="border-amber-500 text-amber-500"
          />
        </Link>
        <Link href="/consultation">
          <StatCard
            icon={GraduationCap}
            label="진행중 상담"
            value={`${pendingConsultations}건`}
            color="border-rose-500 text-rose-500"
          />
        </Link>
      </div>

      <StudentListModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent submissions */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">최근 제출물</CardTitle>
            <Link href="/assignments">
              <Button
                variant="ghost"
                size="sm"
                className="group p-0 h-auto bg-transparent hover:bg-transparent shadow-none text-muted-foreground hover:text-violet-600"
              >
                전체보기 <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {submissions.slice(0, 4).map((sub) => {
              const assignment = assignments.find(
                (a) => a.id === sub.assignmentId
              )
              return (
                <div
                  key={sub.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"
                >
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-foreground">
                      {sub.studentName}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {assignment?.title} - {sub.submittedAt}
                    </p>
                  </div>
                  {sub.grade != null ? (
                    <Badge className="ml-3 flex-shrink-0 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10">
                      {sub.grade}점
                    </Badge>
                  ) : (
                    <Badge className="ml-3 flex-shrink-0 bg-amber-500/10 text-amber-600 hover:bg-amber-500/10">
                      미채점
                    </Badge>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Pending Q&A */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">미답변 질문</CardTitle>
            <Link href="/qna">
              <Button
                variant="ghost"
                size="sm"
                className="group p-0 h-auto bg-transparent hover:bg-transparent shadow-none text-muted-foreground hover:text-violet-600"
              >
                전체보기 <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {qnaPosts
              .filter((q) => !q.answer)
              .slice(0, 4)
              .map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"
                >
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-foreground">
                      {post.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {post.authorName} - {post.createdAt}
                    </p>
                  </div>
                  <Badge className="ml-3 flex-shrink-0 bg-amber-500/10 text-amber-600 hover:bg-amber-500/10">
                    대기중
                  </Badge>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Pending consultations */}
        <Card className="border-border lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">
              진행중인 상담
            </CardTitle>
            <Link href="/consultation">
              <Button
                variant="ghost"
                size="sm"
                className="group p-0 h-auto bg-transparent hover:bg-transparent shadow-none text-muted-foreground hover:text-violet-600"
              >
                전체보기 <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {consultations
              .filter((c) => c.status !== "답변완료")
              .map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"
                >
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-foreground">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.authorName} - {item.createdAt}
                    </p>
                  </div>
                  <Badge
                    className={`ml-3 flex-shrink-0 ${
                      item.status === "접수완료"
                        ? "bg-blue-500/10 text-blue-600 hover:bg-blue-500/10"
                        : "bg-amber-500/10 text-amber-600 hover:bg-amber-500/10"
                    }`}
                  >
                    {item.status}
                  </Badge>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default function DashboardPage() {
  const { user, isAdmin } = useAuth()

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-foreground">
            안녕하세요, {user.name}님
          </h1>
          {isAdmin ? (
            <Badge className="gap-1 bg-rose-500/10 text-rose-600 hover:bg-rose-500/10">
              <Shield className="h-3 w-3" />
              관리자
            </Badge>
          ) : (
            <Badge className="gap-0.5 bg-violet-500/10 px-1.5 py-0 text-[10px] text-violet-600 hover:bg-violet-500/10">
              <GraduationCap className="h-2.5 w-2.5" />
              학생
            </Badge>
          )}
        </div>
        <p className="mt-1 text-muted-foreground">
          {isAdmin
            ? "관리자 대시보드에서 전체 현황을 확인하세요."
            : "오늘도 좋은 하루 되세요. 학습 현황을 확인해보세요."}
        </p>
      </div>

      {isAdmin ? <AdminDashboard /> : <StudentDashboard />}
    </AppLayout>
  )
}
