import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { pastPaperService } from "@/services/past-paper-service"

export const dynamic = "force-dynamic"

export default async function PastPaperYearsPage() {
  let years: number[] = []

  try {
    years = await pastPaperService.getYears()
  } catch (error) {
    console.error("Error fetching years:", error)
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Browse Past Papers by Year</h1>

      {years.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500">No years found. Please check back later or upload some past papers.</p>
          <Link href="/past-papers/upload" className="text-blue-500 hover:underline mt-4 inline-block">
            Upload Past Papers
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {years.map((year) => (
            <Link key={year} href={`/past-papers/search?year=${year}`}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-center text-2xl">{year}</CardTitle>
                  <CardDescription className="text-center">View all papers from {year}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
