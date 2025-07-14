
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import { SupabaseAuthProvider } from './components/SupabaseAuthProvider.tsx'
import './index.css'
import { debugAuthState, isIOSSafari } from './utils/iosAuthHelper.ts'

// iOS-specific debugging
const userAgent = navigator.userAgent;
const isIOS = /iPad|iPhone|iPod/.test(userAgent);
console.log('🚀 App Starting - Device detection:', { userAgent, isIOS, isIOSSafari: isIOSSafari() });

// Run iOS debug if on iOS Safari
if (isIOSSafari()) {
  debugAuthState();
}

console.log('✅ Using Supabase Auth instead of Clerk');

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <SupabaseAuthProvider>
      <App />
    </SupabaseAuthProvider>
  </ErrorBoundary>
);
