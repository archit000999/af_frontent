
import React from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import UpgradeDialog from './UpgradeDialog';

interface SubscriptionGateProps {
  children: React.ReactNode;
  feature: string;
  showUpgrade?: boolean;
  onUpgradeClick?: () => void;
}

const SubscriptionGate: React.FC<SubscriptionGateProps> = ({ 
  children, 
  feature, 
  showUpgrade = true,
  onUpgradeClick 
}) => {
  const { isSubscribed, isLoading } = useSubscription();
  const [showUpgradeDialog, setShowUpgradeDialog] = React.useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-600">Checking subscription...</span>
      </div>
    );
  }

  if (!isSubscribed) {
    return (
      <>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Premium Feature: {feature}
          </h3>
          <p className="text-gray-600 mb-4">
            Subscribe to ApplyFirst Concierge Service to access this feature and get AI-powered job applications.
          </p>
          {showUpgrade && (
            <button
              onClick={() => {
                if (onUpgradeClick) {
                  onUpgradeClick();
                } else {
                  setShowUpgradeDialog(true);
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Upgrade Now
            </button>
          )}
        </div>
        
        {showUpgrade && (
          <UpgradeDialog
            isOpen={showUpgradeDialog}
            onClose={() => setShowUpgradeDialog(false)}
            message={`You need to subscribe to access ${feature}`}
            buttonText="Subscribe Now"
          />
        )}
      </>
    );
  }

  return <>{children}</>;
};

export default SubscriptionGate;
