import React, { createContext, useContext, useState, ReactNode } from 'react';

// Mock auth types to avoid importing Supabase entirely
interface MockUser {
  id: string;
  email?: string;
  user_metadata?: {
    avatar_url?: string;
    full_name?: string;
    name?: string;
    picture?: string;
  };
}

interface MockSession {
  user: MockUser;
  access_token: string;
}

interface MockAuthError {
  message: string;
}

interface NoSupabaseAuthContextType {
  user: MockUser | null;
  session: MockSession | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: MockAuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: MockAuthError | null }>;
  signOut: () => Promise<{ error: MockAuthError | null }>;
  signInWithOAuth: (provider: 'google' | 'github' | 'apple') => Promise<{ error: MockAuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: MockAuthError | null }>;
}

const NoSupabaseAuthContext = createContext<NoSupabaseAuthContextType | undefined>(undefined);

export const useNoSupabaseAuth = (): NoSupabaseAuthContextType => {
  const context = useContext(NoSupabaseAuthContext);
  if (!context) {
    throw new Error('useNoSupabaseAuth must be used within a NoSupabaseAuthProvider');
  }
  return context;
};

interface NoSupabaseAuthProviderProps {
  children: ReactNode;
}

export const NoSupabaseAuthProvider: React.FC<NoSupabaseAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [session, setSession] = useState<MockSession | null>(null);
  const [loading, setLoading] = useState(false);

  console.log('🔐 [NO-SUPABASE-AUTH] Provider initialized with NO Supabase calls');

  const signIn = async (email: string, password: string) => {
    console.log('🔐 [NO-SUPABASE-AUTH] Mock sign in attempt for:', email);
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful login
    const mockUser: MockUser = { 
      id: 'mock-user-id', 
      email,
      user_metadata: {
        full_name: email.split('@')[0],
        avatar_url: `https://api.dicebear.com/6.x/initials/svg?seed=${email}`
      }
    };
    const mockSession: MockSession = { 
      user: mockUser, 
      access_token: 'mock-token' 
    };
    
    setUser(mockUser);
    setSession(mockSession);
    setLoading(false);
    
    console.log('🔐 [NO-SUPABASE-AUTH] Mock sign in successful');
    return { error: null };
  };

  const signUp = async (email: string, password: string) => {
    console.log('🔐 [NO-SUPABASE-AUTH] Mock sign up attempt for:', email);
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: MockUser = { 
      id: 'mock-user-id', 
      email,
      user_metadata: {
        full_name: email.split('@')[0],
        avatar_url: `https://api.dicebear.com/6.x/initials/svg?seed=${email}`
      }
    };
    const mockSession: MockSession = { 
      user: mockUser, 
      access_token: 'mock-token' 
    };
    
    setUser(mockUser);
    setSession(mockSession);
    setLoading(false);
    
    console.log('🔐 [NO-SUPABASE-AUTH] Mock sign up successful');
    return { error: null };
  };

  const signOut = async () => {
    console.log('🔐 [NO-SUPABASE-AUTH] Mock sign out');
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUser(null);
    setSession(null);
    setLoading(false);
    
    console.log('🔐 [NO-SUPABASE-AUTH] Mock sign out successful');
    return { error: null };
  };

  const signInWithOAuth = async (provider: 'google' | 'github' | 'apple') => {
    console.log(`🔐 [NO-SUPABASE-AUTH] Mock OAuth sign in with ${provider}`);
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock redirect behavior
    alert(`Mock OAuth with ${provider} would redirect now. This is a demo mode.`);
    
    setLoading(false);
    return { error: null };
  };

  const resetPassword = async (email: string) => {
    console.log('🔐 [NO-SUPABASE-AUTH] Mock password reset for:', email);
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert(`Mock password reset email sent to ${email}`);
    
    setLoading(false);
    return { error: null };
  };

  const value: NoSupabaseAuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithOAuth,
    resetPassword,
  };

  console.log('🔐 [NO-SUPABASE-AUTH] Current state:', {
    hasUser: !!user,
    hasSession: !!session,
    loading,
    mode: 'DEMO - No Supabase calls'
  });

  return (
    <NoSupabaseAuthContext.Provider value={value}>
      {children}
    </NoSupabaseAuthContext.Provider>
  );
};
