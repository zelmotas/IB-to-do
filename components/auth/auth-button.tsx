"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { LoginForm } from "@/components/auth/login-form"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export function AuthButton() {
  const { user, signOut } = useAuth()
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const handleSignOut = async () => {
    await signOut()
    toast({
      title: t("signOutSuccess"),
      duration: 3000,
    })
  }

  const handleAuthSuccess = () => {
    setOpen(false)
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="border-2 transition-all duration-200 hover:scale-110">
            <User className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">{user.email}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled className="font-medium">
            {user.email}
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/account">
              <Settings className="mr-2 h-4 w-4" />
              {t("Account settings")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            {t("Sign out")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="border-2 transition-all duration-200 hover:scale-110">
          <User className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t("Sign in")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("Sign in")}</DialogTitle>
          <DialogDescription>{t("Sign in to save information")}</DialogDescription>
        </DialogHeader>
        <LoginForm />
      </DialogContent>
    </Dialog>
  )
}
