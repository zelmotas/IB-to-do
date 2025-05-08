import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { PastPaper } from "@/types/past-paper"
import { debugLog } from "@/lib/debug-utils"

// Central service for handling past paper data
class PastPaperService {
  private supabase = createClientComponentClient()

  // Get all past papers with optional filters
  async getPastPapers(
    options: {
      subject?: string
      year?: number
      month?: string
      language?: string
      level?: string
      searchQuery?: string
      limit?: number
      offset?: number
    } = {},
  ): Promise<PastPaper[]> {
    const { subject, year, month, language, level, searchQuery, limit = 50, offset = 0 } = options

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

    if (month) {
      query = query.eq("month", month)
    }

    if (language) {
      query = query.eq("language", language)
    }

    if (level) {
      query = query.eq("level", level)
    }

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,subject.ilike.%${searchQuery}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching past papers:", error)
      throw new Error("Failed to fetch past papers")
    }

    // Map database column names to camelCase for frontend
    return (data || []).map(this.mapDatabaseRecordToPastPaper)
  }

  // Get a single past paper by ID
  async getPastPaperById(id: string): Promise<PastPaper | null> {
    const { data, error } = await this.supabase.from("past_papers").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching past paper:", error)
      return null
    }

    return this.mapDatabaseRecordToPastPaper(data)
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

  // Upload a past paper
  async uploadPastPaper(file: File, metadata: any): Promise<PastPaper | null> {
    try {
      // 1. Upload file to storage
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `past-papers/${fileName}`

      debugLog("Uploading file to storage:", filePath)

      const { data: storageData, error: storageError } = await this.supabase.storage
        .from("past-papers")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        })

      if (storageError) {
        console.error("Error uploading file to storage:", storageError)
        throw new Error("Failed to upload file")
      }

      // 2. Get public URL for the file
      const { data: publicUrlData } = await this.supabase.storage.from("past-papers").getPublicUrl(filePath)

      const fileUrl = publicUrlData.publicUrl

      debugLog("File uploaded successfully. Public URL:", fileUrl)

      // 3. Create database record
      const paperData = {
        title: metadata.title,
        subject: metadata.subject,
        subject_code: metadata.subject_code || null,
        year: metadata.year,
        month: metadata.month || null,
        language: metadata.language,
        paper_number: metadata.paper_number,
        level: metadata.level,
        description: metadata.description || null,
        file_url: fileUrl,
        uploaded_at: new Date().toISOString(),
      }

      debugLog("Creating database record with data:", paperData)

      const { data: insertData, error: insertError } = await this.supabase
        .from("past_papers")
        .insert(paperData)
        .select()
        .single()

      if (insertError) {
        console.error("Error creating past paper record:", insertError)
        // Try to clean up the uploaded file
        await this.supabase.storage.from("past-papers").remove([filePath])
        throw new Error("Failed to create past paper record")
      }

      debugLog("Past paper record created successfully:", insertData)

      return this.mapDatabaseRecordToPastPaper(insertData)
    } catch (error) {
      console.error("Error in uploadPastPaper:", error)
      throw error
    }
  }

  // Helper method to map database column names to camelCase for frontend
  private mapDatabaseRecordToPastPaper(record: any): PastPaper {
    return {
      id: record.id,
      title: record.title,
      subject: record.subject,
      subjectCode: record.subject_code,
      year: record.year,
      month: record.month,
      language: record.language,
      paperNumber: record.paper_number,
      level: record.level,
      description: record.description,
      fileUrl: record.file_url,
      thumbnailUrl: record.thumbnail_url,
      tags: record.tags,
      uploadedBy: record.uploaded_by,
      uploadedAt: record.uploaded_at,
    }
  }
}

export const pastPaperService = new PastPaperService()
