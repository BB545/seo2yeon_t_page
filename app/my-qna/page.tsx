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
import { Plus, Lock, Search, ChevronDown, ChevronUp, EyeOff, MessageSquare, Trash2, Pencil, Upload, X, File, Image, ArrowLeft } from "lucide-react"
import { qnaPosts as initialQnaPosts, type QnaPost } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useRouter } from "next/navigation"

interface AttachedFile {
  file: File
  preview?: string
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}

function QnaPostItem({ post, currentUserId, onUpdateQuestion, onDeleteQuestion }: {
  post: QnaPost; currentUserId: string; onUpdateQuestion: (postId: string, title: string, content: string, attachments?: Array<{
    name: string
    size: number
    type: string
    url: string
  }>) => void; onDeleteQuestion: (postId: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [editQuestionOpen, setEditQuestionOpen] = useState(false)
  const [editTitle, setEditTitle] = useState(post.title)
  const [editContent, setEditContent] = useState(post.content)
  const [editAttachedFiles, setEditAttachedFiles] = useState<AttachedFile[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const titleInputRef = useRef<HTMLInputElement>(null)
  const editFileInputRef = useRef<HTMLInputElement>(null)

  const isOwner = post.authorId === currentUserId

  const handleEditFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles: AttachedFile[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const attachedFile: AttachedFile = { file }

        if (file.type.startsWith("image/")) {
          const reader = new FileReader()
          reader.onload = (event) => {
            attachedFile.preview = event.target?.result as string
            setEditAttachedFiles((prev) => [...prev])
          }
          reader.readAsDataURL(file)
        }

        newFiles.push(attachedFile)
      }

      setEditAttachedFiles((prev) => [...prev, ...newFiles])
    }

    if (editFileInputRef.current) {
      editFileInputRef.current.value = ""
    }
  }

  const handleEditRemoveFile = (index: number) => {
    setEditAttachedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRemoveExistingAttachment = (index: number) => {
    const updatedAttachments = post.attachments?.filter((_, i) => i !== index) || []
    onUpdateQuestion(post.id, editTitle, editContent, updatedAttachments)
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <Image className="h-4 w-4" />
    }
    return <File className="h-4 w-4" />
  }

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
              {post.authorName.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium text-foreground">
                  {post.title}
                </p>
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{post.authorName}</span>
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
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-sm leading-relaxed text-foreground">{post.content}</p>
            </div>

            {/* Display image attachments */}
            {post.attachments && post.attachments.some(a => a.type.startsWith("image/")) && (
              <div className="mt-3 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {post.attachments
                    .filter(a => a.type.startsWith("image/"))
                    .map((attachment, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImage(attachment.url)}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        <img
                          src={attachment.url}
                          alt={attachment.name}
                          className="max-w-xs max-h-40 rounded-lg border border-border object-cover"
                        />
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Image lightbox modal */}
            <Dialog open={selectedImage !== null} onOpenChange={(open) => {
              if (!open) setSelectedImage(null)
            }}>
              <DialogContent className="max-w-2xl border-0 bg-transparent p-0 shadow-none overflow-hidden [&>button]:text-white [&>button.absolute]:-top-1 [&>button.absolute]:right-10 [&>button.absolute]:h-7 [&>button.absolute]:w-7 [&>button.absolute>svg]:h-7 [&>button.absolute>svg]:w-7">
                <DialogTitle asChild>
                  <VisuallyHidden>이미지 미리보기</VisuallyHidden>
                </DialogTitle>
                <div className="relative flex items-center justify-center overflow-hidden">
                  {selectedImage && (
                    <img
                      src={selectedImage}
                      alt="확대된 이미지"
                      className="h-auto w-auto max-h-[90vh] max-w-full object-contain"
                    />
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* Display file attachments */}
            {post.attachments && post.attachments.some(a => !a.type.startsWith("image/")) && (
              <div className="mt-3 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">첨부파일</p>
                <div className="space-y-2">
                  {post.attachments
                    .filter(a => !a.type.startsWith("image/"))
                    .map((attachment, idx) => (
                      <div key={idx} className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 p-2">
                        <div className="h-10 w-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                          <File className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate text-foreground">
                            {attachment.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(attachment.size)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Question edit/delete buttons for owner */}
            {isOwner && (
              <div className="mt-2 flex gap-2 justify-end">
                <Dialog open={editQuestionOpen} onOpenChange={(open) => {
                  setEditQuestionOpen(open)
                  if (!open) {
                    setEditAttachedFiles([])
                  }
                }}>
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
                      <DialogTitle>질문 수정</DialogTitle>
                      <DialogDescription>질문 내용을 수정하세요</DialogDescription>
                    </DialogHeader>
                    <form
                      className="space-y-4"
                      onSubmit={(e) => {
                        e.preventDefault()
                        const newAttachments = [
                          ...(post.attachments || []),
                          ...editAttachedFiles.map(af => ({
                            name: af.file.name,
                            size: af.file.size,
                            type: af.file.type,
                            url: af.preview || URL.createObjectURL(af.file)
                          }))
                        ]
                        onUpdateQuestion(post.id, editTitle, editContent, newAttachments)
                        setEditAttachedFiles([])
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

                      {/* 기존 첨부파일 */}
                      {post.attachments && post.attachments.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-xs">현재 첨부된 파일</Label>
                          <div className="space-y-2">
                            {post.attachments.map((attachment, idx) => (
                              <div key={idx} className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 p-2">
                                {attachment.type.startsWith("image/") ? (
                                  <img
                                    src={attachment.url}
                                    alt={attachment.name}
                                    className="h-10 w-10 rounded object-cover flex-shrink-0"
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                                    <File className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate text-foreground">
                                    {attachment.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatFileSize(attachment.size)}
                                  </p>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveExistingAttachment(idx)}
                                  className="h-8 w-8 p-0 flex-shrink-0 text-destructive hover:text-destructive"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 새 파일 첨부 */}
                      <div className="space-y-2">
                        <Label htmlFor="edit-qna-file">파일/이미지 첨부 추가 (선택사항)</Label>
                        <div className="relative">
                          <input
                            ref={editFileInputRef}
                            id="edit-qna-file"
                            type="file"
                            multiple
                            onChange={handleEditFileSelect}
                            className="hidden"
                            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                          />
                          <button
                            type="button"
                            onClick={() => editFileInputRef.current?.click()}
                            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/30 py-6 px-3 transition-colors hover:border-muted-foreground/50 hover:bg-muted/50"
                          >
                            <Upload className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">클릭 또는 파일을 드래그하여 첨부</span>
                          </button>
                        </div>
                      </div>

                      {/* 새로 추가된 파일 미리보기 */}
                      {editAttachedFiles.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-xs">추가된 파일 ({editAttachedFiles.length})</Label>
                          <div className="space-y-2">
                            {editAttachedFiles.map((attachedFile, index) => (
                              <div key={index} className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 p-2">
                                {attachedFile.preview ? (
                                  <img
                                    src={attachedFile.preview}
                                    alt={attachedFile.file.name}
                                    className="h-10 w-10 rounded object-cover flex-shrink-0"
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                                    {getFileIcon(attachedFile.file)}
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate text-foreground">
                                    {attachedFile.file.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatFileSize(attachedFile.file.size)}
                                  </p>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditRemoveFile(index)}
                                  className="h-8 w-8 p-0 flex-shrink-0"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => {
                          setEditQuestionOpen(false)
                          setEditAttachedFiles([])
                        }}>
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
                <div className="mb-1 flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs bg-pink-500/10 text-pink-600 hover:bg-pink-500/10">
                    선생님 답변
                  </Badge>
                  <span className="text-xs text-muted-foreground">{post.answeredAt}</span>
                </div>
                <p className="text-sm leading-relaxed text-foreground">{post.answer}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function MyQnaPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newContent, setNewContent] = useState("")
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [posts, setPosts] = useState<QnaPost[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("qnaPosts")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)

          // 🔥 빈 배열이면 초기 데이터 사용
          if (Array.isArray(parsed) && parsed.length === 0) {
            return initialQnaPosts
          }

          return parsed
        } catch {
          return initialQnaPosts
        }
      }
    }
    return initialQnaPosts
  })

  // LocalStorage에 posts 저장
  useEffect(() => {
    localStorage.setItem("qnaPosts", JSON.stringify(posts))
  }, [posts])

  if (!user) return null

  const myPosts = posts.filter((post) => post.authorId === user?.id)

  const filteredPosts = myPosts.filter((post) => {
    if (!searchQuery) return true
    return post.title.includes(searchQuery) || post.content.includes(searchQuery)
  })

  const handleAddQuestion = () => {
    if (newTitle.trim() && newContent.trim()) {
      const newPost: QnaPost = {
        id: Date.now().toString(),
        title: newTitle,
        content: newContent,
        authorId: user?.id || "",
        authorName: user?.name || "익명",
        createdAt: new Date().toLocaleDateString("ko-KR"),
        isPrivate: true,
        answer: "",
        answeredAt: null,
        attachments: attachedFiles.map(af => ({
          name: af.file.name,
          size: af.file.size,
          type: af.file.type,
          url: af.preview || URL.createObjectURL(af.file)
        })),
      }

      setPosts([newPost, ...posts])
      setNewTitle("")
      setNewContent("")
      setAttachedFiles([])
      setDialogOpen(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles: AttachedFile[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const attachedFile: AttachedFile = { file }

        if (file.type.startsWith("image/")) {
          const reader = new FileReader()
          reader.onload = (event) => {
            attachedFile.preview = event.target?.result as string
            setAttachedFiles((prev) => [...prev])
          }
          reader.readAsDataURL(file)
        }

        newFiles.push(attachedFile)
      }

      setAttachedFiles((prev) => [...prev, ...newFiles])
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <Image className="h-4 w-4" />
    }
    return <File className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const handleUpdateQuestion = (postId: string, title: string, content: string, attachments?: Array<{
    name: string
    size: number
    type: string
    url: string
  }>) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, title, content, attachments: attachments !== undefined ? attachments : post.attachments } : post
      )
    )
  }

  const handleDeleteQuestion = (postId: string) => {
    setPosts(posts.filter((post) => post.id !== postId))
  }

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
          <h1 className="text-2xl font-bold text-foreground mt-4">내 질문</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            본인이 작성한 질문을 확인하세요.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 mt-4">
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

              {/* File attachment section */}
              <div className="space-y-2">
                <Label htmlFor="qna-file">파일/이미지 첨부 (선택사항)</Label>
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    id="qna-file"
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/30 py-6 px-3 transition-colors hover:border-muted-foreground/50 hover:bg-muted/50"
                  >
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">클릭 또는 파일을 드래그하여 첨부</span>
                  </button>
                </div>
              </div>

              {/* Attached files preview */}
              {attachedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs">첨부된 파일 ({attachedFiles.length})</Label>
                  <div className="space-y-2">
                    {attachedFiles.map((attachedFile, index) => (
                      <div key={index} className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 p-2">
                        {attachedFile.preview ? (
                          <img
                            src={attachedFile.preview}
                            alt={attachedFile.file.name}
                            className="h-10 w-10 rounded object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                            {getFileIcon(attachedFile.file)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate text-foreground">
                            {attachedFile.file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(attachedFile.file.size)}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFile(index)}
                          className="h-8 w-8 p-0 flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
      </div>

      {/* Info banner */}
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-purple-500/20 bg-purple-500/5 px-4 py-3">
        <Lock className="h-5 w-5 flex-shrink-0 text-purple-400" />
        <p className="text-sm text-foreground">
          모든 게시글은 <strong>비공개</strong>로 처리됩니다. 작성한 질문의 내용은 본인과 관리자만 확인할 수 있습니다.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="내 질문 검색..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Post list */}
      <div className="space-y-3">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <QnaPostItem
              key={post.id}
              post={post}
              currentUserId={user?.id || ""}
              onUpdateQuestion={handleUpdateQuestion}
              onDeleteQuestion={handleDeleteQuestion}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">
              {myPosts.length === 0 ? "작성한 질문이 없습니다." : "검색 결과가 없습니다."}
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  )
}