
import { Button } from "@/components/ui/button";
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
      answer: "We use professional email accounts and never share your personal information without permission. All outreach is done with your explicit consent and you can review messaging templates before we send them."
    },
    {
      question: "How quickly will I see results?",
      answer: "Most users start receiving responses from hiring managers within the first week. On average, our users land their first interview within 2-3 weeks of starting the service."
    },
    {
      question: "What if I don't get any interviews?",
      answer: "If we don't generate any interviews for you within the first month, we'll refund your entire $299 deposit. We're confident in our system and stand behind our results."
    },
    {
      question: "Do you work with all industries and experience levels?",
      answer: "We specialize in mid to senior-level professionals earning $100K+ across tech, finance, marketing, sales, and consulting. We focus on roles where our direct outreach approach is most effective."
    },
    {
      question: "How is this different from other job search services?",
      answer: "Unlike traditional recruiters or job boards, we proactively reach hiring managers before jobs are widely posted. This puts you in the first wave of candidates they see, dramatically improving your response rates."
    },
    {
      question: "When do I pay the success fee?",
      answer: "The 1% success fee is only charged if you accept a job offer that came directly through our outreach efforts. It's calculated based on your first month's total compensation (salary + bonuses)."
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about how Saki works.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4 mb-12">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg border border-gray-200">
              <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                <span className="font-semibold text-gray-900">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Skip the Line?
          </h3>
          <p className="text-gray-600 mb-8">
            Join hundreds of professionals who are landing interviews faster with Saki.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-lg">
            Start Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
