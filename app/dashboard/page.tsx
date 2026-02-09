"use client"

import React from "react"
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
  FileCheck,
  Shield,
} from "lucide-react"
import { assignments, qnaPosts, consultations, students, submissions } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType
  label: string
  value: string
  color: string
}) {
  return (
    <Card className="border-border">
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${color}`}
        >
          <Icon className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function StudentDashboard() {
  const pendingAssignments = assignments.filter((a) => a.status === "진행중").length
  const myQnaPosts = qnaPosts.filter((q) => q.authorId === "user-1")
  const myConsultations = consultations.filter((c) => c.authorId === "user-1")

  return (
    <>
      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={ClipboardList}
          label="진행중 과제"
          value={`${pendingAssignments}건`}
          color="bg-primary"
        />
        <StatCard
          icon={MessageSquareMore}
          label="내 질문"
          value={`${myQnaPosts.length}건`}
          color="bg-emerald-500"
        />
        <StatCard
          icon={GraduationCap}
          label="상담 내역"
          value={`${myConsultations.length}건`}
          color="bg-amber-500"
        />
        <StatCard icon={Video} label="수강 강좌" value="4개" color="bg-rose-500" />
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
                className="gap-1 text-muted-foreground"
              >
                전체보기 <ArrowRight className="h-3.5 w-3.5" />
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
            <Link href="/qna">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-muted-foreground"
              >
                전체보기 <ArrowRight className="h-3.5 w-3.5" />
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

function AdminDashboard() {
  const totalStudents = students.length
  const totalAssignments = assignments.length
  const totalSubmissions = submissions.length
  const pendingQna = qnaPosts.filter((q) => !q.answer).length
  const pendingConsultations = consultations.filter(
    (c) => c.status !== "답변완료"
  ).length

  return (
    <>
      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="등록 학생"
          value={`${totalStudents}명`}
          color="bg-primary"
        />
        <StatCard
          icon={ClipboardList}
          label="전체 과제"
          value={`${totalAssignments}건`}
          color="bg-emerald-500"
        />
        <StatCard
          icon={MessageSquareMore}
          label="미답변 질문"
          value={`${pendingQna}건`}
          color="bg-amber-500"
        />
        <StatCard
          icon={GraduationCap}
          label="진행중 상담"
          value={`${pendingConsultations}건`}
          color="bg-rose-500"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent submissions */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">최근 제출물</CardTitle>
            <Link href="/assignments">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-muted-foreground"
              >
                전체보기 <ArrowRight className="h-3.5 w-3.5" />
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
                className="gap-1 text-muted-foreground"
              >
                전체보기 <ArrowRight className="h-3.5 w-3.5" />
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
                className="gap-1 text-muted-foreground"
              >
                전체보기 <ArrowRight className="h-3.5 w-3.5" />
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
          {isAdmin && (
            <Badge className="gap-1 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10">
              <Shield className="h-3 w-3" />
              관리자
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
