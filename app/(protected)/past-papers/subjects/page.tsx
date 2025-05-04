import Link from "next/link"
import { Book } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { pastPaperService } from "@/services/past-paper-service"

export default async function SubjectsPage() {
  const subjects = await pastPaperService.getSubjects()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Browse by Subject</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.length > 0 ? (
          subjects.map((subject) => (
            <Link key={subject} href={`/past-papers/search?subject=${encodeURIComponent(subject)}`}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Book className="mr-2 h-4 w-4" />
                    {subject}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">View all past papers for {subject}</p>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No subjects found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
