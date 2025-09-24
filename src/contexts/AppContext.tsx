import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { config } from '../config/env';
import { User, Notification, ApiStatus } from '../types';

// App State Interface
export interface AppState {
  isInitialized: boolean;
  isLoading: boolean;
  user: User | null;
  notifications: Notification[];
  unreadNotifications: number;
  currentPage: string;
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  uiMode: 'original' | 'polished';
  apiStatus: ApiStatus;
  error: string | null;
}

// App Actions
export type AppAction =
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'SET_CURRENT_PAGE'; payload: string }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_UI_MODE'; payload: 'original' | 'polished' }
  | { type: 'SET_API_STATUS'; payload: ApiStatus }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' };

// Initial State
const initialState: AppState = {
  isInitialized: false,
  isLoading: false,
  user: null,
  notifications: [],
  unreadNotifications: 0,
  currentPage: '/',
  sidebarOpen: false,
  theme: 'dark',
  uiMode: config.ENABLE_POLISHED_UI ? 'polished' : 'original',
  apiStatus: 'idle',
  error: null,
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_INITIALIZED':
      return { ...state, isInitialized: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_NOTIFICATIONS':
      return { 
        ...state, 
        notifications: action.payload,
        unreadNotifications: action.payload.filter(n => !n.isRead).length
      };
    case 'ADD_NOTIFICATION':
      return { 
        ...state, 
        notifications: [action.payload, ...state.notifications],
        unreadNotifications: state.unreadNotifications + 1
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, isRead: true } : n
        ),
        unreadNotifications: Math.max(0, state.unreadNotifications - 1)
      };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_UI_MODE':
      return { ...state, uiMode: action.payload };
    case 'SET_API_STATUS':
      return { ...state, apiStatus: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider Component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize app on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        // Initialize Telegram WebApp if available
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.ready();
          window.Telegram.WebApp.expand();
          
          // Get user data from Telegram
          const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
          if (telegramUser) {
            const user: User = {
              id: telegramUser.id.toString(),
              username: telegramUser.username || telegramUser.first_name,
              firstName: telegramUser.first_name,
              lastName: telegramUser.last_name,
              telegramId: telegramUser.id.toString(),
              role: 'player',
              isOnline: true,
              joinedAt: new Date(),
            };
            dispatch({ type: 'SET_USER', payload: user });
          }
        }

        // Simulate initialization delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        dispatch({ type: 'SET_INITIALIZED', payload: true });
      } catch (error) {
        console.error('App initialization failed:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize application' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeApp();
  }, []);

  // Update page on route change
  useEffect(() => {
    const handleRouteChange = () => {
      dispatch({ type: 'SET_CURRENT_PAGE', payload: window.location.pathname });
    };

    handleRouteChange();
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom Hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Helper functions
export const useNotifications = () => {
  const { state, dispatch } = useApp();
  
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date(),
      isRead: false,
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
  };

  const markAsRead = (notificationId: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
  };

  return {
    notifications: state.notifications,
    unreadCount: state.unreadNotifications,
    addNotification,
    markAsRead,
  };
};