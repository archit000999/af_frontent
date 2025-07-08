
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, TrendingUp, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Starter Plan',
      description: 'Great for Founders and Small Teams starting outreach',
      price: '$99',
      period: '/week',
      credits: '5,000 credits',
      features: [
        'Access to 500M+ Leads',
        'Email & Phone Enrichments',
        'Custom Enrichments',
        'Hyper Personalisation'
      ],
      unavailable: ['Completely Automated'],
      buttonText: 'Get Started',
      popular: false
    },
    {
      name: 'Alpha Plan',
      description: 'Best Plan for full fledged Outbound Automation',
      price: '$179',
      period: '/month',
      credits: '60,000 credits',
      features: [
        'Access to 500M+ Leads',
        'Email & Phone Enrichments',
        'Custom Enrichments',
        'Hyper Personalisation'
      ],
      unavailable: ['Completely Automated'],
      buttonText: 'Get Started',
      popular: true
    },
    {
      name: 'Autopilot',
      description: 'An omnipresent SDR for 5% of the cost',
      price: '$Custom',
      period: '/3 months',
      credits: 'Unlimited credits',
      features: [
        'Everything in Alpha Plan',
        'Complete Email and LinkedIn workflow automation',
        'Mailbox health and placement monitoring'
      ],
      unavailable: [],
      buttonText: 'Request for Pricing',
      popular: false,
      badge: 'Equals to 1 X BDR'
    }
  ];

  const handlePlanSelect = (planName: string) => {
    console.log(`Selected plan: ${planName}`);
    // Here you would typically integrate with a payment processor
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan to accelerate your job search with AI-powered automation
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={plan.name}
              className={`relative h-full ${
                plan.popular
                  ? 'border-2 border-purple-500 shadow-2xl scale-105'
                  : 'border border-gray-200 shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}
              
              {plan.badge && (
                <div className="absolute -top-4 right-4">
                  <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium border border-purple-300">
                    {plan.badge}
                  </div>
                </div>
              )}

              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </CardTitle>
                <p className="text-gray-600 text-sm mb-6 min-h-[40px]">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-1">
                    {plan.period}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col h-full">
                <div className="flex-1">
                  <Button
                    onClick={() => handlePlanSelect(plan.name)}
                    className={`w-full mb-8 py-3 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                        : 'border border-blue-500 text-blue-600 bg-white hover:bg-blue-50'
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.buttonText}
                  </Button>

                  {/* Credits */}
                  <div className="flex items-center mb-6 p-3 bg-gray-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="font-medium text-gray-900">{plan.credits}</span>
                    <Info className="w-4 h-4 text-gray-400 ml-2" />
                  </div>

                  {/* Features */}
                  <div className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-3">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-gray-700 text-sm leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                    
                    {plan.unavailable.map((feature, featureIndex) => (
                      <div key={`unavailable-${featureIndex}`} className="flex items-start">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5 mr-3">
                          <X className="w-3 h-3 text-red-600" />
                        </div>
                        <span className="text-gray-500 text-sm leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Back Button */}
        <div className="flex justify-center mt-12">
          <Button
            variant="outline"
            onClick={() => navigate('/copilot-preview')}
            className="px-8 py-3"
          >
            Back to Preview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
