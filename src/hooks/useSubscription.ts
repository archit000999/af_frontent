
import { useState, useEffect } from 'react';

interface SubscriptionStatus {
  isSubscribed: boolean;
  planType: 'premium' | 'elite' | null;
  maxCopilots: number;
  isLoading: boolean;
  subscriptionId: string | null;
  currentPeriodEnd: string | null;
}

export const useSubscription = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    isSubscribed: false,
    planType: null,
    maxCopilots: 1, // Allow 1 copilot for free users
    isLoading: false,
    subscriptionId: null,
    currentPeriodEnd: null
  });

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      console.log('🔍 Checking subscription status');
      
      // Check for any payment success data
      const paymentSuccess = localStorage.getItem('last_payment_success');
      const payments = paymentSuccess ? [JSON.parse(paymentSuccess)] : [];
      
      console.log('🗂️ ALL payments for user (local):', payments);
      
      // Simulate database query results
      const data = payments.length > 0 ? [{
        plan_type: 'premium',
        status: 'completed',
        stripe_subscription_id: 'sub_123',
        created_at: new Date().toISOString(),
        amount: 2999
      }] : [];
      const error = null;

      console.log('📊 Payment query result (local):', { data, error });

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
        console.log('✅ Latest payment found:', latestPayment);
        
        const planType = latestPayment.plan_type as 'premium' | 'elite';
        
        // Determine max copilots based on plan
        let maxCopilots = 1;
        if (planType === 'premium') {
          maxCopilots = 1;
        } else if (planType === 'elite') {
          maxCopilots = 2;
        }
        
        console.log('🚀 Subscription found:', {
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
          currentPeriodEnd: null
        });
      } else {
        console.log('❌ No completed/paid payments found, setting as free user');
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
