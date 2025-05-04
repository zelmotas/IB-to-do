import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { UploadPastPaper } from "@/components/past-papers/upload-past-paper"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Upload Past Paper | IB Class Tracker",
  description: "Upload an IB past paper",
}

export default function UploadPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button asChild variant="ghost" size="sm" className="mr-2">
          <Link href="/past-papers">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Upload Past Paper</h1>
      </div>

      <UploadPastPaper />
    </div>
  )
}
