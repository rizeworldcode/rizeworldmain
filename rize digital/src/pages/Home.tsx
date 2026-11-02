import { Suspense, lazy } from 'react';
import HeroSection from '../components/home/HeroSection';
import SEO from '../components/common/SEO';

// Lazy-load below-the-fold components to keep initial main-thread execution lightweight
const AgencyHighlightsSection = lazy(() => import('../components/home/AgencyHighlightsSection'));
const ServicesGridSection = lazy(() => import('../components/home/ServicesGridSection'));
const CaseStudiesSection = lazy(() => import('../components/home/teamSection'));
const StrategySection = lazy(() => import('../components/home/StrategySection'));
const GrowthLabsSection = lazy(() => import('../components/home/GrowthLabsSection'));
const ThoughtLeadershipSection = lazy(() => import('../components/home/ThoughtLeadershipSection'));
const AiRankingSection = lazy(() => import('../components/home/AiRankingSection'));
const AwardsSection = lazy(() => import('../components/home/AwardsSection'));
const AreasWeServe = lazy(() => import('../components/common/AreasWeServe'));
const MailboxRevealSection = lazy(() => import('../components/home/MailboxRevealSection'));

export default function Home() {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "RizeWorld Digital",
    "url": "https://rizeworld.in/",
    "logo": "https://rizeworld.in/images/logo/RW.webp",
    "sameAs": [
      "https://www.facebook.com/share/1BcNrvpmuJ/",
      "https://www.instagram.com/rizeworld?igsh=MWYxOGs5NGhhdnNsNA==",
      "https://www.linkedin.com/company/rizeworld/"
    ]
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "RizeWorld Digital Marketing Pvt Ltd",
    "image": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
    "url": "https://rizeworld.in/",
    "telephone": "+91 90246 15510",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "C-198, near Telco Circle, UIT colony, Shalimar Nagar",
      "addressLocality": "Alwar",
      "addressRegion": "Rajasthan",
      "postalCode": "301001",
      "addressCountry": "India"
    }
  };

  return (
    <>
      <SEO 
        title="Digital Marketing for Business Growth in India | RizeWorld"
        description="RizeWorld helps Indian businesses grow with SEO, social media marketing, Google Ads, content marketing, and web development solutions that drive online visibility and leads."
        canonicalUrl="https://rizeworld.in/"
        schema={[orgSchema, localBusinessSchema]}
      />
      
      <div className="relative w-full min-h-screen flex flex-col overflow-hidden bg-[#060218]">
        <div className="relative z-10 flex flex-col min-h-[70vh] xl:min-h-screen w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6 justify-center">
          <HeroSection />
        </div>
      </div>

      <Suspense fallback={null}>
        <AgencyHighlightsSection />
        <ServicesGridSection />
        <CaseStudiesSection />
        <StrategySection />
        <GrowthLabsSection />
        <ThoughtLeadershipSection />
        <AiRankingSection />
        <AwardsSection />
        <AreasWeServe />
        <MailboxRevealSection />
      </Suspense>
    </>
  );
}
