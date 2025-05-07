import type { Metadata } from "next"
import { Suspense } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PastPaperFilters } from "@/components/past-papers/past-paper-filters"

export const metadata: Metadata = {
  title: "Search Past Papers | IB Class Tracker",
  description: "Search for IB past papers",
}

export default function SearchPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button asChild variant="ghost" size="sm" className="mr-2">
          <Link href="/past-papers">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Past Papers
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Search Past Papers</h1>
      </div>

      <Suspense fallback={<div>Loading search...</div>}>
        <PastPaperFilters />
      </Suspense>
    </div>
  )
}
