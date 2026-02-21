"use client"

import React, { useState, useRef, useEffect } from "react"
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
import { ArrowLeft, Lock, ChevronDown, ChevronUp, EyeOff, MessageSquare, Trash2, Pencil } from "lucide-react"
import { consultations as initialConsultations, type Consultation } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { useRouter } from "next/navigation"

function statusColor(status: Consultation["status"]) {
  switch (status) {
    case "대기중":
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
  onUpdateConsultation,
  onDeleteConsultation,
  onUpdateAnswer,
  onDeleteAnswer,
}: {
  item: Consultation
  currentUserId: string
  isAdmin: boolean
  onUpdateConsultation: (id: string, title: string, content: string) => void
  onDeleteConsultation: (id: string) => void
  onUpdateAnswer: (id: string, answer: string, status: Consultation["status"]) => void
  onDeleteAnswer: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [answerOpen, setAnswerOpen] = useState(false)
  const [editConsultationOpen, setEditConsultationOpen] = useState(false)
  const [editAnswerOpen, setEditAnswerOpen] = useState(false)
  const [editTitle, setEditTitle] = useState(item.title)
  const [editContent, setEditContent] = useState(item.content)
  const [editAnswer, setEditAnswer] = useState(item.answer || "")
  const [editStatus, setEditStatus] = useState(item.status)
  const [answerText, setAnswerText] = useState("")
  const [answerStatus, setAnswerStatus] = useState<Consultation["status"]>(item.status)

  const titleInputRef = useRef<HTMLInputElement>(null)
  const answerTextareaRef = useRef<HTMLTextAreaElement>(null)

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
                {canView && <span>{item.authorName} 학생</span>}
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

                {isOwner && (
                  <div className="mt-2 flex gap-2 justify-end">
                    <Dialog open={editConsultationOpen} onOpenChange={setEditConsultationOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="gap-1.5">
                          <Pencil className="h-3.5 w-3.5" />
                          수정
                        </Button>
                      </DialogTrigger>
                      <DialogContent
                        className="sm:max-w-lg"
                        onOpenAutoFocus={(e) => {
                          e.preventDefault()
                          if (titleInputRef.current) {
                            const length = titleInputRef.current.value.length
                            titleInputRef.current.focus()
                            titleInputRef.current.setSelectionRange(length, length)
                          }
                        }}
                      >
                        <DialogHeader>
                          <DialogTitle>상담 수정</DialogTitle>
                          <DialogDescription>상담 내용을 수정하세요</DialogDescription>
                        </DialogHeader>
                        <form
                          className="space-y-4"
                          onSubmit={(e) => {
                            e.preventDefault()
                            onUpdateConsultation(item.id, editTitle, editContent)
                            setEditConsultationOpen(false)
                          }}
                        >
                          <div className="space-y-2">
                            <Label htmlFor="edit-consult-title">제목</Label>
                            <Input
                              ref={titleInputRef}
                              id="edit-consult-title"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-consult-content">내용</Label>
                            <Textarea
                              id="edit-consult-content"
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="min-h-[150px]"
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setEditConsultationOpen(false)}>
                              취소
                            </Button>
                            <Button type="submit">수정 완료</Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 text-destructive hover:text-destructive"
                      onClick={() => {
                        if (confirm("상담을 삭제하시겠습니까?")) {
                          onDeleteConsultation(item.id)
                        }
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      삭제
                    </Button>
                  </div>
                )}

                {item.answer && (
                  <div className="mt-3 rounded-lg border border-purple-500/20 bg-purple-500/5 p-3">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge className="text-xs bg-rose-500/10 text-rose-600 hover:bg-rose-500/10">
                          선생님 답변
                        </Badge>
                        <span className="text-xs text-muted-foreground">{item.answeredAt}</span>
                      </div>
                      {isAdmin && (
                        <div className="flex gap-1">
                          <Dialog open={editAnswerOpen} onOpenChange={setEditAnswerOpen}>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="h-7 w-7 p-0 bg-white/90">
                                <Pencil className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent
                              className="sm:max-w-lg"
                              onOpenAutoFocus={(e) => {
                                e.preventDefault()
                                if (answerTextareaRef.current) {
                                  const length = answerTextareaRef.current.value.length
                                  answerTextareaRef.current.focus()
                                  answerTextareaRef.current.setSelectionRange(length, length)
                                }
                              }}
                            >
                              <DialogHeader>
                                <DialogTitle>답변 수정</DialogTitle>
                                <DialogDescription>{item.title}</DialogDescription>
                              </DialogHeader>
                              <form
                                className="space-y-4"
                                onSubmit={(e) => {
                                  e.preventDefault()
                                  onUpdateAnswer(item.id, editAnswer, item.status)
                                  setEditAnswerOpen(false)
                                }}
                              >
                                <div className="space-y-2">
                                  <Label htmlFor="edit-answer-content">답변 내용</Label>
                                  <Textarea
                                    ref={answerTextareaRef}
                                    id="edit-answer-content"
                                    value={editAnswer}
                                    onChange={(e) => setEditAnswer(e.target.value)}
                                    className="min-h-[150px]"
                                  />
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button type="button" variant="outline" onClick={() => setEditAnswerOpen(false)}>
                                    취소
                                  </Button>
                                  <Button type="submit">수정 완료</Button>
                                </div>
                              </form>
                            </DialogContent>
                          </Dialog>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 w-7 p-0 bg-white/90 text-destructive hover:text-destructive"
                            onClick={() => {
                              if (confirm("답변을 삭제하시겠습니까?")) {
                                onDeleteAnswer(item.id)
                              }
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed text-foreground">{item.answer}</p>
                  </div>
                )}

                {isAdmin && !item.answer && (
                  <div className="mt-3 flex justify-end">
                    <Dialog open={answerOpen} onOpenChange={setAnswerOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="gap-1.5">
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
                            if (answerText.trim()) {
                              onUpdateAnswer(item.id, answerText, answerStatus)
                              setAnswerText("")
                              setAnswerStatus(item.status)
                              setAnswerOpen(false)
                            }
                          }}
                        >
                          <div className="space-y-2">
                            <Label>상담 상태 변경</Label>
                            <Select value={answerStatus} onValueChange={(value) => setAnswerStatus(value as Consultation["status"])}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="대기중">대기중</SelectItem>
                                <SelectItem value="답변완료">답변완료</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="consult-answer">답변 내용</Label>
                            <Textarea
                              id="consult-answer"
                              placeholder="상담 답변을 작성하세요"
                              value={answerText}
                              onChange={(e) => setAnswerText(e.target.value)}
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
                  </div>
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

export default function PendingConsultationPage() {
  const router = useRouter()
  const { user, isAdmin } = useAuth()
  const [consultations, setConsultations] = useState<Consultation[]>(initialConsultations)

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("consultations", JSON.stringify(consultations))
    }
  }, [consultations])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedConsultations = localStorage.getItem("consultations")
      if (savedConsultations) {
        try {
          setConsultations(JSON.parse(savedConsultations))
        } catch (e) {
          console.error("Failed to parse saved consultations:", e)
        }
      }
    }
  }, [])

  const pendingConsultations = consultations.filter((c) => c.status === "대기중")

  const handleUpdateConsultation = (id: string, title: string, content: string) => {
    setConsultations(
      consultations.map((item) =>
        item.id === id ? { ...item, title, content } : item
      )
    )
  }

  const handleDeleteConsultation = (id: string) => {
    setConsultations(consultations.filter((item) => item.id !== id))
  }

  const handleUpdateAnswer = (id: string, answer: string, status: Consultation["status"]) => {
    setConsultations(
      consultations.map((item) =>
        item.id === id
          ? { ...item, answer, status, answeredAt: new Date().toLocaleDateString("ko-KR") }
          : item
      )
    )
  }

  const handleDeleteAnswer = (id: string) => {
    setConsultations(
      consultations.map((item) =>
        item.id === id ? { ...item, answer: undefined, answeredAt: undefined, status: "대기중" } : item
      )
    )
  }

  if (!user) return null

  return (
    <AppLayout>
      <div className="mb-6">
      <Button
          onClick={() => router.back()}
          size="sm"
          className="group p-0 h-auto bg-transparent hover:bg-transparent shadow-none text-muted-foreground hover:text-violet-600"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          뒤로가기
        </Button>
        <h1 className="text-2xl font-bold text-foreground mt-4">미답변 상담</h1>
      </div>

      <div className="space-y-3">
        {pendingConsultations.length > 0 ? (
          pendingConsultations.map((item) => (
            <ConsultationItem
              key={item.id}
              item={item}
              currentUserId={user?.id || ""}
              isAdmin={isAdmin}
              onUpdateConsultation={handleUpdateConsultation}
              onDeleteConsultation={handleDeleteConsultation}
              onUpdateAnswer={handleUpdateAnswer}
              onDeleteAnswer={handleDeleteAnswer}
            />
          ))
        ) : (
          <Card className="border-border">
            <CardContent className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">미답변 상담이 없습니다.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
