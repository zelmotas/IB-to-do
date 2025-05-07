import { createClient } from "@/lib/supabase"
import type { PastPaper } from "@/types/past-paper"

class PastPaperService {
  async getRecentPastPapers(limit = 10): Promise<PastPaper[]> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("past_papers")
      .select("*")
      .order("uploaded_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching recent past papers:", error)
      return []
    }

    return data || []
  }

  async getPastPaperById(id: string): Promise<PastPaper | null> {
    const supabase = createClient()

    const { data, error } = await supabase.from("past_papers").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching past paper by ID:", error)
      return null
    }

    return data
  }

  async getPastPapersBySubject(subject: string): Promise<PastPaper[]> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("past_papers")
      .select("*")
      .eq("subject", subject)
      .order("year", { ascending: false })

    if (error) {
      console.error("Error fetching past papers by subject:", error)
      return []
    }

    return data || []
  }

  async getPastPapersByYear(year: number): Promise<PastPaper[]> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("past_papers")
      .select("*")
      .eq("year", year)
      .order("subject", { ascending: true })

    if (error) {
      console.error("Error fetching past papers by year:", error)
      return []
    }

    return data || []
  }

  async searchPastPapers(query: string, filters?: Record<string, any>): Promise<PastPaper[]> {
    const supabase = createClient()

    let supabaseQuery = supabase.from("past_papers").select("*")

    if (query) {
      supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,subject.ilike.%${query}%,description.ilike.%${query}%`)
    }

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          supabaseQuery = supabaseQuery.eq(key, value)
        }
      })
    }

    const { data, error } = await supabaseQuery.order("year", { ascending: false })

    if (error) {
      console.error("Error searching past papers:", error)
      return []
    }

    return data || []
  }

  async getUniqueSubjects(): Promise<string[]> {
    const supabase = createClient()

    const { data, error } = await supabase.from("past_papers").select("subject").order("subject")

    if (error) {
      console.error("Error fetching unique subjects:", error)
      return []
    }

    // Extract unique subjects
    const subjects = [...new Set(data.map((item) => item.subject))]
    return subjects
  }

  async getUniqueYears(): Promise<number[]> {
    const supabase = createClient()

    const { data, error } = await supabase.from("past_papers").select("year").order("year", { ascending: false })

    if (error) {
      console.error("Error fetching unique years:", error)
      return []
    }

    // Extract unique years
    const years = [...new Set(data.map((item) => item.year))]
    return years
  }
}

export const pastPaperService = new PastPaperService()
