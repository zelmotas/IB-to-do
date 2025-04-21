"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
})

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)

      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/update-password`,
      })

      if (error) {
        throw error
      }

      // Clear form after successful submission
      form.reset()
      setIsSubmitted(true)

      // Show success toast
      toast({
        title: "Password reset email sent",
        description: "Please check your email for the password reset link.",
      })
    } catch (error: any) {
      toast({
        title: "Password reset failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 p-4">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Reset Password</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>
      {isSubmitted ? (
        <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-900/20">
          <p className="text-green-800 dark:text-green-200">Password reset email sent. Please check your inbox.</p>
          <Link href="/login" className="mt-4 inline-block underline">
            Back to login
          </Link>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your.email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </Form>
      )}
      <div className="text-center text-sm">
        Remember your password?{" "}
        <Link href="/login" className="underline">
          Login
        </Link>
      </div>
    </div>
  )
}
