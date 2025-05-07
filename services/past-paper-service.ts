import { createClient } from "@/lib/supabase"
import type { PastPaper, PastPaperFilters } from "@/types/past-paper"

export const pastPaperService = {
  async getPastPapers(filters: PastPaperFilters & { limit?: number } = {}): Promise<PastPaper[]> {
    const supabase = createClient()

    let query = supabase.from("past_papers").select("*")

    // Apply filters
    if (filters.subject) {
      query = query.eq("subject", filters.subject)
    }

    if (filters.year) {
      query = query.eq("year", filters.year)
    }

    if (filters.level) {
      query = query.eq("level", filters.level)
    }

    if (filters.language) {
      query = query.eq("language", filters.language)
    }

    if (filters.month) {
      query = query.eq("month", filters.month)
    }

    if (filters.searchQuery) {
      query = query.or(`title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`)
    }

    // Apply limit if specified
    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    // Order by most recent
    query = query.order("uploaded_at", { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error("Error fetching past papers:", error)
      return []
    }

    return data as PastPaper[]
  },

  async getPastPaperById(id: string): Promise<PastPaper | null> {
    const supabase = createClient()

    const { data, error } = await supabase.from("past_papers").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching past paper:", error)
      return null
    }

    return data as PastPaper
  },

  async uploadPastPaper(
    file: File,
    metadata: Omit<PastPaper, "id" | "file_url" | "thumbnail_url" | "uploaded_at" | "tags">,
  ): Promise<PastPaper | null> {
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.error("User not authenticated")
      return null
    }

    // Upload file to storage
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `past-papers/${fileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage.from("past-papers").upload(filePath, file)

    if (uploadError) {
      console.error("Error uploading file:", uploadError)
      return null
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("past-papers").getPublicUrl(filePath)

    // Insert record in database
    const { data, error } = await supabase
      .from("past_papers")
      .insert({
        ...metadata,
        file_url: publicUrl,
        uploaded_by: user.id,
        uploaded_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error inserting past paper record:", error)
      return null
    }

    return data as PastPaper
  },

  async getSubjects(): Promise<string[]> {
    const supabase = createClient()

    const { data, error } = await supabase.from("past_papers").select("subject").order("subject")

    if (error) {
      console.error("Error fetching subjects:", error)
      return []
    }

    // Extract unique subjects
    const subjects = [...new Set(data.map((item) => item.subject))]
    return subjects
  },

  async getYears(): Promise<number[]> {
    const supabase = createClient()

    const { data, error } = await supabase.from("past_papers").select("year").order("year", { ascending: false })

    if (error) {
      console.error("Error fetching years:", error)
      return []
    }

    // Extract unique years
    const years = [...new Set(data.map((item) => item.year))]
    return years
  },

  async getSubjectsPaginated({
    page = 1,
    pageSize = 9,
  }: { page: number; pageSize: number }): Promise<{ data: string[]; totalPages: number }> {
    const supabase = createClient()

    // Get all subjects first
    const { data, error } = await supabase.from("past_papers").select("subject")

    if (error) {
      console.error("Error fetching subjects:", error)
      return { data: [], totalPages: 0 }
    }

    // Extract unique subjects
    const allSubjects = [...new Set(data.map((item) => item.subject))].sort()

    // Calculate pagination
    const totalPages = Math.ceil(allSubjects.length / pageSize)
    const start = (page - 1) * pageSize
    const end = start + pageSize

    return {
      data: allSubjects.slice(start, end),
      totalPages,
    }
  },
}
