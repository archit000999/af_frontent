import { Button } from '@/components/ui/button';
import { ChevronDown, Settings, MapPin, Clock, Briefcase, Edit, Crown } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useNavigate, Link } from 'react-router-dom';
import { useCopilotConfig } from '@/hooks/useCopilotConfig';
import { useSubscription } from '@/hooks/useSubscription';
import { useEffect, useState } from 'react';
import UpgradeDialog from '@/components/UpgradeDialog';
import { useSupabaseAuth } from '@/components/SupabaseAuthProvider';
import AuthButton from '@/components/AuthButton';
const Home = () => {
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();
  const {
    isSubscribed,
    planType,
    maxCopilots,
    isLoading: subscriptionLoading,
    refreshSubscription
  } = useSubscription();
  const {
    config,
    allConfigs,
    createNewCopilot,
    canCreateNewCopilot,
    switchToConfig,
    isInitialized,
    isLoading
  } = useCopilotConfig(isSubscribed ? maxCopilots : 1);
  const [copilotStatuses, setCopilotStatuses] = useState<{
    [key: string]: boolean;
  }>({});
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);
  const [upgradeDialogType, setUpgradeDialogType] = useState<'subscription' | 'elite'>('subscription');

  // Refresh subscription status when component mounts or when returning from payment
  useEffect(() => {
    if (user) {
      refreshSubscription();
    }
  }, [user, refreshSubscription]);
  const handleSetupCopilot = () => {
    // Check if user is trying to create a second copilot without Elite plan
    if (allConfigs.length >= 1 && planType !== 'elite') {
      setUpgradeDialogType('elite');
      setIsUpgradeDialogOpen(true);
      return;
    }
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
    // If user is not subscribed, show upgrade dialog
    if (!isSubscribed) {
      setUpgradeDialogType('subscription');
      setIsUpgradeDialogOpen(true);
      return;
    }
    setCopilotStatuses(prev => ({
      ...prev,
      [configId]: status
    }));
  };

  // Check if user has any saved configurations
  const hasConfigurations = allConfigs.length > 0;
  const getPlanDisplayName = () => {
    switch (planType) {
      case 'premium':
        return 'Premium';
      case 'elite':
        return 'Elite';
      default:
        return 'Free';
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">ApplyFirst</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-2 text-purple-600 font-medium text-base">
              <button>ApplyFirst</button>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 cursor-pointer text-base" onClick={() => navigate('/applications')}>
              <div className="w-6 h-6 flex items-center justify-center">
              </div>
              <button>Applications</button>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 cursor-pointer text-base" onClick={() => navigate('/support')}>
              <div className="w-6 h-6 flex items-center justify-center">
              </div>
              <button>Support</button>
            </div>
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {isSubscribed && <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 px-3 py-1 rounded-full">
                <Crown className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">{getPlanDisplayName()}</span>
              </div>}
            
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="max-w-6xl">
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">ApplyFirst</h1>
            
            {/* Debug info for subscription status */}
            {/* {process.env.NODE_ENV === 'development' && (
              <div className="mb-4 p-4 bg-gray-100 rounded-lg text-sm">
                <strong>Debug Info:</strong> Subscribed: {isSubscribed ? 'Yes' : 'No'}, 
                Plan: {planType || 'Free'}, 
                Max Copilots: {maxCopilots},
                Loading: {subscriptionLoading ? 'Yes' : 'No'}
              </div>
             )} */}
            
            {/* Copilot Configuration Section */}
            {isLoading || subscriptionLoading ? <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="text-center text-gray-500">Loading configurations...</div>
              </div> : hasConfigurations ?
          // Show existing copilot configurations
          <div className="space-y-6">
                {allConfigs.map((copilotConfig, index) => <div key={copilotConfig.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {copilotConfig.jobTitles?.[0]?.charAt(0) || 'C'}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {copilotConfig.jobTitles?.[0] || 'Software Developer'}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>
                                {copilotConfig.workLocationTypes.includes('remote') && copilotConfig.remoteLocations.includes('Worldwide') ? 'Anywhere in World' : copilotConfig.workLocationTypes.includes('remote') && copilotConfig.remoteLocations.length > 0 ? `${copilotConfig.remoteLocations.join(', ')}` : copilotConfig.workLocationTypes.includes('onsite') && copilotConfig.onsiteLocations.length > 0 ? `${copilotConfig.onsiteLocations.join(', ')}` : 'Anywhere in India'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Briefcase className="w-4 h-4" />
                              <span>
                                {copilotConfig.jobTypes.includes('fulltime') ? 'Auto-Apply Jobs' : 'Manual Apply'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>Time Zone</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleEditConfiguration(copilotConfig.id)} className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                        <Edit className="w-4 h-4" />
                        <span>Edit Configuration</span>
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-700">ApplyFirst Status:</span>
                        <span className={`text-sm font-medium ${copilotStatuses[copilotConfig.id || ''] ? 'text-green-600' : 'text-gray-500'}`}>
                          {copilotStatuses[copilotConfig.id || ''] ? 'ON' : 'OFF'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500">OFF</span>
                        <Switch checked={copilotStatuses[copilotConfig.id || ''] || false} onCheckedChange={checked => handleCopilotStatusToggle(copilotConfig.id || '', checked)} className="data-[state=checked]:bg-purple-600" />
                      </div>
                    </div>
                  </div>)}

                {/* New Copilot Button */}
                <div className="flex justify-center pt-6">
                  <Button variant="outline" onClick={handleSetupCopilot} className="px-8 py-4 border-2 border-purple-300 text-purple-600 hover:bg-purple-50 font-medium rounded-lg">
                    + New Form
                  </Button>
                </div>
              </div> :
          // Show setup prompt if no configurations
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-2xl">+</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Create Your First ApplyFirst</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Set up your job search preferences and let ApplyFirst help you find the perfect opportunities.
                </p>
                <Button onClick={handleSetupCopilot} className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 text-lg font-semibold rounded-lg">
                  Setup ApplyFirst
                </Button>
              </div>}
          </div>

          {/* Guides Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link to="/how-copilot-works" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="font-semibold text-gray-900 mb-2">How ApplyFirst works</h3>
                <p className="text-sm text-gray-600">Learn the basics of how your AI ApplyFirst finds and applies to jobs</p>
              </Link>
              <Link to="/how-to-train-copilot" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="font-semibold text-gray-900 mb-2">How to train your ApplyFirst</h3>
                <p className="text-sm text-gray-600">Optimize your ApplyFirst's performance with better training</p>
              </Link>
              <Link to="/how-to-apply-external" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="font-semibold text-gray-900 mb-2">How to apply to external jobs</h3>
                <p className="text-sm text-gray-600">Apply to jobs outside of our platform with your ApplyFirst</p>
              </Link>
              <Link to="/faq" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="font-semibold text-gray-900 mb-2">FAQ</h3>
                <p className="text-sm text-gray-600">Find answers to commonly asked questions</p>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Upgrade Dialog */}
      <UpgradeDialog isOpen={isUpgradeDialogOpen} onClose={() => setIsUpgradeDialogOpen(false)} message={upgradeDialogType === 'elite' ? "You need an Elite plan to create multiple ApplyFirst." : "You need a premium plan to activate ApplyFirst"} buttonText={upgradeDialogType === 'elite' ? "Upgrade to Elite" : "Upgrade"} />
    </div>;
};
export default Home;