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

    try {
      // First, check if we need to sync storage files with database
      await this.syncStorageWithDatabase()

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
        query = query.or(
          `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,subject.ilike.%${searchQuery}%`,
        )
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching past papers:", error)
        throw new Error("Failed to fetch past papers")
      }

      // Map database column names to camelCase for frontend
      return (data || []).map(this.mapDatabaseRecordToPastPaper)
    } catch (error) {
      console.error("Error in getPastPapers:", error)
      return []
    }
  }

  // Sync storage files with database
  private async syncStorageWithDatabase(): Promise<void> {
    try {
      // Get all files from storage
      const { data: storageFiles, error: storageError } = await this.supabase.storage.from("past-papers").list()

      if (storageError) {
        console.error("Error listing storage files:", storageError)
        return
      }

      if (!storageFiles || storageFiles.length === 0) {
        debugLog("No files found in storage")
        return
      }

      debugLog(`Found ${storageFiles.length} files in storage`)

      // Get all existing file URLs from the database
      const { data: existingRecords, error: dbError } = await this.supabase.from("past_papers").select("file_url")

      if (dbError) {
        console.error("Error fetching existing records:", dbError)
        return
      }

      const existingUrls = new Set((existingRecords || []).map((record) => record.file_url))

      // Process each storage file
      for (const file of storageFiles) {
        // Skip folders
        if (file.id === null) continue

        // Get public URL for the file
        const { data: publicUrlData } = await this.supabase.storage.from("past-papers").getPublicUrl(file.name)
        const fileUrl = publicUrlData.publicUrl

        // Skip if this URL is already in the database
        if (existingUrls.has(fileUrl)) {
          continue
        }

        debugLog(`Found new file in storage: ${file.name}, creating database record`)

        // Extract metadata from filename if possible
        const metadata = this.extractMetadataFromFilename(file.name)

        // Create a new database record for this file
        const paperData = {
          title: metadata.title || file.name,
          subject: metadata.subject || "Unknown",
          year: metadata.year || new Date().getFullYear(),
          month: metadata.month || null,
          language: metadata.language || "English",
          paper_number: metadata.paperNumber || 1,
          level: metadata.level || "SL",
          description: `Automatically imported from storage: ${file.name}`,
          file_url: fileUrl,
          uploaded_at: file.created_at || new Date().toISOString(),
        }

        const { error: insertError } = await this.supabase.from("past_papers").insert(paperData)

        if (insertError) {
          console.error(`Error creating record for ${file.name}:`, insertError)
        } else {
          debugLog(`Created database record for ${file.name}`)
        }
      }
    } catch (error) {
      console.error("Error in syncStorageWithDatabase:", error)
    }
  }

  // Extract metadata from filename if possible
  private extractMetadataFromFilename(filename: string): {
    title?: string
    subject?: string
    year?: number
    month?: string
    language?: string
    paperNumber?: number
    level?: string
  } {
    try {
      // Example filename formats:
      // - Mathematics_SL_Paper1_2022_May.pdf
      // - Physics_HL_2021_November.pdf
      // - Chemistry_Paper2_2020.pdf

      const metadata: any = {}

      // Remove file extension
      const nameWithoutExt = filename.replace(/\.[^/.]+$/, "")

      // Split by underscores
      const parts = nameWithoutExt.split("_")

      // Try to extract subject
      if (parts.length > 0) {
        metadata.subject = parts[0]
      }

      // Try to extract level (SL/HL)
      const levelIndex = parts.findIndex((part) => part === "SL" || part === "HL")
      if (levelIndex !== -1) {
        metadata.level = parts[levelIndex]
      }

      // Try to extract paper number
      const paperIndex = parts.findIndex((part) => part.toLowerCase().startsWith("paper"))
      if (paperIndex !== -1) {
        const paperMatch = parts[paperIndex].match(/paper(\d+)/i)
        if (paperMatch && paperMatch[1]) {
          metadata.paperNumber = Number.parseInt(paperMatch[1], 10)
        }
      }

      // Try to extract year
      const yearIndex = parts.findIndex((part) => /^(19|20)\d{2}$/.test(part))
      if (yearIndex !== -1) {
        metadata.year = Number.parseInt(parts[yearIndex], 10)
      }

      // Try to extract month
      const monthIndex = parts.findIndex((part) =>
        [
          "january",
          "february",
          "march",
          "april",
          "may",
          "june",
          "july",
          "august",
          "september",
          "october",
          "november",
          "december",
        ].includes(part.toLowerCase()),
      )
      if (monthIndex !== -1) {
        metadata.month = parts[monthIndex].charAt(0).toUpperCase() + parts[monthIndex].slice(1).toLowerCase()
      }

      // Construct title
      metadata.title = `${metadata.subject || "Unknown"} ${metadata.level || ""} Paper ${metadata.paperNumber || ""} ${metadata.year || ""}`
      metadata.title = metadata.title.trim().replace(/\s+/g, " ")

      return metadata
    } catch (error) {
      console.error("Error extracting metadata from filename:", error)
      return {}
    }
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
    // First sync storage with database to ensure we have all papers
    await this.syncStorageWithDatabase()

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
    // First sync storage with database to ensure we have all papers
    await this.syncStorageWithDatabase()

    const { data, error } = await this.supabase.from("past_papers").select("year").order("year", { ascending: false })

    if (error) {
      console.error("Error fetching years:", error)
      throw new Error("Failed to fetch years")
    }

    // Extract unique years
    const years = [...new Set(data.map((item) => item.year))]
    return years
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
