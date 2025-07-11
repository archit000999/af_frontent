import { Shield, Users, Target, CheckCircle, AlertTriangle } from "lucide-react";
const ATSProblem = () => {
  return <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 border border-blue-200 rounded-full text-blue-800 text-sm font-medium mb-6">
            <Shield className="h-4 w-4 mr-2" />
            The ApplyFirst Difference
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Why <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Human-Led, AI-Assisted
            </span> Works Better
          </h2>
          
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            While other platforms rely entirely on automation, we chose a different path focused on <strong>real results, not just speed.</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch mb-16">
          <div>
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <div className="flex items-center mb-6">
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Our Human-Led, AI-Assisted Approach</h3>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                Most platforms rely entirely on automation by submitting hundreds of AI-generated applications quickly, which triggers ATS filters designed to detect bot-like behavior. <strong>At ApplyFirst, we chose a different path.</strong>
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-blue-600 text-sm font-bold">✓</span>
                  </div>
                  <span className="text-gray-700"><strong>Human agents drive the outreach</strong>, tailoring every application with precision and accuracy</span>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-blue-600 text-sm font-bold">✓</span>
                  </div>
                  <span className="text-gray-700"><strong>AI tools support and optimize</strong> their workflow behind the scenes</span>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-blue-600 text-sm font-bold">✓</span>
                  </div>
                  <span className="text-gray-700"><strong>Applications are both high-quality and ATS-compliant</strong> thereby avoiding auto-rejection</span>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-blue-800 font-medium">Our north star metric: Designed to be unsubscribed</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-br from-orange-500 to-red-500 p-8 rounded-2xl text-white mb-8">
              <AlertTriangle className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Why AI Alone Can Hurt Your Chances</h3>
              <p className="text-lg leading-relaxed">Mass-applying with bots often leads to being flagged by ATS or ignored by recruiters. Our human-led model gives your application the edge it needs to break through the noise.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-200">
              <div className="text-6xl font-bold text-blue-600 mb-2">85%+</div>
              <p className="text-gray-700 font-semibold mb-2">of applicants never make it past the ATS</p>
              <p className="text-blue-600 font-medium text-sm">ApplyFirst users break through because real people apply like real professionals.</p>
            </div>
          </div>
        </div>

      </div>
    </section>;
};
export default ATSProblem;