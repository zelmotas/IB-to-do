import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { PastPaper } from "@/types/past-paper"

// Central service for handling past paper data
class PastPaperService {
  private supabase = createClientComponentClient()

  // Get all past papers with optional filters
  async getPastPapers(
    options: {
      subject?: string
      year?: number
      level?: string
      search?: string
      limit?: number
      offset?: number
    } = {},
  ): Promise<PastPaper[]> {
    const { subject, year, level, search, limit = 10, offset = 0 } = options

    let query = this.supabase
      .from("past_papers")
      .select("*")
      .order("uploaded_at", { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1)

    if (subject) {
      query = query.eq("subject", subject)
    }

    if (year) {
      query = query.eq("year", year)
    }

    if (level) {
      query = query.eq("level", level)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,subject.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching past papers:", error)
      throw new Error("Failed to fetch past papers")
    }

    return data as PastPaper[]
  }

  // Get a single past paper by ID
  async getPastPaperById(id: string): Promise<PastPaper | null> {
    const { data, error } = await this.supabase.from("past_papers").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching past paper:", error)
      return null
    }

    return data as PastPaper
  }

  // Get all unique subjects
  async getSubjects(): Promise<string[]> {
    const { data, error } = await this.supabase.from("past_papers").select("subject").order("subject")

    if (error) {
      console.error("Error fetching subjects:", error)
      throw new Error("Failed to fetch subjects")
    }

    // Extract unique subjects
    const subjects = [...new Set(data.map((item) => item.subject))]
    return subjects
  }

  // Get paginated subjects
  async getSubjectsPaginated({ page = 1, pageSize = 10 }: { page: number; pageSize: number }): Promise<{
    data: string[]
    totalPages: number
  }> {
    try {
      // First get all subjects to determine total count
      const allSubjects = await this.getSubjects()

      // Calculate pagination
      const totalSubjects = allSubjects.length
      const totalPages = Math.ceil(totalSubjects / pageSize)
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize

      // Get the subjects for the current page
      const paginatedSubjects = allSubjects.slice(startIndex, endIndex)

      return {
        data: paginatedSubjects,
        totalPages,
      }
    } catch (error) {
      console.error("Error fetching paginated subjects:", error)
      throw new Error("Failed to fetch subjects")
    }
  }

  // Get all unique years
  async getYears(): Promise<number[]> {
    const { data, error } = await this.supabase.from("past_papers").select("year").order("year", { ascending: false })

    if (error) {
      console.error("Error fetching years:", error)
      throw new Error("Failed to fetch years")
    }

    // Extract unique years
    const years = [...new Set(data.map((item) => item.year))]
    return years
  }

  // Get paginated years
  async getYearsPaginated({ page = 1, pageSize = 10 }: { page: number; pageSize: number }): Promise<{
    data: number[]
    totalPages: number
  }> {
    try {
      // First get all years to determine total count
      const allYears = await this.getYears()

      // Calculate pagination
      const totalYears = allYears.length
      const totalPages = Math.ceil(totalYears / pageSize)
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize

      // Get the years for the current page
      const paginatedYears = allYears.slice(startIndex, endIndex)

      return {
        data: paginatedYears,
        totalPages,
      }
    } catch (error) {
      console.error("Error fetching paginated years:", error)
      throw new Error("Failed to fetch years")
    }
  }

  // Get past papers by subject
  async getPastPapersBySubject(
    subject: string,
    options: {
      limit?: number
      offset?: number
    } = {},
  ): Promise<{ data: PastPaper[]; count: number }> {
    const { limit = 10, offset = 0 } = options

    // First get the count
    const countQuery = await this.supabase.from("past_papers").select("id", { count: "exact" }).eq("subject", subject)

    // Then get the paginated data
    const { data, error } = await this.supabase
      .from("past_papers")
      .select("*")
      .eq("subject", subject)
      .order("year", { ascending: false })
      .order("paper_number", { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Error fetching past papers by subject:", error)
      throw new Error("Failed to fetch past papers")
    }

    return {
      data: data as PastPaper[],
      count: countQuery.count || 0,
    }
  }

  // Get past papers by year
  async getPastPapersByYear(
    year: number,
    options: {
      limit?: number
      offset?: number
    } = {},
  ): Promise<{ data: PastPaper[]; count: number }> {
    const { limit = 10, offset = 0 } = options

    // First get the count
    const countQuery = await this.supabase.from("past_papers").select("id", { count: "exact" }).eq("year", year)

    // Then get the paginated data
    const { data, error } = await this.supabase
      .from("past_papers")
      .select("*")
      .eq("year", year)
      .order("subject", { ascending: true })
      .order("paper_number", { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Error fetching past papers by year:", error)
      throw new Error("Failed to fetch past papers")
    }

    return {
      data: data as PastPaper[],
      count: countQuery.count || 0,
    }
  }

  // Search past papers
  async searchPastPapers(
    query: string,
    options: {
      limit?: number
      offset?: number
    } = {},
  ): Promise<{ data: PastPaper[]; count: number }> {
    const { limit = 10, offset = 0 } = options

    // First get the count
    const countQuery = await this.supabase
      .from("past_papers")
      .select("id", { count: "exact" })
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,subject.ilike.%${query}%`)

    // Then get the paginated data
    const { data, error } = await this.supabase
      .from("past_papers")
      .select("*")
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,subject.ilike.%${query}%`)
      .order("uploaded_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Error searching past papers:", error)
      throw new Error("Failed to search past papers")
    }

    return {
      data: data as PastPaper[],
      count: countQuery.count || 0,
    }
  }

  // This method is now removed from the client-side service
  // Upload past paper (only available for admin via Supabase dashboard)
  /* 
  async uploadPastPaper(file: File, metadata: PastPaperMetadata): Promise<PastPaper | null> {
    // Implementation removed as upload is now admin-only
    return null
  }
  */
}

export const pastPaperService = new PastPaperService()
