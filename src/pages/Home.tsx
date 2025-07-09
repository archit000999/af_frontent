
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
  const { 
    config, 
    allConfigs, 
    createNewCopilot, 
    canCreateNewCopilot, 
    switchToConfig, 
    isInitialized, 
    isLoading 
  } = useCopilotConfig();
  const [copilotStatuses, setCopilotStatuses] = useState<{[key: string]: boolean}>({});

  const handleSetupCopilot = () => {
    if (createNewCopilot()) {
      // Clear any cached configuration data from localStorage
      localStorage.removeItem('copilot-config-draft');
      localStorage.removeItem('copilot-config');
      
      // Navigate to setup with fresh state
      navigate('/copilot-setup');
    }
  };

  const handleEditConfiguration = (configId?: string) => {
    const targetConfig = configId ? allConfigs.find(c => c.id === configId) : config;
    
    if (configId && targetConfig) {
      switchToConfig(configId);
    }
    
    // Navigate to the appropriate step based on where user left off
    if (targetConfig && targetConfig.stepCompleted) {
      switch (targetConfig.stepCompleted) {
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
          navigate('/copilot-final-step');
          break;
        default:
          navigate('/copilot-setup');
      }
    } else {
      navigate('/copilot-setup');
    }
  };

  const handleCopilotStatusToggle = (configId: string, status: boolean) => {
    setCopilotStatuses(prev => ({
      ...prev,
      [configId]: status
    }));
  };

  // Check if user has any saved configurations
  const hasConfigurations = allConfigs.length > 0;

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

          {/* Loading State */}
          {isLoading ? (
            <Card className="mb-8 border-0 shadow-lg bg-white">
              <CardContent className="p-8">
                <div className="text-center text-gray-500">Loading configurations...</div>
              </CardContent>
            </Card>
          ) : hasConfigurations ? (
            // Show all copilot configurations
            <div className="space-y-4 mb-8">
              {allConfigs.map((copilotConfig, index) => (
                <div key={copilotConfig.id} className="flex gap-4">
                  {/* Configuration Card */}
                  <Card className="flex-1 border-2 border-purple-200 shadow-lg bg-white">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Copilot Number and Job Title */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-500 font-medium">
                              Copilot #{index + 1}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              copilotConfig.stepCompleted === 4 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {copilotConfig.stepCompleted === 4 ? 'Complete' : `Step ${copilotConfig.stepCompleted} of 4`}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {copilotConfig.jobTitles && copilotConfig.jobTitles.length > 0 ? (
                              <>
                                {copilotConfig.jobTitles[0]}
                                {copilotConfig.jobTitles.length > 1 && (
                                  <span className="text-sm text-gray-500 font-normal">
                                    {" "}+ {copilotConfig.jobTitles.length - 1} more
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-gray-500">Job titles not set</span>
                            )}
                          </h3>
                        </div>

                        {/* Location */}
                        <div className="flex items-center space-x-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">
                            {copilotConfig.workLocationTypes.includes('remote') && copilotConfig.remoteLocations.includes('Worldwide') 
                              ? 'Anywhere in the World'
                              : copilotConfig.workLocationTypes.includes('remote') && copilotConfig.remoteLocations.length > 0
                              ? `Remote: ${copilotConfig.remoteLocations.join(', ')}`
                              : copilotConfig.workLocationTypes.includes('onsite') && copilotConfig.onsiteLocations.length > 0
                              ? `On-site: ${copilotConfig.onsiteLocations.join(', ')}`
                              : 'Location not specified'
                            }
                          </span>
                        </div>

                        {/* Job Types */}
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Briefcase className="w-4 h-4" />
                          <span className="text-sm">
                            {copilotConfig.jobTypes && copilotConfig.jobTypes.length > 0 
                              ? copilotConfig.jobTypes.includes('fulltime') ? 'Auto-Apply Jobs' : 
                                copilotConfig.jobTypes.join(', ').replace(/fulltime/g, 'Full-time').replace(/parttime/g, 'Part-time').replace(/contractor/g, 'Contract').replace(/internship/g, 'Internship')
                              : 'Job types not specified'
                            }
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
                            <span className={`text-sm font-medium ${
                              copilotStatuses[copilotConfig.id || ''] ? 'text-green-600' : 'text-gray-400'
                            }`}>
                              {copilotStatuses[copilotConfig.id || ''] ? 'ON' : 'OFF'}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Switch
                                checked={copilotStatuses[copilotConfig.id || ''] || false}
                                onCheckedChange={(checked) => handleCopilotStatusToggle(copilotConfig.id || '', checked)}
                                className="data-[state=checked]:bg-purple-600"
                              />
                              <span className="text-xs text-gray-400">OFF</span>
                            </div>
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditConfiguration(copilotConfig.id)}
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
                </div>
              ))}

              {/* New Copilot Button */}
              {canCreateNewCopilot() && (
                <div className="flex justify-center pt-4">
                  <Button 
                    variant="outline"
                    onClick={handleSetupCopilot}
                    className="px-6 py-3 border-2 border-purple-300 text-purple-600 hover:bg-purple-50 font-medium"
                  >
                    + New Copilot ({allConfigs.length}/2)
                  </Button>
                </div>
              )}

              {!canCreateNewCopilot() && (
                <div className="flex justify-center pt-4">
                  <div className="text-sm text-gray-500">
                    Maximum 2 copilots reached. Edit existing ones above.
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Show setup card if no configurations
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
