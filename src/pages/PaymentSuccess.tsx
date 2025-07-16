
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { useSubscription } from '@/hooks/useSubscription';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshSubscription } = useSubscription();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const session_id = searchParams.get('session_id');
    if (session_id) {
      setSessionId(session_id);
      handlePaymentSuccess(session_id);
    }
  }, [searchParams]);

  const handlePaymentSuccess = async (sessionId: string) => {
    try {
      console.log('Processing payment success for session:', sessionId);
      
      // Handle payment success (localStorage for demo)
      const paymentData = {
        sessionId,
        processedAt: new Date().toISOString(),
        status: 'success'
      };
      
      // Store payment success in localStorage for demo implementation
      localStorage.setItem('last_payment_success', JSON.stringify(paymentData));
      
      // Always successful for demo
      const data = { success: true };
      const error = null;

      if (error) {
        console.error('Error processing payment success:', error);
        toast({
          title: "Warning",
          description: "Payment was successful but there was an issue updating your account. Please contact support if needed.",
          variant: "destructive"
        });
      } else {
        console.log('Payment success processed:', data);
        
        // Refresh subscription status to update the UI
        console.log('Refreshing subscription status after successful payment...');
        await refreshSubscription();
        
        toast({
          title: "Payment Successful!",
          description: "Your subscription has been activated. Welcome to JobApplyFirst Premium!",
        });
      }
    } catch (error) {
      console.error('Error processing payment success:', error);
      toast({
        title: "Warning",
        description: "Payment was successful but there was an issue updating your account. Please contact support if needed.",
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
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </CardTitle>
            <p className="text-gray-600 text-lg">
              Thank you for subscribing to ApplyFirst Premium
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {isProcessing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-blue-700">Processing your payment and updating your subscription...</span>
                </div>
              </div>
            )}

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">What happens next?</h3>
              <ul className="space-y-2 text-green-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Your subscription is now active
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  All premium features are unlocked
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Your ApplyFirst will start working automatically
                </li>
              </ul>
            </div>

            {sessionId && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  <strong>Session ID:</strong> {sessionId}
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
                Setup Your First ApplyFirst
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
