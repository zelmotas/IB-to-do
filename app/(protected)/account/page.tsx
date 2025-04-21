import { AccountForm } from "@/components/auth/account-form"

export const metadata = {
  title: "Account",
  description: "Manage your account settings",
}

export default function AccountPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-md">
        <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
        <AccountForm />
      </div>
    </div>
  )
}
