// lib/admin-auth-context.tsx
'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AdminUser {
  username: string;
  role: 'ADMIN';
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Hardcoded admin credentials (you can move this to env variables)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123', // Change this to a secure password
};

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = () => {
    try {
      const adminData = localStorage.getItem('admin-auth');
      if (adminData) {
        const parsed = JSON.parse(adminData);
        setAdmin(parsed);
      }
    } catch (error) {
      console.error('Admin auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    // Simple credential check (in production, this should be server-side)
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const adminUser: AdminUser = { username, role: 'ADMIN' };
      setAdmin(adminUser);
      localStorage.setItem('admin-auth', JSON.stringify(adminUser));
    } else {
      throw new Error('Invalid admin credentials');
    }
  };

  const logout = async () => {
    setAdmin(null);
    localStorage.removeItem('admin-auth');
  };

  return (
    <AdminAuthContext.Provider value={{
      admin,
      loading,
      login,
      logout,
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};