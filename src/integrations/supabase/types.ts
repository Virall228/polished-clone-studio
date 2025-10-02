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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          rarity: Database["public"]["Enums"]["achievement_rarity"]
        }
        Insert: {
          created_at?: string
          description: string
          icon: string
          id?: string
          name: string
          rarity?: Database["public"]["Enums"]["achievement_rarity"]
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          rarity?: Database["public"]["Enums"]["achievement_rarity"]
        }
        Relationships: []
      }
      game_modes: {
        Row: {
          created_at: string
          game_id: string
          id: string
          maps: string[] | null
          name: string
          team_size: number
        }
        Insert: {
          created_at?: string
          game_id: string
          id?: string
          maps?: string[] | null
          name: string
          team_size: number
        }
        Update: {
          created_at?: string
          game_id?: string
          id?: string
          maps?: string[] | null
          name?: string
          team_size?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_modes_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          created_at: string
          icon: string
          id: string
          is_active: boolean
          name: string
          short_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          icon: string
          id?: string
          is_active?: boolean
          name: string
          short_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          icon?: string
          id?: string
          is_active?: boolean
          name?: string
          short_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          map: string | null
          round: number | null
          scheduled_at: string | null
          score1: number
          score2: number
          started_at: string | null
          status: Database["public"]["Enums"]["match_status"]
          team1_id: string
          team2_id: string
          tournament_id: string | null
          updated_at: string
          winner_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          map?: string | null
          round?: number | null
          scheduled_at?: string | null
          score1?: number
          score2?: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["match_status"]
          team1_id: string
          team2_id: string
          tournament_id?: string | null
          updated_at?: string
          winner_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          map?: string | null
          round?: number | null
          scheduled_at?: string | null
          score1?: number
          score2?: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["match_status"]
          team1_id?: string
          team2_id?: string
          tournament_id?: string | null
          updated_at?: string
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_team1_id_fkey"
            columns: ["team1_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_team2_id_fkey"
            columns: ["team2_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          author_id: string
          category: Database["public"]["Enums"]["news_category"]
          content: string
          cover_image_url: string | null
          created_at: string
          excerpt: string
          id: string
          published_at: string | null
          status: Database["public"]["Enums"]["news_status"]
          tags: string[] | null
          title: string
          updated_at: string
          views: number
        }
        Insert: {
          author_id: string
          category?: Database["public"]["Enums"]["news_category"]
          content: string
          cover_image_url?: string | null
          created_at?: string
          excerpt: string
          id?: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["news_status"]
          tags?: string[] | null
          title: string
          updated_at?: string
          views?: number
        }
        Update: {
          author_id?: string
          category?: Database["public"]["Enums"]["news_category"]
          content?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string
          id?: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["news_status"]
          tags?: string[] | null
          title?: string
          updated_at?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "news_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          metadata: Json | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          metadata?: Json | null
          title: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          metadata?: Json | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          is_online: boolean
          joined_at: string
          last_name: string | null
          last_seen: string | null
          role: Database["public"]["Enums"]["user_role"]
          telegram_id: string | null
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          is_online?: boolean
          joined_at?: string
          last_name?: string | null
          last_seen?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          telegram_id?: string | null
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          is_online?: boolean
          joined_at?: string
          last_name?: string | null
          last_seen?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          telegram_id?: string | null
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_type: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      team_invites: {
        Row: {
          created_at: string
          created_by: string
          expires_at: string
          id: string
          is_active: boolean | null
          max_uses: number | null
          team_id: string
          token: string
          uses_count: number | null
        }
        Insert: {
          created_at?: string
          created_by: string
          expires_at: string
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          team_id: string
          token: string
          uses_count?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string
          expires_at?: string
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          team_id?: string
          token?: string
          uses_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "team_invites_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          id: string
          is_active: boolean
          joined_at: string
          role: Database["public"]["Enums"]["team_role"]
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          is_active?: boolean
          joined_at?: string
          role?: Database["public"]["Enums"]["team_role"]
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          is_active?: boolean
          joined_at?: string
          role?: Database["public"]["Enums"]["team_role"]
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      team_stats: {
        Row: {
          created_at: string
          draws: number
          id: string
          last_match: string | null
          losses: number
          matches_played: number
          points: number
          ranking: number
          team_id: string
          updated_at: string
          win_rate: number
          wins: number
        }
        Insert: {
          created_at?: string
          draws?: number
          id?: string
          last_match?: string | null
          losses?: number
          matches_played?: number
          points?: number
          ranking?: number
          team_id: string
          updated_at?: string
          win_rate?: number
          wins?: number
        }
        Update: {
          created_at?: string
          draws?: number
          id?: string
          last_match?: string | null
          losses?: number
          matches_played?: number
          points?: number
          ranking?: number
          team_id?: string
          updated_at?: string
          win_rate?: number
          wins?: number
        }
        Relationships: [
          {
            foreignKeyName: "team_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: true
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          captain_id: string
          created_at: string
          description: string | null
          game_id: string
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          tag: string
          updated_at: string
        }
        Insert: {
          captain_id: string
          created_at?: string
          description?: string | null
          game_id: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          tag: string
          updated_at?: string
        }
        Update: {
          captain_id?: string
          created_at?: string
          description?: string | null
          game_id?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          tag?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_captain_id_fkey"
            columns: ["captain_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "teams_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      terms_agreements: {
        Row: {
          agreed_at: string
          id: string
          ip_address: string | null
          terms_version: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          agreed_at?: string
          id?: string
          ip_address?: string | null
          terms_version: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          agreed_at?: string
          id?: string
          ip_address?: string | null
          terms_version?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tournament_invites: {
        Row: {
          created_at: string
          created_by: string
          expires_at: string
          id: string
          is_active: boolean | null
          max_uses: number | null
          team_id: string
          token: string
          tournament_id: string
          uses_count: number | null
        }
        Insert: {
          created_at?: string
          created_by: string
          expires_at: string
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          team_id: string
          token: string
          tournament_id: string
          uses_count?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string
          expires_at?: string
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          team_id?: string
          token?: string
          tournament_id?: string
          uses_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tournament_invites_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_invites_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_participants: {
        Row: {
          id: string
          is_active: boolean
          registered_at: string
          team_id: string | null
          terms_agreed: boolean
          terms_agreed_at: string | null
          terms_version: string | null
          tournament_id: string
          user_id: string | null
        }
        Insert: {
          id?: string
          is_active?: boolean
          registered_at?: string
          team_id?: string | null
          terms_agreed?: boolean
          terms_agreed_at?: string | null
          terms_version?: string | null
          tournament_id: string
          user_id?: string | null
        }
        Update: {
          id?: string
          is_active?: boolean
          registered_at?: string
          team_id?: string | null
          terms_agreed?: boolean
          terms_agreed_at?: string | null
          terms_version?: string | null
          tournament_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournament_participants_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_participants_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      tournaments: {
        Row: {
          created_at: string
          description: string
          end_date: string | null
          format: Database["public"]["Enums"]["tournament_format"]
          game_id: string
          id: string
          max_participants: number
          name: string
          organizer_id: string
          prize_pool: number
          registration_deadline: string
          rules: string
          start_date: string
          status: Database["public"]["Enums"]["tournament_status"]
          team_size: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          end_date?: string | null
          format?: Database["public"]["Enums"]["tournament_format"]
          game_id: string
          id?: string
          max_participants?: number
          name: string
          organizer_id: string
          prize_pool?: number
          registration_deadline: string
          rules: string
          start_date: string
          status?: Database["public"]["Enums"]["tournament_status"]
          team_size?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          end_date?: string | null
          format?: Database["public"]["Enums"]["tournament_format"]
          game_id?: string
          id?: string
          max_participants?: number
          name?: string
          organizer_id?: string
          prize_pool?: number
          registration_deadline?: string
          rules?: string
          start_date?: string
          status?: Database["public"]["Enums"]["tournament_status"]
          team_size?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournaments_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournaments_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
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
      user_stats: {
        Row: {
          created_at: string
          games_played: number
          id: string
          losses: number
          points: number
          rank: string | null
          updated_at: string
          user_id: string
          win_rate: number
          wins: number
        }
        Insert: {
          created_at?: string
          games_played?: number
          id?: string
          losses?: number
          points?: number
          rank?: string | null
          updated_at?: string
          user_id: string
          win_rate?: number
          wins?: number
        }
        Update: {
          created_at?: string
          games_played?: number
          id?: string
          losses?: number
          points?: number
          rank?: string | null
          updated_at?: string
          user_id?: string
          win_rate?: number
          wins?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      achievement_rarity: "common" | "rare" | "epic" | "legendary"
      app_role: "admin" | "moderator" | "user"
      match_status:
        | "scheduled"
        | "live"
        | "completed"
        | "postponed"
        | "cancelled"
      news_category:
        | "tournament"
        | "team"
        | "player"
        | "game_update"
        | "announcement"
        | "general"
      news_status: "draft" | "published" | "archived"
      notification_type:
        | "info"
        | "success"
        | "warning"
        | "error"
        | "tournament"
        | "team"
        | "match"
      team_role: "captain" | "player" | "substitute"
      tournament_format:
        | "single_elimination"
        | "double_elimination"
        | "round_robin"
        | "swiss"
      tournament_status:
        | "upcoming"
        | "registration_open"
        | "ongoing"
        | "completed"
        | "cancelled"
      user_role: "admin" | "moderator" | "player" | "viewer"
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
      achievement_rarity: ["common", "rare", "epic", "legendary"],
      app_role: ["admin", "moderator", "user"],
      match_status: [
        "scheduled",
        "live",
        "completed",
        "postponed",
        "cancelled",
      ],
      news_category: [
        "tournament",
        "team",
        "player",
        "game_update",
        "announcement",
        "general",
      ],
      news_status: ["draft", "published", "archived"],
      notification_type: [
        "info",
        "success",
        "warning",
        "error",
        "tournament",
        "team",
        "match",
      ],
      team_role: ["captain", "player", "substitute"],
      tournament_format: [
        "single_elimination",
        "double_elimination",
        "round_robin",
        "swiss",
      ],
      tournament_status: [
        "upcoming",
        "registration_open",
        "ongoing",
        "completed",
        "cancelled",
      ],
      user_role: ["admin", "moderator", "player", "viewer"],
    },
  },
} as const
