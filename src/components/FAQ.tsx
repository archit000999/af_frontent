
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "How do you protect my privacy during outreach?",
      answer: "We use professional email accounts and never share your personal information without explicit permission. All outreach is done with your consent and you can review messaging templates before we send them. We maintain strict data security protocols and never spam or mass-blast."
    },
    {
      question: "How quickly will I see results?",
      answer: "Most users start receiving responses from hiring managers within the first 72 hours. On average, our users land their first interview within 2-3 weeks of starting the service. We've had clients get interview requests within 24 hours of launch."
    },
    {
      question: "What if I don't get any interviews?",
      answer: "If we don't generate any interviews for you within the first 30 days, we'll refund your entire $299 deposit immediately. We're confident in our system and stand behind our results with this iron-clad guarantee."
    },
    {
      question: "Do you work with all industries and experience levels?",
      answer: "We specialize in mid to senior-level professionals earning $100K+ across tech, finance, marketing, sales, consulting, and healthcare. We focus on roles where our direct outreach approach is most effective and where hiring managers have decision-making authority."
    },
    {
      question: "How is this different from other job search services?",
      answer: "Unlike traditional recruiters or job boards, we proactively reach hiring managers before jobs are widely posted. This puts you in the first wave of candidates they see, dramatically improving your response rates. We're not a recruiting firm - we're your personal outreach team."
    },
    {
      question: "When exactly do I pay the success fee?",
      answer: "The 1% success fee is only charged if and when you accept a job offer that came directly through our outreach efforts. It's calculated based on your first month's total compensation (salary + bonuses + equity). No job = no fee, ever."
    }
  ];

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed">
            Everything you need to know about how ApplyFirst works and what to expect.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4 mb-16">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-slate-50 rounded-2xl border border-slate-200 px-6 hover:shadow-lg transition-all duration-300">
              <AccordionTrigger className="py-6 text-left hover:no-underline group">
                <span className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors duration-300">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-slate-600 text-base leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-12 border border-blue-100">
          <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-300 rounded-full text-blue-700 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            Ready to skip the application queue?
          </div>
          
          <h3 className="text-3xl font-bold text-slate-900 mb-4">
            Join 500+ Professionals Landing Interviews Faster
          </h3>
          <p className="text-slate-600 mb-8 text-lg max-w-2xl mx-auto leading-relaxed">
            Stop competing with hundreds of applicants. Start getting noticed by hiring managers 
            before jobs even hit the market.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-12 py-6 text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              Start Now - It's Risk Free <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-6 text-lg border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold">
              Book Free Consultation
            </Button>
          </div>
          
          <p className="text-sm text-slate-500 mt-4">
            30-day money-back guarantee • No long-term contracts • Setup in 24 hours
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
