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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      authors: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          id: string
          name: string
          role_title: string | null
          slug: string
          x_handle: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          name: string
          role_title?: string | null
          slug: string
          x_handle?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          name?: string
          role_title?: string | null
          slug?: string
          x_handle?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          description: string | null
          id: string
          name: string
          position: number
          site: Database["public"]["Enums"]["site_key"]
          slug: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          position?: number
          site: Database["public"]["Enums"]["site_key"]
          slug: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          position?: number
          site?: Database["public"]["Enums"]["site_key"]
          slug?: string
        }
        Relationships: []
      }
      homepage_picks: {
        Row: {
          id: string
          position: number
          post_id: string
          site: Database["public"]["Enums"]["site_key"]
          slot: string
        }
        Insert: {
          id?: string
          position?: number
          post_id: string
          site: Database["public"]["Enums"]["site_key"]
          slot: string
        }
        Update: {
          id?: string
          position?: number
          post_id?: string
          site?: Database["public"]["Enums"]["site_key"]
          slot?: string
        }
        Relationships: [
          {
            foreignKeyName: "homepage_picks_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "homepage_picks_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "site_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      navigation: {
        Row: {
          href: string
          id: string
          label: string
          menu: string
          position: number
          site: Database["public"]["Enums"]["site_key"]
        }
        Insert: {
          href: string
          id?: string
          label: string
          menu: string
          position?: number
          site: Database["public"]["Enums"]["site_key"]
        }
        Update: {
          href?: string
          id?: string
          label?: string
          menu?: string
          position?: number
          site?: Database["public"]["Enums"]["site_key"]
        }
        Relationships: []
      }
      pages: {
        Row: {
          body: string
          id: string
          kind: string
          seo_description: string | null
          seo_title: string | null
          site: Database["public"]["Enums"]["site_key"]
          slug: string
          status: Database["public"]["Enums"]["publish_status"]
          title: string
          updated_at: string
        }
        Insert: {
          body?: string
          id?: string
          kind?: string
          seo_description?: string | null
          seo_title?: string | null
          site: Database["public"]["Enums"]["site_key"]
          slug: string
          status?: Database["public"]["Enums"]["publish_status"]
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          id?: string
          kind?: string
          seo_description?: string | null
          seo_title?: string | null
          site?: Database["public"]["Enums"]["site_key"]
          slug?: string
          status?: Database["public"]["Enums"]["publish_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      post_categories: {
        Row: {
          category_id: string
          post_id: string
        }
        Insert: {
          category_id: string
          post_id: string
        }
        Update: {
          category_id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_categories_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_categories_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "site_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_site_overrides: {
        Row: {
          body: string | null
          editor_note: string | null
          excerpt: string | null
          featured_image: string | null
          post_id: string
          seo_description: string | null
          seo_title: string | null
          site: Database["public"]["Enums"]["site_key"]
          slug: string | null
          title: string | null
        }
        Insert: {
          body?: string | null
          editor_note?: string | null
          excerpt?: string | null
          featured_image?: string | null
          post_id: string
          seo_description?: string | null
          seo_title?: string | null
          site: Database["public"]["Enums"]["site_key"]
          slug?: string | null
          title?: string | null
        }
        Update: {
          body?: string | null
          editor_note?: string | null
          excerpt?: string | null
          featured_image?: string | null
          post_id?: string
          seo_description?: string | null
          seo_title?: string | null
          site?: Database["public"]["Enums"]["site_key"]
          slug?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_site_overrides_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_site_overrides_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "site_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "site_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string | null
          body: string
          created_at: string
          excerpt: string
          featured_image: string | null
          id: string
          image_alt: string | null
          primary_site: Database["public"]["Enums"]["site_key"]
          published_at: string | null
          region: Database["public"]["Enums"]["post_region"]
          seo_description: string | null
          seo_title: string | null
          sites: Database["public"]["Enums"]["site_key"][]
          slug: string
          status: Database["public"]["Enums"]["publish_status"]
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          body?: string
          created_at?: string
          excerpt?: string
          featured_image?: string | null
          id?: string
          image_alt?: string | null
          primary_site: Database["public"]["Enums"]["site_key"]
          published_at?: string | null
          region?: Database["public"]["Enums"]["post_region"]
          seo_description?: string | null
          seo_title?: string | null
          sites: Database["public"]["Enums"]["site_key"][]
          slug: string
          status?: Database["public"]["Enums"]["publish_status"]
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          body?: string
          created_at?: string
          excerpt?: string
          featured_image?: string | null
          id?: string
          image_alt?: string | null
          primary_site?: Database["public"]["Enums"]["site_key"]
          published_at?: string | null
          region?: Database["public"]["Enums"]["post_region"]
          seo_description?: string | null
          seo_title?: string | null
          sites?: Database["public"]["Enums"]["site_key"][]
          slug?: string
          status?: Database["public"]["Enums"]["publish_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          ad_network_id: string | null
          ads_enabled: boolean
          company_number: string | null
          consent_body: string
          consent_title: string
          contact_email: string | null
          cookie_page_slug: string
          default_seo_description: string | null
          default_seo_title: string | null
          do_not_sell_page_slug: string | null
          footer_note: string | null
          ico_registration: string | null
          legal_entity_name: string | null
          privacy_page_slug: string
          registered_address: string | null
          site: Database["public"]["Enums"]["site_key"]
          tagline: string | null
          updated_at: string
          vat_number: string | null
        }
        Insert: {
          ad_network_id?: string | null
          ads_enabled?: boolean
          company_number?: string | null
          consent_body?: string
          consent_title?: string
          contact_email?: string | null
          cookie_page_slug?: string
          default_seo_description?: string | null
          default_seo_title?: string | null
          do_not_sell_page_slug?: string | null
          footer_note?: string | null
          ico_registration?: string | null
          legal_entity_name?: string | null
          privacy_page_slug?: string
          registered_address?: string | null
          site: Database["public"]["Enums"]["site_key"]
          tagline?: string | null
          updated_at?: string
          vat_number?: string | null
        }
        Update: {
          ad_network_id?: string | null
          ads_enabled?: boolean
          company_number?: string | null
          consent_body?: string
          consent_title?: string
          contact_email?: string | null
          cookie_page_slug?: string
          default_seo_description?: string | null
          default_seo_title?: string | null
          do_not_sell_page_slug?: string | null
          footer_note?: string | null
          ico_registration?: string | null
          legal_entity_name?: string | null
          privacy_page_slug?: string
          registered_address?: string | null
          site?: Database["public"]["Enums"]["site_key"]
          tagline?: string | null
          updated_at?: string
          vat_number?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          consent_text: string | null
          created_at: string
          email: string
          id: string
          site: Database["public"]["Enums"]["site_key"]
        }
        Insert: {
          consent_text?: string | null
          created_at?: string
          email: string
          id?: string
          site: Database["public"]["Enums"]["site_key"]
        }
        Update: {
          consent_text?: string | null
          created_at?: string
          email?: string
          id?: string
          site?: Database["public"]["Enums"]["site_key"]
        }
        Relationships: []
      }
      tags: {
        Row: {
          id: string
          name: string
          site: Database["public"]["Enums"]["site_key"]
          slug: string
        }
        Insert: {
          id?: string
          name: string
          site: Database["public"]["Enums"]["site_key"]
          slug: string
        }
        Update: {
          id?: string
          name?: string
          site?: Database["public"]["Enums"]["site_key"]
          slug?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      site_posts: {
        Row: {
          author_avatar: string | null
          author_name: string | null
          author_role: string | null
          author_slug: string | null
          body: string | null
          category_name: string | null
          category_slug: string | null
          counterpart_site: Database["public"]["Enums"]["site_key"] | null
          counterpart_slug: string | null
          editor_note: string | null
          excerpt: string | null
          featured_image: string | null
          id: string | null
          image_alt: string | null
          is_shared: boolean | null
          primary_site: Database["public"]["Enums"]["site_key"] | null
          primary_slug: string | null
          published_at: string | null
          region: Database["public"]["Enums"]["post_region"] | null
          seo_description: string | null
          seo_title: string | null
          site: Database["public"]["Enums"]["site_key"] | null
          sites: Database["public"]["Enums"]["site_key"][] | null
          slug: string | null
          title: string | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
      request_site: {
        Args: never
        Returns: Database["public"]["Enums"]["site_key"]
      }
    }
    Enums: {
      app_role: "admin" | "editor"
      post_region: "global" | "us" | "uk" | "europe"
      publish_status: "draft" | "published"
      site_key: "com" | "uk"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "editor"],
      post_region: ["global", "us", "uk", "europe"],
      publish_status: ["draft", "published"],
      site_key: ["com", "uk"],
    },
  },
} as const
