"use client"

import { useState } from "react"
import Link from "next/link"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BookOpen, ArrowRight, Plus, Pencil, Trash2 } from "lucide-react"
import { lectureCategories, LectureCategory, students } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"

interface CategoryFormData {
  name: string
  description: string
  instructor: string
  assignedTo: string[]
}

export default function LecturesPage() {
  const { isAdmin, user } = useAuth()
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    instructor: "",
    assignedTo: [],
  })
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())
  const [refreshKey, setRefreshKey] = useState(0)

  if (!user) return null

  // 학생 이름 가져오기 (ID로)
  const getStudentName = (studentId: string) => {
    const student = students.find((s) => s.id === studentId)
    return student?.name || "알 수 없음"
  }

  // 카테고리 필터링: 학생은 자신에게 할당된 카테고리만, 관리자는 모두 표시
  const getVisibleCategories = () => {
    if (isAdmin) {
      return lectureCategories
    }
    // 학생 뷰: 할당된 학생이 없거나 현재 사용자가 포함된 카테고리만 표시
    return lectureCategories.filter((category) => {
      if (!category.assignedTo || category.assignedTo.length === 0) {
        return false // 지정된 학생이 없으면 학생에게는 보이지 않음
      }
      return category.assignedTo.includes(user?.id || "")
    })
  }

  // 카테고리 추가
  const handleAddCategory = () => {
    if (!formData.name || !formData.description || !formData.instructor) return

    const newCategory: LectureCategory = {
      id: `cat-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      instructor: formData.instructor,
      thumbnail: "",
      courseCount: 0,
      assignedTo: Array.from(selectedStudents),
    }

    lectureCategories.push(newCategory)
    setFormData({
      name: "",
      description: "",
      instructor: "",
      assignedTo: []
    })
    setSelectedStudents(new Set())
    setAddOpen(false)
    setRefreshKey((prev) => prev + 1)
  }

  // 카테고리 편집 시작
  const handleEditOpen = (category: LectureCategory) => {
    setFormData({
      name: category.name,
      description: category.description,
      instructor: category.instructor,
      assignedTo: category.assignedTo || [],
    })
    setSelectedStudents(new Set(category.assignedTo || []))
    setEditingId(category.id)
    setEditOpen(true)
  }

  // 카테고리 편집 저장
  const handleSaveCategory = () => {
    if (!editingId) return
    const category = lectureCategories.find((c) => c.id === editingId)
    if (category) {
      category.name = formData.name
      category.description = formData.description
      category.instructor = formData.instructor
      category.assignedTo = Array.from(selectedStudents)
    }
    setEditingId(null)
    setEditOpen(false)
    setSelectedStudents(new Set())
    setRefreshKey((prev) => prev + 1)
  }

  // 카테고리 삭제
  const handleDeleteCategory = (categoryId: string) => {
    const index = lectureCategories.findIndex((c) => c.id === categoryId)
    if (index > -1) {
      lectureCategories.splice(index, 1)
      setRefreshKey((prev) => prev + 1)
    }
  }

  // 학생 체크박스 토글
  const toggleStudent = (studentId: string) => {
    const updated = new Set(selectedStudents)
    if (updated.has(studentId)) {
      updated.delete(studentId)
    } else {
      updated.add(studentId)
    }
    setSelectedStudents(updated)
  }

  const visibleCategories = getVisibleCategories()

  return (
    <AppLayout>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">복습 영상</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isAdmin
              ? "강의 카테고리를 관리합니다."
              : "강의 카테고리를 선택하여 복습 영상을 시청하세요."}
          </p>
        </div>
        {isAdmin && (
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                카테고리 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>새 카테고리 추가</DialogTitle>
                <DialogDescription>새로운 강의 카테고리를 추가합니다.</DialogDescription>
              </DialogHeader>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault()
                  handleAddCategory()
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="cat-name">카테고리 이름 *</Label>
                  <Input
                    id="cat-name"
                    placeholder="예: 수학"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cat-description">설명 *</Label>
                  <Input
                    id="cat-description"
                    placeholder="카테고리 설명"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cat-instructor">강사명 *</Label>
                  <Input
                    id="cat-instructor"
                    placeholder="강사 이름"
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>대상 학생 지정 *</Label>
                  <div className="rounded-lg border border-border p-3 max-h-[250px] overflow-y-auto">
                    <div className="space-y-2">
                      {students.map((student) => (
                        <label
                          key={student.id}
                          className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/50"
                        >
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                            checked={selectedStudents.has(student.id)}
                            onChange={() => toggleStudent(student.id)}
                          />
                          <span className="text-sm text-foreground">
                            {student.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {student.grade}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedStudents.size}명 선택됨
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                    취소
                  </Button>
                  <Button
                    type="submit"
                    disabled={!formData.name || !formData.description || !formData.instructor || selectedStudents.size === 0}
                  >
                    추가
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2" key={refreshKey}>
        {visibleCategories.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <p className="text-sm text-muted-foreground">
              {isAdmin
                ? "카테고리가 없습니다."
                : "현재 할당된 강의 카테고리가 없습니다."}
            </p>
          </div>
        ) : (
          visibleCategories.map((category) => (
            <div key={category.id} className="group relative">
              <Link href={`/lectures/${category.id}`}>
                <Card className="border-border transition-all hover:border-primary/30 hover:shadow-md cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <Badge className="border-transparent text-secondary-foreground text-xs bg-violet-100 hover:bg-violet-100">
                        {category.instructor}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{category.courseCount}개 강좌</span>
                    </div>
                    {/* 관리자 뷰: 할당된 학생 정보 표시 */}
                    {isAdmin && (
                      category.assignedTo && category.assignedTo.length > 0 ? (
                        <div className="mt-3 pt-3 border-t border-border/50">
                          <p className="text-xs text-muted-foreground mb-2">지정된 학생:</p>
                          <div className="flex flex-wrap gap-1">
                            {category.assignedTo.map((studentId) => (
                              <Badge key={studentId} variant="outline" className="text-xs">
                                {getStudentName(studentId)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 pt-3 border-t border-border/50">
                          <p className="text-xs text-muted-foreground mb-2">지정된 학생:</p>
                          <span className="text-xs text-muted-foreground">
                            지정된 학생이 없습니다. (접근 제한됨)
                          </span>
                        </div>
                      )
                    )}
                  </CardContent>
                </Card>
              </Link>
              {isAdmin && (
                <div className="absolute bottom-5 right-5 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 bg-white/90"
                    onClick={(e) => {
                      e.preventDefault()
                      handleEditOpen(category)
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 bg-white/90 text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.preventDefault()
                      handleDeleteCategory(category.id)
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 카테고리 편집 Dialog */}
      {editingId && (
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>카테고리 편집</DialogTitle>
              <DialogDescription>카테고리 정보를 수정합니다.</DialogDescription>
            </DialogHeader>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                handleSaveCategory()
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="edit-cat-name">카테고리 이름</Label>
                <Input
                  id="edit-cat-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-cat-description">설명</Label>
                <Input
                  id="edit-cat-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-cat-instructor">강사명</Label>
                <Input
                  id="edit-cat-instructor"
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>대상 학생 지정</Label>
                <div className="rounded-lg border border-border p-3 max-h-[250px] overflow-y-auto">
                  <div className="space-y-2">
                    {students.map((student) => (
                      <label
                        key={student.id}
                        className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/50"
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                          checked={selectedStudents.has(student.id)}
                          onChange={() => toggleStudent(student.id)}
                        />
                        <span className="text-sm text-foreground">
                          {student.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {student.grade}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {selectedStudents.size}명 선택됨
                </p>
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
    </AppLayout>
  )
}
