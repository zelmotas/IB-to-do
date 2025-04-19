"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, LogOut } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AuthForm } from "@/components/auth/auth-form"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function AuthButton() {
  const { user, signOut } = useAuth()
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const handleSignOut = async () => {
    await signOut()
    toast({
      title: t("sign_out_success"),
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
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            {t("sign_out")}
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
          <span className="sr-only">{t("sign_in")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("sign_in")}</DialogTitle>
          <DialogDescription>{t("sign_in_to_save")}</DialogDescription>
        </DialogHeader>
        <AuthForm onSuccess={handleAuthSuccess} />
      </DialogContent>
    </Dialog>
  )
}
