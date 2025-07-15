const LoadingFallback = () => {
  console.log('⏳ [LOADING-DEBUG] LoadingFallback component rendered');
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Loading ApplyFirst</h2>
        <p className="text-muted-foreground">Please wait while we prepare your experience...</p>
        <p className="text-xs text-muted-foreground mt-4">
          Mobile Debug: {navigator.userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop Device'}
        </p>
      </div>
    </div>
  );
};

export default LoadingFallback;