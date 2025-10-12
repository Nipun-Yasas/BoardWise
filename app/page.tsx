import Navbar from './_components/landing/Navbar';
import HeroSection from './_components/landing/HeroSection';
import FeaturesSection from './_components/landing/FeaturesSection';
import HowItWorksSection from './_components/landing/HowItWorksSection';
import TestimonialsSection from './_components/landing/TestimonialsSection';
import CTASection from './_components/landing/CTASection';
import Footer from './_components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-[#060010] dark:via-[#0a0020] dark:to-[#0f0030]">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}