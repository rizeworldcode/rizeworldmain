import CityLandingPageTemplate from './CityLandingPageTemplate';

const pageData = {
  city: "Indore",
  title: "Digital Marketing Agency in Indore | RizeWorld",
  metaDescription: "Looking for a top-rated Digital Marketing Agency in Indore? RizeWorld specializes in SEO, e-commerce growth, social media branding, and IT park B2B marketing in Indore.",
  heroHeadline: "Digital Marketing Agency in Indore",
  heroSubtitle: "Scale your startup, SaaS brand, or retail store in India's cleanest city. RizeWorld builds state-of-the-art SEO frameworks and ROI-driven paid ad systems optimized for Indore's competitive market.",
  aboutHeadline: "RizeWorld – Accelerating Indore's Business Growth",
  aboutText1: "Indore is Madhya Pradesh's dominant financial capital, boasting a rich food culture, rapidly expanding IT parks, and a thriving startup ecosystem. RizeWorld provides custom-built digital strategies designed to help Indore enterprises outperform the competition.",
  aboutText2: "From local food brands near Chappan Dukan aiming to expand delivery orders, to B2B tech developers based in Vijay Nagar looking for international corporate clients, we deploy multi-channel funnels that drive real business growth.",
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
