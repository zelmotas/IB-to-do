"use client"

import { useState, useEffect, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { FileText, Upload, Search, BookOpen, Calendar } from "lucide-react"
import { UploadPastPaper } from "@/components/past-papers/upload-past-paper"
import { PastPaperFilters } from "@/components/past-papers/past-paper-filters"
import { PastPaperCard } from "@/components/past-papers/past-paper-card"
import { pastPaperService } from "@/services/past-paper-service"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import type { PastPaper, PastPaperFilters as PastPaperFiltersType } from "@/types/past-paper"
import { debugLog } from "@/lib/debug-utils"

export function PastPaperSection() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("browse")
  const [papers, setPapers] = useState<PastPaper[]>([])
  const [subjects, setSubjects] = useState<string[]>([])
  const [years, setYears] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<PastPaperFiltersType>({})
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Load papers based on filters
  const loadPapers = useCallback(async () => {
    setLoading(true)
    try {
      debugLog("Loading past papers with filters:", filters, "and search query:", searchQuery)

      const fetchedPapers = await pastPaperService.getPastPapers({
        ...filters,
        searchQuery: searchQuery.trim() || undefined,
      })

      debugLog("Fetched papers:", fetchedPapers.length)
      setPapers(fetchedPapers)

      // Load subjects and years for filters
      if (subjects.length === 0) {
        const subjectsResult = await pastPaperService.getSubjects()
        setSubjects(subjectsResult)
      }

      if (years.length === 0) {
        const yearsResult = await pastPaperService.getYears()
        setYears(yearsResult)
      }
    } catch (error) {
      console.error("Error loading papers:", error)
      toast({
        title: "Error",
        description: "Failed to load past papers. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [filters, searchQuery, subjects.length, years.length, toast])

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: PastPaperFiltersType) => {
    setFilters(newFilters)
  }, [])

  // Refresh data after upload
  const handleUploadSuccess = useCallback(() => {
    debugLog("Upload success detected, refreshing data")
    setRefreshTrigger((prev) => prev + 1)
    setActiveTab("browse")
    toast({
      title: "Success",
      description: "Past paper uploaded successfully",
    })
  }, [toast])

  // Load data when filters change or refresh is triggered
  useEffect(() => {
    loadPapers()
  }, [loadPapers, refreshTrigger])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("pastPapers")}</h1>
        <Button onClick={() => setActiveTab("upload")}>
          <Upload className="mr-2 h-4 w-4" />
          {t("uploadPastPaper")}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="browse" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            {t("browse")}
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center">
            <Search className="mr-2 h-4 w-4" />
            {t("search")}
          </TabsTrigger>
          <TabsTrigger value="subjects" className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4" />
            {t("bySubject")}
          </TabsTrigger>
          <TabsTrigger value="years" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            {t("byYear")}
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center">
            <Upload className="mr-2 h-4 w-4" />
            {t("upload")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/4">
                <PastPaperFilters onFilterChange={handleFilterChange} initialFilters={filters} />
              </div>

              <div className="w-full md:w-3/4">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <Skeleton className="h-5 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-2/3" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : papers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {papers.map((paper) => (
                      <PastPaperCard key={paper.id} paper={paper} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h2 className="text-xl font-semibold mb-2">{t("noPastPapersFound")}</h2>
                    <p className="text-muted-foreground mb-6">{t("noPastPapersDescription")}</p>
                    <Button onClick={() => setActiveTab("upload")}>
                      <Upload className="mr-2 h-4 w-4" />
                      {t("uploadPastPaper")}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="search">
          <div className="space-y-6">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("searchPastPapersPlaceholder")}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    loadPapers()
                  }
                }}
              />
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : papers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {papers.map((paper) => (
                  <PastPaperCard key={paper.id} paper={paper} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">{t("noPastPapersFound")}</h2>
                <p className="text-muted-foreground mb-6">{t("tryDifferentSearch")}</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="subjects">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 9 }).map((_, index) => (
                <Card key={index} className="h-[150px]">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))
            ) : subjects.length > 0 ? (
              subjects.map((subject) => (
                <Card
                  key={subject}
                  className="h-full hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setFilters({ ...filters, subject })
                    setActiveTab("browse")
                  }}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="mr-2 h-5 w-5" />
                      {subject}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{t("viewPastPapersForSubject", { subject })}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">{t("noSubjectsFound")}</h2>
                <p className="text-muted-foreground mb-6">{t("uploadPastPapersToSeeSubjects")}</p>
                <Button onClick={() => setActiveTab("upload")}>
                  <Upload className="mr-2 h-4 w-4" />
                  {t("uploadPastPaper")}
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="years">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {loading ? (
              Array.from({ length: 12 }).map((_, index) => (
                <Card key={index} className="h-[100px]">
                  <CardHeader>
                    <Skeleton className="h-6 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))
            ) : years.length > 0 ? (
              years.map((year) => (
                <Card
                  key={year}
                  className="h-full hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setFilters({ ...filters, year })
                    setActiveTab("browse")
                  }}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-center text-xl">{year}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-center text-muted-foreground">{t("viewPapers")}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-6 text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">{t("noYearsFound")}</h2>
                <p className="text-muted-foreground mb-6">{t("uploadPastPapersToSeeYears")}</p>
                <Button onClick={() => setActiveTab("upload")}>
                  <Upload className="mr-2 h-4 w-4" />
                  {t("uploadPastPaper")}
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="upload">
          <UploadPastPaper onUploadSuccess={handleUploadSuccess} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
