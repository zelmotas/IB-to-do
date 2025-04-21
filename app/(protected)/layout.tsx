import type React from "react"
import { AuthWrapper } from "@/components/auth/auth-wrapper"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthWrapper>{children}</AuthWrapper>
}
