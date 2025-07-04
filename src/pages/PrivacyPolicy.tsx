import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
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
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-slate-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Who We Are</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              ApplyFirst is an AI-powered concierge job search service that helps professionals connect with hiring managers before job postings hit public platforms like LinkedIn. This Privacy Policy explains how we collect, use, and protect your personal information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Personal Information</h3>
            <ul className="list-disc list-inside text-slate-700 mb-4 space-y-2">
              <li>Contact information (name, email address, phone number)</li>
              <li>Professional information (resume, work experience, skills, career preferences)</li>
              <li>Job search preferences and target companies</li>
              <li>Communication history and responses from outreach efforts</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">AI Processing Data</h3>
            <ul className="list-disc list-inside text-slate-700 mb-4 space-y-2">
              <li>Resume content and formatting for personalized outreach</li>
              <li>Job descriptions and company information for matching</li>
              <li>Email templates and messaging optimization data</li>
              <li>Interview feedback and success metrics</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-slate-700 mb-4 space-y-2">
              <li>Identify and reach out to hiring managers on your behalf</li>
              <li>Personalize outreach messages and applications</li>
              <li>Monitor job boards and company pages for new opportunities</li>
              <li>Track and report on campaign performance and interview success</li>
              <li>Improve our AI algorithms and service effectiveness</li>
              <li>Provide customer support and account management</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. AI and Automated Decision Making</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We use artificial intelligence to analyze job opportunities, craft personalized outreach messages, and identify optimal timing for contact. Our AI processes your resume and preferences to match you with relevant positions and hiring managers. You have the right to request human review of any automated decisions that significantly affect you.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Information Sharing and Disclosure</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We share your information only as necessary to provide our service:
            </p>
            <ul className="list-disc list-inside text-slate-700 mb-4 space-y-2">
              <li>With hiring managers and recruiters as part of our outreach service</li>
              <li>With trusted service providers who assist in our operations (email delivery, data analysis)</li>
              <li>When required by law or to protect our rights and safety</li>
              <li>With your explicit consent for additional purposes</li>
            </ul>
            <p className="text-slate-700 leading-relaxed">
              We never sell your personal information to third parties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Data Security</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your personal information, including encryption, secure data transmission, and access controls. However, no internet transmission is completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Your Rights</h2>
            <p className="text-slate-700 leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-slate-700 mb-4 space-y-2">
              <li>Access and review your personal information</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt out of certain communications</li>
              <li>Request data portability</li>
              <li>Withdraw consent for processing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Data Retention</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. After termination of service, we may retain certain information for legal compliance and business records purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Children's Privacy</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Our service is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children under 18.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Changes to This Policy</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by email or through our service. Your continued use of our service after such changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Contact Us</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
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

export default PrivacyPolicy;