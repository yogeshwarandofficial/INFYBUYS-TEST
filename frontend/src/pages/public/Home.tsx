import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Seo } from '@/components/shared/Seo';
import { CookieConsentBanner } from '@/components/shared/CookieConsentBanner';
import { DashboardSelectModal } from '@/components/shared/DashboardSelectModal';
import { HeroSection } from '@/features/public/HeroSection';
import { ExploreOpportunities } from '@/features/public/ExploreOpportunities';
import { CategoryCards } from '@/features/public/CategoryCards';
// import { AboutSection } from '@/features/public/AboutSection';
import { FeaturedListings } from '@/features/public/FeaturedListings';
import { HowItWorks } from '@/features/public/HowItWorks';
import { WhyChooseInfyBuys } from '@/features/public/WhyChooseInfyBuys';
import { TestimonialSection } from '@/features/public/TestimonialSection';
import { CTASection } from '@/features/public/CTASection';

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDashboardModal, setShowDashboardModal] = useState(false);

  useEffect(() => {
    if (location.state?.justLoggedIn) {
      // Show modal after 2.5 seconds
      const timer = setTimeout(() => {
        setShowDashboardModal(true);
      }, 2500);

      // Clear the state so it doesn't trigger again on page refresh
      // using history API to avoid triggering a React Router navigation & re-render
      window.history.replaceState(null, '');

      return () => clearTimeout(timer);
    }
  }, [location.state?.justLoggedIn]);

  return (
    <>
      <Seo
        title="Buy and Sell Profitable Online Businesses"
        description="InfyBuys is the premium marketplace for buying and selling SaaS, E-commerce, and Digital Agencies. Join 15,000+ verified buyers and sellers today."
      />
      <HeroSection />
      <ExploreOpportunities />
      <CategoryCards />
      {/* <AboutSection /> */}
      <WhyChooseInfyBuys />
      <FeaturedListings />
      <HowItWorks />
      <TestimonialSection />
      <CTASection />
      <CookieConsentBanner />
      <DashboardSelectModal 
        isOpen={showDashboardModal} 
        onClose={() => setShowDashboardModal(false)} 
      />
    </>
  );
}
