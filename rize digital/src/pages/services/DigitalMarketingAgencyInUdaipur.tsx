import CityLandingPageTemplate from './CityLandingPageTemplate';

const pageData = {
  city: "Udaipur",
  title: "Digital Marketing Agency in Udaipur | RizeWorld",
  metaDescription: "Looking for the best Digital Marketing Agency in Udaipur? RizeWorld delivers expert SEO, hotel booking lead generation, and social media branding for Udaipur businesses.",
  heroHeadline: "Digital Marketing Agency in Udaipur",
  heroSubtitle: "RizeWorld helps Udaipur's premium hotels, heritage homestays, and handicraft exporters attract domestic and international travelers through world-class search optimization and targeted media spend.",
  aboutHeadline: "RizeWorld – Scaling Udaipur's Tourism & Export Economy",
  aboutText1: "Known as the City of Lakes, Udaipur's business ecosystem thrives on tourism, hospitality, destination weddings, and artisanal exports. RizeWorld specializes in building global and local search visibility campaigns that target travelers researching Udaipur vacations.",
  aboutText2: "Our custom marketing strategy is engineered to drive direct direct-to-consumer hotel bookings, highlight wedding planning portfolios, and optimize international lead generation for Udaipur's premium marble and art exporters.",
  aboutImg: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=800",
  benefits: [
    "Hospitality & Hotel Leads",
    "International Export SEO",
    "B2B Wedding Leads Generation",
    "Vibrant Social Media Branding"
  ],
  faqs: [
    {
      question: "How can a Digital Marketing Agency in Udaipur help my hotel brand?",
      answer: "We focus on driving direct guest reservations through a mix of targeted local Google Ads, Instagram travel campaigns, and Google Map optimization, reducing your dependence on OTA commissions."
    },
    {
      question: "Does RizeWorld work with marble and handicraft exporters in Udaipur?",
      answer: "Yes. We design search engine optimization and B2B LinkedIn outreach campaigns targeting international buyers, helping Udaipur manufacturing and trading firms secure foreign trade deals."
    }
  ],
  localSchemaAddress: {
    streetAddress: "Heritage City Link Road, Lake view area",
    addressLocality: "Udaipur",
    addressRegion: "Rajasthan",
    postalCode: "313001",
    addressCountry: "India"
  },
  phone: "+91 90246 15510",
  email: "hr.rizeworld@gmail.com"
};

export default function DigitalMarketingAgencyInUdaipur() {
  return <CityLandingPageTemplate data={pageData} />;
}
