
import { AlertTriangle, Clock, DollarSign, Users } from "lucide-react";

const Problem = () => {
  const painPoints = [
    {
      icon: Clock,
      title: "You're Too Late to Apply",
      description: "Many roles are already filled internally or receive 500+ applicants within days. By the time you apply, the opportunity window has likely closed.",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: DollarSign,
      title: "LinkedIn InMails Are Costly and Ineffective",
      description: "Sending 100 messages through InMail can cost over $1,000 per month, with low open and response rates from busy hiring managers.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Users,
      title: "Manual Outreach Isn't Scalable",
      description: "Spending hours each day researching companies and writing personalized messages isn't sustainable. Most professionals struggle to keep up this effort consistently over time.",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  return (
    <section id="problem" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
            Why Your{" "}
            <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              Job Search Isn't Working
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Despite your best efforts, you're not seeing the results you deserve.
            Here's what's actually holding you back:
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {painPoints.map((point, index) => (
            <div key={index} className="group relative">
              <div className="h-full p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-slate-300 transform hover:-translate-y-2">
                <div className={`w-16 h-16 bg-gradient-to-r ${point.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <point.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{point.title}</h3>
                <p className="text-slate-600 leading-relaxed">{point.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300 text-yellow-800 rounded-2xl shadow-lg">
            <AlertTriangle className="h-6 w-6 mr-3 text-yellow-600" />
            <span className="font-semibold text-lg">⚠️ Result: You're stuck in a high-effort, low-return process</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problem;
