import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, User } from '../types';
import { getUser, saveUser, clearUser } from '../utils/localStorage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = getUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    // Simple validation - in real app, this would be an API call
    if (email && password) {
      const name = email.split('@')[0];
      const userData = { email, name };
      setUser(userData);
      saveUser(userData);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    clearUser();
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};