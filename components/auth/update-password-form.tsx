"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

const formSchema = z
  .object({
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export function UpdatePasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    // Check if the user is authenticated via the reset password flow
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error("Error checking session:", error)
        toast({
          title: "Authentication error",
          description: "Please use the reset link from your email again.",
          variant: "destructive",
        })
        router.push("/reset-password")
        return
      }

      if (data.session) {
        setIsAuthenticated(true)
      } else {
        toast({
          title: "Session expired",
          description: "Please request a new password reset link.",
          variant: "destructive",
        })
        router.push("/reset-password")
      }
    }

    checkSession()
  }, [router, toast, supabase.auth])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)

      const { error } = await supabase.auth.updateUser({
        password: values.password,
      })

      if (error) {
        throw error
      }

      // Clear form after successful submission
      form.reset()

      // Show success toast
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      })

      // Redirect to login page
      router.push("/login")
    } catch (error: any) {
      toast({
        title: "Password update failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
        <span className="ml-2">Verifying your session...</span>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md space-y-6 p-4">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Update Password</h1>
        <p className="text-gray-500 dark:text-gray-400">Enter your new password</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
