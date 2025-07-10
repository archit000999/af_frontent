import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Copy, Globe, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const HowToApplyExternal = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link to="/home" className="flex items-center space-x-2 text-purple-600 hover:text-purple-700">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AF</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">ApplyFirst</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How to Apply to External Jobs</h1>
          <p className="text-xl text-gray-600">
            Use your ApplyFirst's resources and templates to apply to jobs outside our platform.
          </p>
        </div>

        <div className="space-y-8">
          {/* Method 1 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Copy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Use Generated Templates</h2>
                <p className="text-gray-600 mb-4">
                  Your ApplyFirst creates personalized cover letters and email templates that you can use for manual applications.
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">What You Get:</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Tailored cover letter templates</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Professional email templates for direct outreach</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Optimized resume versions for different roles</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>LinkedIn message templates</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Method 2 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <ExternalLink className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Direct Company Applications</h2>
                <p className="text-gray-600 mb-4">
                  Apply directly to company career pages using your ApplyFirst's research and templates.
                </p>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Step 1: Research</h3>
                    <p className="text-gray-600 text-sm">
                      Use our company database to find hiring managers, company culture info, and recent news
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Step 2: Customize</h3>
                    <p className="text-gray-600 text-sm">
                      Adapt your ApplyFirst-generated templates to match the specific company and role
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Step 3: Apply</h3>
                    <p className="text-gray-600 text-sm">
                      Submit through their career portal and follow up with direct outreach
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Method 3 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Networking & Referrals</h2>
                <p className="text-gray-600 mb-4">
                  Leverage your ApplyFirst's contact research to build professional relationships.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">LinkedIn Outreach</h3>
                    <p className="text-blue-700 text-sm">
                      Use our verified contact data to connect with employees and hiring managers
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">Email Campaigns</h3>
                    <p className="text-green-700 text-sm">
                      Send personalized emails to decision-makers using our templates
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-900 mb-2">Industry Events</h3>
                    <p className="text-purple-700 text-sm">
                      Use company insights to prepare for networking events and conferences
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-orange-900 mb-2">Referral Programs</h3>
                    <p className="text-orange-700 text-sm">
                      Identify employees who can refer you through internal programs
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Best Practices */}
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg p-8">
            <div className="flex items-start space-x-4">
              <Zap className="w-8 h-8 text-indigo-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Best Practices</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Do's</h3>
                    <ul className="space-y-2 text-gray-600 text-sm">
                      <li>✅ Customize each application for the specific role</li>
                      <li>✅ Follow up within 1-2 weeks</li>
                      <li>✅ Keep track of all applications in a spreadsheet</li>
                      <li>✅ Use professional email addresses</li>
                      <li>✅ Research the company thoroughly</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Don'ts</h3>
                    <ul className="space-y-2 text-gray-600 text-sm">
                      <li>❌ Send generic, mass applications</li>
                      <li>❌ Apply to the same company multiple times quickly</li>
                      <li>❌ Ignore application deadlines</li>
                      <li>❌ Forget to proofread your materials</li>
                      <li>❌ Be pushy in follow-up communications</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tools Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Tools & Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Copy className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Template Library</h3>
                <p className="text-gray-600 text-sm">Access all your generated templates and customize them</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Contact Database</h3>
                <p className="text-gray-600 text-sm">Find verified email addresses and LinkedIn profiles</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ExternalLink className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Company Insights</h3>
                <p className="text-gray-600 text-sm">Get detailed company information and recent news</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HowToApplyExternal;