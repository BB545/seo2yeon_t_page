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
import { Plus, Lock, Search, ChevronDown, ChevronUp, EyeOff, MessageSquare } from "lucide-react"
import { qnaPosts, type QnaPost } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"

function maskName(name: string): string {
  if (!name) return "익명"
  return name.charAt(0) + "**"
}

function QnaPostItem({ post, currentUserId, isAdmin }: { post: QnaPost; currentUserId: string; isAdmin: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const [answerOpen, setAnswerOpen] = useState(false)
  const isOwner = post.authorId === currentUserId
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
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
              {canView ? post.authorName.charAt(0) : maskName(post.authorName).charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium text-foreground">
                  {canView ? post.title : "비공개 내용입니다"}
                </p>
                {!canView && <Lock className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />}
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{canView ? post.authorName : maskName(post.authorName)}</span>
                <span>|</span>
                <span>{post.createdAt}</span>
              </div>
            </div>
          </div>
          <div className="ml-3 flex flex-shrink-0 items-center gap-2">
            <Badge
              className={
                post.answer
                  ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10"
                  : "bg-amber-500/10 text-amber-600 hover:bg-amber-500/10"
              }
            >
              {post.answer ? "답변완료" : "대기중"}
            </Badge>
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
                  <p className="text-sm leading-relaxed text-foreground">{post.content}</p>
                </div>
                {post.answer && (
                  <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
                    <div className="mb-1 flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        관리자 답변
                      </Badge>
                      <span className="text-xs text-muted-foreground">{post.answeredAt}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground">{post.answer}</p>
                  </div>
                )}
                {/* Admin answer button */}
                {isAdmin && !post.answer && (
                  <Dialog open={answerOpen} onOpenChange={setAnswerOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="mt-3 gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5" />
                        답변 작성
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>답변 작성</DialogTitle>
                        <DialogDescription>{post.title}</DialogDescription>
                      </DialogHeader>
                      <form
                        className="space-y-4"
                        onSubmit={(e) => {
                          e.preventDefault()
                          setAnswerOpen(false)
                        }}
                      >
                        <div className="space-y-2">
                          <Label htmlFor="answer-content">답변 내용</Label>
                          <Textarea
                            id="answer-content"
                            placeholder="답변을 작성하세요"
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
                  비공개 내용입니다. 글 작성자와 관리자만 확인할 수 있습니다.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function QnaPage() {
  const { user, isAdmin } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  const filteredPosts = qnaPosts.filter((post) => {
    if (!searchQuery) return true
    if (isAdmin || post.authorId === user.id) {
      return post.title.includes(searchQuery) || post.content.includes(searchQuery)
    }
    return false
  })

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">문의/질의응답</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isAdmin
              ? "학생들의 질문을 확인하고 답변하세요."
              : "궁금한 점을 질문하세요. 모든 게시글은 비공개로 처리됩니다."}
          </p>
        </div>
        {!isAdmin && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                질문 작성
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>질문 작성</DialogTitle>
                <DialogDescription>
                  질문을 작성하세요. 작성된 글은 본인과 관리자만 확인할 수 있습니다.
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
                  <Label htmlFor="qna-title">제목</Label>
                  <Input id="qna-title" placeholder="질문 제목을 입력하세요" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qna-content">내용</Label>
                  <Textarea
                    id="qna-content"
                    placeholder="질문 내용을 자세히 작성해주세요"
                    className="min-h-[150px]"
                  />
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4 flex-shrink-0" />
                  <span>작성된 글은 비공개로 처리되며, 글 작성자와 관리자만 확인할 수 있습니다.</span>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    취소
                  </Button>
                  <Button type="submit">등록</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Info banner */}
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
        <Lock className="h-5 w-5 flex-shrink-0 text-primary" />
        <p className="text-sm text-foreground">
          {isAdmin ? (
            <>관리자는 모든 질문의 내용을 확인하고 답변할 수 있습니다.</>
          ) : (
            <>
              모든 게시글은 <strong>비공개</strong>로 처리됩니다. 작성자의 이름은 익명(성만 공개)으로 표시되며,
              글 내용은 작성자 본인과 관리자만 확인할 수 있습니다.
            </>
          )}
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={isAdmin ? "질문 검색..." : "내 질문 검색..."}
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Post list */}
      <div className="space-y-3">
        {filteredPosts.map((post) => (
          <QnaPostItem key={post.id} post={post} currentUserId={user.id} isAdmin={isAdmin} />
        ))}
      </div>
    </AppLayout>
  )
}
