import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const WebinarSection = () => {
  return (
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
            <iframe
              src="https://www.youtube.com/embed/ugqbkP_kbS4"
              title="ApplyFirst Webinar"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          
          <div className="text-center mt-8">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Play className="mr-2 h-5 w-5" />
              Start Your Free Trial
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WebinarSection;