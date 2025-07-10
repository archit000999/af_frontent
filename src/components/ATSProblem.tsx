import { AlertTriangle, Bot, Shield, Target, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignInButton } from '@clerk/clerk-react';
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

      </div>
    </section>;
};
export default ATSProblem;