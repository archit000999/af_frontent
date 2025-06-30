
import { Button } from "@/components/ui/button";
import { CheckCircle, Shield, DollarSign } from "lucide-react";

const Pricing = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Simple, Risk-Free Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're so confident in our results, we put our money where our mouth is.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 border-2 border-blue-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Saki Concierge Service</h3>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-4xl font-bold text-blue-600">$299</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-gray-600">Refundable security deposit</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span>600+ targeted hiring manager contacts monthly</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span>Automated job scanning and instant outreach</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span>Personalized resume and cover letter optimization</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span>Weekly progress reports and analytics</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span>Priority support and strategy consultation</span>
              </div>
            </div>

            <div className="border-t border-blue-200 pt-6 mb-8">
              <div className="flex items-start gap-3 mb-4">
                <Shield className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Money-Back Guarantee</h4>
                  <p className="text-gray-600 text-sm">If we don't land you interviews, get your $299 back. No questions asked.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <DollarSign className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Success Fee</h4>
                  <p className="text-gray-600 text-sm">Only pay 1% of your first month's compensation if you get hired through our efforts.</p>
                </div>
              </div>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg">
              See If You Qualify
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
