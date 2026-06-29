import CityLandingPageTemplate from './CityLandingPageTemplate';

const pageData = {
  city: "Chandigarh",
  title: "Digital Marketing Agency in Chandigarh | RizeWorld",
  metaDescription: "Looking for a premium Digital Marketing Agency in Chandigarh? RizeWorld designs high-performing SEO campaigns, SaaS leads, and social branding in Chandigarh & Mohali.",
  heroHeadline: "Digital Marketing Agency in Chandigarh",
  heroSubtitle: "Transform your brand, SaaS app, or real estate firm in Chandigarh. RizeWorld builds data-driven SEO architectures, premium UI/UX websites, and high-ROI ad loops designed to convert.",
  aboutHeadline: "RizeWorld – Powering Digital Success in Chandigarh",
  aboutText1: "As India's first planned city, Chandigarh is a hotbed for modern SaaS startups, premium real estate developers, healthcare clinics, and creative agencies. RizeWorld provides elite digital solutions that align with the high expectations of the Chandigarh market.",
  aboutText2: "Our Chandigarh team builds high-converting lead pipelines for real estate projects in Mohali & Zirakpur, search engine ranks for international tech service groups, and clean social media campaigns that establish premium brand positioning.",
  aboutImg: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800",
  benefits: [
    "SaaS & B2B Tech Leads",
    "Real Estate Lead Generation",
    "Boutique & Retail Branding",
    "Healthcare Clinic Patient Funnels"
  ],
  faqs: [
    {
      question: "How does RizeWorld manage real estate lead campaigns in Chandigarh?",
      answer: "We design premium single-property landing pages and run highly targeted Google Search and Meta Lead Ads. We segment buyers looking for luxury apartments, commercial sites, or residential plots in Mohali, Panchkula, and Zirakpur."
    },
    {
      question: "Why is SEO critical for tech businesses in Chandigarh?",
      answer: "Chandigarh is a major IT export city. Ranking for global B2B terms allows SaaS and IT outsourcing agencies to source leads directly from North America and Europe without relying on cold outreach."
    }
  ],
  localSchemaAddress: {
    streetAddress: "Sector 17 Business Plaza",
    addressLocality: "Chandigarh",
    addressRegion: "Punjab & Haryana",
    postalCode: "160017",
    addressCountry: "India"
  },
  phone: "+91 90246 15510",
  email: "hr.rizeworld@gmail.com"
};

export default function DigitalMarketingAgencyInChandigarh() {
  return <CityLandingPageTemplate data={pageData} />;
}
