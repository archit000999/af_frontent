
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Home, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSubscription } from '@/hooks/useSubscription';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshSubscription } = useSubscription();
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'processing' | 'success' | 'error'>('processing');

  useEffect(() => {
    const payment_id = searchParams.get('payment_id');
    const session_id = searchParams.get('session_id');
    
    if (payment_id) {
      setPaymentId(payment_id);
      handlePaymentVerification(payment_id);
    } else if (session_id) {
      setSessionId(session_id);
      handleStripeSessionVerification(session_id);
    } else {
      // No tracking parameters, but user reached success page
      handleGenericSuccess();
    }
  }, [searchParams]);

  const handlePaymentVerification = async (paymentId: string) => {
    try {
      console.log('Verifying payment with ID:', paymentId);
      
      // Update the payment status to completed
      const { data: paymentData, error } = await supabase
        .from('payments')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentId)
        .select()
        .single();

      if (error) {
        console.error('Error updating payment:', error);
        throw error;
      }

      console.log('Payment verified and updated:', paymentData);
      
      // Refresh subscription status
      await refreshSubscription();
      
      setVerificationStatus('success');
      toast({
        title: "Payment Successful!",
        description: "Your subscription has been activated. Welcome to ApplyFirst Concierge!",
      });
      
    } catch (error) {
      console.error('Error verifying payment:', error);
      setVerificationStatus('error');
      toast({
        title: "Verification Issue",
        description: "Payment was successful but verification failed. Please contact support if needed.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStripeSessionVerification = async (sessionId: string) => {
    try {
      console.log('Processing Stripe session:', sessionId);
      
      // Call the existing handle-payment-success function
      const { data, error } = await supabase.functions.invoke('handle-payment-success', {
        body: { sessionId }
      });

      if (error) {
        console.error('Error processing payment success:', error);
        throw error;
      }

      console.log('Stripe session processed:', data);
      await refreshSubscription();
      
      setVerificationStatus('success');
      toast({
        title: "Payment Successful!",
        description: "Your subscription has been activated. Welcome to ApplyFirst Concierge!",
      });
      
    } catch (error) {
      console.error('Error processing Stripe session:', error);
      setVerificationStatus('error');
      toast({
        title: "Verification Issue",
        description: "Payment was successful but verification failed. Please contact support if needed.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenericSuccess = () => {
    console.log('Generic success page - no specific tracking');
    setVerificationStatus('success');
    setIsProcessing(false);
    toast({
      title: "Payment Successful!",
      description: "Welcome to ApplyFirst Concierge! Your subscription is now active.",
    });
  };

  const handleManualVerification = async () => {
    setIsProcessing(true);
    try {
      // Refresh subscription status
      await refreshSubscription();
      
      toast({
        title: "Status Refreshed",
        description: "Your subscription status has been updated.",
      });
    } catch (error) {
      console.error('Error refreshing subscription:', error);
      toast({
        title: "Error",
        description: "Failed to refresh subscription status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl border-green-200">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-6">
              <div className={`p-4 rounded-full ${verificationStatus === 'success' ? 'bg-green-100' : verificationStatus === 'error' ? 'bg-yellow-100' : 'bg-blue-100'}`}>
                {verificationStatus === 'success' ? (
                  <CheckCircle className="w-16 h-16 text-green-600" />
                ) : verificationStatus === 'error' ? (
                  <AlertTriangle className="w-16 h-16 text-yellow-600" />
                ) : (
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              {verificationStatus === 'success' ? 'Payment Successful!' : verificationStatus === 'error' ? 'Payment Received' : 'Processing Payment...'}
            </CardTitle>
            <p className="text-gray-600 text-lg">
              {verificationStatus === 'success' 
                ? 'Thank you for subscribing to ApplyFirst Concierge Service'
                : verificationStatus === 'error'
                ? 'Your payment was processed, but verification needs attention'
                : 'Please wait while we verify your payment...'
              }
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {isProcessing && verificationStatus === 'processing' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-blue-700">Verifying your payment and updating your subscription...</span>
                </div>
              </div>
            )}

            {verificationStatus === 'error' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Payment Verification Needed</h3>
                <p className="text-yellow-700 mb-3">
                  Your payment was processed successfully, but we need to verify your subscription status.
                </p>
                <Button 
                  onClick={handleManualVerification}
                  disabled={isProcessing}
                  variant="outline"
                  className="border-yellow-300 text-yellow-800 hover:bg-yellow-100"
                >
                  {isProcessing ? 'Verifying...' : 'Verify My Subscription'}
                </Button>
              </div>
            )}

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">What happens next?</h3>
              <ul className="space-y-2 text-green-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Your concierge service is now active
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  AI will start scanning 50+ job boards daily
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Human agents will apply to 20 matching jobs for you
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Setup will be completed within 24 hours
                </li>
              </ul>
            </div>

            {(paymentId || sessionId) && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  <strong>Reference ID:</strong> {paymentId || sessionId}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Keep this for your records
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={() => navigate('/home')}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
              <Button
                onClick={() => navigate('/copilot-setup')}
                variant="outline"
                className="flex-1"
              >
                Setup Your Copilot
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
