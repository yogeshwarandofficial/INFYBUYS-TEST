import { Seo } from '@/components/shared/Seo';
import { CookieConsentBanner } from '@/components/shared/CookieConsentBanner';
import { HeroSection } from '@/features/public/HeroSection';
import { StatisticsSection } from '@/features/public/StatisticsSection';
import { CategoryCards } from '@/features/public/CategoryCards';
import { HowItWorks } from '@/features/public/HowItWorks';
import { FeaturedListings } from '@/features/public/FeaturedListings';
import { WhyChooseInfyBuys } from '@/features/public/WhyChooseInfyBuys';
import { TestimonialSection } from '@/features/public/TestimonialSection';
import { CTASection } from '@/features/public/CTASection';

export default function Home() {
  return (
    <>
      <Seo
        title="Buy and Sell Profitable Online Businesses"
        description="InfyBuys is the premium marketplace for buying and selling SaaS, E-commerce, and Digital Agencies. Join 15,000+ verified buyers and sellers today."
      />
      <HeroSection />
      <StatisticsSection />
      <CategoryCards />
      <FeaturedListings />
      <HowItWorks />
      <WhyChooseInfyBuys />
      <TestimonialSection />
      <CTASection />
      <CookieConsentBanner />
    </>
  );
}
