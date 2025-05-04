export interface PastPaper {
  id: string
  title: string
  subject: string
  subjectCode?: string
  year: number
  month?: string
  language: string
  paperNumber: number
  level: "SL" | "HL" | "Both"
  fileUrl: string
  thumbnailUrl?: string
  uploadedBy: string
  uploadedAt: string
  tags?: string[]
  description?: string
}

export interface PastPaperFilters {
  subject?: string
  year?: number
  month?: string
  language?: string
  level?: string
  searchQuery?: string
}
