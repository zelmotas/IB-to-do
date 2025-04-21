"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, ArrowLeft, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"

interface PasswordResetProps {
  onBack: () => void
}

export function PasswordReset({ onBack }: PasswordResetProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { t } = useLanguage()
  const { toast } = useToast()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real implementation, this would be an API call to your auth service
      // For demo purposes, we'll just simulate success
      setSuccess(true)
      toast({
        title: t("Reset email sent"),
        description: t("An email will be sent with a link to reset your password"),
      })
    } catch (err) {
      setError(t("Reset error"))
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 p-4">
      <Button variant="ghost" size="sm" className="mb-2" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t("Back to login")}
      </Button>

      <h2 className="text-xl font-semibold">{t("Reset password")}</h2>
      <p className="text-sm text-muted-foreground">{t("An email will be sent with a link to reset your password")}</p>

      {success ? (
        <div className="py-4">
          <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900">
            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-600 dark:text-green-400">
              {t("reset_email_sent_description")}
            </AlertDescription>
          </Alert>
          <Button className="w-full mt-4" onClick={onBack}>
            {t("back_to_login")}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email">{t("email")}</Label>
            <Input
              id="reset-email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t("sending") : t("send_reset_link")}
          </Button>
        </form>
      )}
    </div>
  )
}
