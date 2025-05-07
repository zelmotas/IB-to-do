import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, Download, FileText, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { pastPaperService } from "@/services/past-paper-service"

interface PastPaperPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PastPaperPageProps): Promise<Metadata> {
  const paper = await pastPaperService.getPastPaperById(params.id)

  if (!paper) {
    return {
      title: "Past Paper Not Found | IB Class Tracker",
    }
  }

  return {
    title: `${paper.title} | IB Class Tracker`,
    description: paper.description || `${paper.subject} past paper from ${paper.year}`,
  }
}

export default async function PastPaperPage({ params }: PastPaperPageProps) {
  const paper = await pastPaperService.getPastPaperById(params.id)

  if (!paper) {
    notFound()
  }

  const formatDate = () => {
    let dateStr = `${paper.year}`
    if (paper.month) {
      dateStr = `${paper.month} ${paper.year}`
    }
    return dateStr
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button asChild variant="ghost" size="sm" className="mr-2">
          <Link href="/past-papers">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Past Papers
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl">{paper.title}</CardTitle>
            <CardDescription>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {paper.subject}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate()}
                </Badge>
                <Badge variant="secondary">{paper.level}</Badge>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paper.description && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">{paper.description}</p>
                </div>
              )}

              <div>
                <h3 className="text-lg font-medium mb-2">Details</h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <dt className="text-sm text-muted-foreground">Subject</dt>
                    <dd>{paper.subject}</dd>
                  </div>
                  {paper.subject_code && (
                    <div>
                      <dt className="text-sm text-muted-foreground">Subject Code</dt>
                      <dd>{paper.subject_code}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm text-muted-foreground">Year</dt>
                    <dd>{paper.year}</dd>
                  </div>
                  {paper.month && (
                    <div>
                      <dt className="text-sm text-muted-foreground">Month</dt>
                      <dd>{paper.month}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm text-muted-foreground">Paper Number</dt>
                    <dd>{paper.paper_number}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Level</dt>
                    <dd>{paper.level}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Language</dt>
                    <dd>{paper.language}</dd>
                  </div>
                </dl>
              </div>

              {paper.tags && paper.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {paper.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Download</CardTitle>
            <CardDescription>Download this past paper</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center p-6 border rounded-lg">
              <FileText className="h-16 w-16 text-muted-foreground" />
            </div>
            <Button asChild className="w-full">
              <a href={paper.file_url} target="_blank" rel="noopener noreferrer" download>
                <Download className="mr-2 h-4 w-4" />
                Download Past Paper
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
