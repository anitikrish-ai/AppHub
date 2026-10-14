export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      app_screenshots: {
        Row: {
          app_id: string
          id: string
          image_url: string
          sort_order: number
        }
        Insert: {
          app_id: string
          id?: string
          image_url: string
          sort_order?: number
        }
        Update: {
          app_id?: string
          id?: string
          image_url?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "app_screenshots_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["id"]
          },
        ]
      }
      apps: {
        Row: {
          average_rating: number
          build_file_url: string | null
          category_id: string | null
          created_at: string
          description: string | null
          developer_id: string
          download_count: number
          icon_url: string | null
          id: string
          name: string
          price_cents: number
          rating_count: number
          size_mb: number | null
          slug: string
          status: string
          tagline: string | null
          updated_at: string
          version: string
        }
        Insert: {
          average_rating?: number
          build_file_url?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          developer_id: string
          download_count?: number
          icon_url?: string | null
          id?: string
          name: string
          price_cents?: number
          rating_count?: number
          size_mb?: number | null
          slug: string
          status?: string
          tagline?: string | null
          updated_at?: string
          version?: string
        }
        Update: {
          average_rating?: number
          build_file_url?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          developer_id?: string
          download_count?: number
          icon_url?: string | null
          id?: string
          name?: string
          price_cents?: number
          rating_count?: number
          size_mb?: number | null
          slug?: string
          status?: string
          tagline?: string | null
          updated_at?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "apps_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "apps_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      developers: {
        Row: {
          company_name: string
          created_at: string
          id: string
          support_email: string | null
          verified: boolean
          website: string | null
        }
        Insert: {
          company_name: string
          created_at?: string
          id: string
          support_email?: string | null
          verified?: boolean
          website?: string | null
        }
        Update: {
          company_name?: string
          created_at?: string
          id?: string
          support_email?: string | null
          verified?: boolean
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "developers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      downloads: {
        Row: {
          app_id: string
          downloaded_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          app_id: string
          downloaded_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          app_id?: string
          downloaded_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "downloads_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "downloads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          app_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          app_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          app_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          is_developer: boolean
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          is_developer?: boolean
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_developer?: boolean
          username?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          app_id: string
          body: string | null
          created_at: string
          id: string
          rating: number
          user_id: string
        }
        Insert: {
          app_id: string
          body?: string | null
          created_at?: string
          id?: string
          rating: number
          user_id: string
        }
        Update: {
          app_id?: string
          body?: string | null
          created_at?: string
          id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

type DefaultSchema = Database["public"]

export type Tables<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Row"]
export type TablesInsert<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Update"]
