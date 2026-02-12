"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  MessageSquareMore,
  Video,
  GraduationCap,
  ClipboardList,
  LogOut,
  Menu,
  X,
  BookOpen,
  Shield,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image"

const navItems = [
  { href: "/dashboard", label: "대시보드", icon: LayoutDashboard },
  { href: "/qna", label: "문의/질의응답", icon: MessageSquareMore },
  { href: "/lectures", label: "복습 영상", icon: Video },
  { href: "/consultation", label: "학습 상담", icon: GraduationCap },
  { href: "/assignments", label: "과제 관리", icon: ClipboardList },
]

export function SidebarNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAdmin, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between border-b bg-white px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2">
          <Image
            src="/images/logo/logo_s2y.png"
            alt="Logo"
            width={100}
            height={30}
          />
        </div>

        <div className="w-8" />
      </div>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-foreground/20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card transition-transform duration-200 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 border-b border-border px-6 py-5">
          <div className="flex h-8 w-8 items-center justify-center">
            <Image
              src="/images/logo/logo_symbol_s2y.png"
              alt="Logo"
              width={30}
              height={30}
              className="h-8 w-10 text-sidebar-primary"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">서이연 수학</h1>
            <p className="text-xs text-muted-foreground">학생 관리 사이트</p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden top-2 right-2 absolute"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-violet-500 text-primary-foreground"
                    : "text-muted-foreground hover:bg-violet-100 hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User area */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold",
                isAdmin
                  ? "bg-rose-500/10 text-rose-600"
                  : "bg-violet-500/10 text-violet-600"
              )}
            >
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
                {isAdmin && (
                  <Badge className="gap-0.5 bg-rose-500/10 px-1.5 py-0 text-[10px] text-rose-600 hover:bg-rose-500/10">
                    <Shield className="h-2.5 w-2.5" />
                    관리자
                  </Badge>
                )}
              </div>
              <p className="truncate text-xs text-muted-foreground">
                {isAdmin ? "선생님" : user.grade}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-2 flex items-center gap-2 rounded-lg px-0 py-2 text-sm text-muted-foreground transition-colors hover:text-violet-600"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
