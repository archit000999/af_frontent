import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Shield, DollarSign, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
// import { AuthForm } from "./AuthForm";

const Pricing = () => {
  const [user, setUser] = useState(null); // Mock user state
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const navigate = useNavigate();
  const features = ["AI scans job boards in real time, and our human agents apply to 20 matching jobs on your behalf every day", "We find the right hiring managers using LinkedIn research and verified emails from trusted data providers", "20 personalized emails sent daily from your Gmail. Complete with your resume and hyper-personalized messaging.", "Save 20+ hours every week. Spend less time applying, and more time preparing for interviews.", "2–4 interviews guaranteed per month. Or your next month is free.", "We only onboard 20 candidates each week, focused on roles paying $100K+"];
  return <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 border border-green-300 rounded-full text-green-800 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            Risk-free guarantee
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
            Simple,{" "}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Risk-Free
            </span>{" "}
            Pricing
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            We're so confident in our results, we put our money where our mouth is.
            No hidden fees, no long-term contracts.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-3xl blur-xl"></div>
            
            <div className="relative bg-white rounded-3xl p-12 shadow-2xl border-2 border-blue-100">
              {/* Popular badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">Early Bird Pricing until July 30th</div>
              </div>

              <div className="text-center mb-10">
                <h3 className="text-3xl font-bold text-slate-900 mb-4">ApplyFirst Concierge Service</h3>
                
                {/* Promotional Banner */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-4 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-green-600">First Week Fee Waived Off</span>
                  </div>
                  <p className="text-slate-700 font-medium mb-2">Use promo code: Webinar99</p>
                  
                </div>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">$99</span>
                  <div className="text-left">
                    <div className="text-slate-600 text-lg">/week</div>
                    
                  </div>
                </div>
                
              </div>

              <div className="space-y-4 mb-10">
                {features.map((feature, index) => <div key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-4 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-lg">{feature}</span>
                  </div>)}
              </div>

              

              <div className="space-y-4">
                {user ? (
                  <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                        See If You Qualify <ArrowRight className="ml-2 h-6 w-6" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>See If You Qualify</DialogTitle>
                        <DialogDescription>
                          Sign in to your account or create a new one to check your eligibility for our concierge service.
                        </DialogDescription>
                      </DialogHeader>
                      {/* <AuthForm onSuccess={() => setShowAuthDialog(false)} /> */}
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Button onClick={() => navigate('/home')} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    Go to Dashboard <ArrowRight className="ml-2 h-6 w-6" />
                  </Button>
                )}
                <p className="text-center text-sm text-slate-500">
                  Free consultation • No commitment • Setup in 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social proof */}
        <div className="text-center mt-16">
          <p className="text-slate-600 mb-4">Trusted by professionals at</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-2xl font-bold text-slate-400">Google</div>
            <div className="text-2xl font-bold text-slate-400">Meta</div>
            <div className="text-2xl font-bold text-slate-400">Microsoft</div>
            <div className="text-2xl font-bold text-slate-400">Apple</div>
            <div className="text-2xl font-bold text-slate-400">Netflix</div>
          </div>
        </div>
      </div>
    </section>;
};
export default Pricing;