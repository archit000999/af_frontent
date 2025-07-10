import { Button } from "@/components/ui/button";
import { ArrowLeft, HelpCircle, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "How does the AI ApplyFirst find relevant jobs?",
      answer: "Our AI continuously monitors 50+ job boards including LinkedIn, Indeed, Glassdoor, and company career pages. It uses advanced natural language processing to understand job requirements and match them with your profile, skills, and preferences. The AI considers factors like job title, required skills, location, salary range, and company type to ensure high-quality matches."
    },
    {
      question: "How many jobs will my ApplyFirst apply to each day?",
      answer: "Your ApplyFirst applies to up to 20 relevant jobs per day. This number may vary based on the availability of suitable positions that match your criteria. We prioritize quality over quantity, ensuring each application is well-targeted and personalized rather than sending generic applications."
    },
    {
      question: "Can I control which jobs my ApplyFirst applies to?",
      answer: "Yes! You have full control over your job preferences through detailed filters including job titles, company types, salary ranges, location preferences, and more. You can also set exclusion criteria for companies or roles you want to avoid. Your ApplyFirst learns from your feedback to continuously improve its targeting."
    },
    {
      question: "How does the direct outreach to hiring managers work?",
      answer: "Our system researches LinkedIn to identify hiring managers and decision-makers for relevant positions. We then find their verified business email addresses through our professional database. Your ApplyFirst sends personalized emails that include your resume and a tailored message explaining why you're a great fit for the role."
    },
    {
      question: "What if I don't get the guaranteed interviews?",
      answer: "We guarantee 2-4 interviews per month for active users. If you don't receive at least 2 interviews in a month despite following our guidelines (keeping your profile updated, responding to our optimization suggestions), your next month is free. This guarantee applies after your first full month of service."
    },
    {
      question: "Is my personal information secure?",
      answer: "Absolutely. We use enterprise-grade security measures to protect your data. Your resume and personal information are encrypted and stored securely. We never share your information with third parties without your explicit consent. You can review and update your privacy settings at any time."
    },
    {
      question: "Can I pause or stop the service at any time?",
      answer: "Yes, you can pause or cancel your service at any time through your account settings. If you pause, we'll stop all applications immediately. When you're ready to resume, your preferences and settings will be preserved. There are no long-term contracts or cancellation fees."
    },
    {
      question: "How does the weekly onboarding limit work?",
      answer: "We onboard only 40 new candidates per week to ensure personalized attention and maintain the quality of our service. This selective approach allows us to provide dedicated support during your setup process and ensures our AI systems can effectively manage the application volume for all users."
    },
    {
      question: "What types of roles do you focus on?",
      answer: "We specialize in professional roles typically paying $100K+ annually, including software engineering, product management, marketing, sales, finance, consulting, and other knowledge-worker positions. While we can work with various experience levels, our algorithms are optimized for mid-to-senior level professional roles."
    },
    {
      question: "How quickly will I see results?",
      answer: "Most users start seeing interview requests within 2-3 weeks of starting the service. The timeline depends on factors like your industry, experience level, and market conditions. We continuously optimize your applications based on response rates to improve results over time."
    },
    {
      question: "Can I use my own email for applications?",
      answer: "Yes! We integrate with your Gmail account to send applications from your professional email address. This ensures that responses come directly to you and maintains your professional brand. You maintain full control and can review all outgoing communications."
    },
    {
      question: "What if I want to apply to a specific company?",
      answer: "You can add specific companies to your target list, and your ApplyFirst will prioritize opportunities from those organizations. You can also provide a list of companies to avoid. For dream companies, we recommend combining our automated approach with manual networking for the best results."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link to="/home" className="flex items-center space-x-2 text-purple-600 hover:text-purple-700">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AF</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">ApplyFirst</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <HelpCircle className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900">Frequently Asked Questions</h1>
          </div>
          <p className="text-xl text-gray-600">
            Get answers to common questions about our AI ApplyFirst service.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <AccordionTrigger className="px-6 py-4 text-left font-semibold text-gray-900 hover:text-purple-600">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => window.open('mailto:support@applyfirst.com')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Email Support
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.open('https://calendly.com/applyfirst/support-call', '_blank')}
              className="border-purple-600 text-purple-600 hover:bg-purple-50"
            >
              Schedule a Call
            </Button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            to="/how-copilot-works" 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900 mb-2">How ApplyFirst Works</h3>
            <p className="text-sm text-gray-600">Learn how our AI finds and applies to jobs</p>
          </Link>
          <Link 
            to="/how-to-train-copilot" 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900 mb-2">Training Your ApplyFirst</h3>
            <p className="text-sm text-gray-600">Optimize your ApplyFirst for better results</p>
          </Link>
          <Link 
            to="/how-to-apply-external" 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900 mb-2">External Applications</h3>
            <p className="text-sm text-gray-600">Apply to jobs outside our platform</p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default FAQ;