import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { type Notification as AppNotification, NotificationType } from '../types';

// Toast Notification Interface
export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Notification Context Interface
export interface NotificationContextType {
  toasts: ToastNotification[];
  showToast: (toast: Omit<ToastNotification, 'id'>) => void;
  dismissToast: (id: string) => void;
  clearAllToasts: () => void;
  requestPermission: () => Promise<NotificationPermission>;
  sendBrowserNotification: (title: string, options?: NotificationOptions) => void;
}

// Create Context
const NotificationContext = createContext<NotificationContextType | null>(null);

// Provider Component
interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Show toast notification
  const showToast = useCallback((toast: Omit<ToastNotification, 'id'>) => {
    const id = Date.now().toString();
    const newToast: ToastNotification = {
      ...toast,
      id,
      duration: toast.duration ?? 5000, // 5 seconds default
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-dismiss after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, newToast.duration);
    }
  }, []);

  // Dismiss specific toast
  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Clear all toasts
  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Request browser notification permission
  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    return permission;
  }, []);

  // Send browser notification
  const sendBrowserNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      return notification;
    } else {
      console.warn('Notification permission not granted');
    }
  }, []);

  const contextValue: NotificationContextType = {
    toasts,
    showToast,
    dismissToast,
    clearAllToasts,
    requestPermission,
    sendBrowserNotification,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom Hook
export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Convenience hooks for different notification types
export const useToast = () => {
  const { showToast } = useNotification();

  return {
    success: (message: string, title = 'Success') =>
      showToast({ title, message, type: 'success' }),
    error: (message: string, title = 'Error') =>
      showToast({ title, message, type: 'error' }),
    warning: (message: string, title = 'Warning') =>
      showToast({ title, message, type: 'warning' }),
    info: (message: string, title = 'Info') =>
      showToast({ title, message, type: 'info' }),
  };
};