import { Button } from "@/components/ui/button";
import { ArrowLeft, Target, Settings, TrendingUp, Brain } from "lucide-react";
import { Link } from "react-router-dom";

const HowToTrainCopilot = () => {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How to Train Your Copilot</h1>
          <p className="text-xl text-gray-600">
            Optimize your AI copilot's performance to get better job matches and higher success rates.
          </p>
        </div>

        <div className="space-y-8">
          {/* Section 1 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Refine Your Job Preferences</h2>
                <p className="text-gray-600 mb-4">
                  The more specific you are about your preferences, the better your copilot can target relevant opportunities.
                </p>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Job Titles</h3>
                    <p className="text-gray-600 text-sm">
                      Add multiple variations of your target role (e.g., "Software Engineer", "Software Developer", "Backend Engineer")
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Skills & Keywords</h3>
                    <p className="text-gray-600 text-sm">
                      Include both technical skills and industry buzzwords that appear in your target job descriptions
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Company Preferences</h3>
                    <p className="text-gray-600 text-sm">
                      Specify company sizes, industries, or specific companies you're interested in
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Optimize Your Resume</h2>
                <p className="text-gray-600 mb-4">
                  Your resume is the foundation of every application. Keep it updated and ATS-friendly.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">✅ Do</h3>
                    <ul className="text-gray-600 text-sm space-y-1">
                      <li>• Use keywords from job descriptions</li>
                      <li>• Quantify your achievements</li>
                      <li>• Keep formatting simple and clean</li>
                      <li>• Update regularly with new skills</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">❌ Don't</h3>
                    <ul className="text-gray-600 text-sm space-y-1">
                      <li>• Use complex graphics or designs</li>
                      <li>• Include personal photos</li>
                      <li>• Use unusual fonts or colors</li>
                      <li>• Exceed 2 pages unless necessary</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Monitor and Adjust</h2>
                <p className="text-gray-600 mb-4">
                  Regularly review your copilot's performance and make adjustments based on results.
                </p>
                <div className="space-y-3">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Weekly Review</h3>
                    <p className="text-blue-700 text-sm">
                      Check which types of jobs are getting responses and adjust your preferences accordingly
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">A/B Testing</h3>
                    <p className="text-green-700 text-sm">
                      Try different resume versions or messaging approaches to see what works best
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-900 mb-2">Feedback Loop</h3>
                    <p className="text-purple-700 text-sm">
                      Use interview feedback to refine your approach and targeting
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-8">
            <div className="flex items-start space-x-4">
              <Brain className="w-8 h-8 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Pro Tips</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Update Seasonally</h3>
                    <p className="text-gray-600 text-sm">
                      Job market trends change. Update your preferences quarterly to stay current.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Industry-Specific Keywords</h3>
                    <p className="text-gray-600 text-sm">
                      Research trending skills and technologies in your field and include them.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Geographic Flexibility</h3>
                    <p className="text-gray-600 text-sm">
                      Consider remote opportunities to expand your potential job pool.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Track Metrics</h3>
                    <p className="text-gray-600 text-sm">
                      Monitor application-to-response ratios to measure improvement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HowToTrainCopilot;