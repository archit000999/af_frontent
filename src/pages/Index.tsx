
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import ATSProblem from "@/components/ATSProblem";
import HowItWorks from "@/components/HowItWorks";
import Proof from "@/components/Proof";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Problem />
      <ATSProblem />
      <HowItWorks />
      <Proof />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;
