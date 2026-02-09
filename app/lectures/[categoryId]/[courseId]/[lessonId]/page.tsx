"use client"

import { use, useState } from "react"
import Link from "next/link"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, Clock, FileText, Download, List, Pencil, Plus, Upload } from "lucide-react"
import { lectureCategories, courses, lessons } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"

export default function LessonPage({
  params,
}: {
  params: Promise<{ categoryId: string; courseId: string; lessonId: string }>
}) {
  const { categoryId, courseId, lessonId } = use(params)
  const { isAdmin } = useAuth()
  const [editOpen, setEditOpen] = useState(false)
  const [addTimemarkOpen, setAddTimemarkOpen] = useState(false)
  const [uploadResourceOpen, setUploadResourceOpen] = useState(false)
  const category = lectureCategories.find((c) => c.id === categoryId)
  const course = courses.find((c) => c.id === courseId)
  const lesson = lessons.find((l) => l.id === lessonId)

  if (!category || !course || !lesson) {
    return (
      <AppLayout>
        <p className="text-muted-foreground">수업을 찾을 수 없습니다.</p>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      {/* Breadcrumb */}
      <div className="mb-4">
        <Link href={`/lectures/${categoryId}/${courseId}`}>
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            {course.name}
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">{lesson.title}</h1>
          <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {lesson.duration}
            </span>
            <Badge variant="secondary">{category.name}</Badge>
          </div>
        </div>
        {isAdmin && (
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Pencil className="h-4 w-4" />
                수업 편집
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>수업 편집</DialogTitle>
                <DialogDescription>수업 정보를 수정합니다.</DialogDescription>
              </DialogHeader>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault()
                  setEditOpen(false)
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="edit-title">수업 제목</Label>
                  <Input id="edit-title" defaultValue={lesson.title} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-video">영상 URL</Label>
                  <Input id="edit-video" defaultValue={lesson.videoUrl} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-duration">재생 시간</Label>
                  <Input id="edit-duration" defaultValue={lesson.duration} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                    취소
                  </Button>
                  <Button type="submit">저장</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Video */}
        <div className="lg:col-span-2">
          <div className="aspect-video overflow-hidden rounded-xl border border-border bg-foreground/5">
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground">영상 플레이어 영역</p>
                <p className="mt-1 text-xs text-muted-foreground">{lesson.duration}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Timemarks & Resources */}
        <div className="space-y-4">
          <Tabs defaultValue="timemarks">
            <TabsList className="w-full">
              <TabsTrigger value="timemarks" className="flex-1 gap-1.5">
                <List className="h-3.5 w-3.5" />
                타임마크
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex-1 gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                자료
              </TabsTrigger>
            </TabsList>
            <TabsContent value="timemarks" className="mt-3">
              {isAdmin && (
                <Dialog open={addTimemarkOpen} onOpenChange={setAddTimemarkOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="mb-3 w-full gap-1.5 bg-transparent">
                      <Plus className="h-3.5 w-3.5" />
                      타임마크 추가
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                      <DialogTitle>타임마크 추가</DialogTitle>
                    </DialogHeader>
                    <form
                      className="space-y-4"
                      onSubmit={(e) => {
                        e.preventDefault()
                        setAddTimemarkOpen(false)
                      }}
                    >
                      <div className="space-y-2">
                        <Label htmlFor="tm-time">시간</Label>
                        <Input id="tm-time" placeholder="예: 05:30" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tm-label">설명</Label>
                        <Input id="tm-label" placeholder="타임마크 설명" />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setAddTimemarkOpen(false)}>
                          취소
                        </Button>
                        <Button type="submit">추가</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
              <Card className="border-border">
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {lesson.timemarks.map((mark, index) => (
                      <button
                        key={index}
                        type="button"
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50"
                      >
                        <span className="flex-shrink-0 rounded bg-primary/10 px-2 py-0.5 text-xs font-mono font-medium text-primary">
                          {mark.time}
                        </span>
                        <span className="flex-1 text-sm text-foreground">{mark.label}</span>
                        {isAdmin && (
                          <Pencil className="h-3 w-3 flex-shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="resources" className="mt-3">
              {isAdmin && (
                <Dialog open={uploadResourceOpen} onOpenChange={setUploadResourceOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="mb-3 w-full gap-1.5 bg-transparent">
                      <Upload className="h-3.5 w-3.5" />
                      자료 업로드
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                      <DialogTitle>자료 업로드</DialogTitle>
                    </DialogHeader>
                    <form
                      className="space-y-4"
                      onSubmit={(e) => {
                        e.preventDefault()
                        setUploadResourceOpen(false)
                      }}
                    >
                      <div className="space-y-2">
                        <Label htmlFor="res-name">자료 이름</Label>
                        <Input id="res-name" placeholder="자료 이름을 입력하세요" />
                      </div>
                      <div className="rounded-lg border-2 border-dashed border-border bg-muted/30 p-6 text-center">
                        <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                        <p className="mt-2 text-xs text-muted-foreground">파일을 선택하세요</p>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setUploadResourceOpen(false)}>
                          취소
                        </Button>
                        <Button type="submit">업로드</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
              <Card className="border-border">
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {lesson.resources.map((resource, index) => (
                      <div key={index} className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{resource.name}</p>
                            <p className="text-xs uppercase text-muted-foreground">{resource.type}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  )
}
