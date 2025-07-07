import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Shield, DollarSign, ArrowRight, Sparkles } from "lucide-react";

const Pricing = () => {
  const [showCalendly, setShowCalendly] = useState(false);

  useEffect(() => {
    if (showCalendly) {
      if (!document.querySelector("#calendly-widget-script")) {
        const script = document.createElement("script");
        script.id = "calendly-widget-script";
        script.src = "https://assets.calendly.com/assets/external/widget.js";
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, [showCalendly]);

  const plans = [
    {
      name: "Student Plan",
      price: "$229",
      period: "/month",
      features: [
        "250 personalized emails",
        "3–4 screening calls/mo",
        '"No-hire" refund'
      ],
      popular: false
    },
    {
      name: "Exec Plan", 
      price: "$399",
      period: "/month",
      features: [
        "600 personalized emails",
        "6–7 screening calls/mo",
        "100% refund if no qualified responses"
      ],
      popular: true
    }
  ];
  return <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 border border-green-300 rounded-full text-green-800 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            Risk-free guarantee
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
            Simple,{" "}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Risk-Free
            </span>{" "}
            Pricing
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            We only succeed when you succeed. Our pricing model aligns our incentives with your career goals.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-lg text-slate-600 mb-4">
              <strong>Strategy 1 – Monthly Prepaid Bundle</strong>
            </p>
            <p className="text-slate-600">
              Ideal for customers who want flexibility but will commit at least one month up front.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <div key={index} className={`relative ${plan.popular ? 'lg:scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className={`bg-white rounded-3xl p-8 shadow-xl ${plan.popular ? 'border-2 border-blue-200 shadow-2xl' : 'border border-slate-200'} h-full`}>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{plan.name}</h3>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {plan.price}
                      </span>
                      <div className="text-left">
                        <div className="text-slate-600 text-lg">{plan.period}</div>
                        <div className="text-sm text-green-600 font-medium">Prepaid Cost (1 mo)</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className={`w-full py-4 text-lg font-semibold transition-all duration-300 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                    }`}
                    onClick={() => setShowCalendly(true)}
                  >
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social proof */}
        <div className="text-center mt-16">
          <p className="text-slate-600 mb-4">Trusted by professionals at</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-2xl font-bold text-slate-400">Google</div>
            <div className="text-2xl font-bold text-slate-400">Meta</div>
            <div className="text-2xl font-bold text-slate-400">Microsoft</div>
            <div className="text-2xl font-bold text-slate-400">Apple</div>
            <div className="text-2xl font-bold text-slate-400">Netflix</div>
          </div>
        </div>
        {showCalendly && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white rounded-xl shadow-2xl p-6 relative w-full max-w-2xl">
              <button
                onClick={() => setShowCalendly(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 text-2xl font-bold"
                aria-label="Close"
              >
                ×
              </button>
              {/* Calendly inline widget begin */}
              <div className="calendly-inline-widget" data-url="https://calendly.com/archit-trysaki/qualifying-call" style={{ minWidth: 320, height: 700 }}></div>
              {/* Calendly inline widget end */}
            </div>
          </div>
        )}
      </div>
    </section>;
};
export default Pricing;