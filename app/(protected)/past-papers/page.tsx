import type { Metadata } from "next"
import { Suspense } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, BookOpen, Calendar } from "lucide-react"
import { pastPaperService } from "@/services/past-paper-service"
import { PastPaperCard } from "@/components/past-papers/past-paper-card"
import { PastPaperFilters } from "@/components/past-papers/past-paper-filters"

export const metadata: Metadata = {
  title: "Past Papers | IB Class Tracker",
  description: "Browse and search IB past papers",
}

export default async function PastPapersPage() {
  const recentPapers = await pastPaperService.getRecentPastPapers(8)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Past Papers</h1>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/past-papers/search">
              <Search className="mr-2 h-4 w-4" />
              Search Papers
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Papers</TabsTrigger>
          <TabsTrigger value="browse">Browse</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <Suspense fallback={<div>Loading recent papers...</div>}>
              {recentPapers.map((paper) => (
                <PastPaperCard key={paper.id} paper={paper} />
              ))}
            </Suspense>
          </div>
        </TabsContent>

        <TabsContent value="browse" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Browse by Subject
                </CardTitle>
                <CardDescription>Find past papers organized by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/past-papers/subjects">View Subjects</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Browse by Year
                </CardTitle>
                <CardDescription>Find past papers organized by examination year</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/past-papers/years">View Years</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <PastPaperFilters />
    </div>
  )
}
