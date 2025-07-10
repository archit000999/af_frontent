
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionStatus {
  isSubscribed: boolean;
  planType: 'concierge' | null;
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
      console.log('🔍 Checking subscription for email:', user.emailAddresses[0].emailAddress);
      
      // Check for completed payments for this user
      const { data, error } = await supabase
        .from('payments')
        .select('plan_type, status, stripe_subscription_id, created_at, amount, id')
        .eq('user_email', user.emailAddresses[0].emailAddress)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1);

      console.log('📊 Payment query result:', { data, error });

      if (error) {
        console.error('❌ Error checking subscription:', error);
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
        console.log('✅ Latest completed payment found:', latestPayment);
        
        const planType = latestPayment.plan_type as 'concierge';
        
        // Determine max copilots based on plan
        let maxCopilots = 1;
        if (planType === 'concierge') {
          maxCopilots = 5; // Concierge service gets more copilots
        }
        
        console.log('🚀 Active subscription found:', {
          planType,
          maxCopilots,
          subscriptionId: latestPayment.stripe_subscription_id,
          amount: latestPayment.amount,
          status: latestPayment.status
        });
        
        setSubscriptionStatus({
          isSubscribed: true,
          planType,
          maxCopilots,
          isLoading: false,
          subscriptionId: latestPayment.stripe_subscription_id,
          currentPeriodEnd: null // We could calculate this based on plan duration if needed
        });
      } else {
        console.log('❌ No completed payments found, setting as free user');
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
      console.error('❌ Error checking subscription:', error);
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
    console.log('🔄 Refreshing subscription status...');
    await checkSubscriptionStatus();
  };

  return {
    ...subscriptionStatus,
    refreshSubscription
  };
};
