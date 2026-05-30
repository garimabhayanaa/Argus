export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      feedback: {
        Row: {
          content: string | null
          created_at: string
          id: string
          report_id: string
          report_version_id: string
          section_key: string | null
          status: Database["public"]["Enums"]["feedback_status"]
          type: Database["public"]["Enums"]["feedback_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          report_id: string
          report_version_id: string
          section_key?: string | null
          status?: Database["public"]["Enums"]["feedback_status"]
          type: Database["public"]["Enums"]["feedback_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          report_id?: string
          report_version_id?: string
          section_key?: string | null
          status?: Database["public"]["Enums"]["feedback_status"]
          type?: Database["public"]["Enums"]["feedback_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_report_version_id_fkey"
            columns: ["report_version_id"]
            isOneToOne: false
            referencedRelation: "report_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          company_name: string
          company_url: string | null
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          metadata: Json
          started_at: string | null
          status: Database["public"]["Enums"]["job_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name: string
          company_url?: string | null
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          metadata?: Json
          started_at?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string
          company_url?: string | null
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          metadata?: Json
          started_at?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          report_id: string
          role: string
          sources_cited: Json
          tokens_used: number | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          report_id: string
          role: string
          sources_cited?: Json
          tokens_used?: number | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          report_id?: string
          role?: string
          sources_cited?: Json
          tokens_used?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_read: boolean
          metadata: Json
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          metadata?: Json
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          metadata?: Json
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      report_versions: {
        Row: {
          ai_metadata: Json
          content_html: string
          content_json: Json
          content_markdown: string
          created_at: string
          id: string
          report_id: string
          revision_trigger: string
          sources_used: Json
          version_number: number
        }
        Insert: {
          ai_metadata?: Json
          content_html?: string
          content_json?: Json
          content_markdown: string
          created_at?: string
          id?: string
          report_id: string
          revision_trigger?: string
          sources_used?: Json
          version_number: number
        }
        Update: {
          ai_metadata?: Json
          content_html?: string
          content_json?: Json
          content_markdown?: string
          created_at?: string
          id?: string
          report_id?: string
          revision_trigger?: string
          sources_used?: Json
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "report_versions_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          company_name: string
          company_url: string | null
          created_at: string
          current_version: number
          id: string
          job_id: string
          published_at: string | null
          quality_score: Json | null
          status: Database["public"]["Enums"]["report_status"]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name: string
          company_url?: string | null
          created_at?: string
          current_version?: number
          id?: string
          job_id: string
          published_at?: string | null
          quality_score?: Json | null
          status?: Database["public"]["Enums"]["report_status"]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string
          company_url?: string | null
          created_at?: string
          current_version?: number
          id?: string
          job_id?: string
          published_at?: string | null
          quality_score?: Json | null
          status?: Database["public"]["Enums"]["report_status"]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: true
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      research_sources: {
        Row: {
          content_raw: string | null
          created_at: string
          embedding: string | null
          fetched_at: string
          id: string
          job_id: string
          metadata: Json
          source_type: string
          title: string | null
          url: string | null
        }
        Insert: {
          content_raw?: string | null
          created_at?: string
          embedding?: string | null
          fetched_at?: string
          id?: string
          job_id: string
          metadata?: Json
          source_type: string
          title?: string | null
          url?: string | null
        }
        Update: {
          content_raw?: string | null
          created_at?: string
          embedding?: string | null
          fetched_at?: string
          id?: string
          job_id?: string
          metadata?: Json
          source_type?: string
          title?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "research_sources_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      share_links: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          report_id: string
          token: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          report_id: string
          token: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          report_id?: string
          token?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "share_links_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "share_links_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          settings: Json
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          settings?: Json
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          settings?: Json
          updated_at?: string
        }
        Relationships: []
      }
      workflow_runs: {
        Row: {
          completed_at: string | null
          cost_usd: number | null
          created_at: string
          duration_ms: number | null
          error_log: Json | null
          id: string
          job_id: string | null
          n8n_execution_id: string | null
          started_at: string
          status: Database["public"]["Enums"]["workflow_run_status"]
          tokens_used: number | null
          workflow_name: string
        }
        Insert: {
          completed_at?: string | null
          cost_usd?: number | null
          created_at?: string
          duration_ms?: number | null
          error_log?: Json | null
          id?: string
          job_id?: string | null
          n8n_execution_id?: string | null
          started_at?: string
          status?: Database["public"]["Enums"]["workflow_run_status"]
          tokens_used?: number | null
          workflow_name: string
        }
        Update: {
          completed_at?: string | null
          cost_usd?: number | null
          created_at?: string
          duration_ms?: number | null
          error_log?: Json | null
          id?: string
          job_id?: string | null
          n8n_execution_id?: string | null
          started_at?: string
          status?: Database["public"]["Enums"]["workflow_run_status"]
          tokens_used?: number | null
          workflow_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_runs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_report_with_version: {
        Args: { p_report_id: string }
        Returns: {
          ai_metadata: Json
          company_name: string
          company_url: string
          content_html: string
          content_json: Json
          content_markdown: string
          current_version: number
          published_at: string
          quality_score: Json
          report_id: string
          report_status: Database["public"]["Enums"]["report_status"]
          revision_trigger: string
          sources_used: Json
          title: string
          version_created_at: string
          version_id: string
          version_number: number
        }[]
      }
      match_research_sources: {
        Args: {
          match_count?: number
          match_job_id: string
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          content_raw: string
          id: string
          job_id: string
          metadata: Json
          similarity: number
          source_type: string
          title: string
          url: string
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      feedback_status: "PENDING" | "PROCESSING" | "RESOLVED" | "DISMISSED"
      feedback_type:
        | "REVISION_REQUEST"
        | "SECTION_COMMENT"
        | "THUMBS_UP"
        | "THUMBS_DOWN"
      job_status:
        | "PENDING"
        | "PROCESSING"
        | "RESEARCHING"
        | "GENERATING"
        | "REVIEWING"
        | "REVISION_REQUESTED"
        | "COMPLETED"
        | "FAILED"
        | "ARCHIVED"
      report_status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
      workflow_run_status: "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      feedback_status: ["PENDING", "PROCESSING", "RESOLVED", "DISMISSED"],
      feedback_type: [
        "REVISION_REQUEST",
        "SECTION_COMMENT",
        "THUMBS_UP",
        "THUMBS_DOWN",
      ],
      job_status: [
        "PENDING",
        "PROCESSING",
        "RESEARCHING",
        "GENERATING",
        "REVIEWING",
        "REVISION_REQUESTED",
        "COMPLETED",
        "FAILED",
        "ARCHIVED",
      ],
      report_status: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      workflow_run_status: ["RUNNING", "COMPLETED", "FAILED", "CANCELLED"],
    },
  },
} as const
