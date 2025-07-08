
import { UserButton, useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, Settings, MapPin, Clock, Briefcase, Edit } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { useCopilotConfig } from '@/hooks/useCopilotConfig';
import { useEffect, useState } from 'react';

const Home = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { config, isInitialized, isLoading } = useCopilotConfig();
  const [copilotStatus, setCopilotStatus] = useState(false);

  const handleSetupCopilot = () => {
    navigate('/copilot-setup');
  };

  const handleEditConfiguration = () => {
    // Navigate to the appropriate step based on where user left off
    if (config && config.stepCompleted) {
      switch (config.stepCompleted) {
        case 1:
          navigate('/copilot-setup');
          break;
        case 2:
          navigate('/copilot-filters');
          break;
        case 3:
          navigate('/copilot-screening');
          break;
        case 4:
          navigate('/copilot-final');
          break;
        default:
          navigate('/copilot-setup');
      }
    } else {
      navigate('/copilot-setup');
    }
  };

  // Check if user has a saved configuration
  const hasConfiguration = config && config.jobTitles && config.jobTitles.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
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
            <div className="flex items-center space-x-2 text-purple-600 font-medium">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xs">◯</span>
              </div>
              <span>Copilot</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 cursor-pointer">
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="text-gray-600 text-xs">📋</span>
              </div>
              <span>Applications</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 cursor-pointer">
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="text-gray-600 text-xs">🔧</span>
              </div>
              <span>Tools</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 cursor-pointer">
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
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Automate Job Applications
          </h1>

          {/* Configuration Display or Setup Card */}
          {isLoading ? (
            <Card className="mb-8 border-0 shadow-lg bg-white">
              <CardContent className="p-8">
                <div className="text-center text-gray-500">Loading configuration...</div>
              </CardContent>
            </Card>
          ) : hasConfiguration ? (
            // Show saved configuration
            <div className="flex gap-4 mb-8">
              {/* Configuration Card */}
              <Card className="flex-1 border-2 border-purple-200 shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Job Title */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {config.jobTitles[0]}
                        {config.jobTitles.length > 1 && (
                          <span className="text-sm text-gray-500 font-normal">
                            {" "}+ {config.jobTitles.length - 1} more
                          </span>
                        )}
                      </h3>
                    </div>

                    {/* Location */}
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">
                        {config.workLocationTypes.includes('remote') && config.remoteLocations.includes('Worldwide') 
                          ? 'Anywhere in the World'
                          : config.workLocationTypes.includes('remote') && config.remoteLocations.length > 0
                          ? `Remote: ${config.remoteLocations.join(', ')}`
                          : config.workLocationTypes.includes('onsite') && config.onsiteLocations.length > 0
                          ? `On-site: ${config.onsiteLocations.join(', ')}`
                          : 'Location not specified'
                        }
                      </span>
                    </div>

                    {/* Job Types */}
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Briefcase className="w-4 h-4" />
                      <span className="text-sm">
                        {config.jobTypes.includes('fulltime') ? 'Auto-Apply Jobs' : 
                         config.jobTypes.join(', ').replace(/fulltime/g, 'Full-time').replace(/parttime/g, 'Part-time').replace(/contractor/g, 'Contract').replace(/internship/g, 'Internship')}
                      </span>
                    </div>

                    {/* Time Zone */}
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Time Zone</span>
                    </div>

                    {/* Status and Controls */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-900">Copilot Status:</span>
                        <span className={`text-sm font-medium ${copilotStatus ? 'text-green-600' : 'text-gray-400'}`}>
                          {copilotStatus ? 'ON' : 'OFF'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Switch
                            checked={copilotStatus}
                            onCheckedChange={setCopilotStatus}
                            className="data-[state=checked]:bg-purple-600"
                          />
                          <span className="text-xs text-gray-400">OFF</span>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={handleEditConfiguration}
                          className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                        >
                          <Edit className="w-4 h-4" />
                          <span className="text-sm">Edit Configuration</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* New Copilot Button */}
              <div className="flex flex-col justify-center">
                <Button 
                  variant="outline"
                  onClick={handleSetupCopilot}
                  className="px-6 py-3 border-2 border-purple-300 text-purple-600 hover:bg-purple-50 font-medium"
                >
                  + New Copilot
                </Button>
              </div>
            </div>
          ) : (
            // Show setup card if no configuration
            <Card className="mb-8 border-0 shadow-lg bg-white">
              <CardContent className="p-8">
                <Button 
                  onClick={handleSetupCopilot}
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 text-lg font-semibold rounded-full flex items-center justify-center sm:justify-start space-x-2"
                >
                  <span>Setup your first copilot</span>
                  <span className="ml-2">→</span>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* How Copilot Works Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <button className="flex items-center justify-between w-full text-left">
              <h2 className="text-xl font-semibold text-gray-900">How Copilot Works</h2>
              <ChevronDown className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
