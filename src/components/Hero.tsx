import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import ApplicationForm from "./ApplicationForm";
import AuthButton from "./AuthButton";
const Hero = () => {
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  return <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    }}></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Auth buttons in top right */}
        <div className="flex justify-end mb-8">
          <AuthButton />
        </div>
        
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full text-blue-300 text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4 mr-2" />
            Skip the job application queue
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Land Interviews Before Jobs Hit{" "}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              LinkedIn
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            ApplyFirst reaches out to hiring managers for you — at scale, on autopilot. 
            Be among the first 10 candidates they see.
          </p>
          
          <div className="flex justify-center mb-16">
            <Button variant="outline" size="lg" onClick={() => window.open('https://calendly.com/archit-trysaki/qualifying-call', '_blank')} className="px-10 py-6 text-xl border-2 border-white text-white bg-white/10 hover:bg-white hover:text-slate-900 backdrop-blur-sm font-semibold transition-all duration-300">Try it now</Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <CheckCircle className="h-8 w-8 text-green-400 mb-3" />
              <span className="text-white font-semibold text-lg">10+ interviews</span>
              <span className="text-slate-400 text-sm">in 2 months average</span>
            </div>
            <div className="flex flex-col items-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <CheckCircle className="h-8 w-8 text-green-400 mb-3" />
              <span className="text-white font-semibold text-lg">600+ contacts</span>
              <span className="text-slate-400 text-sm">monthly outreach</span>
            </div>
            <div className="flex flex-col items-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <CheckCircle className="h-8 w-8 text-green-400 mb-3" />
              <span className="text-white font-semibold text-lg">Money-back</span>
              <span className="text-slate-400 text-sm">guarantee</span>
            </div>
          </div>
        </div>
      </div>
      
      <ApplicationForm open={isApplicationFormOpen} onOpenChange={setIsApplicationFormOpen} />
    </section>;
};
export default Hero;