import { Clock, TrendingDown, Target, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ATSProblem = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-slate-100 rounded-full text-slate-600 text-sm font-medium mb-6">
            Why ApplyFirst Exists
          </div>
          <h2 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            Why We Built 
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ApplyFirst
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            The job search process is broken. After watching friends struggle for months, we knew something had to change.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start mb-20">
          
          {/* Left Column - Chart Visual */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-slate-50 to-white p-10 rounded-3xl border border-slate-200 shadow-xl">
              <div className="text-center mb-10">
                <h3 className="text-2xl font-bold text-slate-800 mb-3">Job Search Timeline</h3>
                <p className="text-slate-500">Before vs. After ApplyFirst</p>
              </div>
              
              {/* Enhanced Chart */}
              <div className="space-y-8">
                {/* Before */}
                <div className="relative">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-lg font-semibold text-slate-700">Traditional Method</span>
                      <p className="text-sm text-slate-500">Manual applications</p>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-red-500">12</span>
                      <span className="text-sm text-slate-600 block">months</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                    <div className="bg-gradient-to-r from-red-400 to-red-500 h-4 rounded-full shadow-sm" style={{ width: '100%' }}></div>
                  </div>
                </div>

                {/* After */}
                <div className="relative">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-lg font-semibold text-slate-700">ApplyFirst Method</span>
                      <p className="text-sm text-slate-500">Direct outreach</p>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-blue-500">2</span>
                      <span className="text-sm text-slate-600 block">months</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-4 rounded-full shadow-sm transition-all duration-1000 ease-out" style={{ width: '16.7%' }}></div>
                  </div>
                </div>

                {/* Result */}
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-2xl border border-emerald-200 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingDown className="h-6 w-6 text-emerald-600 mr-2" />
                    <span className="text-2xl font-bold text-emerald-700">83% Faster</span>
                  </div>
                  <p className="text-sm text-emerald-600">Average time reduction</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-3 space-y-12">
            
            {/* Quote Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border-l-4 border-blue-500">
              <blockquote className="text-xl text-slate-700 italic leading-relaxed">
                "The average job search takes <strong className="text-blue-600 not-italic">6–12 months</strong>, even for qualified candidates. Why? Because applying to jobs is time-consuming, frustrating, and often leads nowhere."
              </blockquote>
            </div>

            {/* Problems Section */}
            <div>
              <h3 className="text-3xl font-bold text-slate-900 mb-8">The Problem with Traditional Job Search</h3>
              <div className="grid gap-6">
                <div className="flex items-start group hover:bg-slate-50 p-4 rounded-xl transition-colors">
                  <div className="bg-red-100 p-2 rounded-lg mr-4 group-hover:bg-red-200 transition-colors">
                    <Clock className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-1">Applying manually takes 3–4 hours/day</h4>
                    <p className="text-slate-600">Just to keep up with new postings and requirements</p>
                  </div>
                </div>
                
                <div className="flex items-start group hover:bg-slate-50 p-4 rounded-xl transition-colors">
                  <div className="bg-red-100 p-2 rounded-lg mr-4 group-hover:bg-red-200 transition-colors">
                    <Target className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-1">You're competing with 500+ other applicants</h4>
                    <p className="text-slate-600">By the time you apply, you're already behind</p>
                  </div>
                </div>
                
                <div className="flex items-start group hover:bg-slate-50 p-4 rounded-xl transition-colors">
                  <div className="bg-red-100 p-2 rounded-lg mr-4 group-hover:bg-red-200 transition-colors">
                    <div className="h-5 w-5 bg-red-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">AI</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-1">AI applications get flagged by ATS systems</h4>
                    <p className="text-slate-600">Modern systems detect automated behavior patterns</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Solution Section */}
            <div className="bg-gradient-to-br from-white to-slate-50 p-8 rounded-3xl border border-slate-200 shadow-lg">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
                The ApplyFirst Approach
              </h3>
              <p className="text-lg text-slate-600 mb-8">Instead of wasting time applying to every listing, we flip the process entirely:</p>
              
              <div className="grid gap-4">
                {[
                  "Our AI monitors job boards and company sites 24/7",
                  "We identify openings that match your experience and goals", 
                  "We instantly reach out to hiring managers with personalized emails",
                  "If there's interest, we alert you to prepare for the interview"
                ].map((text, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-green-100 p-1 rounded-full mr-4 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-slate-700 font-medium">{text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-white rounded-2xl border border-blue-200">
                <div className="text-center">
                  <p className="text-lg text-blue-800">
                    <TrendingDown className="inline h-5 w-5 mr-2" />
                    <strong>Result:</strong> Job search time reduced from 12 months to just 2 months on average
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-12 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-4xl font-bold mb-6">Let ApplyFirst do the outreach.<br />You focus on crushing the interview.</h3>
            
            <Button 
              size="lg" 
              className="bg-white text-slate-900 hover:bg-slate-100 px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-full"
            >
              Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          {/* Subtle background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl -translate-y-48 translate-x-48"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl translate-y-48 -translate-x-48"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ATSProblem;