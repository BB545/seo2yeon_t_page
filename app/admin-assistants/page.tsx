"use client"

import React, { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Mail,
  Check,
  X,
  Trash2,
  CheckCircle2,
  Clock,
  Users,
  ArrowLeft,
} from "lucide-react"
import { assistantInvites, assistantSignups, assistants } from "@/lib/mock-data"
import { useRouter } from "next/navigation"

export default function AdminAssistantsPage() {
  const router = useRouter()
  const [invites, setInvites] = useState(assistantInvites)
  const [signups, setSignups] = useState(assistantSignups)
  const [assistantsList, setAssistantsList] = useState(assistants)

  const handleAcceptSignup = (id: string) => {
    const signup = signups.find((s) => s.id === id)
    if (!signup) return

    setSignups(signups.filter((s) => s.id !== id))
    setAssistantsList([
      ...assistantsList,
      {
        id: `asst-${Date.now()}`,
        name: signup.name,
        email: signup.email,
        assignedAt: new Date().toISOString().split("T")[0],
      },
    ])
  }

  const handleRejectSignup = (id: string) => {
    setSignups(signups.filter((s) => s.id !== id))
  }

  const handleRemoveAssistant = (id: string) => {
    setAssistantsList(assistantsList.filter((a) => a.id !== id))
  }

  return (
    <AppLayout>
      <div className="mb-8">
        <Button
          onClick={() => router.back()}
          size="sm"
          className="group p-0 h-auto bg-transparent hover:bg-transparent shadow-none text-muted-foreground hover:text-violet-600"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          뒤로가기
        </Button>
        <h1 className="text-2xl font-bold text-foreground mt-4">조교 목록</h1>
        <p className="mt-1 text-muted-foreground">
          조교 가입 승인, 권한 관리를 할 수 있습니다.
        </p>
      </div>

      <div className="space-y-6">
        {/* Invited Assistants */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-base font-semibold">조교 초대 목록</CardTitle>
              <Badge variant="secondary" className="ml-auto">
                {invites.length}명
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {invites.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        이름
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        이메일
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        초대 횟수
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        마지막 초대 날짜
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invites.map((invite) => (
                      <tr
                        key={invite.id}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-foreground">{invite.name}</td>
                        <td className="py-3 px-4 text-foreground">{invite.email}</td>
                        <td className="py-3 px-4 text-foreground">{invite.inviteCount}회</td>
                        <td className="py-3 px-4 text-foreground">
                          {invite.lastInvitedAt}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex items-center justify-center h-20 text-muted-foreground">
                초대한 조교가 없습니다.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Signups */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <CardTitle className="text-base font-semibold">
                가입한 조교 목록 (승인 대기)
              </CardTitle>
              <Badge variant="secondary" className="ml-auto">
                {signups.length}명
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {signups.length > 0 ? (
              <div className="space-y-3">
                {signups.map((signup) => (
                  <div
                    key={signup.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{signup.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {signup.email} • {signup.signedUpAt}에 가입
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleAcceptSignup(signup.id)}
                      >
                        <Check className="h-3.5 w-3.5 mr-1" />
                        수락
                      </Button>
                      <Button
                        onClick={() => handleRejectSignup(signup.id)}
                        variant="destructive"
                        size="sm"
                      >
                        <X className="h-3.5 w-3.5 mr-1" />
                        거절
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-20 text-muted-foreground">
                승인 대기 중인 조교가 없습니다.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Assistants */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <CardTitle className="text-base font-semibold">
                현재 조교 목록
              </CardTitle>
              <Badge variant="secondary" className="ml-auto">
                {assistantsList.length}명
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {assistantsList.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        이름
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        이메일
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        권한 부여 날짜
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {assistantsList.map((assistant) => (
                      <tr
                        key={assistant.id}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-foreground">
                          {assistant.name}
                        </td>
                        <td className="py-3 px-4 text-foreground">
                          {assistant.email}
                        </td>
                        <td className="py-3 px-4 text-foreground">
                          {assistant.assignedAt}
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            onClick={() => handleRemoveAssistant(assistant.id)}
                            variant="destructive"
                            size="sm"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            권한 삭제
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex items-center justify-center h-20 text-muted-foreground">
                권한이 부여된 조교가 없습니다.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
