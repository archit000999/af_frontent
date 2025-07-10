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
  const [isLoading, setIsLoading] = useState(false);
  const plan = {
    id: 'concierge',
    name: 'ApplyFirst Concierge Service',
    price: '$99',
    period: '/week',
    description: 'AI scans 50+ job boards, human agents apply to 20 matching jobs daily',
    features: ['AI scans 50+ job boards in real time, and our human agents apply to 20 matching jobs on your behalf every day', 'We find the right hiring managers using LinkedIn research and verified emails from trusted data providers', '20 personalized emails sent daily from your Gmail — complete with your resume, tailored messaging, and your name', 'Save 20+ hours every week — spend less time applying, and more time preparing for interviews', '2–4 interviews guaranteed per month — or your next month is free', 'We onboard only 40 candidates per week, focused on roles paying $100K+'],
    buttonText: 'Get Started',
    popular: true,
    color: 'from-blue-600 to-indigo-600'
  };
  const handleUpgrade = async () => {
    // Open the Stripe payment link in a new tab
    window.open('https://buy.stripe.com/4gMaEX8Cxg8afIN59C8ww00', '_blank');
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
        </h1>
          
        </div>

        {/* Pricing Card */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-3xl blur-xl"></div>
            
            <Card className="relative border-2 border-blue-100 shadow-2xl">
              {/* Early Bird Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                  Early Bird Pricing until July 30th
                </div>
              </div>

              <CardHeader className="text-center pb-6 pt-12">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${plan.color} mb-4 mx-auto`}>
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                
                <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
                  {plan.name}
                </CardTitle>
                
                {/* Promotional Banner */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-4 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-xl font-bold text-green-600">First Week Fee Waived Off</span>
                  </div>
                  <p className="text-gray-700 font-medium mb-2">If you participate in our upcoming webinar "Effective Strategies to find job in the era of AI"</p>
                  <button onClick={() => window.open('https://calendly.com/vaasu_bhartia/job-search-ai-webinar', '_blank')} className="text-blue-600 hover:text-blue-800 font-medium underline transition-colors">
                    Click here to see the schedule of webinar
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {plan.price}
                  </span>
                  <div className="text-left">
                    <div className="text-gray-600 text-lg">{plan.period}</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="px-12 pb-12">
                <Button onClick={handleUpgrade} disabled={isLoading} className="w-full mb-8 py-6 text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  {isLoading ? <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div> : <>
                      {plan.buttonText}
                      <ArrowLeft className="ml-2 w-5 h-5 rotate-180" />
                    </>}
                </Button>

                {/* Features */}
                <div className="space-y-4">
                  {plan.features.map((feature, featureIndex) => <div key={featureIndex} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700 text-lg leading-relaxed">
                        {feature}
                      </span>
                    </div>)}
                </div>
                
                <p className="text-center text-sm text-gray-500 mt-8">
                  Free consultation • No commitment • Setup in 24 hours
                </p>
              </CardContent>
            </Card>
          </div>
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