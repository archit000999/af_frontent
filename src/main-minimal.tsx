import { createRoot } from 'react-dom/client'
import './index.css'

// MINIMAL iOS Safari Test - No complex imports

console.log('🍎 [MINIMAL-TEST] Starting minimal iOS Safari test...');

// Simple device detection
const userAgent = navigator.userAgent;
const isIOS = /iPad|iPhone|iPod/.test(userAgent);
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

console.log('🍎 [MINIMAL-TEST] Device info:', { userAgent, isIOS, isMobile });

// Create the simplest possible React app
const MinimalApp = () => {
  return (
    <div style={{
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    }}>
      <h1 style={{ marginBottom: '20px' }}>🍎 iOS Safari Test</h1>
      <p style={{ marginBottom: '20px' }}>
        {isIOS ? '✅ iOS Device Detected' : '📱 Non-iOS Device'}
      </p>
      <p style={{ marginBottom: '20px' }}>
        User Agent: {userAgent.substring(0, 50)}...
      </p>
      <button 
        onClick={() => {
          const info = {
            url: window.location.href,
            userAgent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            screen: `${screen.width}x${screen.height}`,
            isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
            cookieEnabled: navigator.cookieEnabled,
            errors: []
          };

          // Test storage
          try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
          } catch (e) {
            info.errors.push(`localStorage: ${e.message}`);
          }

          alert(`DEVICE INFO:
URL: ${info.url}
Viewport: ${info.viewport}
Screen: ${info.screen}
iOS: ${info.isIOS}
Cookies: ${info.cookieEnabled}
Errors: ${info.errors.length > 0 ? info.errors.join(', ') : 'None'}

This app is working! 🎉`);
        }}
        style={{
          padding: '15px 30px',
          fontSize: '18px',
          background: '#ff4444',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}
      >
        🍎 TAP FOR DEBUG INFO
      </button>
      
      <div style={{ marginTop: '30px', fontSize: '14px', opacity: '0.8' }}>
        <p>✅ No stack overflow</p>
        <p>✅ React is working</p>
        <p>✅ JavaScript is working</p>
        <p>✅ CSS is working</p>
      </div>
    </div>
  );
};

// Initialize the minimal app
const initializeMinimalApp = () => {
  try {
    console.log('🍎 [MINIMAL-TEST] Initializing...');
    
    const rootElement = document.getElementById("root");
    if (!rootElement) {
      throw new Error("Root element not found");
    }

    createRoot(rootElement).render(<MinimalApp />);
    
    console.log('🍎 [MINIMAL-TEST] ✅ App initialized successfully!');
  } catch (error) {
    console.error('🍎 [MINIMAL-TEST] ❌ Initialization failed:', error);
    
    // Fallback HTML
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="
          padding: 20px; 
          font-family: system-ui, -apple-system, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        ">
          <div>
            <h1>❌ Error Loading App</h1>
            <p>Error: ${error.message}</p>
            <p>Device: ${isIOS ? 'iOS' : 'Other'}</p>
            <button onclick="window.location.reload()" style="
              padding: 15px 30px;
              margin-top: 20px;
              background: #ff4444;
              color: white;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-size: 16px;
            ">🔄 Refresh</button>
          </div>
        </div>
      `;
    }
  }
};

initializeMinimalApp();
