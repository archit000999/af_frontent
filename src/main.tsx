
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import IOSCompatibilityChecker from './components/IOSCompatibilityChecker.tsx'
import { SupabaseAuthProvider } from './components/SupabaseAuthProvider.tsx'
import './index.css'
import { debugAuthState, isIOSSafari, waitForSupabaseReady } from './utils/iosAuthHelper.ts'

// iOS-specific debugging and initialization
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

// Initialize app with proper error handling
const initializeApp = async () => {
  try {
    // Run iOS debug if on iOS Safari
    if (isIOSSafari()) {
      debugAuthState();
      await waitForSupabaseReady();
    }

    console.log('✅ Using Supabase Auth instead of Clerk');

    const rootElement = document.getElementById("root");
    if (!rootElement) {
      throw new Error("Root element not found");
    }

    createRoot(rootElement).render(
      <ErrorBoundary>
        <IOSCompatibilityChecker>
          <SupabaseAuthProvider>
            <App />
          </SupabaseAuthProvider>
        </IOSCompatibilityChecker>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('Failed to initialize app:', error);
    // Fallback rendering
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div>
            <h2 style="color: #ef4444; margin-bottom: 16px;">Loading Error</h2>
            <p style="color: #64748b; margin-bottom: 16px;">Please refresh the page or try again later.</p>
            <button onclick="window.location.reload()" style="padding: 10px 20px; margin-top: 10px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;">Refresh</button>
            <div style="margin-top: 16px; font-size: 12px; color: #94a3b8;">
              Error: ${error instanceof Error ? error.message : 'Unknown error'}
            </div>
          </div>
        </div>
      `;
    }
  }
};

// Initialize the app
initializeApp();
