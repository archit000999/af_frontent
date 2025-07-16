
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import ATSProblem from "@/components/ATSProblem";
import HowItWorks from "@/components/HowItWorks";
import Proof from "@/components/Proof";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import WebinarSection from "@/components/WebinarSection";

const Index = () => { 
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <div id="problem">
        <Problem />
      </div>
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <div id="ats-problem">
        <ATSProblem />
      </div>
      <div id="proof">
        <Proof />
      </div>
      <WebinarSection />
      <div id="pricing">
        <Pricing />
      </div>
      <div id="faq">
        <FAQ />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
