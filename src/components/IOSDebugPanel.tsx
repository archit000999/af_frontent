import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';

interface DebugInfo {
  timestamp: string;
  userAgent: string;
  isIOS: boolean;
  isSafari: boolean;
  isStandalone: boolean;
  viewportWidth: number;
  viewportHeight: number;
  devicePixelRatio: number;
  cookiesEnabled: boolean;
  localStorageAvailable: boolean;
  sessionStorageAvailable: boolean;
  indexedDBAvailable: boolean;
  clerkLoaded: boolean;
  clerkSignedIn: boolean;
  hasClerkUser: boolean;
  currentURL: string;
  referrer: string;
}

export const IOSDebugPanel = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const collectDebugInfo = (): DebugInfo => {
      // Check storage availability
      let localStorageAvailable = false;
      let sessionStorageAvailable = false;
      let indexedDBAvailable = false;

      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        localStorageAvailable = true;
      } catch (e) {
        localStorageAvailable = false;
      }

      try {
        sessionStorage.setItem('test', 'test');
        sessionStorage.removeItem('test');
        sessionStorageAvailable = true;
      } catch (e) {
        sessionStorageAvailable = false;
      }

      try {
        indexedDBAvailable = !!window.indexedDB;
      } catch (e) {
        indexedDBAvailable = false;
      }

      return {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
        isSafari: /Safari/.test(navigator.userAgent) && !/Chrome|CriOS|OPiOS|FxiOS/.test(navigator.userAgent),
        isStandalone: ('standalone' in window.navigator) && (window.navigator as any).standalone,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio || 1,
        cookiesEnabled: navigator.cookieEnabled,
        localStorageAvailable,
        sessionStorageAvailable,
        indexedDBAvailable,
        clerkLoaded: isLoaded,
        clerkSignedIn: isSignedIn,
        hasClerkUser: !!user,
        currentURL: window.location.href,
        referrer: document.referrer
      };
    };

    setDebugInfo(collectDebugInfo());

    // Update debug info when window resizes
    const handleResize = () => {
      setDebugInfo(collectDebugInfo());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isLoaded, isSignedIn, user]);

  // Only show in development or when triple-tapped
  useEffect(() => {
    let tapCount = 0;
    const handleTap = () => {
      tapCount++;
      if (tapCount >= 3) {
        setIsVisible(true);
        tapCount = 0;
      }
      setTimeout(() => {
        tapCount = 0;
      }, 1000);
    };

    // Show debug panel on triple tap or in development
    if (import.meta.env.DEV) {
      setIsVisible(true);
    } else {
      document.addEventListener('touchstart', handleTap);
      return () => document.removeEventListener('touchstart', handleTap);
    }
  }, []);

  if (!isVisible || !debugInfo) return null;

  const criticalIssues = [];
  
  if (debugInfo.isIOS && !debugInfo.localStorageAvailable) {
    criticalIssues.push('❌ localStorage blocked (Private Browsing?)');
  }
  
  if (debugInfo.isIOS && !debugInfo.cookiesEnabled) {
    criticalIssues.push('❌ Cookies disabled');
  }
  
  if (debugInfo.isIOS && !debugInfo.clerkLoaded) {
    criticalIssues.push('❌ Clerk not loading');
  }

  return (
    <div className="fixed top-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-sm z-[9999] max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-sm">🍎 iOS Debug Panel</h3>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-white hover:text-red-400"
        >
          ✕
        </button>
      </div>
      
      {criticalIssues.length > 0 && (
        <div className="mb-3 p-2 bg-red-900/50 rounded">
          <h4 className="font-bold text-red-400 mb-1">Critical Issues:</h4>
          {criticalIssues.map((issue, i) => (
            <div key={i} className="text-red-300">{issue}</div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <div>
          <span className="text-green-400">Device:</span>
          <div className="ml-2">
            iOS: {debugInfo.isIOS ? '✅' : '❌'}<br/>
            Safari: {debugInfo.isSafari ? '✅' : '❌'}<br/>
            Standalone: {debugInfo.isStandalone ? '✅' : '❌'}
          </div>
        </div>

        <div>
          <span className="text-blue-400">Storage:</span>
          <div className="ml-2">
            Cookies: {debugInfo.cookiesEnabled ? '✅' : '❌'}<br/>
            localStorage: {debugInfo.localStorageAvailable ? '✅' : '❌'}<br/>
            sessionStorage: {debugInfo.sessionStorageAvailable ? '✅' : '❌'}<br/>
            IndexedDB: {debugInfo.indexedDBAvailable ? '✅' : '❌'}
          </div>
        </div>

        <div>
          <span className="text-purple-400">Clerk:</span>
          <div className="ml-2">
            Loaded: {debugInfo.clerkLoaded ? '✅' : '❌'}<br/>
            Signed In: {debugInfo.clerkSignedIn ? '✅' : '❌'}<br/>
            Has User: {debugInfo.hasClerkUser ? '✅' : '❌'}
          </div>
        </div>

        <div>
          <span className="text-yellow-400">Viewport:</span>
          <div className="ml-2">
            {debugInfo.viewportWidth}×{debugInfo.viewportHeight}<br/>
            DPR: {debugInfo.devicePixelRatio}
          </div>
        </div>

        <div>
          <span className="text-gray-400">URLs:</span>
          <div className="ml-2 break-all">
            Current: {debugInfo.currentURL}<br/>
            Referrer: {debugInfo.referrer || 'None'}
          </div>
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-400">
        Updated: {new Date(debugInfo.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
};
