import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Search, Upload, Book, Calendar } from "lucide-react"
import { pastPaperService } from "@/services/past-paper-service"
import { PastPaperCard } from "@/components/past-papers/past-paper-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Past Papers | IB Class Tracker",
  description: "Browse and download IB past papers",
}

async function PastPapersContent() {
  const papers = await pastPaperService.getPastPapers()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {papers.length > 0 ? (
          papers.slice(0, 6).map((paper) => <PastPaperCard key={paper.id} paper={paper} />)
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No past papers found.</p>
            <Button asChild className="mt-4">
              <Link href="/past-papers/upload">Upload a Past Paper</Link>
            </Button>
          </div>
        )}
      </div>

      {papers.length > 6 && (
        <div className="flex justify-center">
          <Button asChild variant="outline">
            <Link href="/past-papers/search">View All Past Papers</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

export default function PastPapersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Past Papers</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/past-papers/search">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/past-papers/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Browse by Subject</CardTitle>
            <CardDescription>Find past papers by subject</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/past-papers/subjects">
                <Book className="mr-2 h-4 w-4" />
                Browse Subjects
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Browse by Year</CardTitle>
            <CardDescription>Find past papers by examination year</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/past-papers/years">
                <Calendar className="mr-2 h-4 w-4" />
                Browse Years
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Advanced Search</CardTitle>
            <CardDescription>Search with filters</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/past-papers/search">
                <Search className="mr-2 h-4 w-4" />
                Advanced Search
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Past Papers</h2>
        <Suspense fallback={<div>Loading recent papers...</div>}>
          <PastPapersContent />
        </Suspense>
      </div>
    </div>
  )
}
