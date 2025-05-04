import Link from "next/link"
import { Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { pastPaperService } from "@/services/past-paper-service"

export default async function YearsPage() {
  const years = await pastPaperService.getYears()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Browse by Year</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {years.length > 0 ? (
          years.map((year) => (
            <Link key={year} href={`/past-papers/search?year=${year}`}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    {year}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">View all past papers from {year}</p>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No years found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
