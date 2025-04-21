import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export const metadata = {
  title: "Reset Password",
  description: "Reset your password",
}

export default function ResetPasswordPage() {
  return (
    <div className="container flex h-screen items-center justify-center">
      <ResetPasswordForm />
    </div>
  )
}
