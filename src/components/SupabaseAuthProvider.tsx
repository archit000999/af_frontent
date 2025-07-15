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

  useEffect(() => {
    console.log('🔐 [AUTH-DEBUG] SupabaseAuthProvider initializing...');

    // Get initial session
    const getInitialSession = async () => {
      console.log('🔐 [AUTH-DEBUG] Getting initial session...');
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('🔐 [AUTH-DEBUG] Initial session result:', { 
          hasSession: !!session, 
          hasUser: !!session?.user,
          error: error?.message 
        });
        
        if (error) {
          console.error('❌ [AUTH-DEBUG] Error getting initial session:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
          console.log('✅ [AUTH-DEBUG] Initial session set successfully');
        }
      } catch (error) {
        console.error('❌ [AUTH-DEBUG] Exception getting initial session:', error);
      } finally {
        setLoading(false);
        console.log('🔐 [AUTH-DEBUG] Loading state set to false');
      }
    };

    getInitialSession();

    // Listen for auth changes
    console.log('🔐 [AUTH-DEBUG] Setting up auth state change listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 [AUTH-DEBUG] Auth state changed:', { 
          event, 
          hasSession: !!session,
          hasUser: !!session?.user,
          userId: session?.user?.id 
        });
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    console.log('✅ [AUTH-DEBUG] Auth state change listener set up');

    return () => {
      console.log('🔐 [AUTH-DEBUG] Cleaning up auth subscription...');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    return { error };
  };

  const signInWithOAuth = async (provider: 'google' | 'github' | 'apple') => {
    
    // Get the current URL and set appropriate redirect
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
         redirectTo: `${window.location.origin}/home`
      }
    });
    
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    
    return { error };
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

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};
