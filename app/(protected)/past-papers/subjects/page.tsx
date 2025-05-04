import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { pastPaperService } from "@/services/past-paper-service"

export const dynamic = "force-dynamic"

export default async function PastPaperSubjectsPage() {
  let subjects: string[] = []

  try {
    subjects = await pastPaperService.getSubjects()
  } catch (error) {
    console.error("Error fetching subjects:", error)
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Browse Past Papers by Subject</h1>

      {subjects.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500">
            No subjects found. Please check back later or upload some past papers.
          </p>
          <Link href="/past-papers/upload" className="text-blue-500 hover:underline mt-4 inline-block">
            Upload Past Papers
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Link key={subject} href={`/past-papers/search?subject=${encodeURIComponent(subject)}`}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{subject}</CardTitle>
                  <CardDescription>View all past papers for this subject</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
