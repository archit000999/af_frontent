
import { Search, Mail, Target } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "We Scan & Find Hidden Jobs",
      description: "Our system continuously scans the web for new opportunities, including positions that haven't hit LinkedIn yet.",
      step: "01"
    },
    {
      icon: Mail,
      title: "Instant Hiring Manager Outreach",
      description: "We immediately email hiring managers with your tailored resume and compelling introduction.",
      step: "02"
    },
    {
      icon: Target,
      title: "You're in the First 10 Applicants",
      description: "By reaching out instantly, you're among the first candidates they see, dramatically increasing your chances.",
      step: "03"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How Saki Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our automated system puts you ahead of the competition by reaching hiring managers 
            before the job market gets saturated.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 h-full">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-4xl font-bold text-blue-100">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <div className="w-8 h-0.5 bg-blue-300"></div>
                  <div className="w-0 h-0 border-l-4 border-l-blue-300 border-t-2 border-t-transparent border-b-2 border-b-transparent absolute right-0 top-1/2 transform -translate-y-1/2"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
