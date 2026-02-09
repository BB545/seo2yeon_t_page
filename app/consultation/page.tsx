"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Lock, ChevronDown, ChevronUp, User, EyeOff, MessageSquare } from "lucide-react"
import { consultations, instructors, type Consultation } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"

function statusColor(status: Consultation["status"]) {
  switch (status) {
    case "접수완료":
      return "bg-blue-500/10 text-blue-600 hover:bg-blue-500/10"
    case "상담진행중":
      return "bg-amber-500/10 text-amber-600 hover:bg-amber-500/10"
    case "답변완료":
      return "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10"
    default:
      return "bg-muted text-muted-foreground"
  }
}

function ConsultationItem({
  item,
  currentUserId,
  isAdmin,
}: {
  item: Consultation
  currentUserId: string
  isAdmin: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const [answerOpen, setAnswerOpen] = useState(false)
  const isOwner = item.authorId === currentUserId
  const canView = isOwner || isAdmin

  return (
    <Card className="border-border transition-shadow hover:shadow-sm">
      <CardContent className="p-0">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between p-4 text-left"
        >
          <div className="flex flex-1 items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-muted">
              {canView ? (
                <span className="text-sm font-semibold text-muted-foreground">
                  {item.authorName.charAt(0)}
                </span>
              ) : (
                <Lock className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium text-foreground">
                  {canView ? item.title : "비공개 상담입니다"}
                </p>
                {!canView && <Lock className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />}
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                {canView && <span>{item.authorName}</span>}
                {canView && <span>|</span>}
                <span>{item.createdAt}</span>
              </div>
            </div>
          </div>
          <div className="ml-3 flex flex-shrink-0 items-center gap-2">
            <Badge className={statusColor(item.status)}>{item.status}</Badge>
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </button>

        {expanded && (
          <div className="border-t border-border px-4 pb-4 pt-3">
            {canView ? (
              <>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-sm leading-relaxed text-foreground">{item.content}</p>
                </div>
                {item.answer && (
                  <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
                    <div className="mb-1 flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        상담 답변
                      </Badge>
                      <span className="text-xs text-muted-foreground">{item.answeredAt}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground">{item.answer}</p>
                  </div>
                )}
                {/* Admin answer button */}
                {isAdmin && !item.answer && (
                  <Dialog open={answerOpen} onOpenChange={setAnswerOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="mt-3 gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5" />
                        답변 작성
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>상담 답변 작성</DialogTitle>
                        <DialogDescription>
                          {item.authorName}님의 상담: {item.title}
                        </DialogDescription>
                      </DialogHeader>
                      <form
                        className="space-y-4"
                        onSubmit={(e) => {
                          e.preventDefault()
                          setAnswerOpen(false)
                        }}
                      >
                        <div className="space-y-2">
                          <Label>상담 상태 변경</Label>
                          <Select defaultValue={item.status}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="접수완료">접수완료</SelectItem>
                              <SelectItem value="상담진행중">상담진행중</SelectItem>
                              <SelectItem value="답변완료">답변완료</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="consult-answer">답변 내용</Label>
                          <Textarea
                            id="consult-answer"
                            placeholder="상담 답변을 작성하세요"
                            className="min-h-[150px]"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setAnswerOpen(false)}>
                            취소
                          </Button>
                          <Button type="submit">답변 등록</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 py-6">
                <EyeOff className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  비공개 상담입니다. 작성자와 관리자만 확인할 수 있습니다.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function ConsultationPage() {
  const { user, isAdmin } = useAuth()
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">학습 상담</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isAdmin
              ? "학생들의 상담 요청을 확인하고 답변하세요."
              : "학습 방향, 진로 등에 대해 상담을 신청하세요."}
          </p>
        </div>
        {!isAdmin && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                상담 신청
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>학습 상담 신청</DialogTitle>
                <DialogDescription>
                  상담 내용을 작성하세요. 모든 상담은 비공개로 진행됩니다.
                </DialogDescription>
              </DialogHeader>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault()
                  setDialogOpen(false)
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="consult-type">상담 유형</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="상담 유형을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="study">학습 방법 상담</SelectItem>
                      <SelectItem value="career">진로 상담</SelectItem>
                      <SelectItem value="schedule">스케줄 조정</SelectItem>
                      <SelectItem value="other">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consult-title">제목</Label>
                  <Input id="consult-title" placeholder="상담 제목을 입력하세요" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consult-content">상담 내용</Label>
                  <Textarea
                    id="consult-content"
                    placeholder="상담 내용을 자세히 작성해주세요"
                    className="min-h-[150px]"
                  />
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4 flex-shrink-0" />
                  <span>모든 상담 내용은 비공개로 처리되며, 작성자와 관리자만 확인할 수 있습니다.</span>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    취소
                  </Button>
                  <Button type="submit">신청</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Instructor Section */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-foreground">강사 소개</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {instructors.map((instructor) => (
            <Card key={instructor.name} className="border-border">
              <CardContent className="p-4 text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{instructor.name}</h3>
                <Badge variant="secondary" className="mt-1">
                  {instructor.subject}
                </Badge>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {instructor.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Info banner */}
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
        <Lock className="h-5 w-5 flex-shrink-0 text-primary" />
        <p className="text-sm text-foreground">
          {isAdmin ? (
            <>관리자는 모든 상담 내용을 확인하고 답변할 수 있습니다.</>
          ) : (
            <>
              모든 상담 글은 <strong>전체 비공개</strong>로 처리됩니다. 해당 게시글은 작성자와 관리자만 확인할 수 있습니다.
            </>
          )}
        </p>
      </div>

      {/* Consultation list */}
      <div className="space-y-3">
        {consultations.map((item) => (
          <ConsultationItem key={item.id} item={item} currentUserId={user.id} isAdmin={isAdmin} />
        ))}
      </div>
    </AppLayout>
  )
}
