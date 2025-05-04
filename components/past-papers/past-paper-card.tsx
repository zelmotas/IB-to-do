"use client"

import Link from "next/link"
import { FileText } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { PastPaper } from "@/types/past-paper"
import { useLanguage } from "@/contexts/language-context"

interface PastPaperCardProps {
  paper: PastPaper
}

export function PastPaperCard({ paper }: PastPaperCardProps) {
  const { t } = useLanguage()

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2">{paper.title}</CardTitle>
          <Badge variant={paper.level === "HL" ? "destructive" : "default"}>{paper.level}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <span className="text-muted-foreground mr-2">{t("subject")}:</span>
            <span>{paper.subject}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-muted-foreground mr-2">{t("year")}:</span>
            <span>{paper.year}</span>
            {paper.month && <span className="ml-1">({paper.month})</span>}
          </div>
          <div className="flex items-center text-sm">
            <span className="text-muted-foreground mr-2">{t("paper")}:</span>
            <span>{paper.paperNumber}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/past-papers/${paper.id}`}>
            <FileText className="mr-2 h-4 w-4" />
            {t("view")}
          </Link>
        </Button>
        <Button variant="default" size="sm" asChild>
          <a href={paper.fileUrl} download target="_blank" rel="noopener noreferrer">
            {t("download")}
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
