import { AlertTriangle, Bot, Shield, Target, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
const ATSProblem = () => {
  return <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 to-orange-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-red-100 border border-red-200 rounded-full text-red-800 text-sm font-medium mb-6">
            <AlertTriangle className="h-4 w-4 mr-2" />
            The Truth About Job Applications
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              STOP APPLYING FOR JOBS
            </span>
            {" "}— USING AI
          </h2>
          
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            <strong>Your resume isn't getting ignored by people — it's being blocked by bots.</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch mb-16">
          <div>
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <div className="flex items-center mb-6">
                <Bot className="h-8 w-8 text-red-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">ATS Systems Now Use AI to Block You</h3>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                Most top companies use <strong>Applicant Tracking Systems (ATS)</strong> to filter out candidates before a human ever sees their profile. These systems now use AI to detect and flag:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-red-600 text-sm font-bold">✗</span>
                  </div>
                  <span className="text-gray-700"><strong>Cursor tracking patterns (detecting bot-like behavior)</strong></span>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-red-600 text-sm font-bold">✗</span>
                  </div>
                  <span className="text-gray-700"><strong>AI applies in 5 seconds (impossible human speed)</strong></span>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-red-600 text-sm font-bold">✗</span>
                  </div>
                  <span className="text-gray-700"><strong>Generic or templated resumes</strong></span>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-red-600 text-sm font-bold">✗</span>
                  </div>
                  <span className="text-gray-700"><strong>Mass job applications from the same candidate</strong></span>
                </div>
              </div>
              
              
            </div>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-br from-red-600 to-orange-600 p-8 rounded-2xl text-white mb-8">
              <AlertTriangle className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">AI Job Applying is a Trap</h3>
              <p className="text-lg leading-relaxed">Using AI to mass-apply can backfire—many ATS platforms now flag AI-generated applications, and recruiters are starting to use those warnings to auto-reject candidates.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-red-200">
              <div className="text-6xl font-bold text-red-600 mb-2">85%+</div>
              <p className="text-gray-700 font-semibold">of applicants never make it past the ATS</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
          <div className="text-center mb-8">
            <Shield className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-4">We Bypass the ATS Entirely</h3>
            <p className="text-xl leading-relaxed max-w-4xl mx-auto">
              <strong>ApplyFirst doesn't apply through job portals.</strong> We identify the right person — the hiring manager — and send a personalized message with your resume directly to their inbox the moment a role opens.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <CheckCircle className="h-8 w-8 mx-auto mb-3 text-green-300" />
              <div className="font-semibold">No filters. No flags. No bots.</div>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <Target className="h-8 w-8 mx-auto mb-3 text-green-300" />
              <div className="font-semibold">Direct to hiring managers</div>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <CheckCircle className="h-8 w-8 mx-auto mb-3 text-green-300" />
              <div className="font-semibold">Real conversations with real people</div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-xl mb-6">
              <h4 className="text-xl font-bold mb-2">It's the Only Way to Stand Out</h4>
              <p className="text-lg">
                With 85%+ of applicants never making it past the ATS, ApplyFirst gives you a completely different lane — one that actually works.
              </p>
            </div>
            
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl">
              Start Your Free Evaluation <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm mt-2 opacity-90">Get ahead before the filters even kick in</p>
          </div>
        </div>
      </div>
    </section>;
};
export default ATSProblem;