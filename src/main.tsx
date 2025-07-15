
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import { SupabaseAuthProvider } from './components/SupabaseAuthProvider.tsx'
import './index.css'
import { debugAuthState, isIOSSafari } from './utils/iosAuthHelper.ts'

// iOS-specific debugging
const userAgent = navigator.userAgent;
const isIOS = /iPad|iPhone|iPod/.test(userAgent);
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
const isIOSSafariBrowser = isIOSSafari();

console.log('🚀 [MOBILE-DEBUG] App Starting - Device detection:', { 
  userAgent, 
  isIOS, 
  isMobile,
  isIOSSafari: isIOSSafariBrowser,
  screen: { width: window.screen.width, height: window.screen.height },
  viewport: { width: window.innerWidth, height: window.innerHeight },
  platform: navigator.platform,
  language: navigator.language
});

// Check if DOM is ready
console.log('🚀 [MOBILE-DEBUG] DOM readyState:', document.readyState);
console.log('🚀 [MOBILE-DEBUG] Root element exists:', !!document.getElementById("root"));

// Run iOS debug if on iOS Safari
if (isIOSSafariBrowser) {
  console.log('🍎 [iOS-DEBUG] Running iOS Safari specific debugging');
  debugAuthState();
}

// Check for essential browser features
console.log('🚀 [MOBILE-DEBUG] Browser features:', {
  localStorage: typeof(Storage) !== "undefined" && !!window.localStorage,
  sessionStorage: typeof(Storage) !== "undefined" && !!window.sessionStorage,
  fetch: typeof fetch !== 'undefined',
  promises: typeof Promise !== 'undefined',
  webSockets: typeof WebSocket !== 'undefined'
});

console.log('✅ [MOBILE-DEBUG] Using Supabase Auth instead of Clerk');

try {
  console.log('🚀 [MOBILE-DEBUG] Creating React root...');
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error('❌ [MOBILE-DEBUG] Root element not found!');
    throw new Error('Root element not found');
  }
  
  console.log('🚀 [MOBILE-DEBUG] Root element found, creating React app...');
  
  createRoot(rootElement).render(
    <ErrorBoundary>
      <SupabaseAuthProvider>
        <App />
      </SupabaseAuthProvider>
    </ErrorBoundary>
  );
  
  console.log('✅ [MOBILE-DEBUG] React app rendered successfully');
} catch (error) {
  console.error('❌ [MOBILE-DEBUG] Failed to render React app:', error);
  
  // Fallback: show error message
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h1>Loading Error</h1>
        <p>The app failed to load. Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
        <p>Device: ${userAgent}</p>
        <button onclick="window.location.reload()">Retry</button>
      </div>
    `;
  }
}
