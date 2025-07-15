import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface SupabaseAuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  signInWithOAuth: (provider: 'google' | 'github' | 'apple') => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

export const useSupabaseAuth = (): SupabaseAuthContextType => {
  const context = useContext(SupabaseAuthContext);
  if (!context) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};

interface SupabaseAuthProviderProps {
  children: ReactNode;
}

export const SupabaseAuthProvider: React.FC<SupabaseAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initializationAttempts, setInitializationAttempts] = useState(0);

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    // Get initial session with retry logic for iOS Safari
    const getInitialSession = async (attempt = 1) => {
      console.log(`🔐 [AUTH-DEBUG] Getting initial session... (attempt ${attempt})`);
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        
        if (error) {
          console.error('Error getting initial session:', error);
          
          // Retry logic for iOS Safari issues
          if (attempt < 3 && mounted) {
            console.log(`🔐 [AUTH-DEBUG] Retrying session fetch in 500ms...`);
            timeoutId = setTimeout(() => {
              if (mounted) {
                getInitialSession(attempt + 1);
              }
            }, 500);
            return;
          }
        } else {
          if (mounted) {
            setSession(session);
            setUser(session?.user ?? null);
          }
        }
      } catch (error) {
        console.error('Exception getting initial session:', error);
        
        // Retry logic for network/connectivity issues
        if (attempt < 3 && mounted) {
          console.log(`🔐 [AUTH-DEBUG] Retrying due to exception in 1000ms...`);
          timeoutId = setTimeout(() => {
            if (mounted) {
              getInitialSession(attempt + 1);
            }
          }, 1000);
          return;
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setInitializationAttempts(attempt);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes with error handling
    console.log('🔐 [AUTH-DEBUG] Setting up auth state change listener...');
    let subscription: any;
    
    try {
      const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('🔐 [AUTH-DEBUG] Auth state changed:', event, session?.user?.id);
          if (mounted) {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
          }
        }
      );
      subscription = authSubscription;
      console.log('✅ [AUTH-DEBUG] Auth state change listener set up successfully');
    } catch (error) {
      console.error('❌ [AUTH-DEBUG] Failed to set up auth state listener:', error);
      if (mounted) {
        setLoading(false);
      }
    }

    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (subscription) {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error('Error unsubscribing from auth changes:', error);
        }
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('🔐 [AUTH-DEBUG] Attempting sign in...');
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      return { error };
    } catch (error) {
      console.error('🔐 [AUTH-DEBUG] Sign in exception:', error);
      return { error: error as AuthError };
    }
  };

  const signUp = async (email: string, password: string) => {
    console.log('🔐 [AUTH-DEBUG] Attempting sign up...');
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      return { error };
    } catch (error) {
      console.error('🔐 [AUTH-DEBUG] Sign up exception:', error);
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    console.log('🔐 [AUTH-DEBUG] Attempting sign out...');
    try {
      const { error } = await supabase.auth.signOut();
      
      return { error };
    } catch (error) {
      console.error('🔐 [AUTH-DEBUG] Sign out exception:', error);
      return { error: error as AuthError };
    }
  };

  const signInWithOAuth = async (provider: 'google' | 'github' | 'apple') => {
    console.log(`🔐 [AUTH-DEBUG] Attempting OAuth sign in with ${provider}...`);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/home`
        }
      });
      
      return { error };
    } catch (error) {
      console.error('🔐 [AUTH-DEBUG] OAuth exception:', error);
      return { error: error as AuthError };
    }
  };

  const resetPassword = async (email: string) => {
    console.log('🔐 [AUTH-DEBUG] Attempting password reset...');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      return { error };
    } catch (error) {
      console.error('🔐 [AUTH-DEBUG] Password reset exception:', error);
      return { error: error as AuthError };
    }
  };

  const value: SupabaseAuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithOAuth,
    resetPassword,
  };

  // Log current auth state for debugging
  console.log('🔐 [AUTH-DEBUG] Current state:', {
    hasUser: !!user,
    hasSession: !!session,
    loading,
    initializationAttempts
  });

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};
