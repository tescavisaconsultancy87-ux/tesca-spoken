'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, ensureSupabaseClient } from '@/lib/supabaseClient';
import { isAdminEmail, isTutorEmail, formatFriendlyError } from '@/lib/security';

interface UserProfile {
  id: string;
  email: string;
  role: 'student' | 'admin' | 'tutor';
  name: string;
  needsPasswordChange: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; role?: 'student' | 'admin' | 'tutor'; needsPasswordChange?: boolean; error?: string }>;
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
      let devSessionLoaded = false;
      try {
        await ensureSupabaseClient();
        if (supabase) {
          try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
              const email = session.user.email || '';
              const { data: profile } = await supabase.from('profiles').select('role, name, needs_password_change').eq('id', session.user.id).single();
              
              let resolvedRole: 'student' | 'admin' | 'tutor' = 'student';
              if (isAdminEmail(email)) {
                resolvedRole = 'admin';
              } else if (isTutorEmail(email)) {
                resolvedRole = 'tutor';
              } else {
                resolvedRole = (profile?.role as 'student' | 'admin' | 'tutor') || (session.user.user_metadata?.role as 'student' | 'admin' | 'tutor') || 'student';
              }

              // Self-healing database upsert if role differs or profile is missing
              if (supabase && (!profile || profile.role !== resolvedRole)) {
                console.log(`[Auth] Self-healing profile for ${email} with role ${resolvedRole}`);
                await supabase.from('profiles').upsert({
                  id: session.user.id,
                  email: email,
                  role: resolvedRole,
                  name: profile?.name || session.user.user_metadata?.name || email.split('@')[0] || 'User',
                });
              }

              setUser({
                id: session.user.id,
                email,
                role: resolvedRole,
                name: profile?.name || session.user.user_metadata?.name || email.split('@')[0] || 'User',
                needsPasswordChange: profile ? !!profile.needs_password_change : false,
              });
            }
            
            // Listen for auth state changes
            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
              if (event === 'PASSWORD_RECOVERY') {
                router.push('/reset-password');
                return;
              }
              if (session?.user) {
                const email = session.user.email || '';
                const { data: profile } = await supabase!.from('profiles').select('role, name, needs_password_change').eq('id', session.user.id).single();
                
                let resolvedRole: 'student' | 'admin' | 'tutor' = 'student';
                if (isAdminEmail(email)) {
                  resolvedRole = 'admin';
                } else if (isTutorEmail(email)) {
                  resolvedRole = 'tutor';
                } else {
                  resolvedRole = (profile?.role as 'student' | 'admin' | 'tutor') || (session.user.user_metadata?.role as 'student' | 'admin' | 'tutor') || 'student';
                }

                // Self-healing
                if (supabase && (!profile || profile.role !== resolvedRole)) {
                  console.log(`[Auth] Self-healing profile on auth-change for ${email}`);
                  await supabase.from('profiles').upsert({
                    id: session.user.id,
                    email: email,
                    role: resolvedRole,
                    name: profile?.name || session.user.user_metadata?.name || email.split('@')[0] || 'User',
                  });
                }

                setUser({
                  id: session.user.id,
                  email,
                  role: resolvedRole,
                  name: profile?.name || session.user.user_metadata?.name || email.split('@')[0] || 'User',
                  needsPasswordChange: profile ? !!profile.needs_password_change : false,
                });
              } else {
                setUser(null);
              }
            });

            return () => {
              subscription.unsubscribe();
            };
          } catch (supabaseError: any) {
            const isNetworkError = 
              supabaseError.name === 'AuthRetryableFetchError' || 
              supabaseError.message?.includes('fetch') || 
              supabaseError.message?.includes('NetworkError') || 
              supabaseError.status === 0;

            if (isNetworkError && process.env.NODE_ENV === 'development') {
              console.warn('[Auth] Supabase session fetch failed due to connection/network error. Checking local mock session.');
              devSessionLoaded = true;
            } else {
              throw supabaseError;
            }
          }
        }
      } catch (err) {
        console.error('Session loading failed', err);
      } finally {
        if (!supabase || devSessionLoaded) {
          // Dev Sandbox LocalStorage Fallback
          const savedSession = sessionStorage.getItem('tesca_dev_session');
          if (savedSession) {
            setUser(JSON.parse(savedSession));
          }
        }
        setLoading(false);
      }
    }
    loadSession();
  }, []);

  const performMockLogin = async (email: string, password: string) => {
    console.warn('[Auth] Falling back to local mock authentication.');
    await new Promise((r) => setTimeout(r, 800)); // Simulate networking delay
    
    const isTemp = password === 'temp123';
    
    // Dynamically resolve role for sandbox fallback
    let role: 'student' | 'admin' | 'tutor' = 'student';
    if (isAdminEmail(email)) {
      role = 'admin';
    } else if (isTutorEmail(email)) {
      role = 'tutor';
    }

    const cleanEmail = email.trim().toLowerCase();
    const namePrefix = cleanEmail.split('@')[0] || 'User';
    const friendlyName = namePrefix.charAt(0).toUpperCase() + namePrefix.slice(1);

    // Accept default password or temp123 for any email to facilitate developer local sandbox flow
    if (password === 'password' || isTemp) {
      const profile: UserProfile = {
        id: `dev-${role}-${cleanEmail.replace(/[^a-z0-9]/g, '-')}`,
        email: cleanEmail,
        role,
        name: friendlyName,
        needsPasswordChange: isTemp,
      };
      sessionStorage.setItem('tesca_dev_session', JSON.stringify(profile));
      setUser(profile);
      return { success: true, role, needsPasswordChange: isTemp };
    } else {
      return { success: false, error: 'Invalid username or password.' };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await ensureSupabaseClient();
      if (supabase) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          
          if (data.user) {
            const email = data.user.email || '';
            const { data: profile } = await supabase
              .from('profiles')
              .select('role, name, needs_password_change')
              .eq('id', data.user.id)
              .single();

            let resolvedRole: 'student' | 'admin' | 'tutor' = 'student';
            if (isAdminEmail(email)) {
              resolvedRole = 'admin';
            } else if (isTutorEmail(email)) {
              resolvedRole = 'tutor';
            } else {
              resolvedRole = (profile?.role as 'student' | 'admin' | 'tutor') || (data.user.user_metadata?.role as 'student' | 'admin' | 'tutor') || 'student';
            }

            // Self-healing
            if (!profile || profile.role !== resolvedRole) {
              console.log(`[Auth] Self-healing profile on login for ${email}`);
              await supabase.from('profiles').upsert({
                id: data.user.id,
                email: email,
                role: resolvedRole,
                name: profile?.name || data.user.user_metadata?.name || email.split('@')[0] || 'User',
              });
            }

            const profileData: UserProfile = {
              id: data.user.id,
              email,
              role: resolvedRole,
              name: profile?.name || data.user.user_metadata?.name || email.split('@')[0] || 'User',
              needsPasswordChange: profile ? !!profile.needs_password_change : false,
            };
            setUser(profileData);
            return { success: true, role: profileData.role, needsPasswordChange: profileData.needsPasswordChange };
          }
          return { success: false, error: 'User login data unavailable' };
        } catch (supabaseError: any) {
          const isNetworkError = 
            supabaseError.name === 'AuthRetryableFetchError' || 
            supabaseError.message?.includes('fetch') || 
            supabaseError.message?.includes('NetworkError') || 
            supabaseError.status === 0;

          if (isNetworkError && process.env.NODE_ENV === 'development') {
            const targetUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'undefined';
            console.warn(`[Auth] Supabase login failed due to connection/network error. Target URL: "${targetUrl}". Falling back to local mock authentication.`, supabaseError);
            return await performMockLogin(email, password);
          }
          throw supabaseError;
        }
      } else {
        return await performMockLogin(email, password);
      }
    } catch (error: any) {
      return { success: false, error: formatFriendlyError(error) };
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
