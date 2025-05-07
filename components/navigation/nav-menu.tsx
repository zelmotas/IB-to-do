"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, FileText, Home, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"

export function NavMenu() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()
  const { user } = useAuth()

  const isActive = (path: string) => pathname === path

  if (!user) return null

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">{t("toggleMenu")}</span>
        </Button>
      </SheetTrigger>
      <div className="hidden md:block md:fixed md:top-4 md:left-4 md:z-50">
        <nav className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-4 min-w-52">
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  isActive("/dashboard") && "bg-accent text-accent-foreground",
                )}
              >
                <Home className="h-4 w-4" />
                {t("home")}
              </Link>
            </li>
            <li>
              <Link
                href="/calendar"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  isActive("/calendar") && "bg-accent text-accent-foreground",
                )}
              >
                <Calendar className="h-4 w-4" />
                {t("calendar")}
              </Link>
            </li>
            <li>
              <Link
                href="/past-papers"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  isActive("/past-papers") && "bg-accent text-accent-foreground",
                )}
              >
                <FileText className="h-4 w-4" />
                {t("pastPapers")}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="text-left">IB Class Tracker</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid gap-1 px-2">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  isActive("/dashboard") && "bg-accent text-accent-foreground",
                )}
              >
                <Home className="h-4 w-4" />
                {t("dashboard")}
              </Link>
              <Link
                href="/calendar"
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  isActive("/calendar") && "bg-accent text-accent-foreground",
                )}
              >
                <Calendar className="h-4 w-4" />
                {t("calendar")}
              </Link>
              <Link
                href="/past-papers"
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  isActive("/past-papers") && "bg-accent text-accent-foreground",
                )}
              >
                <FileText className="h-4 w-4" />
                {t("pastPapers")}
              </Link>
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Add the DesktopNavMenu component
export function DesktopNavMenu() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const { user } = useAuth()

  const isActive = (path: string) => pathname === path

  if (!user) return null

  return (
    <div className="hidden md:flex h-full">
      <nav className="grid gap-1 px-2 py-2">
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            isActive("/dashboard") && "bg-accent text-accent-foreground",
          )}
        >
          <Home className="h-4 w-4" />
          {t("dashboard")}
        </Link>
        <Link
          href="/calendar"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            isActive("/calendar") && "bg-accent text-accent-foreground",
          )}
        >
          <Calendar className="h-4 w-4" />
          {t("calendar")}
        </Link>
        <Link
          href="/past-papers"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            isActive("/past-papers") && "bg-accent text-accent-foreground",
          )}
        >
          <FileText className="h-4 w-4" />
          {t("pastPapers")}
        </Link>
      </nav>
    </div>
  )
}
