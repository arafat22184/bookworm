import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { StatsSection } from '@/components/landing/StatsSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function LandingPage() {
  const user = await getCurrentUser();
  
    if (!user) {
      redirect('/login');
    }
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans selection:bg-primary/20 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 z-[-1] opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'url(/pattern.png)', backgroundSize: '300px' }} />

      <Navbar />

      <main className="flex-1 pt-20">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
