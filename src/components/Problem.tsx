
import { AlertCircle, Clock, DollarSign, Target } from "lucide-react";

const Problem = () => {
  const painPoints = [
    {
      icon: Target,
      title: "Ghost Jobs & Timing Issues",
      description: "You apply to jobs that are already filled or miss the perfect timing when positions first open up."
    },
    {
      icon: DollarSign,
      title: "Expensive InMails Get Ignored",
      description: "LinkedIn InMails cost money but rarely get responses from busy hiring managers."
    },
    {
      icon: Clock,
      title: "Manual Outreach Takes Forever",
      description: "Researching hiring managers and crafting personalized emails is time-consuming and rarely converts."
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why LinkedIn Isn't Enough
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Traditional job searching leaves you frustrated and behind the competition.
            Here's what's holding you back:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {painPoints.map((point, index) => (
            <div key={index} className="text-center p-8 rounded-xl bg-red-50 border border-red-100">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <point.icon className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{point.title}</h3>
              <p className="text-gray-600">{point.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-yellow-100 text-yellow-800 rounded-full">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span className="font-medium">The result? You're always playing catch-up in a crowded field.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problem;
