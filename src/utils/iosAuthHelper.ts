// iOS Safari Authentication Helper
// This module helps with iOS Safari specific authentication issues

export const isIOSSafari = (): boolean => {
  const userAgent = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isSafari = /Safari/.test(userAgent) && !/Chrome|CriOS|OPiOS|FxiOS/.test(userAgent);
  return isIOS && isSafari;
};

export const isPrivateBrowsing = (): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      // Test localStorage access
      const testKey = '__private_browsing_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      resolve(false);
    } catch (e) {
      resolve(true);
    }
  });
};

export const enableIOSCompatibilityMode = (): void => {
  if (!isIOSSafari()) return;

  // Prevent zoom on input focus
  const preventZoom = () => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
      );
    }
  };

  // Fix iOS Safari 100vh issue
  const fixViewportHeight = () => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', () => {
      setTimeout(setVH, 100);
    });
  };

  // Ensure cookies work in iOS Safari
  const ensureCookieSupport = () => {
    if (!navigator.cookieEnabled) {
      console.warn('Cookies are disabled. Authentication may not work properly.');
      return false;
    }
    return true;
  };

  // Initialize all fixes
  preventZoom();
  fixViewportHeight();
  ensureCookieSupport();

  // Add iOS-specific body class
  document.body.classList.add('ios-safari');
};

export const waitForSupabaseReady = (maxAttempts = 30): Promise<boolean> => {
  return new Promise((resolve) => {
    let attempts = 0;
    
    const checkSupabase = () => {
      attempts++;
      
      // Check if Supabase is available
      if (typeof window !== 'undefined' && (window as any).supabase) {
        resolve(true);
        return;
      }
      
      if (attempts >= maxAttempts) {
        console.error('Supabase failed to load after maximum attempts');
        resolve(false);
        return;
      }
      
      setTimeout(checkSupabase, 100);
    };
    
    checkSupabase();
  });
};

export const debugAuthState = (): void => {
  if (!isIOSSafari()) return;

  console.group('🍎 iOS Safari Auth Debug');
  console.log('User Agent:', navigator.userAgent);
  console.log('Cookies Enabled:', navigator.cookieEnabled);
  console.log('localStorage Available:', (() => {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch (e) {
      return false;
    }
  })());
  console.log('Current URL:', window.location.href);
  console.log('Referrer:', document.referrer);
  console.log('Standalone Mode:', ('standalone' in window.navigator) && (window.navigator as any).standalone);
  console.groupEnd();
};

// Initialize iOS compatibility on import
if (typeof window !== 'undefined') {
  enableIOSCompatibilityMode();
}
