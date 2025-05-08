"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FileText, Download, ArrowLeft, Calendar, BookOpen, AlertCircle } from "lucide-react"
import { pastPaperService } from "@/services/past-paper-service"
import { useLanguage } from "@/contexts/language-context"
import type { PastPaper } from "@/types/past-paper"

export default function PastPaperDetailPage() {
  const { t } = useLanguage()
  const params = useParams()
  const router = useRouter()
  const [paper, setPaper] = useState<PastPaper | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        setLoading(true)
        setError(null)

        if (!params.id) {
          throw new Error("No paper ID provided")
        }

        const paperData = await pastPaperService.getPastPaperById(params.id as string)

        if (!paperData) {
          throw new Error("Paper not found")
        }

        setPaper(paperData)
      } catch (err) {
        console.error("Error fetching paper:", err)
        setError(t("errorFetchingPaper"))
      } finally {
        setLoading(false)
      }
    }

    fetchPaper()
  }, [params.id, t])

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("back")}
      </Button>

      {loading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("error")}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : paper ? (
        <div className="space-y-6">
          <Card>
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
                    {paper.year} {paper.month && `(${paper.month})`}
                  </Badge>
                  <Badge variant="secondary">{paper.level}</Badge>
                  {paper.paperNumber && <Badge variant="secondary">Paper {paper.paperNumber}</Badge>}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {paper.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">{t("description")}</h3>
                  <p className="text-muted-foreground">{paper.description}</p>
                </div>
              )}

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">{t("preview")}</h3>
                <div className="border rounded-lg p-4 bg-muted/20 flex items-center justify-center min-h-[400px]">
                  {paper.fileUrl && paper.fileUrl.toLowerCase().endsWith(".pdf") ? (
                    <iframe
                      src={`${paper.fileUrl}#toolbar=0&navpanes=0`}
                      className="w-full h-[600px] border-0"
                      title={paper.title}
                    />
                  ) : (
                    <div className="text-center">
                      <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">{t("previewNotAvailable")}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">
                {paper.uploadedAt && (
                  <span>
                    {t("uploaded")}: {formatDate(paper.uploadedAt)}
                  </span>
                )}
              </div>
              <a href={paper.fileUrl} target="_blank" rel="noopener noreferrer" download>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  {t("download")}
                </Button>
              </a>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("notFound")}</AlertTitle>
          <AlertDescription>{t("pastPaperNotFound")}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
