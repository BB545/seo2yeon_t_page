"use client"

import { use, useState } from "react"
import Link from "next/link"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, Clock, Plus, Pencil, Trash2 } from "lucide-react"
import { lectureCategories, courses, lessons, Lesson } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"

interface LessonFormData {
  title: string
  videoUrl: string
}

export default function CoursePage({
  params,
}: {
  params: Promise<{ categoryId: string; courseId: string }>
}) {
  const { categoryId, courseId } = use(params)
  const { isAdmin } = useAuth()
  const [addOpen, setAddOpen] = useState(false)
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null)
  const [editLessonData, setEditLessonData] = useState<LessonFormData>({
    title: "",
    videoUrl: "",
  })
  const [refreshKey, setRefreshKey] = useState(0)

  const [newLesson, setNewLesson] = useState<LessonFormData>({
    title: "",
    videoUrl: "",
  })

  const category = lectureCategories.find((c) => c.id === categoryId)
  const course = courses.find((c) => c.id === courseId)

  // 수업 목록 (mock-data에서 동적으로 필터링)
  const courseLessons = lessons.filter((l) => l.courseId === courseId)

  // 수업 추가
  const handleAddLesson = () => {
    if (!newLesson.title || !newLesson.videoUrl) {
      return
    }

    const newLessonData: Lesson = {
      id: `lesson-${Date.now()}`,
      courseId,
      title: newLesson.title,
      videoUrl: newLesson.videoUrl,
      timemarks: [],
      resources: [],
    }

    lessons.push(newLessonData)
    setNewLesson({ title: "", videoUrl: "" })
    setAddOpen(false)
    setRefreshKey((prev) => prev + 1)
  }

  // 수업 편집 Open
  const handleEditLessonOpen = (lessonId: string) => {
    const lesson = lessons.find((l) => l.id === lessonId)
    if (lesson) {
      setEditLessonData({ title: lesson.title, videoUrl: lesson.videoUrl })
      setEditingLessonId(lessonId)
    }
  }

  // 수업 편집 저장
  const handleSaveLesson = () => {
    if (!editingLessonId) return
    const lesson = lessons.find((l) => l.id === editingLessonId)
    if (lesson) {
      lesson.title = editLessonData.title
      lesson.videoUrl = editLessonData.videoUrl
    }
    setEditingLessonId(null)
    setRefreshKey((prev) => prev + 1)
  }

  // 수업 삭제
  const handleDeleteLesson = (lessonId: string) => {
    const index = lessons.findIndex((l) => l.id === lessonId)
    if (index > -1) {
      lessons.splice(index, 1)
      setRefreshKey((prev) => prev + 1)
    }
  }

  if (!category || !course) {
    return (
      <AppLayout>
        <p className="text-muted-foreground">강좌를 찾을 수 없습니다.</p>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href={`/lectures/${categoryId}`}>
          <Button size="sm" className="group p-0 h-auto bg-transparent hover:bg-transparent shadow-none text-muted-foreground hover:text-violet-600">
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            {category.name}
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{course.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            총 {courseLessons.length}개 수업
          </p>
        </div>
        {isAdmin && (
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                수업 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>새 수업 추가</DialogTitle>
                <DialogDescription>
                  {course?.name}에 새 수업을 추가합니다.
                </DialogDescription>
              </DialogHeader>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault()
                  handleAddLesson()
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="lesson-title">수업 제목 *</Label>
                  <Input
                    id="lesson-title"
                    placeholder="수업 제목을 입력하세요"
                    value={newLesson.title}
                    onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lesson-video">YouTube 영상 URL *</Label>
                  <Input
                    id="lesson-video"
                    placeholder="https://www.youtube.com/watch?v=... 또는 https://youtu.be/..."
                    value={newLesson.videoUrl}
                    onChange={(e) => setNewLesson({ ...newLesson, videoUrl: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                    취소
                  </Button>
                  <Button type="submit" disabled={!newLesson.title || !newLesson.videoUrl}>
                    추가
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-3" key={refreshKey}>
        {courseLessons.length > 0 ? (
          courseLessons.map((lesson, index) => (
            <div key={lesson.id} className="group relative">
              <Link href={`/lectures/${categoryId}/${courseId}/${lesson.id}`}>
                <Card className="border-border transition-all hover:border-primary/30 hover:shadow-sm cursor-pointer">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-violet-400 text-sm font-bold text-primary-foreground">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{lesson.title}</h3>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{lesson.timemarks.length}개 타임마크</span>
                        <span>{lesson.resources.length}개 자료</span>
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={(e) => {
                            e.preventDefault()
                            handleEditLessonOpen(lesson.id)
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.preventDefault()
                            handleDeleteLesson(lesson.id)
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))
        ) : (
          <Card className="border-border">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">등록된 수업이 없습니다.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 수업 편집 Dialog */}
      {editingLessonId && (
        <Dialog
          open={!!editingLessonId}
          onOpenChange={(open) => {
            if (!open) setEditingLessonId(null)
          }}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>수업 편집</DialogTitle>
              <DialogDescription>수업 정보를 수정합니다.</DialogDescription>
            </DialogHeader>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                handleSaveLesson()
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="edit-lesson-title">수업 제목</Label>
                <Input
                  id="edit-lesson-title"
                  value={editLessonData.title}
                  onChange={(e) => setEditLessonData({ ...editLessonData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lesson-video">YouTube 영상 URL</Label>
                <Input
                  id="edit-lesson-video"
                  value={editLessonData.videoUrl}
                  onChange={(e) =>
                    setEditLessonData({ ...editLessonData, videoUrl: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingLessonId(null)}
                >
                  취소
                </Button>
                <Button type="submit">저장</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </AppLayout>
  )
}
