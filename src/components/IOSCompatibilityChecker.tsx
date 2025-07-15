import { useEffect, useState } from 'react';
import { isIOSSafari } from '../utils/iosAuthHelper';

interface IOSCompatibilityCheckerProps {
  children: React.ReactNode;
}

const IOSCompatibilityChecker: React.FC<IOSCompatibilityCheckerProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const checkCompatibility = async () => {
      try {
        // Basic compatibility checks
        if (typeof window === 'undefined') {
          throw new Error('Window object not available');
        }

        if (typeof document === 'undefined') {
          throw new Error('Document object not available');
        }

        // Check if localStorage is available (important for iOS Safari)
        try {
          const testKey = '__compatibility_test__';
          localStorage.setItem(testKey, 'test');
          localStorage.removeItem(testKey);
        } catch (e) {
          console.warn('localStorage not available, possibly in private browsing mode');
        }

        // iOS-specific checks
        if (isIOSSafari()) {
          console.log('iOS Safari detected, applying compatibility fixes');
          
          // Ensure viewport is properly set
          const viewport = document.querySelector('meta[name="viewport"]');
          if (!viewport) {
            const meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
            document.getElementsByTagName('head')[0].appendChild(meta);
          }

          // Set CSS variables for viewport height
          const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
          };
          
          setVH();
          window.addEventListener('resize', setVH);
          window.addEventListener('orientationchange', () => {
            setTimeout(setVH, 100);
          });

          // Add iOS body class
          document.body.classList.add('ios-safari');
        }

        setIsReady(true);
      } catch (error) {
        console.error('Compatibility check failed:', error);
        setHasError(true);
        setErrorMessage(error instanceof Error ? error.message : 'Unknown compatibility error');
      }
    };

    checkCompatibility();
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-bold text-destructive mb-4">Compatibility Issue</h2>
          <p className="text-muted-foreground mb-4">{errorMessage}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default IOSCompatibilityChecker;
