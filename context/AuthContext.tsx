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

              // No profile exists — user hasn't been set up by admin yet
              if (!profile) {
                console.warn(`[Auth] No profile found for ${email}. User must be created by an admin.`);
                setLoading(false);
                return;
              }

              setUser({
                id: session.user.id,
                email,
                role: resolvedRole,
                name: profile.name || session.user.user_metadata?.name || email.split('@')[0] || 'User',
                needsPasswordChange: !!profile.needs_password_change,
              });
            }
            
            // Listen for auth state changes
            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
              if (event === 'PASSWORD_RECOVERY') {
                router.push('/reset-password');
                return;
              }
              if (session?.user) {
                // Ensure session cookie is set for server middleware
                document.cookie = 'sb-session-active=true; path=/; max-age=86400;';

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

                // No profile exists — user hasn't been set up by admin yet
                if (!profile) {
                  console.warn(`[Auth] No profile found for ${email} on auth-state-change. User must be created by an admin.`);
                  setUser(null);
                  return;
                }

                setUser({
                  id: session.user.id,
                  email,
                  role: resolvedRole,
                  name: profile.name || session.user.user_metadata?.name || email.split('@')[0] || 'User',
                  needsPasswordChange: !!profile.needs_password_change,
                });
              } else {
                // Clear session cookie for server middleware
                document.cookie = 'sb-session-active=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
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
            // Keep the mock middleware session cookie active
            document.cookie = `sb-mock-session=true; path=/; max-age=86400;`;
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
      // Write mock session cookie to satisfy middleware check
      document.cookie = `sb-mock-session=true; path=/; max-age=86400;`;
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
            // Write session cookie synchronously before redirecting to satisfy middleware
            document.cookie = 'sb-session-active=true; path=/; max-age=86400;';

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

            // No profile exists — user hasn't been set up by admin yet
            if (!profile) {
              console.warn(`[Auth] No profile found for ${email} on login. User must be created by an admin.`);
              return { success: false, error: 'Your account has not been set up yet. Please contact an administrator.' };
            }

            // Check if student has paid (has an active course enrollment)
            if (resolvedRole === 'student') {
              const { data: enrollmentRecord, error: enrollmentError } = await supabase
                .from('enrollments')
                .select('status')
                .eq('student_id', data.user.id)
                .eq('status', 'active')
                .limit(1)
                .maybeSingle();

              if (enrollmentError || !enrollmentRecord) {
                console.warn(`[Auth] Enrollment check failed or no active enrollment found for ${email}`);
                await supabase.auth.signOut();
                return { success: false, error: 'Access denied: No valid course purchase or active enrollment found.' };
              }
            }

            const profileData: UserProfile = {
              id: data.user.id,
              email,
              role: resolvedRole,
              name: profile.name || data.user.user_metadata?.name || email.split('@')[0] || 'User',
              needsPasswordChange: !!profile.needs_password_change,
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
    // Expire mock session cookie
    document.cookie = `sb-mock-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
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
