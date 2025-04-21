import { UpdatePasswordForm } from "@/components/auth/update-password-form"

export const metadata = {
  title: "Update Password",
  description: "Update your password",
}

export default function UpdatePasswordPage() {
  return (
    <div className="container flex h-screen items-center justify-center">
      <UpdatePasswordForm />
    </div>
  )
}
