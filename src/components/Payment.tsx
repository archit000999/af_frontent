import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ArrowLeft, Sparkles, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@clerk/clerk-react';
const Payment = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    user
  } = useUser();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const plans = [{
    id: 'premium',
    name: 'Premium',
    price: '$5.60',
    period: '/week',
    originalPrice: '₹469',
    description: 'Perfect for job seekers who want automated applications',
    features: ['Automated job applications', 'Resume optimization', 'Interview scheduling', 'Weekly progress reports', 'Email support'],
    buttonText: 'Upgrade to Premium',
    popular: false,
    color: 'from-blue-500 to-blue-600'
  }, {
    id: 'elite',
    name: 'Elite',
    price: '$8.00',
    period: '/week',
    originalPrice: '₹669',
    description: 'Advanced features for serious job hunters',
    features: ['Everything in Premium', 'Priority job matching', 'Personalized cover letters', 'LinkedIn optimization', 'Phone interview prep', 'Priority support'],
    buttonText: 'Upgrade to Elite',
    popular: true,
    color: 'from-purple-500 to-purple-600'
  }];
  const handleUpgrade = async (planType: string) => {
    console.log("Plan type selected:", planType);
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to continue with payment",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    setIsLoading(planType);
    try {
      console.log("Creating checkout session for user:", user.emailAddresses[0]?.emailAddress);
      const {
        data,
        error
      } = await supabase.functions.invoke('create-checkout', {
        body: {
          planType,
          userEmail: user.emailAddresses[0]?.emailAddress
        }
      });
      console.log("=== CREATE CHECKOUT RESPONSE ===");
      console.log("Error:", error);
      console.log("Data:", data);
      console.log("Data type:", typeof data);
      console.log("Data URL:", data?.url);
      console.log("===================================");
      if (error) {
        console.error('Checkout error:', error);
        throw new Error(error.message || 'Failed to create checkout session');
      }
      if (!data?.url) {
        console.error('No checkout URL received. Full data:', JSON.stringify(data, null, 2));
        throw new Error('No checkout URL received');
      }
      console.log("Checkout session created, redirecting to:", data.url);

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to process payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(null);
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-full">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock the full potential of JobCopilot with our premium features
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {plans.map(plan => <Card key={plan.id} className={`relative h-full transition-all duration-300 hover:shadow-2xl ${plan.popular ? 'border-2 border-purple-500 shadow-xl scale-105' : 'border border-gray-200 shadow-lg hover:border-blue-300'}`}>
              {plan.popular && <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>}

              <CardHeader className="text-center pb-6 pt-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${plan.color} mb-4 mx-auto`}>
                  <span className="text-white font-bold text-xl">{plan.name[0]}</span>
                </div>
                
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </CardTitle>
                
                <p className="text-gray-600 text-sm mb-6 min-h-[40px]">
                  {plan.description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 ml-1 text-lg">
                      {plan.period}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    (converted from {plan.originalPrice})
                  </p>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col h-full pt-0">
                <div className="flex-1">
                  <Button onClick={() => handleUpgrade(plan.id)} disabled={isLoading === plan.id} className={`w-full mb-8 py-4 text-base font-semibold transition-all duration-300 ${plan.popular ? `bg-gradient-to-r ${plan.color} hover:shadow-lg hover:scale-105 text-white` : `border-2 border-blue-500 text-blue-600 bg-white hover:bg-blue-50 hover:border-blue-600`}`} variant={plan.popular ? 'default' : 'outline'}>
                    {isLoading === plan.id ? <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </div> : plan.buttonText}
                  </Button>

                  {/* Features */}
                  <div className="space-y-4">
                    {plan.features.map((feature, featureIndex) => <div key={featureIndex} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-gray-700 text-sm leading-relaxed">
                          {feature}
                        </span>
                      </div>)}
                  </div>
                </div>
              </CardContent>
            </Card>)}
        </div>

        {/* Trust Indicators */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Check className="w-4 h-4 text-green-600" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-1">
              <Check className="w-4 h-4 text-green-600" />
              <span>Secure payment</span>
            </div>
            <div className="flex items-center gap-1">
              <Check className="w-4 h-4 text-green-600" />
              <span>24/7 support</span>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center mt-12">
          <Button variant="outline" onClick={() => navigate('/copilot-preview')} className="px-8 py-3 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Preview
          </Button>
        </div>
      </div>
    </div>;
};
export default Payment;