
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';

const CopilotPreview = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/copilot-final');
  };

  // Mock job data based on the image
  const jobs = [
    {
      id: 1,
      title: "Senior Software Engineer - Fullstack Developer",
      company: "Ninja Van",
      location: "Hyderabad, India",
      type: "Fulltime"
    },
    {
      id: 2,
      title: "Senior Full Stack Software Engineer (React.js /.Net)",
      company: "Shift",
      location: "Kalyani Magnum, Block 2, 5th ...",
      type: "Fulltime"
    },
    {
      id: 3,
      title: "Software Developer",
      company: "Cbts India",
      location: "Chennai, India",
      type: "Fulltime"
    },
    {
      id: 4,
      title: "Jio Tesseract-Software Developer/Engineering Manager/Senior Software Developer",
      company: "Nexthire",
      location: "Navi Mumbai, IN",
      type: "Fulltime"
    },
    {
      id: 5,
      title: "Lead Software Developer",
      company: "Cbts India",
      location: "Chennai, India",
      type: "Fulltime"
    },
    {
      id: 6,
      title: "Software Developer (React)",
      company: "Vagaro",
      location: "Ahmedabad, IN",
      type: "Fulltime"
    },
    {
      id: 7,
      title: "Senior Embedded Software Developer",
      company: "Continental",
      location: "Remote",
      type: "Fulltime"
    },
    {
      id: 8,
      title: "Truva-Senior Software Developer",
      company: "Nexthire",
      location: "Bangalore, IN",
      type: "Fulltime"
    },
    {
      id: 9,
      title: "EVEREST IMS- SOFTWARE DEVELOPER",
      company: "Nexthire",
      location: "BANGALORE, IN",
      type: "Fulltime"
    },
    {
      id: 10,
      title: "Software Developer - Wifi",
      company: "Arista Networks",
      location: "Pune, Maharashtra, India",
      type: "Fulltime"
    }
  ];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-purple-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CJ</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">JobCopilot</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-2 text-purple-600 font-medium text-sm">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xs">◯</span>
              </div>
              <span>Copilot</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 cursor-pointer text-sm">
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="text-gray-600 text-xs">📋</span>
              </div>
              <span>Applications</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 cursor-pointer text-sm">
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="text-gray-600 text-xs">🔧</span>
              </div>
              <span>Tools</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 cursor-pointer text-sm">
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="text-gray-600 text-xs">❓</span>
              </div>
              <span>Support</span>
            </div>
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            <Settings className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                }
              }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden px-6 py-8">
        <div className="max-w-6xl mx-auto h-full flex flex-col">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-base font-semibold text-gray-900 mb-4">
              Great! You've configured your Copilot
            </h1>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Based on your configuration, here's a preview of jobs that your Copilot will automatically apply to
            </p>
          </div>

          {/* Jobs Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-3">
                    {/* Job Title */}
                    <h3 className="text-base font-medium text-purple-600 leading-tight">
                      {job.title}
                    </h3>
                    
                    {/* Company */}
                    <p className="text-sm font-medium text-gray-900">
                      {job.company}
                    </p>
                    
                    {/* Location and Type */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm">{job.type}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm">{job.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Back Button */}
          <div className="flex justify-start pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center space-x-2 px-6 py-3 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Configuration</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CopilotPreview;
