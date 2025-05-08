"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Calendar, BookOpen } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { PastPaper } from "@/types/past-paper"

interface PastPaperCardProps {
  paper: PastPaper
}

export function PastPaperCard({ paper }: PastPaperCardProps) {
  const { t } = useLanguage()

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
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg line-clamp-2">{paper.title}</CardTitle>
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
      </CardHeader>
      <CardContent className="flex-grow">
        {paper.description && <p className="text-sm text-muted-foreground line-clamp-3">{paper.description}</p>}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-xs text-muted-foreground">{paper.uploadedAt && formatDate(paper.uploadedAt)}</div>
        <div className="flex gap-2">
          <Link href={`/past-papers/${paper.id}`} passHref>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-1" />
              {t("view")}
            </Button>
          </Link>
          <a href={paper.fileUrl} target="_blank" rel="noopener noreferrer" download>
            <Button size="sm">
              <Download className="h-4 w-4 mr-1" />
              {t("download")}
            </Button>
          </a>
        </div>
      </CardFooter>
    </Card>
  )
}
