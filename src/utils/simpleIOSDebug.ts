// Simple iOS debug overlay that always works
export const createIOSDebugOverlay = () => {
  // Only run on mobile devices
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  if (!isMobile) return;

  console.log('🔍 Creating iOS debug overlay...');

  // Create debug button
  const debugButton = document.createElement('div');
  debugButton.innerHTML = isIOS ? '🍎' : '📱';
  debugButton.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    background: ${isIOS ? '#ff4444' : '#ff8800'};
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    z-index: 999999;
    cursor: pointer;
    user-select: none;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    border: 3px solid white;
  `;

  // Create debug panel
  const debugPanel = document.createElement('div');
  debugPanel.style.cssText = `
    position: fixed;
    top: 90px;
    right: 20px;
    width: 90%;
    max-width: 400px;
    max-height: 80vh;
    background: rgba(0, 0, 0, 0.95);
    color: white;
    padding: 20px;
    border-radius: 12px;
    font-family: monospace;
    font-size: 12px;
    z-index: 999998;
    overflow: auto;
    display: none;
    border: 2px solid ${isIOS ? '#ff4444' : '#ff8800'};
  `;

  // Collect debug info
  const collectDebugInfo = () => {
    const errors = [];
    
    // Test localStorage
    let hasLocalStorage = false;
    let hasSessionStorage = false;
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      hasLocalStorage = true;
    } catch (e) {
      errors.push(`localStorage: ${e.message}`);
    }

    try {
      sessionStorage.setItem('test', 'test');
      sessionStorage.removeItem('test');
      hasSessionStorage = true;
    } catch (e) {
      errors.push(`sessionStorage: ${e.message}`);
    }

    return {
      userAgent: navigator.userAgent,
      isIOS,
      isMobile,
      isStandalone: ('standalone' in navigator) && navigator.standalone,
      hasLocalStorage,
      hasSessionStorage,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      screen: `${screen.width}x${screen.height}`,
      devicePixelRatio: window.devicePixelRatio || 1,
      touchSupport: 'ontouchstart' in window,
      url: window.location.href,
      errors: errors.length > 0 ? errors : ['No errors detected']
    };
  };

  // Toggle debug panel
  let isVisible = false;
  debugButton.onclick = () => {
    isVisible = !isVisible;
    debugPanel.style.display = isVisible ? 'block' : 'none';
    
    if (isVisible) {
      const info = collectDebugInfo();
      debugPanel.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 15px; color: ${isIOS ? '#ff4444' : '#ff8800'};">
          📱 Mobile Debug Panel
        </div>
        <div><strong>Device:</strong> ${isIOS ? 'iOS' : 'Mobile'}</div>
        <div><strong>Standalone:</strong> ${info.isStandalone ? 'Yes' : 'No'}</div>
        <div><strong>localStorage:</strong> ${info.hasLocalStorage ? '✅' : '❌'}</div>
        <div><strong>sessionStorage:</strong> ${info.hasSessionStorage ? '✅' : '❌'}</div>
        <div><strong>Touch:</strong> ${info.touchSupport ? '✅' : '❌'}</div>
        <div><strong>Viewport:</strong> ${info.viewport}</div>
        <div><strong>Screen:</strong> ${info.screen}</div>
        <div><strong>DPR:</strong> ${info.devicePixelRatio}</div>
        <div style="margin-top: 10px;"><strong>URL:</strong></div>
        <div style="word-break: break-all; font-size: 10px;">${info.url}</div>
        <div style="margin-top: 10px;"><strong>User Agent:</strong></div>
        <div style="word-break: break-all; font-size: 10px;">${info.userAgent}</div>
        <div style="margin-top: 10px;"><strong>Errors:</strong></div>
        ${info.errors.map(error => `<div style="color: #ff6b6b; font-size: 10px;">• ${error}</div>`).join('')}
        <button onclick="
          navigator.clipboard && navigator.clipboard.writeText(JSON.stringify(${JSON.stringify(info)}, null, 2));
          alert('Debug info copied to clipboard!');
        " style="
          margin-top: 15px;
          padding: 8px 12px;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 12px;
        ">Copy Info</button>
        <button onclick="window.location.reload()" style="
          margin: 15px 0 0 10px;
          padding: 8px 12px;
          background: #2196F3;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 12px;
        ">Refresh</button>
      `;
    }
  };

  // Add to page
  document.body.appendChild(debugButton);
  document.body.appendChild(debugPanel);

  console.log('✅ iOS debug overlay created successfully');
};
