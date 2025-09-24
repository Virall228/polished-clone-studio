// Core types for WAY Esports application

export interface User {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
  telegramId?: string;
  role: UserRole;
  isOnline: boolean;
  lastSeen?: Date;
  joinedAt: Date;
  stats?: UserStats;
}

export type UserRole = 'admin' | 'moderator' | 'player' | 'viewer';

export interface UserStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  rank?: string;
  points: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Team {
  id: string;
  name: string;
  tag: string;
  logo?: string;
  description?: string;
  members: TeamMember[];
  captain: string; // user id
  game: Game;
  stats: TeamStats;
  createdAt: Date;
  isActive: boolean;
}

export interface TeamMember {
  userId: string;
  user: User;
  role: TeamRole;
  joinedAt: Date;
  isActive: boolean;
}

export type TeamRole = 'captain' | 'player' | 'substitute';

export interface TeamStats {
  matchesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  points: number;
  ranking: number;
  lastMatch?: Date;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  game: Game;
  format: TournamentFormat;
  status: TournamentStatus;
  prizePool: number;
  maxParticipants: number;
  participants: TournamentParticipant[];
  startDate: Date;
  endDate?: Date;
  registrationDeadline: Date;
  rules: string;
  organizer: User;
  createdAt: Date;
  brackets?: TournamentBracket[];
}

export type TournamentFormat = 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss';
export type TournamentStatus = 'upcoming' | 'registration_open' | 'ongoing' | 'completed' | 'cancelled';

export interface TournamentParticipant {
  id: string;
  tournament: Tournament;
  team?: Team;
  user?: User; // for individual tournaments
  registeredAt: Date;
  isActive: boolean;
}

export interface TournamentBracket {
  id: string;
  tournament: Tournament;
  round: number;
  matches: Match[];
}

export interface Match {
  id: string;
  tournament?: Tournament;
  team1: Team;
  team2: Team;
  score1: number;
  score2: number;
  status: MatchStatus;
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  map?: string;
  round?: number;
  winner?: Team;
}

export type MatchStatus = 'scheduled' | 'live' | 'completed' | 'postponed' | 'cancelled';

export interface Game {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  isActive: boolean;
  modes: GameMode[];
}

export interface GameMode {
  id: string;
  name: string;
  teamSize: number;
  maps: string[];
}

export interface News {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  author: User;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  status: NewsStatus;
  tags: string[];
  category: NewsCategory;
  views: number;
}

export type NewsStatus = 'draft' | 'published' | 'archived';
export type NewsCategory = 'tournament' | 'team' | 'player' | 'game_update' | 'announcement' | 'general';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'tournament' | 'team' | 'match';

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Component Props types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Theme types
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  border: {
    light: string;
    medium: string;
    strong: string;
  };
}

// Telegram WebApp types
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
        };
        showAlert: (message: string) => void;
        showConfirm: (message: string, callback: (confirmed: boolean) => void) => void;
      };
    };
  }
}

export * from './api';
export * from './forms';