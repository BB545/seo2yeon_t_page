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
import { ArrowLeft, PlayCircle, Clock, Plus, Pencil, Trash2 } from "lucide-react"
import { lectureCategories, courses, lessons } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"

export default function CoursePage({
  params,
}: {
  params: Promise<{ categoryId: string; courseId: string }>
}) {
  const { categoryId, courseId } = use(params)
  const { isAdmin } = useAuth()
  const [addOpen, setAddOpen] = useState(false)
  const category = lectureCategories.find((c) => c.id === categoryId)
  const course = courses.find((c) => c.id === courseId)
  const courseLessons = lessons.filter((l) => l.courseId === courseId)

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
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            {category.name}
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{course.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            총 {course.lessonCount}개 수업 | {category.instructor}
          </p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
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
                  <DialogDescription>{course.name}에 새 수업을 추가합니다.</DialogDescription>
                </DialogHeader>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault()
                    setAddOpen(false)
                  }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="lesson-title">수업 제목</Label>
                    <Input id="lesson-title" placeholder="수업 제목을 입력하세요" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lesson-video">영상 URL</Label>
                    <Input id="lesson-video" placeholder="https://youtube.com/..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lesson-duration">재생 시간</Label>
                    <Input id="lesson-duration" placeholder="예: 45:30" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                      취소
                    </Button>
                    <Button type="submit">추가</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {courseLessons.length > 0 ? (
          courseLessons.map((lesson, index) => (
            <div key={lesson.id} className="group relative">
              <Link href={`/lectures/${categoryId}/${courseId}/${lesson.id}`}>
                <Card className="border-border transition-all hover:border-primary/30 hover:shadow-sm">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{lesson.title}</h3>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {lesson.duration}
                        </span>
                        <span>{lesson.timemarks.length}개 타임마크</span>
                        <span>{lesson.resources.length}개 자료</span>
                      </div>
                    </div>
                    {isAdmin ? (
                      <div className="flex gap-1.5">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={(e) => e.preventDefault()}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent text-destructive hover:text-destructive"
                          onClick={(e) => e.preventDefault()}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" className="gap-1.5 bg-transparent">
                        <PlayCircle className="h-4 w-4" />
                        수업 보기
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))
        ) : (
          <Card className="border-border">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">아직 등록된 수업이 없습니다.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
