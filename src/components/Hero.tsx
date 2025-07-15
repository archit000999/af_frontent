import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useNoSupabaseAuth } from './NoSupabaseAuthProvider';
import { useNavigate } from 'react-router-dom';
import ApplicationForm from "./ApplicationForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AuthForm } from './AuthForm';

const Hero = () => {
  console.log('🏠 [HERO-DEBUG] Hero component rendering...');
  
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { user } = useNoSupabaseAuth();
  
  console.log('🏠 [HERO-DEBUG] Auth context loaded successfully, user:', !!user);
  const navigate = useNavigate();
  return (
    <section id="home" className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10 pt-16">
        
        <div className="text-center">
          {/* Badge */}
          

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Land Interviews on{" "}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Autopilot
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">ApplyFirst monitors job boards in real time, instantly contacts hiring managers for intro call, and applies to jobs on your behalf. Human-led, AI-assisted</p>
          
          <div className="flex justify-center mb-16">
            {!user ? (
              <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="lg" className="px-10 py-6 text-xl border-2 border-white text-white bg-white/10 hover:bg-white hover:text-slate-900 backdrop-blur-sm font-semibold transition-all duration-300">
                    Try For Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Get Started</DialogTitle>
                    <DialogDescription>
                      Sign in to your account or create a new one to start landing interviews on autopilot.
                    </DialogDescription>
                  </DialogHeader>
                  <AuthForm />
                </DialogContent>
              </Dialog>
            ) : (
              <Button onClick={() => navigate('/home')} variant="outline" size="lg" className="px-10 py-6 text-xl border-2 border-white text-white bg-white/10 hover:bg-white hover:text-slate-900 backdrop-blur-sm font-semibold transition-all duration-300">
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <CheckCircle className="h-8 w-8 text-green-400 mb-3" />
              <span className="text-white font-semibold text-lg">10-15 intro calls</span>
              <span className="text-slate-400 text-sm">in 1 month average</span>
            </div>
            <div className="flex flex-col items-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <CheckCircle className="h-8 w-8 text-green-400 mb-3" />
              <span className="text-white font-semibold text-lg">400+ hiring manager</span>
              <span className="text-slate-400 text-sm">monthly outreach</span>
            </div>
            <div className="flex flex-col items-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <CheckCircle className="h-8 w-8 text-green-400 mb-3" />
              <span className="text-white font-semibold text-lg">Designed to be</span>
              <span className="text-slate-400 text-sm">unsubscribed</span>
            </div>
          </div>
        </div>
      </div>
      
      <ApplicationForm open={isApplicationFormOpen} onOpenChange={setIsApplicationFormOpen} />
    </section>
  );
};
export default Hero;