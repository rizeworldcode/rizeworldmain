import CityLandingPageTemplate from './CityLandingPageTemplate';

const pageData = {
  city: "Udaipur",
  title: "Digital Marketing Agency in Udaipur | RizeWorld",
  metaDescription: "Looking for the best Digital Marketing Agency in Udaipur? RizeWorld offers digital marketing services in Udaipur, SEO agency in Udaipur solutions, and website design.",
  heroHeadline: "Digital Marketing Agency in Udaipur",
  heroSubtitle: "Partner with the premier digital marketing in Udaipur company. RizeWorld builds data-driven SEO services in Udaipur, social media marketing agency in Udaipur campaigns, and direct hotel booking funnels.",
  aboutHeadline: "RizeWorld – Scaling Udaipur's Tourism & Export Economy",
  aboutText1: "Udaipur's business ecosystem thrives on tourism, weddings, and exports. As a leading web design company in Udaipur, RizeWorld provides custom-built digital strategies and social media marketing company in Udaipur campaigns.",
  aboutText2: "Whether you need a website designer in Udaipur, a custom WordPress development company setup, or an ecommerce website development company structure, we ensure top search ranking results.",
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
