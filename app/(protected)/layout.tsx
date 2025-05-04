import type { ReactNode } from "react"
import { NavMenu, DesktopNavMenu } from "@/components/navigation/nav-menu"

interface ProtectedLayoutProps {
  children: ReactNode
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex w-64 border-r bg-background">
        <DesktopNavMenu />
      </div>
      <div className="flex flex-col flex-1">
        <header className="h-14 border-b flex items-center px-4 sticky top-0 bg-background z-10">
          <NavMenu />
          <div className="ml-auto"></div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
