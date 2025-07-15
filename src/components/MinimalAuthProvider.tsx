import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface MinimalAuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  signInWithOAuth: (provider: 'google' | 'github' | 'apple') => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

const MinimalAuthContext = createContext<MinimalAuthContextType | undefined>(undefined);

export const useMinimalAuth = (): MinimalAuthContextType => {
  const context = useContext(MinimalAuthContext);
  if (!context) {
    throw new Error('useMinimalAuth must be used within a MinimalAuthProvider');
  }
  return context;
};

interface MinimalAuthProviderProps {
  children: ReactNode;
}

export const MinimalAuthProvider: React.FC<MinimalAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false); // Start with false to avoid infinite loops

  console.log('🔐 [MINIMAL-AUTH] Provider initialized with no async operations');

  const signIn = async (email: string, password: string) => {
    console.log('🔐 [MINIMAL-AUTH] Attempting sign in...');
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
      }
      
      return { error };
    } catch (error) {
      console.error('🔐 [MINIMAL-AUTH] Sign in exception:', error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    console.log('🔐 [MINIMAL-AUTH] Attempting sign up...');
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
      }
      
      return { error };
    } catch (error) {
      console.error('🔐 [MINIMAL-AUTH] Sign up exception:', error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    console.log('🔐 [MINIMAL-AUTH] Attempting sign out...');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        setSession(null);
        setUser(null);
      }
      
      return { error };
    } catch (error) {
      console.error('🔐 [MINIMAL-AUTH] Sign out exception:', error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signInWithOAuth = async (provider: 'google' | 'github' | 'apple') => {
    console.log(`🔐 [MINIMAL-AUTH] Attempting OAuth sign in with ${provider}...`);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/home`
        }
      });
      
      return { error };
    } catch (error) {
      console.error('🔐 [MINIMAL-AUTH] OAuth exception:', error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    console.log('🔐 [MINIMAL-AUTH] Attempting password reset...');
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      return { error };
    } catch (error) {
      console.error('🔐 [MINIMAL-AUTH] Password reset exception:', error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const value: MinimalAuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithOAuth,
    resetPassword,
  };

  console.log('🔐 [MINIMAL-AUTH] Current state:', {
    hasUser: !!user,
    hasSession: !!session,
    loading
  });

  return (
    <MinimalAuthContext.Provider value={value}>
      {children}
    </MinimalAuthContext.Provider>
  );
};
