
import { TrendingUp, Users, Clock, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Proof = () => {
  const stats = [
    {
      icon: TrendingUp,
      number: "10+",
      label: "Average interviews landed per user in 2 months",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: Users,
      number: "600+",
      label: "High-intent contacts reached monthly per user",
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: Clock,
      number: "24hrs",
      label: "Average time to first hiring manager contact",
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: Star,
      number: "100%",
      label: "of emails land in primary inbox",
      color: "from-yellow-400 to-orange-500"
    }
  ];

  return (
    <section id="proof" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Proven Results That{" "}
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Speak for Themselves
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Our users consistently land more interviews faster than traditional job searching methods.
            The numbers don't lie.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className={`mx-auto w-20 h-20 bg-gradient-to-r ${stat.color} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl`}>
                <stat.icon className="h-10 w-10 text-white" />
              </div>
              <div className="text-5xl font-bold text-white mb-3 group-hover:scale-105 transition-transform duration-300">{stat.number}</div>
              <div className="text-slate-300 text-base leading-relaxed max-w-48 mx-auto">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 lg:p-12 max-w-6xl mx-auto border border-white/20 shadow-2xl">
          <h3 className="text-3xl font-bold text-white mb-12 text-center">What Our Users Say</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-200 text-lg italic mb-6 leading-relaxed">
                "ApplyFirst helped me land 3 interviews in my first week. The hiring managers actually responded because I was early in the process. Game changer!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">MD</span>
                </div>
                <div>
                  <div className="font-semibold text-white">Mudit Dawar</div>
                  <div className="text-sm text-slate-400">GTM Manager at Walmart</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-200 text-lg italic mb-6 leading-relaxed">
                "I was tired of applying to 200+ jobs on LinkedIn with no response. ApplyFirst's approach actually gets you in front of decision-makers who matter."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">JW</span>
                </div>
                <div>
                  <div className="font-semibold text-white">Jordan Williams</div>
                  <div className="text-sm text-slate-400">Senior Developer at InnovateInc</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" onClick={() => window.location.href = '/auth'} className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-12 py-6 text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              Start Landing Interviews <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Proof;
