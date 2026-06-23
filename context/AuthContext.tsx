'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

interface UserProfile {
  id: string;
  email: string;
  role: 'student' | 'admin';
  name: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; role?: 'student' | 'admin'; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load session on startup
  useEffect(() => {
    async function loadSession() {
      try {
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              role: (session.user.user_metadata?.role as 'student' | 'admin') || 'student',
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            });
          }
          
          // Listen for auth state changes
          const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                role: (session.user.user_metadata?.role as 'student' | 'admin') || 'student',
                name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              });
            } else {
              setUser(null);
            }
          });

          return () => {
            subscription.unsubscribe();
          };
        } else {
          // Dev Sandbox LocalStorage Fallback
          const savedSession = sessionStorage.getItem('tesca_dev_session');
          if (savedSession) {
            setUser(JSON.parse(savedSession));
          }
        }
      } catch (err) {
        console.error('Session loading failed', err);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || '',
            role: (data.user.user_metadata?.role as 'student' | 'admin') || 'student',
            name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
          };
          setUser(profile);
          return { success: true, role: profile.role };
        }
        return { success: false, error: 'User login data unavailable' };
      } else {
        // Dev Sandbox Mock Authentication logic
        await new Promise((r) => setTimeout(r, 800)); // Simulate networking delay
        
        if (email === 'admin@tesca.com' && password === 'password') {
          const profile: UserProfile = {
            id: 'dev-admin-id',
            email: 'admin@tesca.com',
            role: 'admin',
            name: 'Admin User',
          };
          sessionStorage.setItem('tesca_dev_session', JSON.stringify(profile));
          setUser(profile);
          return { success: true, role: 'admin' as const };
        } else if (email === 'student@tesca.com' && password === 'password') {
          const profile: UserProfile = {
            id: 'dev-student-id',
            email: 'student@tesca.com',
            role: 'student',
            name: 'Student User',
          };
          sessionStorage.setItem('tesca_dev_session', JSON.stringify(profile));
          setUser(profile);
          return { success: true, role: 'student' as const };
        } else {
          return { success: false, error: 'Invalid username or password. Please use admin@tesca.com or student@tesca.com.' };
        }
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Authentication error' };
    }
  };

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    } else {
      sessionStorage.removeItem('tesca_dev_session');
    }
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
