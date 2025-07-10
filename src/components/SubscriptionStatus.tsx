
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Crown, RefreshCw } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useNavigate } from 'react-router-dom';

const SubscriptionStatus: React.FC = () => {
  const { isSubscribed, planType, maxCopilots, isLoading, refreshSubscription } = useSubscription();
  const navigate = useNavigate();

  const handleRefresh = async () => {
    await refreshSubscription();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-gray-600">Loading subscription status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${isSubscribed ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {isSubscribed ? (
              <>
                <Crown className="w-5 h-5 text-yellow-600" />
                Subscription Status
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 text-gray-400" />
                Subscription Status
              </>
            )}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="flex items-center gap-1"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Plan:</span>
            <Badge variant={isSubscribed ? "default" : "secondary"}>
              {isSubscribed ? `${planType?.toUpperCase()} Plan` : 'Free Plan'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Max Copilots:</span>
            <span className="font-medium">{maxCopilots}</span>
          </div>

          {isSubscribed ? (
            <div className="bg-white border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-700 mb-2">
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">Active Subscription</span>
              </div>
              <ul className="text-sm text-green-600 space-y-1">
                <li>• AI scans 50+ job boards daily</li>
                <li>• Human agents apply to 20+ jobs</li>
                <li>• Personalized email outreach</li>
                <li>• Interview guarantee program</li>
              </ul>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-700 text-sm mb-3">
                Upgrade to unlock premium features and get AI-powered job applications.
              </p>
              <Button
                onClick={() => navigate('/payment')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Upgrade to Concierge Service
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;
