// Mock Supabase client for iOS Safari debugging
// This file replaces the real Supabase client to prevent stack overflow

console.log('🚫 [MOCK-SUPABASE] Using mock Supabase client - no real database operations');

// Mock types
interface MockSupabaseResponse {
  data: any;
  error: null;
}

interface MockSupabaseQuery {
  select: (fields?: string) => MockSupabaseQuery;
  insert: (data: any) => MockSupabaseQuery;
  update: (data: any) => MockSupabaseQuery;
  upsert: (data: any, options?: any) => MockSupabaseQuery;
  delete: () => MockSupabaseQuery;
  eq: (field: string, value: any) => MockSupabaseQuery;
  from: (table: string) => MockSupabaseQuery;
  single: () => Promise<MockSupabaseResponse>;
  then: (callback: (result: MockSupabaseResponse) => void) => Promise<void>;
}

interface MockSupabaseAuth {
  signInWithPassword: (credentials: any) => Promise<MockSupabaseResponse>;
  signUp: (credentials: any) => Promise<MockSupabaseResponse>;
  signOut: () => Promise<MockSupabaseResponse>;
  signInWithOAuth: (options: any) => Promise<MockSupabaseResponse>;
  resetPasswordForEmail: (email: string, options?: any) => Promise<MockSupabaseResponse>;
  getSession: () => Promise<MockSupabaseResponse>;
  onAuthStateChange: (callback: any) => { data: { subscription: { unsubscribe: () => void } } };
}

interface MockSupabaseClient {
  from: (table: string) => MockSupabaseQuery;
  auth: MockSupabaseAuth;
}

// Create mock query builder
const createMockQuery = (): MockSupabaseQuery => ({
  select: () => createMockQuery(),
  insert: () => createMockQuery(),
  update: () => createMockQuery(),
  upsert: () => createMockQuery(),
  delete: () => createMockQuery(),
  eq: () => createMockQuery(),
  from: () => createMockQuery(),
  single: async () => ({ data: null, error: null }),
  then: async (callback) => {
    console.log('🚫 [MOCK-SUPABASE] Mock database operation completed');
    callback({ data: null, error: null });
  }
});

// Create mock client
export const supabase: MockSupabaseClient = {
  from: (table: string) => {
    console.log(`🚫 [MOCK-SUPABASE] Mock query on table: ${table}`);
    return createMockQuery();
  },
  auth: {
    signInWithPassword: async (credentials) => {
      console.log('🚫 [MOCK-SUPABASE] Mock signInWithPassword');
      return { data: null, error: null };
    },
    signUp: async (credentials) => {
      console.log('🚫 [MOCK-SUPABASE] Mock signUp');
      return { data: null, error: null };
    },
    signOut: async () => {
      console.log('🚫 [MOCK-SUPABASE] Mock signOut');
      return { data: null, error: null };
    },
    signInWithOAuth: async (options) => {
      console.log('🚫 [MOCK-SUPABASE] Mock signInWithOAuth');
      return { data: null, error: null };
    },
    resetPasswordForEmail: async (email, options) => {
      console.log('🚫 [MOCK-SUPABASE] Mock resetPasswordForEmail');
      return { data: null, error: null };
    },
    getSession: async () => {
      console.log('🚫 [MOCK-SUPABASE] Mock getSession');
      return { data: null, error: null };
    },
    onAuthStateChange: (callback) => {
      console.log('🚫 [MOCK-SUPABASE] Mock onAuthStateChange');
      return {
        data: {
          subscription: {
            unsubscribe: () => console.log('🚫 [MOCK-SUPABASE] Mock unsubscribe')
          }
        }
      };
    }
  }
};

export default supabase;
