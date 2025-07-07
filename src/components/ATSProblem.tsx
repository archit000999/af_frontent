import { useState, useEffect } from "react";
import { AlertTriangle, Bot, Shield, Target, CheckCircle, ArrowRight, X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const ATSProblem = () => {
  const [showCalendly, setShowCalendly] = useState(false);

  useEffect(() => {
    if (showCalendly) {
      if (!document.querySelector("#calendly-widget-script")) {
        const script = document.createElement("script");
        script.id = "calendly-widget-script";
        script.src = "https://assets.calendly.com/assets/external/widget.js";
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, [showCalendly]);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-orange-100 border border-orange-200 rounded-full text-orange-800 text-sm font-medium mb-6">
            <AlertTriangle className="h-4 w-4 mr-2" />
            The Truth About Job Applications
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Why AI Job Applications{" "}
            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              DON'T WORK
            </span>
            {" "}vs ApplyFirst
          </h2>
          
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            <strong>ATS systems like Greenhouse and Workday now use AI to block automated applications. Here's the comparison:</strong>
          </p>
        </div>

        {/* Side by Side Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-12 relative">
          
          {/* Left Side - The Problem */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl border-2 border-red-200 relative">
            <div className="absolute -top-3 left-6">
              <div className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center">
                <X className="h-4 w-4 mr-1" />
                DOESN'T WORK
              </div>
            </div>
            
            <div className="pt-4">
              <div className="flex items-center mb-6">
                <Bot className="h-10 w-10 text-red-600 mr-4" />
                <h3 className="text-2xl font-bold text-red-800">AI Job Applications</h3>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <X className="h-5 w-5 text-red-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-red-800">Detected by ATS Bots</div>
                    <div className="text-red-700 text-sm">Greenhouse & Workday track cursor patterns, application speed, and behavior</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <X className="h-5 w-5 text-red-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-red-800">Permanent Blacklisting</div>
                    <div className="text-red-700 text-sm">Once flagged, you're blocked across their entire system forever</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <X className="h-5 w-5 text-red-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-red-800">Generic Applications</div>
                    <div className="text-red-700 text-sm">Templated resumes get auto-rejected before humans see them</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <X className="h-5 w-5 text-red-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-red-800">Lost in the Queue</div>
                    <div className="text-red-700 text-sm">You're competing with 500+ other applicants in the same portal</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-200 border-l-4 border-red-600 p-4 rounded">
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-700 mb-2">85%+</div>
                  <div className="text-red-800 font-semibold">Never make it past ATS</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - The Solution */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl border-2 border-blue-200 relative">
            <div className="absolute -top-3 left-6">
              <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                WORKS
              </div>
            </div>
            
            <div className="pt-4">
              <div className="flex items-center mb-6">
                <Users className="h-10 w-10 text-blue-600 mr-4" />
                <h3 className="text-2xl font-bold text-blue-800">ApplyFirst Method</h3>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-blue-800">Bypasses ATS Completely</div>
                    <div className="text-blue-700 text-sm">Direct contact with hiring managers via email - no portals involved</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-blue-800">Real Human Outreach</div>
                    <div className="text-blue-700 text-sm">Personalized messages written by humans, not AI-generated templates</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-blue-800">First 10 Applicants</div>
                    <div className="text-blue-700 text-sm">We contact them within 60 minutes of job posting going live</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-blue-800">Decision Maker Direct</div>
                    <div className="text-blue-700 text-sm">Your resume lands directly in the hiring manager's inbox</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-200 border-l-4 border-blue-600 p-4 rounded">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-700 mb-2">15+</div>
                  <div className="text-blue-800 font-semibold">Interviews in 2 months</div>
                </div>
              </div>
            </div>
          </div>

          {/* VS Divider for larger screens */}
          <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl shadow-xl">
              VS
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-4">The Only Way That Actually Works</h3>
            <p className="text-xl leading-relaxed max-w-4xl mx-auto mb-8">
              While others get blocked by ATS systems, ApplyFirst puts you directly in front of decision-makers. 
              <strong> It's not about applying faster — it's about applying smarter.</strong>
            </p>
            
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
              onClick={() => setShowCalendly(true)}
            >
              See If You Qualify <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm mt-3 opacity-90">Free evaluation • No obligations</p>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        </div>

        {showCalendly && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white rounded-xl shadow-2xl p-6 relative w-full max-w-2xl">
              <button
                onClick={() => setShowCalendly(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 text-2xl font-bold"
                aria-label="Close"
              >
                ×
              </button>
              {/* Calendly inline widget begin */}
              <div className="calendly-inline-widget" data-url="https://calendly.com/archit-trysaki/qualifying-call" style={{ minWidth: 320, height: 700 }}></div>
              {/* Calendly inline widget end */}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ATSProblem;