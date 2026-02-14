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
import { Plus, Lock, Search, ChevronDown, ChevronUp, EyeOff, MessageSquare, Trash2, Pencil } from "lucide-react"
import { qnaPosts, type QnaPost } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"

function maskName(name: string): string {
  if (!name) return "익명"
  return name.charAt(0) + "**"
}

function QnaPostItem({
  post,
  currentUserId,
  isAdmin,
  onUpdateQuestion,
  onDeleteQuestion,
  onUpdateAnswer,
  onDeleteAnswer,
  posts
}: {
  post: QnaPost
  currentUserId: string
  isAdmin: boolean
  onUpdateQuestion: (postId: string, title: string, content: string) => void
  onDeleteQuestion: (postId: string) => void
  onUpdateAnswer: (postId: string, answer: string) => void
  onDeleteAnswer: (postId: string) => void
  posts: QnaPost[]
}) {
  const [expanded, setExpanded] = useState(false)
  const [answerOpen, setAnswerOpen] = useState(false)
  const [editQuestionOpen, setEditQuestionOpen] = useState(false)
  const [editAnswerOpen, setEditAnswerOpen] = useState(false)
  const [editTitle, setEditTitle] = useState(post.title)
  const [editContent, setEditContent] = useState(post.content)
  const [editAnswer, setEditAnswer] = useState(post.answer || "")
  const [answerText, setAnswerText] = useState("")

  const titleInputRef = useRef<HTMLInputElement>(null)
  const answerTextareaRef = useRef<HTMLTextAreaElement>(null)

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

                {/* Question edit/delete buttons for owner */}
                {isOwner && (
                  <div className="mt-2 flex gap-2 justify-end">
                    <Dialog open={editQuestionOpen} onOpenChange={setEditQuestionOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="gap-1.5">
                          <Pencil className="h-3.5 w-3.5" />
                          수정
                        </Button>
                      </DialogTrigger>
                      <DialogContent
                        className="sm:max-w-lg"
                        onOpenAutoFocus={(e) => {
                          e.preventDefault() // Radix 기본 auto focus 막기

                          if (titleInputRef.current) {
                            const length = titleInputRef.current.value.length
                            titleInputRef.current.focus()
                            titleInputRef.current.setSelectionRange(length, length)
                          }
                        }}
                      >
                        <DialogHeader>
                          <DialogTitle>질문 수정</DialogTitle>
                          <DialogDescription>질문 내용을 수정하세요</DialogDescription>
                        </DialogHeader>
                        <form
                          className="space-y-4"
                          onSubmit={(e) => {
                            e.preventDefault()
                            onUpdateQuestion(post.id, editTitle, editContent)
                            setEditQuestionOpen(false)
                          }}
                        >
                          <div className="space-y-2">
                            <Label htmlFor="edit-qna-title">제목</Label>
                            <Input
                              ref={titleInputRef}
                              id="edit-qna-title"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-qna-content">내용</Label>
                            <Textarea
                              id="edit-qna-content"
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="min-h-[150px]"
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setEditQuestionOpen(false)}>
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
                        if (confirm("질문을 삭제하시겠습니까?")) {
                          onDeleteQuestion(post.id)
                        }
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      삭제
                    </Button>
                  </div>
                )}

                {post.answer && (
                  <div className="mt-3 rounded-lg border border-purple-500/20 bg-purple-500/5 p-3">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs bg-pink-500/10 text-pink-600 hover:bg-pink-500/10">
                          선생님 답변
                        </Badge>
                        <span className="text-xs text-muted-foreground">{post.answeredAt}</span>
                      </div>
                      {/* Answer edit/delete buttons for admin */}
                      {isAdmin && (
                        <div className="flex gap-2">
                          <Dialog open={editAnswerOpen} onOpenChange={setEditAnswerOpen}>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="h-7 w-7 bg-white/90 text-destructive hover:text-destructive">
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
                                <DialogDescription>{post.title}</DialogDescription>
                              </DialogHeader>
                              <form
                                className="space-y-4"
                                onSubmit={(e) => {
                                  e.preventDefault()
                                  onUpdateAnswer(post.id, editAnswer)
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
                                onDeleteAnswer(post.id)
                              }
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed text-foreground">{post.answer}</p>
                  </div>
                )}
                {/* Admin answer button */}
                {isAdmin && !post.answer && (
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
                          <DialogTitle>답변 작성</DialogTitle>
                          <DialogDescription>{post.title}</DialogDescription>
                        </DialogHeader>
                        <form
                          className="space-y-4"
                          onSubmit={(e) => {
                            e.preventDefault()
                            if (answerText.trim()) {
                              onUpdateAnswer(post.id, answerText)
                              setAnswerText("")
                              setAnswerOpen(false)
                            }
                          }}
                        >
                          <div className="space-y-2">
                            <Label htmlFor="answer-content">답변 내용</Label>
                            <Textarea
                              id="answer-content"
                              placeholder="답변을 작성하세요"
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
  const [posts, setPosts] = useState(qnaPosts)
  const [newTitle, setNewTitle] = useState("")
  const [newContent, setNewContent] = useState("")

  const filteredPosts = posts.filter((post) => {
    if (!searchQuery) return true
    if (isAdmin || post.authorId === user.id) {
      return post.title.includes(searchQuery) || post.content.includes(searchQuery)
    }
    return false
  })

  const handleAddQuestion = () => {
    if (newTitle.trim() && newContent.trim()) {
      const newPost: QnaPost = {
        id: Date.now().toString(),
        title: newTitle,
        content: newContent,
        authorId: user.id,
        authorName: user.name || "익명",
        createdAt: new Date().toLocaleDateString("ko-KR"),
        isPrivate: true,
        answer: undefined,
        answeredAt: undefined,
      }
      setPosts([newPost, ...posts])
      setNewTitle("")
      setNewContent("")
      setDialogOpen(false)
    }
  }

  const handleUpdateQuestion = (postId: string, title: string, content: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, title, content } : post
      )
    )
  }

  const handleDeleteQuestion = (postId: string) => {
    setPosts(posts.filter((post) => post.id !== postId))
  }

  const handleUpdateAnswer = (postId: string, answer: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, answer, answeredAt: new Date().toLocaleDateString("ko-KR") }
          : post
      )
    )
  }

  const handleDeleteAnswer = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, answer: undefined, answeredAt: undefined } : post
      )
    )
  }

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
                  handleAddQuestion()
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="qna-title">제목</Label>
                  <Input
                    id="qna-title"
                    placeholder="질문 제목을 입력하세요"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qna-content">내용</Label>
                  <Textarea
                    id="qna-content"
                    placeholder="질문 내용을 자세히 작성해주세요"
                    className="min-h-[150px]"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
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
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-purple-500/20 bg-purple-500/5 px-4 py-3">
        <Lock className="h-5 w-5 flex-shrink-0 text-purple-400" />
        <p className="text-sm text-foreground">
          {isAdmin ? (
            <>관리자는 모든 질문의 내용을 확인하고 답변할 수 있습니다.</>
          ) : (
            <>
              모든 게시글은 <strong>비공개</strong>로 처리됩니다. 작성자의 이름은 익명으로 표시되며,
              글 내용은 작성자 본인과 관리자만 확인할 수 있습니다.
            </>
          )}
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={isAdmin ? "질문 검색" : "내 질문 검색"}
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Post list */}
      <div className="space-y-3">
        {filteredPosts.map((post) => (
          <QnaPostItem
            key={post.id}
            post={post}
            currentUserId={user.id}
            isAdmin={isAdmin}
            onUpdateQuestion={handleUpdateQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            onUpdateAnswer={handleUpdateAnswer}
            onDeleteAnswer={handleDeleteAnswer}
            posts={posts}
          />
        ))}
      </div>
    </AppLayout>
  )
}
