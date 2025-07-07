import { Clock, TrendingDown, Target, CheckCircle, ArrowRight, Users, Zap, Mail, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ATSProblem = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-blue-100 border border-blue-200 rounded-full text-blue-700 text-sm font-semibold mb-8 shadow-sm">
            <Users className="h-4 w-4 mr-2" />
            Why ApplyFirst Exists
          </div>
          <h2 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-8 tracking-tight leading-tight">
            Why We Built 
            <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ApplyFirst
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            The job search process is broken. After watching friends struggle for months, we knew something had to change.
          </p>
        </div>

        {/* Balanced Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
          
          {/* Left Column - Enhanced Visual Section */}
          <div className="space-y-8">
            {/* Timeline Visualization */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
              <div className="flex items-center justify-center mb-8">
                <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-slate-800">Job Search Timeline</h3>
              </div>
              
              <div className="space-y-8">
                {/* Traditional Method */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                      <div>
                        <span className="text-lg font-semibold text-slate-700">Traditional Method</span>
                        <p className="text-sm text-slate-500">Manual applications, ATS portals</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-4xl font-bold text-red-500">12</span>
                      <span className="text-sm text-slate-600 block">months avg</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-6 overflow-hidden shadow-inner">
                    <div className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 h-6 rounded-full shadow-sm relative">
                      <div className="absolute inset-0 bg-white/20 rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Competing with 500+ applicants per role</p>
                </div>

                {/* ApplyFirst Method */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                      <div>
                        <span className="text-lg font-semibold text-slate-700">ApplyFirst Method</span>
                        <p className="text-sm text-slate-500">Direct outreach to hiring managers</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-4xl font-bold text-blue-500">2</span>
                      <span className="text-sm text-slate-600 block">months avg</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-6 overflow-hidden shadow-inner">
                    <div className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 h-6 rounded-full shadow-sm transition-all duration-1000 ease-out relative" style={{ width: '16.7%' }}>
                      <div className="absolute inset-0 bg-white/20 rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">First to reach decision makers</p>
                </div>

                {/* Success Metric */}
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-2xl border border-emerald-200 text-center">
                  <div className="flex items-center justify-center mb-3">
                    <TrendingDown className="h-7 w-7 text-emerald-600 mr-3" />
                    <span className="text-3xl font-bold text-emerald-700">83% Faster</span>
                  </div>
                  <p className="text-sm text-emerald-600 font-medium">Average time reduction across all clients</p>
                </div>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">15+</div>
                <div className="text-sm text-slate-600">Interviews<br />per month</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">87%</div>
                <div className="text-sm text-slate-600">Response<br />rate</div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-8">
            
            {/* Founder's Quote */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border-l-4 border-blue-500 relative">
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">"</span>
              </div>
              <blockquote className="text-xl text-slate-700 italic leading-relaxed pl-4">
                The average job search takes <strong className="text-blue-600 not-italic">6–12 months</strong>, even for qualified candidates. We knew we had to flip this broken process entirely.
              </blockquote>
              <cite className="text-sm text-slate-500 not-italic block mt-4 pl-4">— ApplyFirst Founders</cite>
            </div>

            {/* Problems Grid */}
            <div>
              <h3 className="text-3xl font-bold text-slate-900 mb-8">Traditional Job Search Problems</h3>
              <div className="space-y-4">
                {[
                  {
                    icon: Clock,
                    title: "3-4 hours daily on applications",
                    desc: "Just to keep up with new postings and tailored requirements",
                    color: "red"
                  },
                  {
                    icon: Target,
                    title: "500+ competitors per role",  
                    desc: "By the time you apply, you're already lost in the crowd",
                    color: "orange"
                  },
                  {
                    icon: Zap,
                    title: "AI detection by ATS systems",
                    desc: "Modern platforms flag automated applications instantly",
                    color: "red"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start group hover:bg-slate-50 p-5 rounded-xl transition-all duration-200">
                    <div className={`bg-${item.color}-100 p-3 rounded-xl mr-4 group-hover:bg-${item.color}-200 transition-colors`}>
                      <item.icon className={`h-5 w-5 text-${item.color}-600`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-2 text-lg">{item.title}</h4>
                      <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Solution Highlight */}
            <div className="bg-gradient-to-br from-white to-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl">
              <div className="flex items-center mb-6">
                <Mail className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  The ApplyFirst Solution
                </h3>
              </div>
              
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Instead of applying through crowded portals, we reach hiring managers directly before jobs go public.
              </p>
              
              <div className="space-y-4">
                {[
                  "AI monitors 10,000+ job boards and company sites 24/7",
                  "Identify perfect matches based on your experience and goals", 
                  "Send personalized emails directly to hiring managers",
                  "Get you in the first 10 applicants, every time"
                ].map((text, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-full mr-4 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-slate-700 font-medium text-lg leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-white rounded-2xl border-2 border-blue-200">
                <div className="text-center">
                  <p className="text-xl text-blue-800 font-semibold">
                    <strong>Result:</strong> 12 months → 2 months average job search
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced CTA */}
        <div className="relative">
          <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="relative z-10 text-center">
              <h3 className="text-4xl font-bold mb-4 leading-tight">
                Let ApplyFirst do the outreach.
                <span className="block text-blue-300">You focus on crushing the interview.</span>
              </h3>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Join 500+ professionals who've cut their job search time by 83%
              </p>
              
              <Button 
                size="lg" 
                className="bg-white text-slate-900 hover:bg-slate-100 px-12 py-4 text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-full"
              >
                Start Your Job Search <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
              
              <p className="text-sm text-slate-400 mt-4">No upfront fees • Results guaranteed</p>
            </div>
            
            {/* Enhanced background decoration */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl -translate-y-48 translate-x-48"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl translate-y-48 -translate-x-48"></div>
              <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ATSProblem;