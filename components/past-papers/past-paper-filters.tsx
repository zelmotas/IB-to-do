"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { pastPaperService } from "@/services/past-paper-service"
import type { PastPaperFilters } from "@/types/past-paper"
import { useLanguage } from "@/contexts/language-context"

interface PastPaperFiltersProps {
  onFilterChange: (filters: PastPaperFilters) => void
  initialFilters?: PastPaperFilters
}

export function PastPaperFilters({ onFilterChange, initialFilters = {} }: PastPaperFiltersProps) {
  const { t } = useLanguage()
  const [subjects, setSubjects] = useState<string[]>([])
  const [years, setYears] = useState<number[]>([])
  const [filters, setFilters] = useState<PastPaperFilters>(initialFilters)
  const [subjectOpen, setSubjectOpen] = useState(false)
  const [yearOpen, setYearOpen] = useState(false)
  const [levelOpen, setLevelOpen] = useState(false)

  useEffect(() => {
    const loadFilterOptions = async () => {
      const [fetchedSubjects, fetchedYears] = await Promise.all([
        pastPaperService.getSubjects(),
        pastPaperService.getYears(),
      ])
      setSubjects(fetchedSubjects)
      setYears(fetchedYears)
    }

    loadFilterOptions()
  }, [])

  const handleFilterChange = (key: keyof PastPaperFilters, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    setFilters({})
    onFilterChange({})
  }

  const levels = ["SL", "HL", "Both"]

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-medium">{t("filters")}</h3>

      <div className="space-y-2">
        <label className="text-sm font-medium">{t("subject")}</label>
        <Popover open={subjectOpen} onOpenChange={setSubjectOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={subjectOpen} className="w-full justify-between">
              {filters.subject ? filters.subject : t("selectSubject")}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder={t("searchSubject")} />
              <CommandList>
                <CommandEmpty>{t("noSubjectsFound")}</CommandEmpty>
                <CommandGroup>
                  {subjects.map((subject) => (
                    <CommandItem
                      key={subject}
                      value={subject}
                      onSelect={() => {
                        handleFilterChange("subject", subject === filters.subject ? undefined : subject)
                        setSubjectOpen(false)
                      }}
                    >
                      <Check
                        className={cn("mr-2 h-4 w-4", filters.subject === subject ? "opacity-100" : "opacity-0")}
                      />
                      {subject}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{t("year")}</label>
        <Popover open={yearOpen} onOpenChange={setYearOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={yearOpen} className="w-full justify-between">
              {filters.year ? filters.year.toString() : t("selectYear")}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder={t("searchYear")} />
              <CommandList>
                <CommandEmpty>{t("noYearsFound")}</CommandEmpty>
                <CommandGroup>
                  {years.map((year) => (
                    <CommandItem
                      key={year}
                      value={year.toString()}
                      onSelect={() => {
                        handleFilterChange("year", year === filters.year ? undefined : year)
                        setYearOpen(false)
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", filters.year === year ? "opacity-100" : "opacity-0")} />
                      {year}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{t("level")}</label>
        <Popover open={levelOpen} onOpenChange={setLevelOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={levelOpen} className="w-full justify-between">
              {filters.level ? filters.level : t("selectLevel")}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandList>
                <CommandGroup>
                  {levels.map((level) => (
                    <CommandItem
                      key={level}
                      value={level}
                      onSelect={() => {
                        handleFilterChange("level", level === filters.level ? undefined : level)
                        setLevelOpen(false)
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", filters.level === level ? "opacity-100" : "opacity-0")} />
                      {level}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <Button variant="outline" className="w-full" onClick={clearFilters}>
        {t("clearFilters")}
      </Button>
    </div>
  )
}
