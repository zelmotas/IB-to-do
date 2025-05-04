import { createClient } from "@/lib/supabase"
import type { PastPaper, PastPaperFilters } from "@/types/past-paper"

export const pastPaperService = {
  async getPastPapers(filters: PastPaperFilters = {}): Promise<PastPaper[]> {
    const supabase = createClient()

    let query = supabase.from("past_papers").select("*")

    if (filters.subject) {
      query = query.eq("subject", filters.subject)
    }

    if (filters.year) {
      query = query.eq("year", filters.year)
    }

    if (filters.month) {
      query = query.eq("month", filters.month)
    }

    if (filters.language) {
      query = query.eq("language", filters.language)
    }

    if (filters.level) {
      query = query.eq("level", filters.level)
    }

    if (filters.searchQuery) {
      query = query.or(`title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`)
    }

    const { data, error } = await query.order("year", { ascending: false })

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

  async getSubjects(): Promise<string[]> {
    const supabase = createClient()

    // Using a raw SQL query to get distinct subjects
    const { data, error } = await supabase.rpc("get_distinct_subjects")

    if (error) {
      console.error("Error fetching subjects:", error)

      // Fallback: fetch all and filter in JavaScript
      try {
        const { data: allData, error: allError } = await supabase.from("past_papers").select("subject")

        if (allError) throw allError

        // Get unique subjects and sort them
        const uniqueSubjects = [...new Set(allData.map((item) => item.subject))].sort()
        return uniqueSubjects
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError)
        return []
      }
    }

    return data as string[]
  },

  async getYears(): Promise<number[]> {
    const supabase = createClient()

    // Using a raw SQL query to get distinct years
    const { data, error } = await supabase.rpc("get_distinct_years")

    if (error) {
      console.error("Error fetching years:", error)

      // Fallback: fetch all and filter in JavaScript
      try {
        const { data: allData, error: allError } = await supabase.from("past_papers").select("year")

        if (allError) throw allError

        // Get unique years and sort them in descending order
        const uniqueYears = [...new Set(allData.map((item) => item.year))].sort((a, b) => b - a)
        return uniqueYears
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError)
        return []
      }
    }

    return data as number[]
  },

  async uploadPastPaper(
    file: File,
    paperData: Omit<PastPaper, "id" | "fileUrl" | "uploadedAt" | "uploadedBy">,
  ): Promise<PastPaper | null> {
    const supabase = createClient()
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
    const filePath = `${user.id}/${fileName}`

    const { data: fileData, error: fileError } = await supabase.storage.from("past-papers").upload(filePath, file)

    if (fileError) {
      console.error("Error uploading file:", fileError)
      return null
    }

    // Get public URL for the file
    const { data: urlData } = supabase.storage.from("past-papers").getPublicUrl(filePath)

    // Insert record into database
    const { data, error } = await supabase
      .from("past_papers")
      .insert({
        ...paperData,
        fileUrl: urlData.publicUrl,
        uploadedBy: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error("Error inserting past paper:", error)
      return null
    }

    return data as PastPaper
  },
}
