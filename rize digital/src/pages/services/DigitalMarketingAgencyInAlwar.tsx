import CityLandingPageTemplate from './CityLandingPageTemplate';

const pageData = {
  city: "Alwar",
  title: "Digital Marketing Agency in Alwar | RizeWorld",
  metaDescription: "Looking for the best Digital Marketing Agency in Alwar? RizeWorld offers SEO, PPC, Social Media, and Web Development services in Alwar UIT Colony, Telco Circle, and Shalimar Nagar.",
  heroHeadline: "Digital Marketing Agency in Alwar",
  heroSubtitle: "RizeWorld is Alwar's leading digital marketing partner, delivering result-focused SEO optimization, local search exposure, and ROI-driven paid ad campaigns to grow local brands online.",
  aboutHeadline: "RizeWorld – Empowering Local Brands in Alwar",
  aboutText1: "Based at Shalimar Nagar, Alwar, RizeWorld is a premium digital marketing company dedicated to elevating retail, education, manufacturing, and industrial brands in the NCR region. We help Alwar businesses connect with online consumers through search rankings, localized keywords, and visual storytelling.",
  aboutText2: "Whether you operate an educational institute near Telco Circle, a retail shop in UIT Colony, or an exporter in Alwar Industrial Area, we design highly targeted growth loops that convert web visits into loyal customers.",
  aboutImg: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
  benefits: [
    "UIT Colony Local SEO Expertise",
    "High Conversion ROI Paid Ads",
    "Responsive Web Layouts",
    "Google Map Pack Domination"
  ],
  faqs: [
    {
      question: "Why is RizeWorld the best Digital Marketing Agency in Alwar?",
      answer: "We are local search experts headquartered right here in Alwar. We understand the specific regional trends, customer behaviors, and local search queries that drive leads for Alwar-based service providers."
    },
    {
      question: "What digital services does RizeWorld provide in Alwar?",
      answer: "We offer end-to-end digital solutions including Search Engine Optimization (SEO), Paid Advertising (Meta/Google Ads), Social Media Management (Instagram/Facebook/LinkedIn), Custom Website Development, and Graphic Designing."
    },
    {
      question: "How long does it take to rank on Google in Alwar?",
      answer: "For local searches targeting Alwar UIT Colony or Shalimar Nagar, SEO campaigns usually show significant keyword ranking improvements and map pack visibility within 3 to 6 months of execution."
    }
  ],
  localSchemaAddress: {
    streetAddress: "C-198, near Telco Circle, UIT colony, Shalimar Nagar",
    addressLocality: "Alwar",
    addressRegion: "Rajasthan",
    postalCode: "301001",
    addressCountry: "India"
  },
  phone: "+91 90246 15510",
  email: "hr.rizeworld@gmail.com"
};

export default function DigitalMarketingAgencyInAlwar() {
  return <CityLandingPageTemplate data={pageData} />;
}
