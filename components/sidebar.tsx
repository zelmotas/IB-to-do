"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  Home,
  Layers,
  MessageSquare,
  Settings,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { t } = useLanguage()
  const { user } = useAuth()

  if (!user) return null

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path)

  const navItems = [
    { href: "/dashboard", icon: Home, label: t("dashboard") },
    { href: "/calendar", icon: Calendar, label: t("calendar") },
    { href: "/subjects", icon: BookOpen, label: t("subjects") },
    { href: "/past-papers", icon: FileText, label: t("past Papers") },
    { href: "/chat", icon: MessageSquare, label: t("chat") },
    { href: "/account", icon: User, label: t("account") },
    { href: "/settings", icon: Settings, label: t("settings") },
  ]

  return (
    <aside
      className={cn(
        "bg-sidebar text-sidebar-foreground relative h-screen transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between p-4 h-16">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Layers className="h-6 w-6" />
            <span className="font-bold">IB Tracker</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("rounded-full hover:bg-sidebar-muted/20", collapsed && "mx-auto")}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn("sidebar-item", isActive(item.href) && "active", collapsed && "justify-center px-2")}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-muted/20">
        {collapsed ? (
          <Avatar className="mx-auto">
            <AvatarFallback>{user.email?.[0].toUpperCase() || "U"}</AvatarFallback>
            <AvatarImage src={user.avatar_url || ""} />
          </Avatar>
        ) : (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{user.email?.[0].toUpperCase() || "U"}</AvatarFallback>
              <AvatarImage src={user.avatar_url || ""} />
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.email}</p>
              <p className="text-xs text-sidebar-foreground/70 truncate">{t("student")}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
