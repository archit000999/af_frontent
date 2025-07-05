import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ApplicationForm from "./ApplicationForm";
import { useState } from "react";

const Header = () => {
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-left">
              <h1 className="text-xl font-bold text-slate-900">
                ApplyFirst
              </h1>
              <p className="text-sm text-blue-600 font-medium">
                powered by Saki AI
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#problem" className="text-slate-600 hover:text-slate-900 transition-colors">
              About
            </a>
            <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors">
              Pricing
            </a>
            <a href="#faq" className="text-slate-600 hover:text-slate-900 transition-colors">
              FAQ
            </a>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center">
            <Button 
              onClick={() => setIsApplicationFormOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <ApplicationForm 
        open={isApplicationFormOpen} 
        onOpenChange={setIsApplicationFormOpen} 
      />
    </header>
  );
};

export default Header; 