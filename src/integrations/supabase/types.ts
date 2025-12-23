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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      academic_years: {
        Row: {
          created_at: string
          end_date: string
          id: string
          is_active: boolean | null
          start_date: string
          year_name: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          is_active?: boolean | null
          start_date: string
          year_name: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          is_active?: boolean | null
          start_date?: string
          year_name?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          code: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string
          document_type: string
          file_name: string
          file_size: number | null
          file_url: string
          group_id: string
          id: string
          phase_id: string | null
          title: string
          uploaded_by: string | null
          version: number | null
        }
        Insert: {
          created_at?: string
          document_type: string
          file_name: string
          file_size?: number | null
          file_url: string
          group_id: string
          id?: string
          phase_id?: string | null
          title: string
          uploaded_by?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string
          document_type?: string
          file_name?: string
          file_size?: number | null
          file_url?: string
          group_id?: string
          id?: string
          phase_id?: string | null
          title?: string
          uploaded_by?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "project_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "project_phases"
            referencedColumns: ["id"]
          },
        ]
      }
      external_evaluations: {
        Row: {
          created_at: string
          evaluated_at: string | null
          evaluator_designation: string | null
          evaluator_id: string | null
          evaluator_name: string | null
          group_id: string
          id: string
          is_locked: boolean | null
          marks: number | null
          remarks: string | null
        }
        Insert: {
          created_at?: string
          evaluated_at?: string | null
          evaluator_designation?: string | null
          evaluator_id?: string | null
          evaluator_name?: string | null
          group_id: string
          id?: string
          is_locked?: boolean | null
          marks?: number | null
          remarks?: string | null
        }
        Update: {
          created_at?: string
          evaluated_at?: string | null
          evaluator_designation?: string | null
          evaluator_id?: string | null
          evaluator_name?: string | null
          group_id?: string
          id?: string
          is_locked?: boolean | null
          marks?: number | null
          remarks?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "external_evaluations_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "project_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          is_leader: boolean | null
          joined_at: string
          student_id: string
        }
        Insert: {
          group_id: string
          id?: string
          is_leader?: boolean | null
          joined_at?: string
          student_id: string
        }
        Update: {
          group_id?: string
          id?: string
          is_leader?: boolean | null
          joined_at?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "project_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_phase_status: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          group_id: string
          id: string
          mentor_remarks: string | null
          phase_id: string
          status: string | null
          submission_date: string | null
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          group_id: string
          id?: string
          mentor_remarks?: string | null
          phase_id: string
          status?: string | null
          submission_date?: string | null
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          group_id?: string
          id?: string
          mentor_remarks?: string | null
          phase_id?: string
          status?: string | null
          submission_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_phase_status_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "project_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_phase_status_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "project_phases"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          group_id: string | null
          id: string
          location: string | null
          meeting_type: string | null
          scheduled_at: string
          title: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          group_id?: string | null
          id?: string
          location?: string | null
          meeting_type?: string | null
          scheduled_at: string
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          group_id?: string | null
          id?: string
          location?: string | null
          meeting_type?: string | null
          scheduled_at?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetings_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "project_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          link: string | null
          message: string
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          link?: string | null
          message: string
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
          user_id: string
          usn: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email: string
          full_name: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
          usn?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
          usn?: string | null
        }
        Relationships: []
      }
      project_diary: {
        Row: {
          created_at: string
          entry_date: string
          group_id: string
          id: string
          is_reviewed: boolean | null
          issues_faced: string | null
          mentor_comments: string | null
          next_plan: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          submitted_by: string | null
          updated_at: string
          work_done: string
        }
        Insert: {
          created_at?: string
          entry_date?: string
          group_id: string
          id?: string
          is_reviewed?: boolean | null
          issues_faced?: string | null
          mentor_comments?: string | null
          next_plan?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          submitted_by?: string | null
          updated_at?: string
          work_done: string
        }
        Update: {
          created_at?: string
          entry_date?: string
          group_id?: string
          id?: string
          is_reviewed?: boolean | null
          issues_faced?: string | null
          mentor_comments?: string | null
          next_plan?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          submitted_by?: string | null
          updated_at?: string
          work_done?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_diary_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "project_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      project_groups: {
        Row: {
          academic_year_id: string | null
          created_at: string
          department_id: string | null
          group_id: string
          id: string
          mentor_id: string | null
          project_description: string | null
          project_title: string
          status: string | null
          updated_at: string
        }
        Insert: {
          academic_year_id?: string | null
          created_at?: string
          department_id?: string | null
          group_id: string
          id?: string
          mentor_id?: string | null
          project_description?: string | null
          project_title: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          academic_year_id?: string | null
          created_at?: string
          department_id?: string | null
          group_id?: string
          id?: string
          mentor_id?: string | null
          project_description?: string | null
          project_title?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_groups_academic_year_id_fkey"
            columns: ["academic_year_id"]
            isOneToOne: false
            referencedRelation: "academic_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_groups_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      project_phases: {
        Row: {
          academic_year_id: string | null
          completion_percentage: number
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          is_locked: boolean | null
          phase_name: string
          phase_number: number
          start_date: string | null
        }
        Insert: {
          academic_year_id?: string | null
          completion_percentage: number
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_locked?: boolean | null
          phase_name: string
          phase_number: number
          start_date?: string | null
        }
        Update: {
          academic_year_id?: string | null
          completion_percentage?: number
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_locked?: boolean | null
          phase_name?: string
          phase_number?: number
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_phases_academic_year_id_fkey"
            columns: ["academic_year_id"]
            isOneToOne: false
            referencedRelation: "academic_years"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_group_ids: { Args: { _user_id: string }; Returns: string[] }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "mentor" | "student"
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
      app_role: ["admin", "mentor", "student"],
    },
  },
} as const
