export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
          full_name: string | null
          avatar_url: string | null
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          text: string
          completed: boolean
          due_date: string | null
          created_at: string
          reminder_time: string | null
          subject_id: string | null
          unit_id: string | null
          subtopic_id: string | null
          subject_name: string | null
          unit_name: string | null
          subtopic_name: string | null
          subject_color: string | null
        }
        Insert: {
          id?: string
          user_id: string
          text: string
          completed?: boolean
          due_date?: string | null
          created_at?: string
          reminder_time?: string | null
          subject_id?: string | null
          unit_id?: string | null
          subtopic_id?: string | null
          subject_name?: string | null
          unit_name?: string | null
          subtopic_name?: string | null
          subject_color?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          text?: string
          completed?: boolean
          due_date?: string | null
          created_at?: string
          reminder_time?: string | null
          subject_id?: string | null
          unit_id?: string | null
          subtopic_id?: string | null
          subject_name?: string | null
          unit_name?: string | null
          subtopic_name?: string | null
          subject_color?: string | null
        }
      }
      chat_history: {
        Row: {
          id: string
          user_id: string
          messages: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          messages: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          messages?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]
export type Insertable<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"]
export type Updatable<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"]
