import { Search, Mail, Target, ArrowRight } from "lucide-react";
const HowItWorks = () => {
  const steps = [{
    icon: Search,
    title: "We Monitor new Job postings",
    description: "Our AI continuously monitors 500+ job boards including LinkedIn, company pages, and insider networks to find opportunities.",
    step: "01",
    color: "from-blue-500 to-indigo-500"
  }, {
    icon: Target,
    title: "You're in the First 10 Applicants",
    description: "Our human agents manually apply to each job using our in-house Chrome extension — ensuring you're among the first 10 applicants.",
    step: "02",
    color: "from-indigo-500 to-purple-500"
  }, {
    icon: Mail,
    title: "Instant Hiring Manager Outreach",
    description: "Within 10 minutes, we email hiring managers with your resume and compelling introduction that cuts through the noise.",
    step: "03",
    color: "from-purple-500 to-pink-500"
  }];
  return <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
            How ApplyFirst{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Our automated system puts you ahead of the competition by reaching hiring managers 
            before the job market gets saturated. It's like having a personal recruiter working 24/7.
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {steps.map((step, index) => <div key={index} className="relative group">
                <div className="h-full p-8 bg-gradient-to-br from-slate-50 to-white rounded-3xl shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3">
                  <div className="flex items-center mb-8">
                    <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300`}>
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <span className="text-6xl font-bold bg-gradient-to-r from-slate-200 to-slate-300 bg-clip-text text-zinc-950">{step.step}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-lg">{step.description}</p>
                </div>
                
                {index < steps.length - 1 && <div className="hidden lg:flex absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                      <ArrowRight className="h-6 w-6 text-white" />
                    </div>
                  </div>}
              </div>)}
          </div>
        </div>
      </div>
    </section>;
};
export default HowItWorks;