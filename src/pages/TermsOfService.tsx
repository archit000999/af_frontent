import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <Link to="/">
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Terms of Service</h1>
          <p className="text-slate-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Definitions</h2>
            <ul className="list-disc list-inside text-slate-700 space-y-2">
              <li><strong>"Saki", "we", "our", "us"</strong> refers to the Saki concierge job search service</li>
              <li><strong>"Service"</strong> means our AI-powered job search and outreach platform</li>
              <li><strong>"User", "you", "your"</strong> refers to any person using our Service</li>
              <li><strong>"Content"</strong> means any information, text, graphics, or other materials</li>
              <li><strong>"User Content"</strong> means resumes, profiles, and other materials you provide</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Acceptance of Terms</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              By accessing or using Saki, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Eligibility</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              You must be at least 18 years old and legally capable of entering into binding contracts to use our Service. By using Saki, you represent that you meet these eligibility requirements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Service Description</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Saki provides an AI-powered concierge service that:
            </p>
            <ul className="list-disc list-inside text-slate-700 mb-4 space-y-2">
              <li>Scans job boards and company pages for new opportunities</li>
              <li>Identifies hiring managers and decision-makers</li>
              <li>Sends personalized outreach emails on your behalf</li>
              <li>Tracks responses and manages interview scheduling</li>
              <li>Provides performance analytics and recommendations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. User Responsibilities</h2>
            <p className="text-slate-700 leading-relaxed mb-4">You agree to:</p>
            <ul className="list-disc list-inside text-slate-700 mb-4 space-y-2">
              <li>Provide accurate and truthful information in your profile and resume</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Use the Service in compliance with all applicable laws</li>
              <li>Not interfere with the proper functioning of the Service</li>
              <li>Respond professionally to interview requests and communications</li>
              <li>Notify us of any changes to your job search status or preferences</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Pricing and Payment</h2>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Monthly Service Fee</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              Our standard service fee is $299/month, which serves as a refundable security deposit. This fee is fully refundable if we do not generate any interviews for you within 30 days.
            </p>
            
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Success Fee</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              Upon successful job placement through our outreach efforts, you agree to pay a one-time success fee equal to 1% of your first year's total compensation (including salary, bonuses, and equity value).
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Refund Policy</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              We offer a money-back guarantee: if we do not secure any interviews for you within 30 days of service activation, you will receive a full refund of your monthly fee.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Intellectual Property</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              You retain ownership of your resume, professional information, and other content you provide. By using our Service, you grant us a limited license to use this content for the purpose of providing job search services.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              All AI-generated content, templates, and outreach strategies developed by Saki remain our intellectual property.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Privacy and Data Protection</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Your privacy is important to us. Our collection, use, and protection of your personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Service Limitations</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              While we strive to provide excellent results, we cannot guarantee:
            </p>
            <ul className="list-disc list-inside text-slate-700 mb-4 space-y-2">
              <li>Specific numbers of interviews or job offers</li>
              <li>Response rates from hiring managers</li>
              <li>Successful job placement within any specific timeframe</li>
              <li>Compatibility with all companies or industries</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Prohibited Uses</h2>
            <p className="text-slate-700 leading-relaxed mb-4">You may not use our Service to:</p>
            <ul className="list-disc list-inside text-slate-700 mb-4 space-y-2">
              <li>Provide false or misleading information</li>
              <li>Harass or spam hiring managers</li>
              <li>Reverse engineer our AI algorithms or technology</li>
              <li>Compete with our Service or solicit our clients</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Termination</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Either party may terminate this agreement at any time with 30 days' notice. We reserve the right to suspend or terminate accounts that violate these Terms. Upon termination, you remain responsible for any outstanding fees.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Limitation of Liability</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              To the maximum extent permitted by law, Saki's liability is limited to the amount paid by you in the 12 months preceding any claim. We are not liable for indirect, incidental, or consequential damages.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Changes to Terms</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We may modify these Terms at any time. Material changes will be communicated via email or through our Service. Continued use after changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">14. Governing Law</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              These Terms are governed by the laws of [Your Jurisdiction]. Any disputes will be resolved through binding arbitration in [Your City, State].
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">15. Contact Information</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              For questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-slate-700">
             Email: support@trysaki.com<br />
             Address: 149 New Montgomery St 4th Floor, San Francisco, CA 94105
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;