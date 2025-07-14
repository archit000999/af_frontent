
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import './index.css'
import { debugAuthState, isIOSSafari } from './utils/iosAuthHelper.ts'

const PUBLISHABLE_KEY = "pk_live_Y2xlcmsuYXBwbHlmaXJzdC50cnlzYWtpLmNvbSQ";

// iOS-specific debugging
const userAgent = navigator.userAgent;
const isIOS = /iPad|iPhone|iPod/.test(userAgent);
console.log('Device detection:', { userAgent, isIOS, isIOSSafari: isIOSSafari() });

// Run iOS debug if on iOS Safari
if (isIOSSafari()) {
  debugAuthState();
}

if (!PUBLISHABLE_KEY) {
  console.error("Missing Clerk Publishable Key");
}

// Graceful Clerk initialization for iOS
const ClerkWrapper = ({ children }: { children: React.ReactNode }) => {
  if (!PUBLISHABLE_KEY) {
    console.warn("Clerk not initialized - running without authentication");
    return <>{children}</>;
  }

  try {
    return (
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY} 
        afterSignOutUrl="/"
        appearance={{
          baseTheme: undefined,
          variables: {
            colorPrimary: 'hsl(var(--primary))',
          }
        }}
      >
        {children}
      </ClerkProvider>
    );
  } catch (error) {
    console.error("Clerk initialization failed:", error);
    return <>{children}</>;
  }
};

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <ClerkWrapper>
      <App />
    </ClerkWrapper>
  </ErrorBoundary>
);
