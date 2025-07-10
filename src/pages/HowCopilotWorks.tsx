import { Button } from "@/components/ui/button";
import { ArrowLeft, Bot, Search, Mail, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
const HowCopilotWorks = () => {
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How ApplyFirst Works</h1>
          <p className="text-xl text-gray-600">
            Your AI-powered job search assistant that works 24/7 to find and apply to the best opportunities for you.
          </p>
        </div>

        <div className="space-y-12">
          {/* Step 1 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Intelligent Job Discovery</h2>
                <p className="text-gray-600 mb-4">
                  Our AI continuously scans 50+ job boards including LinkedIn, Indeed, Glassdoor, and company career pages. 
                  It identifies new opportunities that match your profile, preferences, and career goals.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Real-time monitoring of job postings</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Advanced matching algorithms</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Filters out irrelevant positions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Smart Application Process</h2>
                <p className="text-gray-600 mb-4">Our human agent manually apply to each job posting using our in-house chrome extension. It tailors your resume and cover letter to highlight the most relevant skills and experiences for each position.</p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Customized resume optimization</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Personalized cover letters</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Keyword matching for ATS systems</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Direct Outreach</h2>
                <p className="text-gray-600 mb-4">Beyond standard applications, ApplyFirst AI can identify hiring managers and decision-makers on LinkedIn, then human agent sends personalized emails directly to their verified business addresses on your behalf</p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>LinkedIn research and contact finding</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Verified email addresses</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Professional, personalized messaging</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">20+</div>
                <div className="text-gray-600">Applications per day</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">10x</div>
                <div className="text-gray-600">Higher response rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">20+</div>
                <div className="text-gray-600">Hours saved per week</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>;
};
export default HowCopilotWorks;