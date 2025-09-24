// Environment configuration for WAY Esports
// This includes the ENABLE_POLISHED_UI flag functionality

export const config = {
  // UI Enhancement Flag - controls polished UI mode
  ENABLE_POLISHED_UI: process.env.NODE_ENV === 'development' ? true : false,
  
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  
  // Telegram WebApp Configuration
  TELEGRAM_BOT_TOKEN: import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '',
  
  // Feature Flags
  FEATURES: {
    ADMIN_PANEL: true,
    NOTIFICATIONS: true,
    TOURNAMENTS: true,
    TEAMS: true,
    NEWS: true,
    PROFILE: true,
  },
  
  // Application Settings
  APP_NAME: 'WAY Esports',
  VERSION: '1.0.0',
  
  // Development Settings
  DEBUG: import.meta.env.DEV,
  
  // Social Links
  SOCIAL_LINKS: {
    TELEGRAM: import.meta.env.VITE_TELEGRAM_CHANNEL || '',
    DISCORD: import.meta.env.VITE_DISCORD_INVITE || '',
    TWITTER: import.meta.env.VITE_TWITTER_URL || '',
  }
};

// Type definitions for environment variables
declare global {
  interface ImportMetaEnv {
    VITE_API_BASE_URL?: string;
    VITE_TELEGRAM_BOT_TOKEN?: string;
    VITE_TELEGRAM_CHANNEL?: string;
    VITE_DISCORD_INVITE?: string;
    VITE_TWITTER_URL?: string;
  }
}

export default config;