
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCopilotConfig } from '@/hooks/useCopilotConfig';


interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  description?: string;
}

const CopilotPreview = () => {
  const navigate = useNavigate();
  const { config, isInitialized } = useCopilotConfig();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>('');
  const [apiMessage, setApiMessage] = useState<string>('');

  const handleBack = () => {
    navigate('/copilot-final-step');
  };

  const handleActivateCopilot = () => {
    navigate('/payment');
  };

  useEffect(() => {
    const fetchJobs = async () => {
      if (!isInitialized || !config || !config.jobTitles || config.jobTitles.length === 0) {
        return;
      }

      setIsLoading(true);
      setError(null);
      setDataSource('');
      setApiMessage('');

      try {
        // Mock job fetching for demo
        const mockJobs = [
          {
            id: 1,
            title: `${config.jobTitles[0] || 'Software Engineer'}`,
            company: 'Tech Company Inc.',
            location: config.onsiteLocations[0] || 'San Francisco, CA',
            type: config.workLocationTypes[0] || 'Full-time',
            description: 'Exciting opportunity to work with cutting-edge technology...',
            salary: '$120,000 - $150,000',
            posted: '2 days ago'
          },
          {
            id: 2,
            title: `Senior ${config.jobTitles[0] || 'Developer'}`,
            company: 'Innovation Labs',
            location: config.remoteLocations[0] || 'Remote',
            type: 'Remote',
            description: 'Join our team of passionate developers...',
            salary: '$140,000 - $180,000',
            posted: '1 week ago'
          }
        ];

        const data = {
          jobs: mockJobs,
          source: 'demo',
          message: 'Demo jobs generated based on your criteria'
        };
        const functionError = null;

        if (functionError) {
          throw new Error(functionError.message || 'Failed to fetch jobs');
        }

        if (data && data.jobs) {
          setJobs(data.jobs);
          setDataSource(data.source || 'unknown');
          setApiMessage(data.message || '');
        } else {
          throw new Error('No jobs data received');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
        
        // Set fallback jobs on error
        setJobs([
          {
            id: 1,
            title: 'Senior Software Engineer - Fullstack Developer',
            company: 'Ninja Van',
            location: 'Hyderabad, India',
            type: 'Fulltime'
          },
          {
            id: 2,
            title: 'Senior Full Stack Software Engineer (React.js /.Net)',
            company: 'Shift',
            location: 'Kalyani Magnum, Block 2, 5th ...',
            type: 'Fulltime'
          },
          {
            id: 3,
            title: 'Software Developer',
            company: 'Cbts India',
            location: 'Chennai, India',
            type: 'Fulltime'
          }
        ]);
        setDataSource('fallback');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [isInitialized, config]);

  if (!isInitialized) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AF</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">ApplyFirst</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div
            onClick={()=>navigate("/")}
            className="flex items-center space-x-2 text-purple-600 font-medium text-base cursor-pointer">
              <span>ApplyFirst</span>
            </div>
            <div
            onClick={()=>navigate("/applications")}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 cursor-pointer text-base">
              <span>Applications</span>
            </div>
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden px-6 py-8">
        <div className="max-w-5xl mx-auto h-full flex flex-col">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              Great! You've configured your ApplyFirst
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Based on your configuration, here's a preview of jobs that your ApplyFirst will automatically apply to
            </p>
            
            {/* Data Source Indicator */}
            {dataSource && (
              <div className="mt-4">
                {dataSource === 'perplexity-api' ? (
                  <div className="inline-flex items-center px-3 py-1 bg-green-50 border border-green-200 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  </div>
                ) : (
                  <div className="inline-flex items-center px-3 py-1 bg-orange-50 border border-orange-200 rounded-full">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                  </div>
                )}
              </div>
            )}
            
            {/* API Message */}
            
            
            
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
                <p className="text-gray-600">Fetching latest job opportunities...</p>
              </div>
            </div>
          ) : (
            /* Jobs Grid */
            <div className="flex-1 overflow-y-auto mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-lg border border-gray-200 px-5 py-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="space-y-4">
                      {/* Job Title */}
                      <h3 className="text-lg font-medium text-purple-600 leading-tight">
                        {job.title}
                      </h3>
                      
                      {/* Company */}
                      <p className="text-base font-medium text-gray-900">
                        {job.company}
                      </p>
                      
                      {/* Location and Type */}
                      <div className="flex items-center justify-between text-gray-600">
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm">{job.type}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm">{job.location}</span>
                        </div>
                      </div>

                      {/* Hiring Manager Info */}
                      <div className="space-y-2 pt-2 border-t border-gray-100">
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Hiring Manager</p>
                          <div className="bg-gray-200 rounded h-4 w-32" style={{ filter: 'blur(2px)' }}>
                            <span className="text-xs text-gray-400 opacity-0">████████████</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Contact Email</p>
                          <div className="bg-gray-200 rounded h-4 w-40" style={{ filter: 'blur(2px)' }}>
                            <span className="text-xs text-gray-400 opacity-0">████████████████</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Text and Buttons */}
          <div className="text-center space-y-6">
            <h2 className="text-xl font-medium text-gray-900">
              Want your ApplyFirst to apply for these jobs?
            </h2>
            
            <div className="flex flex-col space-y-4 max-w-md mx-auto">
              <Button
                onClick={handleActivateCopilot}
                className="w-full py-4 text-base font-medium bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-full"
              >
                Yes! Activate ApplyFirst
              </Button>

              <Button
                variant="outline"
                onClick={handleBack}
                className="w-full py-4 text-base font-medium border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full"
              >
                No, go back to configuration
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CopilotPreview;
