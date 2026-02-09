"use client"

import { use } from "react"
import Link from "next/link"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, BookOpen, PlayCircle } from "lucide-react"
import { lectureCategories, courses } from "@/lib/mock-data"

export default function CategoryPage({ params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = use(params)
  const category = lectureCategories.find((c) => c.id === categoryId)
  const categoryCourses = courses.filter((c) => c.categoryId === categoryId)

  if (!category) {
    return (
      <AppLayout>
        <p className="text-muted-foreground">카테고리를 찾을 수 없습니다.</p>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/lectures">
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            복습 영상
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{category.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
        <Badge variant="secondary" className="mt-2">{category.instructor}</Badge>
      </div>

      <div className="space-y-3">
        {categoryCourses.map((course) => (
          <Link key={course.id} href={`/lectures/${categoryId}/${course.id}`}>
            <Card className="group border-border transition-all hover:border-primary/30 hover:shadow-sm">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{course.name}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {course.lessonCount}개 수업
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1.5 bg-transparent">
                    <PlayCircle className="h-4 w-4" />
                    강의실 입장
                  </Button>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </AppLayout>
  )
}
