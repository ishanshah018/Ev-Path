import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  location: string;
  hasCompletedOnboarding: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, phone: string, location: string) => Promise<void>;
  logout: () => void;
  completeOnboarding: () => void;
}

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

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    const mockUser = {
      id: '1',
      email,
      name: email.split('@')[0],
      phone: '+91 98765 43210',
      location: 'New Delhi, India',
      hasCompletedOnboarding: Math.random() > 0.5
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const signup = async (email: string, password: string, name: string, phone: string, location: string) => {
    // Simulate API call
    const mockUser = {
      id: '1',
      email,
      name,
      phone,
      location,
      hasCompletedOnboarding: false
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const completeOnboarding = () => {
    if (user) {
      const updatedUser = { ...user, hasCompletedOnboarding: true };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
};