'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import authService, { User } from '@/services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  loading: boolean;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we have a token and user data in localStorage first
        if (authService.isAuthenticated()) {
          // Try to get user from localStorage first for immediate UI update
          const localUser = authService.getUser();
          if (localUser) {
            setUser(localUser);
            setIsAuthenticated(true);
          }
          
          // Then verify with backend to get fresh user data
          const result = await authService.verifyToken();
          if (result.valid && result.user) {
            setUser(result.user);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear storage
            await authService.logout();
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // On network errors during initialization, keep user logged in if they have valid local data
        const localUser = authService.getUser();
        if (localUser && authService.isAuthenticated()) {
          setUser(localUser);
          setIsAuthenticated(true);
        } else {
          await authService.logout();
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const result = await authService.login(email, password);
      
      if (result.success && result.user) {
        setIsAuthenticated(true);
        setUser(result.user);
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login' };
    }
  };

  const logout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      return await authService.changePassword(currentPassword, newPassword);
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, message: 'An error occurred while changing password' };
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      if (authService.isAuthenticated()) {
        const result = await authService.verifyToken();
        if (result.valid && result.user) {
          setUser(result.user);
          setIsAuthenticated(true);
        } else {
          // Only logout if token is explicitly invalid, not on network errors
          await authService.logout();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error('Refresh user error:', error);
      // On network errors, don't automatically logout - keep user logged in
      // Only logout if we can't verify the token due to server issues
      // This prevents users from being logged out due to temporary network issues
    }
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
    changePassword,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 