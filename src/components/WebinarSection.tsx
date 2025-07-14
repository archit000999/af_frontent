import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useState } from "react";
import ErrorBoundary from "./ErrorBoundary";

const WebinarSection = () => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  return (
    <ErrorBoundary fallback={
      <section className="py-20 bg-gradient-to-br from-background to-muted">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Watch Our Latest Webinar
            </h2>
            <p className="text-muted-foreground">
              Video temporarily unavailable. Please try again later.
            </p>
          </div>
        </div>
      </section>
    }>
      <section className="py-20 bg-gradient-to-br from-background to-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Watch Our Latest Webinar
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Learn how ApplyFirst can transform your job application process and get you more interviews
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
              {!iframeLoaded && !iframeError && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-muted-foreground">Loading video...</p>
                  </div>
                </div>
              )}
              
              {iframeError ? (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <div className="text-center">
                    <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-foreground font-medium mb-2">Video unavailable</p>
                    <a 
                      href="https://www.youtube.com/watch?v=ugqbkP_kbS4" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Watch on YouTube
                    </a>
                  </div>
                </div>
              ) : (
                <iframe 
                  src="https://www.youtube.com/embed/ugqbkP_kbS4?rel=0&modestbranding=1" 
                  title="ApplyFirst Webinar" 
                  className="w-full h-full" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin allow-presentation"
                  onLoad={() => setIframeLoaded(true)}
                  onError={() => setIframeError(true)}
                />
              )}
            </div>
            
            <div className="text-center mt-8">
              
            </div>
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
};
export default WebinarSection;