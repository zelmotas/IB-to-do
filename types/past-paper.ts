export interface PastPaperFilters {
  subject?: string
  year?: number
  level?: string
}

export interface PastPaper {
  id: string
  title: string
  subject: string
  subject_code?: string
  year: number
  month?: string
  language: string
  paper_number: number
  level: string
  description?: string
  file_url: string
  thumbnail_url?: string
  tags?: string[]
  uploaded_by?: string
  uploaded_at?: string
}
