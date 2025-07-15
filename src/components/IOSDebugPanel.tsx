import { useEffect, useState } from 'react';

interface IOSDebugInfo {
  userAgent: string;
  isIOS: boolean;
  isIOSSafari: boolean;
  isStandalone: boolean;
  isPrivateBrowsing: boolean;
  hasLocalStorage: boolean;
  hasSessionStorage: boolean;
  viewportSize: { width: number; height: number };
  devicePixelRatio: number;
  touchSupport: boolean;
  orientation: string;
  currentUrl: string;
  errors: string[];
}

const IOSDebugPanel = () => {
  const [debugInfo, setDebugInfo] = useState<IOSDebugInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const collectDebugInfo = async (): Promise<IOSDebugInfo> => {
      const errors: string[] = [];
      
      // Basic device detection
      const userAgent = navigator.userAgent;
      const isIOS = /iPad|iPhone|iPod/.test(userAgent);
      const isIOSSafari = isIOS && /Safari/.test(userAgent) && !/Chrome|CriOS|OPiOS|FxiOS/.test(userAgent);
      const isStandalone = ('standalone' in window.navigator) && (window.navigator as any).standalone;

      // Storage tests
      let hasLocalStorage = false;
      let hasSessionStorage = false;
      let isPrivateBrowsing = false;

      try {
        const testKey = '__ios_debug_test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        hasLocalStorage = true;
      } catch (e) {
        errors.push(`localStorage error: ${e}`);
        isPrivateBrowsing = true;
      }

      try {
        const testKey = '__ios_debug_test__';
        sessionStorage.setItem(testKey, 'test');
        sessionStorage.removeItem(testKey);
        hasSessionStorage = true;
      } catch (e) {
        errors.push(`sessionStorage error: ${e}`);
      }

      // Viewport and device info
      const viewportSize = {
        width: window.innerWidth,
        height: window.innerHeight
      };

      const devicePixelRatio = window.devicePixelRatio || 1;
      const touchSupport = 'ontouchstart' in window;
      const orientation = screen.orientation?.type || 'unknown';
      const currentUrl = window.location.href;

      return {
        userAgent,
        isIOS,
        isIOSSafari,
        isStandalone,
        isPrivateBrowsing,
        hasLocalStorage,
        hasSessionStorage,
        viewportSize,
        devicePixelRatio,
        touchSupport,
        orientation,
        currentUrl,
        errors
      };
    };

    collectDebugInfo().then(setDebugInfo);

    // Always show debug panel for testing
    setIsVisible(false); // Start hidden, user can click to show
  }, []);

  if (!debugInfo) return null;

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 10000,
          backgroundColor: debugInfo.isIOS ? '#ff4444' : debugInfo.touchSupport ? '#ff8800' : '#4444ff',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          fontSize: '18px',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        title={`Debug Panel - ${debugInfo.isIOS ? 'iOS Device' : debugInfo.touchSupport ? 'Touch Device' : 'Desktop'}`}
      >
        {debugInfo.isIOS ? '🍎' : debugInfo.touchSupport ? '📱' : '�️'}
      </button>

      {/* Debug panel */}
      {isVisible && (
        <div
          style={{
            position: 'fixed',
            top: '60px',
            right: '10px',
            maxWidth: '350px',
            maxHeight: '80vh',
            overflow: 'auto',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '15px',
            borderRadius: '8px',
            fontSize: '12px',
            fontFamily: 'monospace',
            zIndex: 9999,
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            lineHeight: '1.4'
          }}
        >
          <div style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '14px' }}>
            🔍 iOS Debug Info
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <strong>Device:</strong> {debugInfo.isIOS ? '🍎 iOS' : '💻 Other'}
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <strong>Safari:</strong> {debugInfo.isIOSSafari ? '✅ Yes' : '❌ No'}
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <strong>Standalone:</strong> {debugInfo.isStandalone ? '✅ Yes' : '❌ No'}
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <strong>Private:</strong> {debugInfo.isPrivateBrowsing ? '🔒 Yes' : '🔓 No'}
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <strong>localStorage:</strong> {debugInfo.hasLocalStorage ? '✅ Available' : '❌ Blocked'}
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <strong>sessionStorage:</strong> {debugInfo.hasSessionStorage ? '✅ Available' : '❌ Blocked'}
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <strong>Viewport:</strong> {debugInfo.viewportSize.width}x{debugInfo.viewportSize.height}
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <strong>DPR:</strong> {debugInfo.devicePixelRatio}
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <strong>Touch:</strong> {debugInfo.touchSupport ? '✅ Yes' : '❌ No'}
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <strong>Orientation:</strong> {debugInfo.orientation}
          </div>
          
          <div style={{ marginBottom: '8px', wordBreak: 'break-all' }}>
            <strong>URL:</strong> {debugInfo.currentUrl}
          </div>
          
          <div style={{ marginBottom: '8px', wordBreak: 'break-all', fontSize: '10px' }}>
            <strong>User Agent:</strong> {debugInfo.userAgent}
          </div>
          
          {debugInfo.errors.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <strong style={{ color: '#ff6b6b' }}>Errors:</strong>
              {debugInfo.errors.map((error, index) => (
                <div key={index} style={{ color: '#ff6b6b', fontSize: '10px', marginLeft: '5px' }}>
                  • {error}
                </div>
              ))}
            </div>
          )}
          
          <button
            onClick={() => {
              console.log('🔍 [DEBUG] Full debug info:', debugInfo);
              navigator.clipboard?.writeText(JSON.stringify(debugInfo, null, 2));
            }}
            style={{
              marginTop: '10px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px'
            }}
          >
            Copy Debug Info
          </button>
        </div>
      )}
    </>
  );
};

export default IOSDebugPanel;
