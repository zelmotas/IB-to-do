import { Suspense } from "react"
import Link from "next/link"
import { ArrowLeft, Download } from "lucide-react"
import { pastPaperService } from "@/services/past-paper-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PastPaperPageProps {
  params: {
    id: string
  }
}

async function PastPaperContent({ id }: { id: string }) {
  const paper = await pastPaperService.getPastPaperById(id)

  if (!paper) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Past paper not found.</p>
        <Button asChild className="mt-4">
          <Link href="/past-papers">Back to Past Papers</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{paper.title}</CardTitle>
          <CardDescription>
            Paper {paper.paperNumber} - {paper.month} {paper.year}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{paper.subject}</Badge>
            <Badge variant="outline">{paper.year}</Badge>
            <Badge variant="outline">{paper.month}</Badge>
            <Badge variant="outline">{paper.level}</Badge>
            <Badge variant="outline">{paper.language}</Badge>
          </div>

          {paper.description && (
            <div>
              <h3 className="text-sm font-medium mb-1">Description</h3>
              <p className="text-sm text-muted-foreground">{paper.description}</p>
            </div>
          )}

          <div className="pt-4">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <a href={paper.fileUrl} download target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button asChild variant="outline">
          <Link href="/past-papers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Past Papers
          </Link>
        </Button>

        <Button asChild variant="outline">
          <Link href={`/past-papers/search?subject=${encodeURIComponent(paper.subject)}`}>
            View More {paper.subject} Papers
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default function PastPaperPage({ params }: PastPaperPageProps) {
  return (
    <Suspense fallback={<div>Loading past paper...</div>}>
      <PastPaperContent id={params.id} />
    </Suspense>
  )
}
