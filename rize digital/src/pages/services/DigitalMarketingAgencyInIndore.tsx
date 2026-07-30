import CityLandingPageTemplate from './CityLandingPageTemplate';

const pageData = {
  city: "Indore",
  title: "Digital Marketing Company in Indore | RizeWorld",
  metaDescription: "Looking for a top-rated Digital Marketing Company in Indore? RizeWorld specializes in SEO agency services, e-commerce, and website designer services in Indore.",
  heroHeadline: "Digital Marketing Company in Indore",
  heroSubtitle: "Scale your business with the best digital marketing agency in Indore. RizeWorld builds data-driven SEO services in Indore and ecommerce company Indore structures.",
  aboutHeadline: "RizeWorld – Accelerating Indore's Business Growth",
  aboutText1: "Indore is Madhya Pradesh's dominant financial capital. As a top marketing agency in Indore, RizeWorld provides custom-built SEO company in Indore strategies and social media marketing agency in Indore campaigns.",
  aboutText2: "Whether you need a website designer in Indore or a custom WordPress development company setup, our best web design company in Indore services ensure premium brand positioning.",
  aboutImg: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
  benefits: [
    "SaaS & Tech B2B SEO",
    "E-commerce & D2C Scaling",
    "Vijay Nagar Corporate Leads",
    "Instagram Food & Retail Ads"
  ],
  faqs: [
    {
      question: "How does RizeWorld support Indore startups with digital marketing?",
      answer: "We focus on scalable growth models, including organic content strategies to build traffic, custom landing page funnels to optimize visitor signups, and data-driven ad loops to lower acquisition costs."
    },
    {
      question: "Can you help local retail stores in Indore drive offline foot traffic?",
      answer: "Absolutely. We specialize in Google Map Pack optimization and localized geographic-targeted Facebook ads that reach nearby shoppers, prompting visits and phone inquiries."
    }
  ],
  localSchemaAddress: {
    streetAddress: "Vijay Nagar Business Hub, near AB Road",
    addressLocality: "Indore",
    addressRegion: "Madhya Pradesh",
    postalCode: "452010",
    addressCountry: "India"
  },
  phone: "+91 90246 15510",
  email: "hr.rizeworld@gmail.com"
};

export default function DigitalMarketingAgencyInIndore() {
  return <CityLandingPageTemplate data={pageData} />;
}
