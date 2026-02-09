"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  CalendarDays,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileUp,
  Paperclip,
  Users,
  FileText,
  ArrowLeft,
  Star,
  MessageSquare,
  ChevronRight,
  Plus,
} from "lucide-react"
import {
  assignments,
  submissions,
  students,
  type Assignment,
  type Submission,
} from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"

// ─── Shared Helpers ───

function statusConfig(status: Assignment["status"]) {
  switch (status) {
    case "진행중":
      return { color: "bg-primary/10 text-primary hover:bg-primary/10", icon: Clock }
    case "제출완료":
      return { color: "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10", icon: CheckCircle2 }
    case "마감":
      return { color: "bg-destructive/10 text-destructive hover:bg-destructive/10", icon: AlertCircle }
    default:
      return { color: "bg-muted text-muted-foreground", icon: Clock }
  }
}

function daysUntilDue(dueDate: string): number {
  const diff = new Date(dueDate).getTime() - new Date().getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

// ─── Student View ───

function StudentAssignmentCard({ assignment }: { assignment: Assignment }) {
  const [submitOpen, setSubmitOpen] = useState(false)
  const [fileName, setFileName] = useState("")
  const config = statusConfig(assignment.status)
  const days = daysUntilDue(assignment.dueDate)

  // Find this student's submission/grade for this assignment
  const mySubmission = submissions.find(
    (s) => s.assignmentId === assignment.id && s.studentId === "user-1"
  )

  return (
    <Card className="border-border transition-shadow hover:shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-foreground">{assignment.title}</h3>
              <Badge className={config.color}>{assignment.status}</Badge>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {assignment.description}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <Badge variant="secondary">{assignment.subject}</Badge>
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                마감: {assignment.dueDate}
              </span>
              {assignment.status === "진행중" && (
                <span
                  className={`font-medium ${
                    days <= 2
                      ? "text-destructive"
                      : days <= 5
                        ? "text-amber-600"
                        : "text-muted-foreground"
                  }`}
                >
                  {days > 0 ? `D-${days}` : "마감일 지남"}
                </span>
              )}
              {mySubmission?.submittedAt && (
                <span className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle2 className="h-3 w-3" />
                  제출: {mySubmission.submittedAt}
                </span>
              )}
            </div>

            {/* Grade display for student */}
            {mySubmission && (
              <div className="mt-3 rounded-lg border border-border bg-muted/30 p-3">
                <div className="flex flex-wrap items-center gap-3">
                  {mySubmission.grade != null ? (
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-semibold text-foreground">
                        성적: {mySubmission.grade}점
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        성적 미입력
                      </span>
                    </div>
                  )}
                  {mySubmission.feedback && (
                    <span className="text-xs text-muted-foreground">|</span>
                  )}
                  {mySubmission.feedback && (
                    <div className="flex items-start gap-1.5">
                      <MessageSquare className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {mySubmission.feedback}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {assignment.status === "진행중" && (
            <Dialog open={submitOpen} onOpenChange={setSubmitOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex-shrink-0 gap-1.5">
                  <Upload className="h-4 w-4" />
                  제출
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>과제 제출</DialogTitle>
                  <DialogDescription>{assignment.title}</DialogDescription>
                </DialogHeader>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault()
                    setSubmitOpen(false)
                  }}
                >
                  <div className="rounded-lg border-2 border-dashed border-border bg-muted/30 p-8">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <FileUp className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          파일을 드래그하거나 클릭하여 업로드
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          PDF, DOC, DOCX, HWP, JPG, PNG (최대 50MB)
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-1.5 bg-transparent"
                        onClick={() =>
                          setFileName("과제_김민준_미적분.pdf")
                        }
                      >
                        <Paperclip className="h-3.5 w-3.5" />
                        파일 선택
                      </Button>
                    </div>
                  </div>
                  {fileName && (
                    <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm text-foreground">
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      {fileName}
                    </div>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSubmitOpen(false)}
                    >
                      취소
                    </Button>
                    <Button type="submit">제출하기</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function StudentView() {
  const myAssignments = assignments.filter((a) =>
    a.assignedTo.includes("user-1")
  )
  const pending = myAssignments.filter((a) => a.status === "진행중")
  const completed = myAssignments.filter((a) => a.status === "제출완료")
  const overdue = myAssignments.filter((a) => a.status === "마감")

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">과제 제출</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          나에게 할당된 과제를 확인하고 제출하세요.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{pending.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">진행중</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">
              {completed.length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">제출완료</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-destructive">
              {overdue.length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">마감</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">전체 ({myAssignments.length})</TabsTrigger>
          <TabsTrigger value="pending">진행중 ({pending.length})</TabsTrigger>
          <TabsTrigger value="completed">
            제출완료 ({completed.length})
          </TabsTrigger>
          <TabsTrigger value="overdue">마감 ({overdue.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4 space-y-3">
          {myAssignments.map((a) => (
            <StudentAssignmentCard key={a.id} assignment={a} />
          ))}
        </TabsContent>
        <TabsContent value="pending" className="mt-4 space-y-3">
          {pending.map((a) => (
            <StudentAssignmentCard key={a.id} assignment={a} />
          ))}
        </TabsContent>
        <TabsContent value="completed" className="mt-4 space-y-3">
          {completed.map((a) => (
            <StudentAssignmentCard key={a.id} assignment={a} />
          ))}
        </TabsContent>
        <TabsContent value="overdue" className="mt-4 space-y-3">
          {overdue.map((a) => (
            <StudentAssignmentCard key={a.id} assignment={a} />
          ))}
        </TabsContent>
      </Tabs>
    </>
  )
}

// ─── Admin View ───

function GradeDialog({
  submission,
  assignmentTitle,
}: {
  submission: Submission
  assignmentTitle: string
}) {
  const [open, setOpen] = useState(false)
  const [grade, setGrade] = useState(
    submission.grade != null ? String(submission.grade) : ""
  )
  const [feedback, setFeedback] = useState(submission.feedback || "")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 bg-transparent">
          <Star className="h-3.5 w-3.5" />
          {submission.grade != null ? "성적 수정" : "성적 입력"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>성적 입력</DialogTitle>
          <DialogDescription>
            {submission.studentName} - {assignmentTitle}
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            setOpen(false)
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="grade-score">
              성적 (선택사항)
            </Label>
            <Input
              id="grade-score"
              type="number"
              min="0"
              max="100"
              placeholder="0 ~ 100"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              성적 입력은 필수가 아닙니다. 필요한 경우에만 입력하세요.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="grade-feedback">피드백 (선택사항)</Label>
            <Textarea
              id="grade-feedback"
              placeholder="학생에게 전달할 피드백을 작성하세요"
              className="min-h-[100px]"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              취소
            </Button>
            <Button type="submit">저장</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function AdminAssignmentDetail({
  assignment,
  onBack,
}: {
  assignment: Assignment
  onBack: () => void
}) {
  const assignmentSubmissions = submissions.filter(
    (s) => s.assignmentId === assignment.id
  )
  const assignedStudentsList = students.filter((s) =>
    assignment.assignedTo.includes(s.id)
  )
  const submittedIds = assignmentSubmissions.map((s) => s.studentId)
  const notSubmitted = assignedStudentsList.filter(
    (s) => !submittedIds.includes(s.id)
  )
  const graded = assignmentSubmissions.filter((s) => s.grade != null).length

  return (
    <>
      {/* Back button and header */}
      <div className="mb-6">
        <button
          type="button"
          onClick={onBack}
          className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          과제 목록으로 돌아가기
        </button>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">
                {assignment.title}
              </h1>
              <Badge className={statusConfig(assignment.status).color}>
                {assignment.status}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {assignment.description}
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <Badge variant="secondary">{assignment.subject}</Badge>
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            마감: {assignment.dueDate}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            대상: {assignedStudentsList.length}명
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              {assignmentSubmissions.length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">제출</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-destructive">
              {notSubmitted.length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">미제출</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">{graded}</p>
            <p className="mt-1 text-xs text-muted-foreground">채점완료</p>
          </CardContent>
        </Card>
      </div>

      {/* Submitted */}
      <div className="mb-6">
        <h2 className="mb-3 text-lg font-semibold text-foreground">
          제출한 학생 ({assignmentSubmissions.length})
        </h2>
        <div className="space-y-3">
          {assignmentSubmissions.map((sub) => (
            <Card key={sub.id} className="border-border">
              <CardContent className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {sub.studentName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {sub.studentName}
                      </p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Paperclip className="h-3 w-3" />
                          {sub.fileName}
                        </span>
                        <span>|</span>
                        <span>제출: {sub.submittedAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {sub.grade != null ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10">
                        {sub.grade}점
                      </Badge>
                    ) : (
                      <Badge className="bg-muted text-muted-foreground hover:bg-muted">
                        미채점
                      </Badge>
                    )}
                    <GradeDialog
                      submission={sub}
                      assignmentTitle={assignment.title}
                    />
                  </div>
                </div>
                {sub.feedback && (
                  <div className="mt-3 rounded-lg border border-border bg-muted/30 px-3 py-2">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
                      <p className="text-sm text-muted-foreground">
                        {sub.feedback}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {assignmentSubmissions.length === 0 && (
            <div className="rounded-xl border border-dashed border-border py-12 text-center">
              <FileText className="mx-auto h-10 w-10 text-muted-foreground/30" />
              <p className="mt-3 text-sm text-muted-foreground">
                아직 제출한 학생이 없습니다.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Not submitted */}
      {notSubmitted.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            미제출 학생 ({notSubmitted.length})
          </h2>
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="space-y-2">
                {notSubmitted.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center gap-3 rounded-lg bg-muted/30 p-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-xs font-semibold text-destructive">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {student.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {student.grade}
                      </p>
                    </div>
                    <Badge className="ml-auto bg-destructive/10 text-destructive hover:bg-destructive/10">
                      미제출
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

function AdminAssignmentCard({
  assignment,
  onClick,
}: {
  assignment: Assignment
  onClick: () => void
}) {
  const config = statusConfig(assignment.status)
  const assignmentSubmissions = submissions.filter(
    (s) => s.assignmentId === assignment.id
  )
  const graded = assignmentSubmissions.filter((s) => s.grade != null).length
  const days = daysUntilDue(assignment.dueDate)

  return (
    <Card
      className="cursor-pointer border-border transition-all hover:border-primary/30 hover:shadow-md"
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-foreground">
                {assignment.title}
              </h3>
              <Badge className={config.color}>{assignment.status}</Badge>
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground line-clamp-1">
              {assignment.description}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <Badge variant="secondary">{assignment.subject}</Badge>
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                마감: {assignment.dueDate}
              </span>
              {assignment.status === "진행중" && days > 0 && (
                <span
                  className={`font-medium ${
                    days <= 2
                      ? "text-destructive"
                      : days <= 5
                        ? "text-amber-600"
                        : "text-muted-foreground"
                  }`}
                >
                  D-{days}
                </span>
              )}
            </div>
          </div>
          <ChevronRight className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />
        </div>
        {/* Submission summary bar */}
        <div className="mt-4 flex items-center gap-4 rounded-lg bg-muted/50 px-3 py-2">
          <div className="flex items-center gap-1.5 text-xs">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">
              대상 {assignment.assignedTo.length}명
            </span>
          </div>
          <div className="h-3 w-px bg-border" />
          <div className="flex items-center gap-1.5 text-xs">
            <FileText className="h-3.5 w-3.5 text-primary" />
            <span className="text-primary font-medium">
              제출 {assignmentSubmissions.length}명
            </span>
          </div>
          <div className="h-3 w-px bg-border" />
          <div className="flex items-center gap-1.5 text-xs">
            <Star className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-amber-600 font-medium">채점 {graded}명</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AdminView() {
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  const pending = assignments.filter((a) => a.status === "진행중")
  const closed = assignments.filter((a) => a.status !== "진행중")

  if (selectedAssignment) {
    return (
      <AdminAssignmentDetail
        assignment={selectedAssignment}
        onBack={() => setSelectedAssignment(null)}
      />
    )
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">과제 관리</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            과제를 생성하고, 학생 제출물을 확인하고, 성적을 입력하세요.
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              과제 생성
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>새 과제 생성</DialogTitle>
              <DialogDescription>
                학생들에게 배포할 새 과제를 생성합니다.
              </DialogDescription>
            </DialogHeader>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                setCreateOpen(false)
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="new-title">과제 제목</Label>
                <Input
                  id="new-title"
                  placeholder="과제 제목을 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-desc">과제 설명</Label>
                <Textarea
                  id="new-desc"
                  placeholder="과제 내용을 상세히 설명하세요"
                  className="min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-subject">과목</Label>
                  <Input id="new-subject" placeholder="예: 수학" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-due">마감일</Label>
                  <Input id="new-due" type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>대상 학생 지정</Label>
                <div className="rounded-lg border border-border p-3">
                  <div className="space-y-2">
                    {students.map((student) => (
                      <label
                        key={student.id}
                        className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/50"
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                          defaultChecked
                        />
                        <span className="text-sm text-foreground">
                          {student.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {student.grade}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>첨부 파일 (선택)</Label>
                <div className="rounded-lg border-2 border-dashed border-border bg-muted/30 p-4">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <FileUp className="h-6 w-6 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      과제 자료 파일을 첨부하세요
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateOpen(false)}
                >
                  취소
                </Button>
                <Button type="submit">과제 생성</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              {assignments.length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">전체 과제</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">
              {submissions.length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">총 제출물</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">
              {submissions.filter((s) => s.grade == null).length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">미채점</p>
          </CardContent>
        </Card>
      </div>

      {/* Assignment Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">전체 ({assignments.length})</TabsTrigger>
          <TabsTrigger value="pending">진행중 ({pending.length})</TabsTrigger>
          <TabsTrigger value="closed">
            마감/완료 ({closed.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4 space-y-3">
          {assignments.map((a) => (
            <AdminAssignmentCard
              key={a.id}
              assignment={a}
              onClick={() => setSelectedAssignment(a)}
            />
          ))}
        </TabsContent>
        <TabsContent value="pending" className="mt-4 space-y-3">
          {pending.map((a) => (
            <AdminAssignmentCard
              key={a.id}
              assignment={a}
              onClick={() => setSelectedAssignment(a)}
            />
          ))}
        </TabsContent>
        <TabsContent value="closed" className="mt-4 space-y-3">
          {closed.map((a) => (
            <AdminAssignmentCard
              key={a.id}
              assignment={a}
              onClick={() => setSelectedAssignment(a)}
            />
          ))}
        </TabsContent>
      </Tabs>
    </>
  )
}

// ─── Main Page ───

export default function AssignmentsPage() {
  const { isAdmin } = useAuth()
  return <AppLayout>{isAdmin ? <AdminView /> : <StudentView />}</AppLayout>
}
