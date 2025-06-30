
import { TrendingUp, Users, Clock, Star } from "lucide-react";

const Proof = () => {
  const stats = [
    {
      icon: TrendingUp,
      number: "15+",
      label: "Average interviews landed per user in 2 months"
    },
    {
      icon: Users,
      number: "600+",
      label: "High-intent contacts reached monthly per user"
    },
    {
      icon: Clock,
      number: "24hrs",
      label: "Average time to first hiring manager contact"
    },
    {
      icon: Star,
      number: "95%",
      label: "User satisfaction rate"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Proven Results That Speak for Themselves
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Our users consistently land more interviews faster than traditional job searching methods.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-blue-100 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-8 max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">What Our Users Say</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <p className="text-gray-600 italic mb-4">
                "Saki helped me land 3 interviews in my first week. The hiring managers actually responded because I was early in the process."
              </p>
              <div className="font-semibold text-gray-900">Sarah Chen</div>
              <div className="text-sm text-gray-500">Product Manager</div>
            </div>
            <div className="text-center">
              <p className="text-gray-600 italic mb-4">
                "I was tired of applying to hundreds of jobs on LinkedIn. Saki's approach actually gets you in front of decision-makers."
              </p>
              <div className="font-semibold text-gray-900">Michael Rodriguez</div>
              <div className="text-sm text-gray-500">Senior Developer</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Proof;
