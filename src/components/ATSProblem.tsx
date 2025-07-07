import { Clock, TrendingDown, Target, CheckCircle, ArrowRight, Users, Zap, BarChart3, ArrowDown, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const ATSProblem = () => {
  const [currentMonth, setCurrentMonth] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const milestones = [
    { month: 0, label: "Start", interviews: 0, offers: 0, hoursSaved: 0, costSaved: 0, description: "Begin job search" },
    { month: 1, label: "Month 1", interviews: 8, offers: 0, hoursSaved: 80, costSaved: 10000, description: "8 interviews scheduled, 80+ hours saved" },
    { month: 2, label: "Month 2", interviews: 15, offers: 1, hoursSaved: 160, costSaved: 20000, description: "Offer accepted! $20K+ opportunity cost saved" },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          const newProgress = prev + 2;
          setCurrentMonth(Math.floor((newProgress / 100) * (milestones.length - 1)));
          return newProgress;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, milestones.length]);

  const handlePlayPause = () => {
    if (progress >= 100) {
      setProgress(0);
      setCurrentMonth(0);
    }
    setIsPlaying(!isPlaying);
  };

  const currentMilestone = milestones[currentMonth] || milestones[0];
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto">
        
        {/* Hero Section with Embedded Chart */}
        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center px-6 py-3 bg-blue-100 border border-blue-200 rounded-full text-blue-700 text-sm font-semibold mb-6">
            <Users className="h-4 w-4 mr-2" />
            Why We Built ApplyFirst
          </div>
          
          <h2 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Cut Job Search Time from <span className="text-red-500">12 Months</span> to <span className="text-blue-500">2 Months</span>
          </h2>
          
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Stop competing with 500+ applicants. Be among the first 10 every time.
          </p>
          
          {/* Interactive Timeline Slider */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="text-center">
                <div className="text-sm font-semibold text-red-600 mb-2">Traditional Method</div>
                <div className="text-2xl font-bold text-red-500">12 Months</div>
                <div className="text-xs text-slate-500">Average job search</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-blue-600 mb-2">ApplyFirst Method</div>
                <div className="text-2xl font-bold text-blue-500">2 Months</div>
                <div className="text-xs text-slate-500">With our system</div>
              </div>
            </div>
            
            {/* Interactive Progress Bar */}
            <div className="relative mb-6">
              <div className="w-full bg-slate-200 rounded-full h-8 overflow-hidden shadow-inner">
                {/* Background (Traditional - 12 months) */}
                <div className="bg-gradient-to-r from-red-400 to-red-500 h-8 rounded-full absolute w-full opacity-90"></div>
                {/* Progress (ApplyFirst - 2 months) */}
                <div 
                  className="bg-gradient-to-r from-blue-400 to-blue-500 h-8 rounded-full absolute transition-all duration-300 ease-out opacity-95 shadow-lg"
                  style={{ width: `${Math.max(16.7, (progress / 100) * 16.7)}%` }}
                ></div>
                {/* Progress Indicator */}
                <div 
                  className="absolute top-0 h-8 w-1 bg-white shadow-lg transition-all duration-300 ease-out"
                  style={{ left: `${(progress / 100) * 16.7}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-3">
                <span className="text-xs text-red-600 font-medium">Competing with 500+ applicants</span>
                <span className="text-xs text-blue-600 font-medium">Among first 10 applicants</span>
              </div>
            </div>

            {/* Milestone Display */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{currentMilestone.month}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{currentMilestone.label}</h4>
                    <p className="text-sm text-slate-600">{currentMilestone.description}</p>
                  </div>
                </div>
                
                <div className="flex space-x-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{currentMilestone.interviews}</div>
                    <div className="text-xs text-slate-500">Interviews</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{currentMilestone.offers}</div>
                    <div className="text-xs text-slate-500">Offers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{currentMilestone.hoursSaved}+</div>
                    <div className="text-xs text-slate-500">Hours Saved</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-600">${currentMilestone.costSaved > 0 ? `${currentMilestone.costSaved/1000}K+` : '0'}</div>
                    <div className="text-xs text-slate-500">Cost Saved</div>
                  </div>
                </div>
              </div>
              
              {/* Progress Steps */}
              <div className="flex justify-between items-center">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                      index <= currentMonth ? 'bg-blue-500' : 'bg-slate-300'
                    }`}></div>
                    {index < milestones.length - 1 && (
                      <div className={`w-16 h-0.5 transition-colors duration-300 ${
                        index < currentMonth ? 'bg-blue-500' : 'bg-slate-300'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Play Control */}
            <div className="text-center">
              <Button
                onClick={handlePlayPause}
                variant="outline"
                size="lg"
                className="px-8 py-4 rounded-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 transition-all duration-300"
              >
                {isPlaying ? (
                  <><Pause className="h-5 w-5 mr-2" /> Pause Animation</>
                ) : (
                  <><Play className="h-5 w-5 mr-2" /> {progress >= 100 ? 'Replay' : 'See Progress'}</>
                )}
              </Button>
            </div>
          </div>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
            The job search process is broken. We flipped it entirely.
          </p>
          
          {/* Key Stats Row */}
          <div className="flex justify-center items-center space-x-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">83%</div>
              <div className="text-sm text-slate-600">Faster</div>
            </div>
            <div className="w-px h-12 bg-slate-300"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">15+</div>
              <div className="text-sm text-slate-600">Interviews/month</div>
            </div>
            <div className="w-px h-12 bg-slate-300"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">87%</div>
              <div className="text-sm text-slate-600">Response rate</div>
            </div>
          </div>
        </div>

        {/* Problem vs Solution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* The Problem */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-3xl border-l-4 border-red-400">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mr-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">The Broken System</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-red-600 mr-3" />
                <span className="text-slate-700 font-medium">3-4 hours daily applications</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-red-600 mr-3" />
                <span className="text-slate-700 font-medium">500+ applicants per job</span>
              </div>
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-red-600 mr-3" />
                <span className="text-slate-700 font-medium">AI detection & blacklisting</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-red-100 rounded-xl text-center">
              <div className="text-2xl font-bold text-red-700">6-12 months</div>
              <div className="text-sm text-red-600">Average job search time</div>
            </div>
          </div>

          {/* The Solution */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-3xl border-l-4 border-blue-400">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">The ApplyFirst Way</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-slate-700 font-medium">AI monitors 10k+ job boards</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-slate-700 font-medium">Direct hiring manager outreach</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-slate-700 font-medium">First 10 applicants, every time</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-100 rounded-xl text-center">
              <div className="text-2xl font-bold text-blue-700">2 months</div>
              <div className="text-sm text-blue-600">Average with ApplyFirst</div>
            </div>
          </div>
        </div>

        {/* How It Works - Simplified */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl mb-16">
          <h3 className="text-3xl font-bold text-center text-slate-900 mb-8">How It Works</h3>
          
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex-1 text-center mb-6 md:mb-0">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="font-bold text-slate-800 mb-2">We Find Jobs</h4>
              <p className="text-slate-600 text-sm">AI scans thousands of listings matching your profile</p>
            </div>
            
            <ArrowRight className="h-8 w-8 text-slate-400 mb-6 md:mb-0 rotate-90 md:rotate-0" />
            
            <div className="flex-1 text-center mb-6 md:mb-0">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h4 className="font-bold text-slate-800 mb-2">We Reach Out</h4>
              <p className="text-slate-600 text-sm">Direct personalized emails to hiring managers</p>
            </div>
            
            <ArrowRight className="h-8 w-8 text-slate-400 mb-6 md:mb-0 rotate-90 md:rotate-0" />
            
            <div className="flex-1 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h4 className="font-bold text-slate-800 mb-2">You Interview</h4>
              <p className="text-slate-600 text-sm">Skip the queue, go straight to conversations</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 rounded-3xl p-12 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-4xl font-bold mb-4">
              Stop applying. Start interviewing.
            </h3>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join 500+ professionals who cut their job search by 83%
            </p>
            
            <Button 
              size="lg" 
              className="bg-white text-slate-900 hover:bg-slate-100 px-12 py-4 text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-full"
            >
              Get Started Today <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </div>
          
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl -translate-y-48 translate-x-48"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl translate-y-48 -translate-x-48"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ATSProblem;