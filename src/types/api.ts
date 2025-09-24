// API related types for WAY Esports

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  retries: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  status?: number;
}

export interface ApiRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

export interface ApiTokens {
  accessToken?: string;
  refreshToken?: string;
}

// Specific API endpoint response types
export interface LoginResponse {
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
  tokens: {
    access: string;
    refresh: string;
  };
}

export interface TournamentListResponse {
  tournaments: any[];
  total: number;
  page: number;
  limit: number;
}

export interface TeamListResponse {
  teams: any[];
  total: number;
  page: number;
  limit: number;
}

export interface NewsListResponse {
  news: any[];
  total: number;
  page: number;
  limit: number;
}

// API status types
export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';