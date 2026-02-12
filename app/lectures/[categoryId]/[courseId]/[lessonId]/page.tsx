"use client"

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

import { use, useState, useEffect, useRef } from "react"
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
import { ArrowLeft, Clock, FileText, Download, List, Pencil, Plus, Upload, Trash2 } from "lucide-react"
import { lectureCategories, courses, lessons } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"

// 로컬 타입 정의
interface Timemark {
  id: string
  time: string
  seconds: number
  label: string
}

interface Resource {
  id: string
  name: string
  type: string
  size: number
  uploadedAt: string
  url: string
}

// 유틸 함수들
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

function convertTimeToSeconds(timeStr: string): number {
  const parts = timeStr.split(':').map(p => parseInt(p, 10))
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1]
  }
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2]
  }
  return 0
}

function convertSecondsToTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export default function LessonPage({
  params,
}: {
  params: Promise<{ categoryId: string; courseId: string; lessonId: string }>
}) {
  const { categoryId, courseId, lessonId } = use(params)
  const { isAdmin } = useAuth()
  const playerRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [editOpen, setEditOpen] = useState(false)
  const [addTimemarkOpen, setAddTimemarkOpen] = useState(false)
  const [uploadResourceOpen, setUploadResourceOpen] = useState(false)
  const [editTimemarkId, setEditTimemarkId] = useState<string | null>(null)
  
  // 로컬 상태: 타임마크와 자료
  const [timemarks, setTimemarks] = useState<Timemark[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [newTimemark, setNewTimemark] = useState({ time: '', label: '' })
  const [editTimemark, setEditTimemark] = useState<Timemark | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  
  const category = lectureCategories.find((c) => c.id === categoryId)
  const course = courses.find((c) => c.id === courseId)
  const lesson = lessons.find((l) => l.id === lessonId)
  
  // 초기 데이터 로드
  useEffect(() => {
    if (lesson) {
      // mock-data의 기존 데이터를 새 타입으로 변환
      const convertedTimemarks = lesson.timemarks.map((tm, idx) => ({
        id: `tm-${idx}`,
        time: tm.time,
        seconds: convertTimeToSeconds(tm.time),
        label: tm.label,
      }))
      const convertedResources = lesson.resources.map((res, idx) => ({
        id: `res-${idx}`,
        name: res.name,
        type: res.type,
        size: 0,
        uploadedAt: new Date().toISOString(),
        url: res.url,
      }))
      setTimemarks(convertedTimemarks)
      setResources(convertedResources)
    }
  }, [lesson])
  
  // ✅ YouTube Player 초기화 - 더 안정적인 버전
  useEffect(() => {
    if (!lesson) return
    
    const videoId = extractYouTubeId(lesson.videoUrl)
    if (!videoId) return
    
    // YouTube IFrame API 로드 체크
    const loadYouTubeAPI = () => {
      if (window.YT && window.YT.Player) {
        initPlayer()
      } else if (!window.YT) {
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        tag.onload = () => {
          // API 로드 완료 시 재시도
          setTimeout(initPlayer, 150)
        }
        document.body.appendChild(tag)
        
        // 전역 콜백 설정
        window.onYouTubeIframeAPIReady = initPlayer
      }
    }
    
    // Player 초기화
    const initPlayer = () => {
      if (containerRef.current && !playerRef.current) {
        try {
          playerRef.current = new window.YT.Player(containerRef.current, {
            videoId: videoId,
            width: '100%',
            height: '100%',
            playerVars: {
              controls: 1,
              modestbranding: 1,
              rel: 0,
              autoplay: 0,
            },
            events: {
              onReady: (event: any) => {
                console.log('YouTube Player ready')
              },
              onError: (event: any) => {
                console.error('YouTube Player error:', event.data)
              },
            },
          })
        } catch (e) {
          console.error('Failed to initialize player:', e)
          playerRef.current = null
        }
      }
    }
    
    loadYouTubeAPI()
    
    return () => {
      // 언마운트 시 정리 (필요시)
    }
  }, [lesson?.videoUrl])
  
  // ✅ 타임마크 클릭 핸들러 - Player 준비 상태 확인
  const handleTimemarkClick = (seconds: number) => {
    if (!playerRef.current) {
      console.warn('Player not ready yet')
      return
    }
    
    try {
      // Player 상태 확인: getPlayerState 존재 시 확인
      const state = typeof playerRef.current.getPlayerState === 'function' 
        ? playerRef.current.getPlayerState() 
        : -1
      
      if (typeof playerRef.current.seekTo === 'function') {
        playerRef.current.seekTo(seconds, true)
        
        // seekTo 후 약간의 지연을 두고 재생
        setTimeout(() => {
          if (typeof playerRef.current?.playVideo === 'function') {
            playerRef.current.playVideo()
          }
        }, 100)
      }
    } catch (e) {
      console.error('Error seeking to time:', e)
    }
  }
  
  // 타임마크 추가
  const handleAddTimemark = () => {
    if (!newTimemark.time || !newTimemark.label) return
    
    // 시간 형식 검증
    const seconds = convertTimeToSeconds(newTimemark.time)
    if (seconds === 0 && newTimemark.time !== "00:00" && newTimemark.time !== "0:00") {
      console.error('Invalid time format:', newTimemark.time)
      return
    }
    
    const timemark: Timemark = {
      id: `tm-${Date.now()}`,
      time: newTimemark.time,
      seconds: seconds,
      label: newTimemark.label,
    }
    
    setTimemarks(prev => [...prev, timemark])
    setNewTimemark({ time: '', label: '' })
    setAddTimemarkOpen(false)
  }
  
  // 타임마크 편집 저장
  const handleSaveEditTimemark = () => {
    if (!editTimemark) return
    
    const newSeconds = convertTimeToSeconds(editTimemark.time)
    const updated = timemarks.map(tm =>
      tm.id === editTimemark.id
        ? {
            ...editTimemark,
            seconds: newSeconds,
          }
        : tm
    )
    setTimemarks(updated)
    setEditTimemark(null)
    setEditTimemarkId(null)
  }
  
  // 타임마크 삭제
  const handleDeleteTimemark = (id: string) => {
    setTimemarks(timemarks.filter(tm => tm.id !== id))
  }
  
  // 파일 선택
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files
    if (files) {
      const validFiles = Array.from(files).filter(file => {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'application/msword']
        return allowedTypes.includes(file.type) || file.name.endsWith('.docx')
      })
      setSelectedFiles(validFiles)
    }
  }
  
  // 강의자료 추가
  const handleAddResource = () => {
    selectedFiles.forEach(file => {
      const resource: Resource = {
        id: `res-${Date.now()}`,
        name: file.name,
        type: file.type.split('/')[1] || file.name.split('.').pop() || 'file',
        size: file.size,
        uploadedAt: new Date().toISOString(),
        url: '#', // 실제 구현시 URL.createObjectURL(file) 사용
      }
      setResources([...resources, resource])
    })
    setSelectedFiles([])
    setUploadResourceOpen(false)
  }
  
  // 강의자료 삭제
  const handleDeleteResource = (id: string) => {
    setResources(resources.filter(r => r.id !== id))
  }

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
          <Button size="sm" className="group p-0 h-auto bg-transparent hover:bg-transparent shadow-none text-muted-foreground hover:text-violet-600">
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            {course.name}
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">{lesson.title}</h1>
          <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
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
          <div className="aspect-video overflow-hidden rounded-xl border border-border bg-black">
            {lesson?.videoUrl ? (
              <div ref={containerRef} className="w-full h-full" />
            ) : (
              <div className="flex h-full items-center justify-center bg-foreground/5">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="text-sm text-muted-foreground">영상 정보를 찾을 수 없습니다</p>
                </div>
              </div>
            )}
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
                        handleAddTimemark()
                      }}
                    >
                      <div className="space-y-2">
                        <Label htmlFor="tm-time">시간 (MM:SS 또는 HH:MM:SS)</Label>
                        <Input
                          id="tm-time"
                          placeholder="예: 05:30"
                          value={newTimemark.time}
                          onChange={(e) => setNewTimemark({ ...newTimemark, time: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tm-label">타임마크 제목</Label>
                        <Input
                          id="tm-label"
                          placeholder="타임마크 설명"
                          value={newTimemark.label}
                          onChange={(e) => setNewTimemark({ ...newTimemark, label: e.target.value })}
                        />
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
              
              {editTimemarkId && editTimemark && (
                <Dialog open={!!editTimemarkId} onOpenChange={() => setEditTimemarkId(null)}>
                  <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                      <DialogTitle>타임마크 편집</DialogTitle>
                    </DialogHeader>
                    <form
                      className="space-y-4"
                      onSubmit={(e) => {
                        e.preventDefault()
                        handleSaveEditTimemark()
                      }}
                    >
                      <div className="space-y-2">
                        <Label htmlFor="edit-tm-time">시간</Label>
                        <Input
                          id="edit-tm-time"
                          placeholder="예: 05:30"
                          value={editTimemark.time}
                          onChange={(e) => setEditTimemark({ ...editTimemark, time: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-tm-label">타임마크 제목</Label>
                        <Input
                          id="edit-tm-label"
                          placeholder="타임마크 설명"
                          value={editTimemark.label}
                          onChange={(e) => setEditTimemark({ ...editTimemark, label: e.target.value })}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setEditTimemarkId(null)}>
                          취소
                        </Button>
                        <Button type="submit">저장</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
              
              <Card className="border-border">
                <CardContent className="p-0">
                  {timemarks.length > 0 ? (
                    <div className="divide-y divide-border">
                      {timemarks.map((mark) => (
                        <div
                          key={mark.id}
                          className="group flex items-center justify-between px-4 py-3 transition-colors hover:bg-muted/50"
                        >
                          <button
                            type="button"
                            onClick={() => handleTimemarkClick(mark.seconds)}
                            className="flex flex-1 items-center gap-3 text-left"
                          >
                            <span className="flex-shrink-0 rounded bg-primary/10 px-2 py-0.5 text-xs font-mono font-medium text-primary">
                              {mark.time}
                            </span>
                            <span className="flex-1 text-sm text-foreground">{mark.label}</span>
                          </button>
                          {isAdmin && (
                            <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-7 w-7"
                                onClick={() => {
                                  setEditTimemark(mark)
                                  setEditTimemarkId(mark.id)
                                }}
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-7 w-7 text-destructive hover:text-destructive"
                                onClick={() => handleDeleteTimemark(mark.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-sm text-muted-foreground">타임마크가 없습니다.</p>
                    </div>
                  )}
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
                      <DialogDescription>PDF, 이미지, 문서 등 강의 자료를 업로드하세요.</DialogDescription>
                    </DialogHeader>
                    <form
                      className="space-y-4"
                      onSubmit={(e) => {
                        e.preventDefault()
                        handleAddResource()
                      }}
                    >
                      <div className="space-y-3">
                        <Label htmlFor="res-file">파일 선택 (PDF, 이미지, 문서)</Label>
                        <label htmlFor="res-file" className="block">
                          <div className="cursor-pointer rounded-lg border-2 border-dashed border-border bg-muted/30 p-6 text-center transition-colors hover:border-primary/50">
                            <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                            <p className="mt-2 text-sm font-medium text-foreground">
                              파일을 선택하세요
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {selectedFiles.length > 0
                                ? `${selectedFiles.length}개 파일 선택됨`
                                : 'PDF, JPG, PNG, GIF, DOC, DOCX'}
                            </p>
                          </div>
                          <input
                            id="res-file"
                            type="file"
                            multiple
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx"
                            onChange={handleFileSelect}
                          />
                        </label>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setUploadResourceOpen(false)}>
                          취소
                        </Button>
                        <Button type="submit" disabled={selectedFiles.length === 0}>
                          업로드
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
              
              <Card className="border-border">
                <CardContent className="p-0">
                  {resources.length > 0 ? (
                    <div className="divide-y divide-border">
                      {resources.map((resource) => (
                        <div
                          key={resource.id}
                          className="group flex items-center justify-between px-4 py-3 transition-colors hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{resource.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {resource.type.toUpperCase()} • {formatFileSize(resource.size)}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="h-4 w-4" />
                            </Button>
                            {isAdmin && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive opacity-0 transition-opacity group-hover:opacity-100"
                                onClick={() => handleDeleteResource(resource.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-sm text-muted-foreground">강의 자료가 없습니다.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  )
}
