
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionStatus {
  isSubscribed: boolean;
  planType: 'premium' | 'elite' | null;
  maxCopilots: number;
  isLoading: boolean;
  subscriptionId: string | null;
  currentPeriodEnd: string | null;
}

export const useSubscription = () => {
  const { user } = useUser();
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    isSubscribed: false,
    planType: null,
    maxCopilots: 1, // Allow 1 copilot for free users
    isLoading: true,
    subscriptionId: null,
    currentPeriodEnd: null
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
        .select('plan_type, status, stripe_subscription_id, created_at')
        .eq('user_email', user.emailAddresses[0].emailAddress)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error checking subscription:', error);
        setSubscriptionStatus({
          isSubscribed: false,
          planType: null,
          maxCopilots: 1,
          isLoading: false,
          subscriptionId: null,
          currentPeriodEnd: null
        });
        return;
      }

      if (data && data.length > 0) {
        const latestPayment = data[0];
        const planType = latestPayment.plan_type as 'premium' | 'elite';
        
        // Determine max copilots based on plan
        let maxCopilots = 1;
        if (planType === 'premium') {
          maxCopilots = 1;
        } else if (planType === 'elite') {
          maxCopilots = 2;
        }
        
        console.log('Subscription found:', {
          planType,
          maxCopilots,
          subscriptionId: latestPayment.stripe_subscription_id
        });
        
        setSubscriptionStatus({
          isSubscribed: true,
          planType,
          maxCopilots,
          isLoading: false,
          subscriptionId: latestPayment.stripe_subscription_id,
          currentPeriodEnd: null // We could fetch this from Stripe if needed
        });
      } else {
        console.log('No completed payments found, setting as free user');
        setSubscriptionStatus({
          isSubscribed: false,
          planType: null,
          maxCopilots: 1, // Allow 1 copilot for free users
          isLoading: false,
          subscriptionId: null,
          currentPeriodEnd: null
        });
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscriptionStatus({
        isSubscribed: false,
        planType: null,
        maxCopilots: 1, // Allow 1 copilot for free users
        isLoading: false,
        subscriptionId: null,
        currentPeriodEnd: null
      });
    }
  };

  const refreshSubscription = async () => {
    console.log('Refreshing subscription status...');
    await checkSubscriptionStatus();
  };

  return {
    ...subscriptionStatus,
    refreshSubscription
  };
};
