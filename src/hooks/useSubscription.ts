
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionStatus {
  isSubscribed: boolean;
  planType: 'premium' | 'elite' | null;
  maxCopilots: number;
  isLoading: boolean;
}

export const useSubscription = () => {
  const { user } = useUser();
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    isSubscribed: false,
    planType: null,
    maxCopilots: 0,
    isLoading: true
  });

  useEffect(() => {
    if (user?.emailAddresses[0]?.emailAddress) {
      checkSubscriptionStatus();
    }
  }, [user]);

  const checkSubscriptionStatus = async () => {
    if (!user?.emailAddresses[0]?.emailAddress) return;

    try {
      const { data, error } = await supabase
        .from('payments')
        .select('plan_type, status')
        .eq('user_email', user.emailAddresses[0].emailAddress)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error checking subscription:', error);
        setSubscriptionStatus({
          isSubscribed: false,
          planType: null,
          maxCopilots: 0,
          isLoading: false
        });
        return;
      }

      if (data && data.length > 0) {
        const planType = data[0].plan_type as 'premium' | 'elite';
        const maxCopilots = planType === 'premium' ? 1 : planType === 'elite' ? 2 : 0;
        
        setSubscriptionStatus({
          isSubscribed: true,
          planType,
          maxCopilots,
          isLoading: false
        });
      } else {
        setSubscriptionStatus({
          isSubscribed: false,
          planType: null,
          maxCopilots: 0,
          isLoading: false
        });
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscriptionStatus({
        isSubscribed: false,
        planType: null,
        maxCopilots: 0,
        isLoading: false
      });
    }
  };

  return {
    ...subscriptionStatus,
    refreshSubscription: checkSubscriptionStatus
  };
};
