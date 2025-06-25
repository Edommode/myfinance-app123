
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FinancialHealthCheck from "@/components/FinancialHealthCheck";
import PersonalizedTips from "@/components/PersonalizedTips";
import FeaturesSection from "@/components/FeaturesSection";
import InvestmentEducation from "@/components/InvestmentEducation";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <FinancialHealthCheck />
      <PersonalizedTips />
      <FeaturesSection />
      <InvestmentEducation />
      <TestimonialsSection />
      <ContactSection />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
