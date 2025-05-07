"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { pastPaperService } from "@/services/past-paper-service"
import type { PastPaper, PastPaperFilters } from "@/types/past-paper"
import { PastPaperCard } from "@/components/past-papers/past-paper-card"
import { PastPaperFilters as PastPaperFiltersComponent } from "@/components/past-papers/past-paper-filters"
import { useLanguage } from "@/contexts/language-context"

export default function SearchPage() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const [papers, setPapers] = useState<PastPaper[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<PastPaperFilters>({
    subject: searchParams.get("subject") || undefined,
    year: searchParams.get("year") ? Number.parseInt(searchParams.get("year") as string) : undefined,
  })

  useEffect(() => {
    const loadPapers = async () => {
      setLoading(true)
      const fetchedPapers = await pastPaperService.getPastPapers({
        ...filters,
        searchQuery: searchQuery.trim() || undefined,
      })
      setPapers(fetchedPapers)
      setLoading(false)
    }

    loadPapers()
  }, [filters, searchQuery])

  const handleFilterChange = (newFilters: PastPaperFilters) => {
    setFilters(newFilters)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t("searchPastPapers")}</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4">
          <PastPaperFiltersComponent onFilterChange={handleFilterChange} initialFilters={filters} />
        </div>

        <div className="w-full md:w-3/4">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder={t("searchPastPapersPlaceholder")}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p>{t("loading")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-muted-foreground">
                  {papers.length} {papers.length === 1 ? t("paper") : t("papers")} {t("found")}
                </p>
              </div>

              {papers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {papers.map((paper) => (
                    <PastPaperCard key={paper.id} paper={paper} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">{t("noPastPapersFound")}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
