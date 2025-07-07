import { Clock, TrendingDown, Target, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ATSProblem = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
            Why We Built ApplyFirst
          </h2>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Chart Visual */}
          <div className="bg-white p-8 rounded-2xl shadow-lg animate-fade-in">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Job Search Duration</h3>
              <p className="text-gray-600">How we've transformed the timeline</p>
            </div>
            
            {/* Simple Chart Visualization */}
            <div className="space-y-6">
              {/* Before ApplyFirst */}
              <div className="relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-700">Before ApplyFirst</span>
                  <span className="text-2xl font-bold text-red-600">12 months</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 h-6 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              {/* With ApplyFirst */}
              <div className="relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-700">With ApplyFirst</span>
                  <span className="text-2xl font-bold text-blue-600">2 months</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-6 rounded-full animate-pulse" style={{ width: '17%' }}></div>
                </div>
              </div>

              {/* Improvement Arrow */}
              <div className="flex items-center justify-center mt-6 text-green-600">
                <TrendingDown className="h-8 w-8 mr-2" />
                <span className="text-xl font-bold">83% Faster</span>
              </div>
            </div>
          </div>

          {/* Right Column - Text Content */}
          <div className="animate-fade-in">
            <div className="mb-8">
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                The job search process is broken. After watching friends and colleagues struggle for months — or even years — to find meaningful roles, we knew something had to change.
              </p>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8">
                <p className="text-lg text-gray-800">
                  The average job search takes <strong className="text-blue-600">6–12 months</strong>, even for qualified candidates. 
                  Why? Because applying to jobs is time-consuming, frustrating, and often leads nowhere.
                </p>
              </div>
            </div>

            {/* Problem Points */}
            <div className="mb-8">
              <h4 className="text-xl font-bold text-gray-900 mb-6">The Problem with Traditional Job Search:</h4>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-800">Applying manually takes 3–4 hours/day</span>
                    <span className="text-gray-600 text-sm block">just to keep up with postings</span>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Target className="h-5 w-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-800">By the time you apply, there are already 500+ applicants</span>
                    <span className="text-gray-600 text-sm block">ahead of you</span>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="h-5 w-5 bg-red-500 rounded-full mr-3 mt-1 flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800">Using AI to apply gets flagged by ATS bots</span>
                    <span className="text-gray-600 text-sm block">that detect cursor movement, speed, and spacing patterns</span>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="h-5 w-5 bg-red-500 rounded-full mr-3 mt-1 flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800">Embellishing resumes with keywords?</span>
                    <span className="text-gray-600 text-sm block">That's being caught too — and could get you blacklisted permanently</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ApplyFirst Approach */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <h4 className="text-xl font-bold text-blue-900 mb-4">The ApplyFirst Approach:</h4>
              <p className="text-gray-700 mb-4">Instead of wasting time applying to every listing, ApplyFirst flips the process:</p>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-800"><strong>Our AI monitors job boards and company sites 24/7</strong></span>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-800"><strong>We identify openings that match your experience and goals</strong></span>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-800"><strong>We instantly reach out to hiring managers</strong> with personalized emails and your resume</span>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-800">If there's interest, we alert you to apply manually or prepare for the interview</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <div className="bg-white p-4 rounded-lg border border-blue-300">
                  <p className="text-lg text-blue-800">
                    <TrendingDown className="inline h-5 w-5 mr-1" />
                    That's how we've reduced job search time from <strong>12 months to just 2 months</strong> on average.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden animate-fade-in">
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-4">Let ApplyFirst do the outreach. You focus on crushing the interview.</h3>
            
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 mt-6"
            >
              Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        </div>
      </div>
    </section>
  );
};

export default ATSProblem;