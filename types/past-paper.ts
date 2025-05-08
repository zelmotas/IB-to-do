export interface PastPaper {
  id: string
  title: string
  subject: string
  subjectCode?: string
  year: number
  month?: string
  language: string
  paperNumber: number
  level: string
  description?: string
  fileUrl: string
  thumbnailUrl?: string
  tags?: string[]
  uploadedBy?: string
  uploadedAt?: string
}

export interface PastPaperFilters {
  subject?: string
  year?: number
  month?: string
  language?: string
  level?: string
  searchQuery?: string
}
