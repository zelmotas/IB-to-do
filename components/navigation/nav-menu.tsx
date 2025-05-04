"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Book, Calendar, ChevronDown, FileText, Home, Menu, Search, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"

export function NavMenu() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [pastPapersOpen, setPastPapersOpen] = useState(pathname?.startsWith("/past-papers") || false)
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
                href="/chat"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  isActive("/chat") && "bg-accent text-accent-foreground",
                )}
              >
                <Calendar className="h-4 w-4" />
                {t("chat")}
              </Link>
            </li>
            <li>
              <Collapsible open={pastPapersOpen} onOpenChange={setPastPapersOpen} className="w-full">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      pathname?.startsWith("/past-papers") && "bg-accent text-accent-foreground",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4" />
                      {t("pastPapers")}
                    </div>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", pastPapersOpen && "rotate-180")} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-10 pr-2">
                  <div className="grid gap-1 py-1">
                    <Link
                      href="/past-papers"
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        isActive("/past-papers") && "bg-accent text-accent-foreground",
                      )}
                    >
                      <FileText className="h-4 w-4" />
                      {t("allPapers")}
                    </Link>
                    <Link
                      href="/past-papers/subjects"
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        isActive("/past-papers/subjects") && "bg-accent text-accent-foreground",
                      )}
                    >
                      <Book className="h-4 w-4" />
                      {t("browseBySubject")}
                    </Link>
                    <Link
                      href="/past-papers/years"
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        isActive("/past-papers/years") && "bg-accent text-accent-foreground",
                      )}
                    >
                      <Calendar className="h-4 w-4" />
                      {t("browseByYear")}
                    </Link>
                    <Link
                      href="/past-papers/search"
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        isActive("/past-papers/search") && "bg-accent text-accent-foreground",
                      )}
                    >
                      <Search className="h-4 w-4" />
                      {t("search")}
                    </Link>
                    <Link
                      href="/past-papers/upload"
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        isActive("/past-papers/upload") && "bg-accent text-accent-foreground",
                      )}
                    >
                      <Upload className="h-4 w-4" />
                      {t("upload")}
                    </Link>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </li>
            <li>
              <Link
                href="/account"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  isActive("/account") && "bg-accent text-accent-foreground",
                )}
              >
                <Home className="h-4 w-4" />
                {t("account")}
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
                href="/chat"
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  isActive("/chat") && "bg-accent text-accent-foreground",
                )}
              >
                <Calendar className="h-4 w-4" />
                {t("chat")}
              </Link>

              <Collapsible open={pastPapersOpen} onOpenChange={setPastPapersOpen} className="w-full">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      pathname?.startsWith("/past-papers") && "bg-accent text-accent-foreground",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4" />
                      {t("pastPapers")}
                    </div>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", pastPapersOpen && "rotate-180")} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-10 pr-2">
                  <div className="grid gap-1 py-1">
                    <Link
                      href="/past-papers"
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        isActive("/past-papers") && "bg-accent text-accent-foreground",
                      )}
                    >
                      <FileText className="h-4 w-4" />
                      {t("allPapers")}
                    </Link>
                    <Link
                      href="/past-papers/subjects"
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        isActive("/past-papers/subjects") && "bg-accent text-accent-foreground",
                      )}
                    >
                      <Book className="h-4 w-4" />
                      {t("browseBySubject")}
                    </Link>
                    <Link
                      href="/past-papers/years"
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        isActive("/past-papers/years") && "bg-accent text-accent-foreground",
                      )}
                    >
                      <Calendar className="h-4 w-4" />
                      {t("browseByYear")}
                    </Link>
                    <Link
                      href="/past-papers/search"
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        isActive("/past-papers/search") && "bg-accent text-accent-foreground",
                      )}
                    >
                      <Search className="h-4 w-4" />
                      {t("search")}
                    </Link>
                    <Link
                      href="/past-papers/upload"
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        isActive("/past-papers/upload") && "bg-accent text-accent-foreground",
                      )}
                    >
                      <Upload className="h-4 w-4" />
                      {t("upload")}
                    </Link>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  isActive("/account") && "bg-accent text-accent-foreground",
                )}
              >
                <Home className="h-4 w-4" />
                {t("account")}
              </Link>
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function DesktopNavMenu() {
  const pathname = usePathname()
  const [pastPapersOpen, setPastPapersOpen] = useState(pathname?.startsWith("/past-papers") || false)
  const { t } = useLanguage()

  const isActive = (path: string) => pathname === path

  return (
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
            {t("dashboard")}
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
            href="/chat"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              isActive("/chat") && "bg-accent text-accent-foreground",
            )}
          >
            <Calendar className="h-4 w-4" />
            {t("chat")}
          </Link>
        </li>
        <li>
          <Collapsible open={pastPapersOpen} onOpenChange={setPastPapersOpen} className="w-full">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname?.startsWith("/past-papers") && "bg-accent text-accent-foreground",
                )}
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4" />
                  {t("pastPapers")}
                </div>
                <ChevronDown className={cn("h-4 w-4 transition-transform", pastPapersOpen && "rotate-180")} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-10 pr-2">
              <div className="grid gap-1 py-1">
                <Link
                  href="/past-papers"
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    isActive("/past-papers") && "bg-accent text-accent-foreground",
                  )}
                >
                  <FileText className="h-4 w-4" />
                  {t("allPapers")}
                </Link>
                <Link
                  href="/past-papers/subjects"
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    isActive("/past-papers/subjects") && "bg-accent text-accent-foreground",
                  )}
                >
                  <Book className="h-4 w-4" />
                  {t("browseBySubject")}
                </Link>
                <Link
                  href="/past-papers/years"
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    isActive("/past-papers/years") && "bg-accent text-accent-foreground",
                  )}
                >
                  <Calendar className="h-4 w-4" />
                  {t("browseByYear")}
                </Link>
                <Link
                  href="/past-papers/search"
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    isActive("/past-papers/search") && "bg-accent text-accent-foreground",
                  )}
                >
                  <Search className="h-4 w-4" />
                  {t("search")}
                </Link>
                <Link
                  href="/past-papers/upload"
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    isActive("/past-papers/upload") && "bg-accent text-accent-foreground",
                  )}
                >
                  <Upload className="h-4 w-4" />
                  {t("upload")}
                </Link>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </li>
        <li>
          <Link
            href="/account"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              isActive("/account") && "bg-accent text-accent-foreground",
            )}
          >
            <Home className="h-4 w-4" />
            {t("account")}
          </Link>
        </li>
      </ul>
    </nav>
  )
}
