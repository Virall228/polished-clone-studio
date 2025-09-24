import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginFormData, RegisterFormData } from '../types';
import { config } from '../config/env';

// Auth State Interface
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
}

// Auth Context Interface
export interface AuthContextType extends AuthState {
  login: (credentials: LoginFormData) => Promise<void>;
  register: (userData: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

// Create Context
const AuthContext = createContext<AuthContextType | null>(null);

// Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: false,
    user: null,
    error: null,
  });

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      setState(prev => ({ ...prev, isLoading: true }));
      
      try {
        // Check if we have a token stored
        const token = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user_data');
        
        if (token && storedUser) {
          const user = JSON.parse(storedUser);
          setState(prev => ({
            ...prev,
            isAuthenticated: true,
            user,
            isLoading: false,
          }));
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Authentication check failed',
        }));
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginFormData): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Mock login for now - in real app this would call API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const mockUser: User = {
        id: '1',
        username: credentials.username,
        email: 'user@wayesports.com',
        role: 'player',
        isOnline: true,
        joinedAt: new Date(),
      };

      // Store auth data
      localStorage.setItem('auth_token', 'mock_token_' + Date.now());
      localStorage.setItem('user_data', JSON.stringify(mockUser));
      
      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        user: mockUser,
        isLoading: false,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Login failed',
      }));
      throw error;
    }
  };

  // Register function
  const register = async (userData: RegisterFormData): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Mock registration - in real app this would call API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (userData.password !== userData.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      const mockUser: User = {
        id: Date.now().toString(),
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'player',
        isOnline: true,
        joinedAt: new Date(),
      };

      // Store auth data
      localStorage.setItem('auth_token', 'mock_token_' + Date.now());
      localStorage.setItem('user_data', JSON.stringify(mockUser));
      
      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        user: mockUser,
        isLoading: false,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Registration failed',
      }));
      throw error;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Clear stored auth data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      
      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: null,
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Logout failed',
      }));
    }
  };

  // Clear error function
  const clearError = (): void => {
    setState(prev => ({ ...prev, error: null }));
  };

  // Update profile function
  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!state.user) throw new Error('User not authenticated');
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Mock profile update - in real app this would call API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUser = { ...state.user, ...updates };
      
      // Update stored user data
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      
      setState(prev => ({
        ...prev,
        user: updatedUser,
        isLoading: false,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Profile update failed',
      }));
      throw error;
    }
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};