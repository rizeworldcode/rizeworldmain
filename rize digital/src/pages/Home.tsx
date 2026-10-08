import HeroSection from '../components/home/HeroSection';
import SEO from '../components/common/SEO';
import AreasWeServe from '../components/common/AreasWeServe';
import AgencyHighlightsSection from '../components/home/AgencyHighlightsSection';
import AiRankingSection from '../components/home/AiRankingSection';
import AwardsSection from '../components/home/AwardsSection';
import CaseStudiesSection from '../components/home/teamSection';
import StrategySection from '../components/home/StrategySection';
import GrowthLabsSection from '../components/home/GrowthLabsSection';
import ThoughtLeadershipSection from '../components/home/ThoughtLeadershipSection';
import ServicesGridSection from '../components/home/ServicesGridSection';
import MailboxRevealSection from '../components/home/MailboxRevealSection';

export default function Home() {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "RizeWorld Digital",
    "url": "https://rizeworld.in/",
    "logo": "https://rizeworld.in/images/logo/RW.png",
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
        title="Digital Marketing Agency for Indian Startups"
        description="RizeWorld provides SEO, social media marketing, Google Ads, content marketing, web development, and digital marketing solutions to help Indian startups and businesses grow online."
        canonicalUrl="https://rizeworld.in/"
        schema={[orgSchema, localBusinessSchema]}
      />
      
      <div className="relative w-full min-h-screen flex flex-col overflow-hidden bg-[#060218]">
        <div className="relative z-10 flex flex-col min-h-[70vh] xl:min-h-screen w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6 justify-center">
          <HeroSection />
        </div>
      </div>

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
    </>
  );
}
