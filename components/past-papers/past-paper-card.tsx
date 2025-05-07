"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, Calendar, BookOpen } from "lucide-react"
import type { PastPaper } from "@/types/past-paper"
import { useLanguage } from "@/contexts/language-context"

interface PastPaperCardProps {
  paper: PastPaper
}

export function PastPaperCard({ paper }: PastPaperCardProps) {
  const { t } = useLanguage()

  const formatDate = () => {
    let dateStr = `${paper.year}`
    if (paper.month) {
      dateStr = `${paper.month} ${paper.year}`
    }
    return dateStr
  }

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg line-clamp-2">{paper.title}</CardTitle>
        </div>
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
      </CardHeader>
      <CardContent className="flex-grow">
        {paper.description && <p className="text-sm text-muted-foreground line-clamp-3 mb-2">{paper.description}</p>}
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline">
            {t("paper")} {paper.paper_number}
          </Badge>
          <Badge variant="outline">{paper.language}</Badge>
          {paper.tags?.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/past-papers/${paper.id}`}>
            <FileText className="mr-2 h-4 w-4" />
            {t("details")}
          </Link>
        </Button>
        <Button variant="default" size="sm" asChild>
          <a href={paper.file_url} target="_blank" rel="noopener noreferrer" download>
            <Download className="mr-2 h-4 w-4" />
            {t("download")}
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
