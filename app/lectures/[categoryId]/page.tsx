"use client"

import { use, useState } from "react"
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
import { ArrowLeft, ArrowRight, BookOpen, Pencil, Plus, Trash2 } from "lucide-react"
import { lectureCategories, courses, Course, students } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"

interface CategoryFormData {
  name: string
  description: string
  instructor: string
}

export default function CategoryPage({ params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = use(params)
  const { isAdmin, isAssistantAdmin, isStaff, user } = useAuth()
  const [editOpen, setEditOpen] = useState(false)
  const [addCourseOpen, setAddCourseOpen] = useState(false)
  const [categoryData, setCategoryData] = useState<CategoryFormData | null>(null)
  const [newCourseName, setNewCourseName] = useState("")
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())
  const [selectedSchoolCategory, setSelectedSchoolCategory] = useState<string>("all")
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null)
  const [editCourseName, setEditCourseName] = useState("")
  const [editingCourseStudents, setEditingCourseStudents] = useState<Set<string>>(new Set())
  const [editingSchoolCategory, setEditingSchoolCategory] = useState<string>("all")
  const [refreshKey, setRefreshKey] = useState(0)

  const category = lectureCategories.find((c) => c.id === categoryId)

  // 강좌 목록 (mock-data에서 동적으로 필터링)
  const categoryCourses = courses.filter((c) => {
    if (c.categoryId !== categoryId) return false
    // 학생인 경우 본인이 지정된 강좌만 표시
    if (!isStaff && user?.id) {
      return c.assignedTo.includes(user.id)
    }
    return true
  })

  // 특정 강좌의 대상 학생인지 확인
  const isTargetStudent = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId)
    return course && user?.id && course.assignedTo.includes(user.id)
  }

  // 강좌 편집 권한 확인
  const canEditCourse = (courseId: string) => {
    return isAdmin || isAssistantAdmin || isTargetStudent(courseId)
  }

  const toggleStudent = (studentId: string) => {
    const updated = new Set(selectedStudents)
    if (updated.has(studentId)) {
      updated.delete(studentId)
    } else {
      updated.add(studentId)
    }
    setSelectedStudents(updated)
  }

  const getStudentsByCategory = (categoryType: "all" | string) => {
    if (categoryType === "all") {
      return students
    }
    return students.filter((s) => s.school === categoryType)
  }

  const getSchools = () => {
    const schools = new Set(students.map((s) => s.school))
    return Array.from(schools).sort()
  }

  const cleanSchoolName = (name: string) => {
    return name
      .replace(/학교|등학교/g, "")
      .trim()
  }

  const sortGrades = (grades: string[]) => {
    return grades.sort((a, b) => {
      const getOrder = (grade: string) => {
        if (grade.includes("중학교")) {
          const num = parseInt(grade.match(/\d+/)?.[0] || "0")
          return num
        }
        if (grade.includes("고등학교")) {
          const num = parseInt(grade.match(/\d+/)?.[0] || "0")
          return 10 + num
        }
        return 99
      }
      return getOrder(a) - getOrder(b)
    })
  }

  const sortSchools = (schools: string[]) => {
    return schools.sort((a, b) => {
      const getOrder = (school: string) => {
        if (school.includes("중학교")) return 0
        if (school.includes("고등학교")) return 1
        return 2
      }
      const orderA = getOrder(a)
      const orderB = getOrder(b)
      if (orderA !== orderB) return orderA - orderB
      return a.localeCompare(b, "ko")
    })
  }

  const groupStudentsByGrade = (schoolStudents: typeof students) => {
    const grouped: { [key: string]: typeof students } = {}
    schoolStudents.forEach((student) => {
      if (!grouped[student.grade]) {
        grouped[student.grade] = []
      }
      grouped[student.grade].push(student)
    })
    return grouped
  }

  // 카테고리 편집 Open
  // const handleEditOpen = () => {
  //   if (category) {
  //     setCategoryData({
  //       name: category.name,
  //       description: category.description,
  //       instructor: category.instructor,
  //     })
  //   }
  //   setEditOpen(true)
  // }

  // // 카테고리 저장
  // const handleSaveCategory = () => {
  //   if (categoryData && category) {
  //     category.name = categoryData.name
  //     category.description = categoryData.description
  //     category.instructor = categoryData.instructor
  //   }
  //   setEditOpen(false)
  //   setRefreshKey((prev) => prev + 1)
  // }

  // 강좌 추가
  const handleAddCourse = () => {
    if (!newCourseName) return

    const newCourse: Course = {
      id: `course-${Date.now()}`,
      categoryId,
      name: newCourseName,
      lessonCount: 0,
      assignedTo: Array.from(selectedStudents),
    }

    courses.push(newCourse)
    setNewCourseName("")
    setSelectedStudents(new Set())
    setSelectedSchoolCategory("all")
    setAddCourseOpen(false)
    setRefreshKey((prev) => prev + 1)
  }

  // 강좌 편집 Open
  const handleEditCourseOpen = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId)
    if (course) {
      setEditCourseName(course.name)
      setEditingCourseStudents(new Set(course.assignedTo))
      setEditingSchoolCategory("all")
      setEditingCourseId(courseId)
    }
  }

  // 강좌 편집 저장
  const handleSaveCourse = () => {
    if (!editingCourseId) return
    const course = courses.find((c) => c.id === editingCourseId)
    if (course) {
      course.name = editCourseName
      course.assignedTo = Array.from(editingCourseStudents)
    }
    setEditingCourseId(null)
    setEditCourseName("")
    setEditingCourseStudents(new Set())
    setEditingSchoolCategory("all")
    setRefreshKey((prev) => prev + 1)
  }

  // 강좌 삭제
  const handleDeleteCourse = (courseId: string) => {
    const index = courses.findIndex((c) => c.id === courseId)
    if (index > -1) {
      courses.splice(index, 1)
      setRefreshKey((prev) => prev + 1)
    }
  }

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
          <Button size="sm" className="group p-0 h-auto bg-transparent hover:bg-transparent shadow-none text-muted-foreground hover:text-violet-600">
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            복습 영상
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{category?.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{category?.description}</p>
          <Badge className="mt-2 border-transparent text-secondary-foreground text-xs bg-violet-100 hover:bg-violet-100">
            {category?.instructor}
          </Badge>
        </div>
        {(isAdmin || isAssistantAdmin) && (
          <div className="flex gap-2">
            {/* 카테고리 편집 */}
            {/* <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent" onClick={handleEditOpen}>
                  <Pencil className="h-4 w-4" />
                  카테고리 편집
                </Button>
              </DialogTrigger>
              {categoryData && (
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>카테고리 편집</DialogTitle>
                    <DialogDescription>
                      {category?.name} 정보를 수정합니다.
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSaveCategory()
                    }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="cat-name">카테고리 이름</Label>
                      <Input
                        id="cat-name"
                        value={categoryData.name}
                        onChange={(e) =>
                          setCategoryData({ ...categoryData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cat-description">설명</Label>
                      <Input
                        id="cat-description"
                        value={categoryData.description}
                        onChange={(e) =>
                          setCategoryData({ ...categoryData, description: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cat-instructor">강사명</Label>
                      <Input
                        id="cat-instructor"
                        value={categoryData.instructor}
                        onChange={(e) =>
                          setCategoryData({ ...categoryData, instructor: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                        취소
                      </Button>
                      <Button type="submit">저장</Button>
                    </div>
                  </form>
                </DialogContent>
              )}
            </Dialog> */}

            {/* 강좌 추가 */}
            <Dialog open={addCourseOpen} onOpenChange={setAddCourseOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  강좌 추가
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>새 강좌 추가</DialogTitle>
                  <DialogDescription>
                    {category?.name}에 새 강좌를 추가합니다.
                  </DialogDescription>
                </DialogHeader>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleAddCourse()
                  }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="course-name">강좌 이름 *</Label>
                    <Input
                      id="course-name"
                      placeholder="강좌 이름을 입력하세요"
                      value={newCourseName}
                      onChange={(e) => setNewCourseName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>대상 학생 지정 *</Label>
                    <div className="rounded-lg border border-border p-3">
                      <div className="mb-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedSchoolCategory("all")}
                          className={`px-3 py-1.5 text-sm rounded-md transition-colors font-medium ${selectedSchoolCategory === "all"
                            ? "bg-violet-500 text-white"
                            : "bg-muted text-muted-foreground hover:bg-muted-foreground/20"
                            }`}
                        >
                          전체 ({students.length})
                        </button>
                        {sortSchools(getSchools().slice()).map((school) => {
                          const schoolCount = students.filter((s) => s.school === school).length
                          return (
                            <button
                              key={school}
                              type="button"
                              onClick={() => setSelectedSchoolCategory(school)}
                              className={`px-3 py-1.5 text-sm rounded-md transition-colors font-medium ${selectedSchoolCategory === school
                                ? "bg-violet-500 text-white"
                                : "bg-muted text-muted-foreground hover:bg-muted-foreground/20"
                                }`}
                            >
                              {cleanSchoolName(school)} ({schoolCount})
                            </button>
                          )
                        })}
                      </div>
                      <div className="max-h-[350px] overflow-y-auto scrollbar-hide">
                        <div className="space-y-3">
                          {(() => {
                            const categoryStudents = getStudentsByCategory(selectedSchoolCategory)
                            const gradeGrouped = groupStudentsByGrade(categoryStudents)
                            return sortGrades(Object.keys(gradeGrouped)).map((grade) => {
                              const gradeStudents = gradeGrouped[grade]
                              return (
                                <div key={grade} className="space-y-2">
                                  <label className="flex cursor-pointer items-center gap-3">
                                    <input
                                      type="checkbox"
                                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                                      checked={gradeStudents.every((s) =>
                                        selectedStudents.has(s.id)
                                      )}
                                      onChange={() => {
                                        const allSelected = gradeStudents.every((s) =>
                                          selectedStudents.has(s.id)
                                        )
                                        const updated = new Set(selectedStudents)
                                        gradeStudents.forEach((s) => {
                                          if (allSelected) {
                                            updated.delete(s.id)
                                          } else {
                                            updated.add(s.id)
                                          }
                                        })
                                        setSelectedStudents(updated)
                                      }}
                                    />
                                    <span className="text-sm font-medium text-foreground">
                                      {grade}
                                    </span>
                                  </label>
                                  <div className="space-y-1.5 ml-6">
                                    {gradeStudents
                                      .slice()
                                      .sort((a, b) => a.name.localeCompare(b.name, "ko"))
                                      .map((student) => (
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
                                        </label>
                                      ))}
                                  </div>
                                </div>
                              )
                            })
                          })()}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {selectedStudents.size}명 선택됨
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setAddCourseOpen(false)}
                    >
                      취소
                    </Button>
                    <Button type="submit" disabled={!newCourseName || selectedStudents.size === 0}>
                      추가
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <div className="space-y-3" key={refreshKey}>
        {categoryCourses.length > 0 ? (
          categoryCourses.map((course) => (
            <div key={course.id} className="group relative">
              <Link href={`/lectures/${categoryId}/${course.id}`}>
                <Card className="border-border transition-all hover:border-primary/30 hover:shadow-sm cursor-pointer">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 flex-shrink-0">
                        <BookOpen className="h-5 w-5 text-violet-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{course.name}</h3>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {course.lessonCount}개 수업
                        </p>
                        {(isAdmin || isAssistantAdmin) && (
                          <p className="mt-1.5 text-xs text-muted-foreground">
                            지정: {course.assignedTo && course.assignedTo.length > 0 ? `${course.assignedTo.length}명` : "미지정"}
                          </p>
                        )}
                      </div>
                    </div>
                    {isAdmin || isAssistantAdmin ? (
                      <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={(e) => {
                            e.preventDefault()
                            handleEditCourseOpen(course.id)
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        {(isAdmin || isAssistantAdmin) && (
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.preventDefault()
                              handleDeleteCourse(course.id)
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    ) : (
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    )}
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))
        ) : (
          <Card className="border-border">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">등록된 강좌가 없습니다.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 강좌 편집 Dialog */}
      {editingCourseId && (
        <Dialog
          open={!!editingCourseId}
          onOpenChange={(open) => {
            if (!open) {
              setEditingCourseId(null)
              setEditCourseName("")
              setEditingCourseStudents(new Set())
              setEditingSchoolCategory("all")
            }
          }}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>강좌 편집</DialogTitle>
              <DialogDescription>강좌 정보를 수정합니다.</DialogDescription>
            </DialogHeader>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                handleSaveCourse()
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="edit-course-name">강좌 이름</Label>
                <Input
                  id="edit-course-name"
                  value={editCourseName}
                  onChange={(e) => setEditCourseName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>대상 학생 지정</Label>
                <div className="rounded-lg border border-border p-3">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingSchoolCategory("all")}
                      className={`px-3 py-1.5 text-sm rounded-md transition-colors font-medium ${editingSchoolCategory === "all"
                        ? "bg-violet-500 text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted-foreground/20"
                        }`}
                    >
                      전체 ({students.length})
                    </button>
                    {sortSchools(getSchools().slice()).map((school) => {
                      const schoolCount = students.filter((s) => s.school === school).length
                      return (
                        <button
                          key={school}
                          type="button"
                          onClick={() => setEditingSchoolCategory(school)}
                          className={`px-3 py-1.5 text-sm rounded-md transition-colors font-medium ${editingSchoolCategory === school
                            ? "bg-violet-500 text-white"
                            : "bg-muted text-muted-foreground hover:bg-muted-foreground/20"
                            }`}
                        >
                          {cleanSchoolName(school)} ({schoolCount})
                        </button>
                      )
                    })}
                  </div>
                  <div className="max-h-[350px] overflow-y-auto scrollbar-hide">
                    <div className="space-y-3">
                      {(() => {
                        const categoryStudents = getStudentsByCategory(editingSchoolCategory)
                        const gradeGrouped = groupStudentsByGrade(categoryStudents)
                        return sortGrades(Object.keys(gradeGrouped)).map((grade) => {
                          const gradeStudents = gradeGrouped[grade]
                          return (
                            <div key={grade} className="space-y-2">
                              <label className="flex cursor-pointer items-center gap-3">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                                  checked={gradeStudents.every((s) =>
                                    editingCourseStudents.has(s.id)
                                  )}
                                  onChange={() => {
                                    const allSelected = gradeStudents.every((s) =>
                                      editingCourseStudents.has(s.id)
                                    )
                                    const updated = new Set(editingCourseStudents)
                                    gradeStudents.forEach((s) => {
                                      if (allSelected) {
                                        updated.delete(s.id)
                                      } else {
                                        updated.add(s.id)
                                      }
                                    })
                                    setEditingCourseStudents(updated)
                                  }}
                                />
                                <span className="text-sm font-medium text-foreground">
                                  {grade}
                                </span>
                              </label>
                              <div className="space-y-1.5 ml-6">
                                {gradeStudents
                                  .slice()
                                  .sort((a, b) => a.name.localeCompare(b.name, "ko"))
                                  .map((student) => (
                                    <label
                                      key={student.id}
                                      className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/50"
                                    >
                                      <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                                        checked={editingCourseStudents.has(student.id)}
                                        onChange={() => {
                                          const updated = new Set(editingCourseStudents)
                                          if (updated.has(student.id)) {
                                            updated.delete(student.id)
                                          } else {
                                            updated.add(student.id)
                                          }
                                          setEditingCourseStudents(updated)
                                        }}
                                      />
                                      <span className="text-sm text-foreground">
                                        {student.name}
                                      </span>
                                    </label>
                                  ))}
                              </div>
                            </div>
                          )
                        })
                      })()}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {editingCourseStudents.size}명 선택됨
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingCourseId(null)}
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
