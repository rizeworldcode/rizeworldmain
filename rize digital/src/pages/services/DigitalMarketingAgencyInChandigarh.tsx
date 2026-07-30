import CityLandingPageTemplate from './CityLandingPageTemplate';

const pageData = {
  city: "Chandigarh",
  title: "Digital Marketing Company in Chandigarh | RizeWorld",
  metaDescription: "Looking for the best Digital Marketing Company in Chandigarh? RizeWorld is a premier digital marketing agency in Chandigarh offering SEO services and web design.",
  heroHeadline: "Digital Marketing Company in Chandigarh",
  heroSubtitle: "Scale your business with the best digital marketing agency in Chandigarh. RizeWorld builds data-driven SEO services in Chandigarh, premium website development company solutions, and local social media campaigns.",
  aboutHeadline: "RizeWorld – Powering Digital Success in Chandigarh",
  aboutText1: "As a top marketing agency in Chandigarh, RizeWorld provides elite digital solutions that align with the high expectations of the market. Our SEO expert in Chandigarh team builds high-converting lead pipelines and clean social media marketing services in Chandigarh.",
  aboutText2: "Whether you need a website designer in Chandigarh, custom WordPress development company designs, or targeted PPC company campaign setups, our web design services in Chandigarh ensure premium brand positioning.",
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
