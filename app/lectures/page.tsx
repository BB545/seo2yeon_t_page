"use client"

import { AppLayout } from "@/components/app-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { BookOpen, Users, ArrowRight } from "lucide-react"
import { lectureCategories } from "@/lib/mock-data"

const colorMap: Record<string, string> = {
  "bg-blue-500": "bg-blue-500",
  "bg-emerald-500": "bg-emerald-500",
  "bg-amber-500": "bg-amber-500",
  "bg-rose-500": "bg-rose-500",
}

const iconBgMap: Record<string, string> = {
  "bg-blue-500": "bg-blue-500/10 text-blue-600",
  "bg-emerald-500": "bg-emerald-500/10 text-emerald-600",
  "bg-amber-500": "bg-amber-500/10 text-amber-600",
  "bg-rose-500": "bg-rose-500/10 text-rose-600",
}

export default function LecturesPage() {
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">복습 영상</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          강의 카테고리를 선택하여 복습 영상을 시청하세요.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {lectureCategories.map((category) => (
          <Link key={category.id} href={`/lectures/${category.id}`}>
            <Card className="group border-border transition-all hover:border-primary/30 hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBgMap[category.color]}`}>
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <Users className="h-3 w-3" />
                    {category.instructor}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{category.courseCount}개 강좌</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </AppLayout>
  )
}
