"use client"

import { useState, useRef, useEffect } from "react"
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
import { Plus, Lock, ChevronDown, ChevronUp, EyeOff, Trash2, Pencil, ArrowLeft } from "lucide-react"
import { consultations as initialConsultations, type Consultation } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
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
  onUpdateConsultation,
  onDeleteConsultation,
}: {
  item: Consultation
  currentUserId: string
  onUpdateConsultation: (id: string, title: string, content: string) => void
  onDeleteConsultation: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [editConsultationOpen, setEditConsultationOpen] = useState(false)
  const [editTitle, setEditTitle] = useState(item.title)
  const [editContent, setEditContent] = useState(item.content)

  const titleInputRef = useRef<HTMLInputElement>(null)

  const isOwner = item.authorId === currentUserId

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
              <span className="text-sm font-semibold text-muted-foreground">
                {item.authorName.charAt(0)}
              </span>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium text-foreground">
                  {item.title}
                </p>
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{item.authorName}</span>
                <span>|</span>
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
                <div className="mb-1 flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs bg-rose-500/10 text-rose-600 hover:bg-rose-500/10">
                    선생님 답변
                  </Badge>
                  <span className="text-xs text-muted-foreground">{item.answeredAt}</span>
                </div>
                <p className="text-sm leading-relaxed text-foreground">{item.answer}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function MyConsultationPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newContent, setNewContent] = useState("")
  const [consultationType, setConsultationType] = useState("")
  const [consultations, setConsultations] = useState<Consultation[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("consultations")
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {
          return initialConsultations
        }
      }
    }
    return initialConsultations
  })

  useEffect(() => {
    localStorage.setItem("consultations", JSON.stringify(consultations))
  }, [consultations])

  if (!user) return null

  const handleAddConsultation = () => {
    if (newTitle.trim() && newContent.trim()) {
      const newConsultation: Consultation = {
        id: Date.now().toString(),
        title: newTitle,
        content: newContent,
        authorId: user?.id || "",
        authorName: user?.name || "익명",
        createdAt: new Date().toLocaleDateString("ko-KR"),
        status: "대기중",
        answer: undefined,
        answeredAt: undefined,
      }
      setConsultations([newConsultation, ...consultations])
      setNewTitle("")
      setNewContent("")
      setConsultationType("")
      setDialogOpen(false)
    }
  }

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

  const myConsultations = user
    ? consultations.filter((item) => item.authorId === user.id)
    : []

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button
            onClick={() => router.back()}
            size="sm"
            className="group p-0 h-auto bg-transparent hover:bg-transparent shadow-none text-muted-foreground hover:text-violet-600"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            뒤로가기
          </Button>
          <h1 className="text-2xl font-bold text-foreground mt-4">상담 내역</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            본인이 신청한 학습 상담을 확인하세요.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 mt-4">
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
                handleAddConsultation()
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="consult-type">상담 유형</Label>
                <Select value={consultationType} onValueChange={setConsultationType}>
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
                <Input
                  id="consult-title"
                  placeholder="상담 제목을 입력하세요"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="consult-content">상담 내용</Label>
                <Textarea
                  id="consult-content"
                  placeholder="상담 내용을 자세히 작성해주세요"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
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
      </div>

      {/* Info banner */}
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-purple-500/20 bg-purple-500/5 px-4 py-3">
        <Lock className="h-5 w-5 flex-shrink-0 text-purple-400" />
        <p className="text-sm text-foreground">
          모든 상담은 <strong>비공개</strong>로 진행됩니다. 해당 상담은 본인과 관리자만 확인할 수 있습니다.
        </p>
      </div>

      <div className="space-y-3">
        {myConsultations.length > 0 ? (
          myConsultations.map((item) => (
            <ConsultationItem
              key={item.id}
              item={item}
              currentUserId={user?.id || ""}
              onUpdateConsultation={handleUpdateConsultation}
              onDeleteConsultation={handleDeleteConsultation}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
            <EyeOff className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">
              신청한 상담이 없습니다.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
