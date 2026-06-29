import { useParams, Navigate } from 'react-router-dom';
import CityLandingPageTemplate from './CityLandingPageTemplate';

const CITY_NAME_MAPPING: Record<string, string> = {
  "delhi": "Delhi",
  "mumbai": "Mumbai",
  "bangalore": "Bangalore",
  "hyderabad": "Hyderabad",
  "pune": "Pune",
  "chennai": "Chennai",
  "kolkata": "Kolkata",
  "ahmedabad": "Ahmedabad",
  "gurgaon": "Gurgaon",
  "noida": "Noida",
  "faridabad": "Faridabad",
  "ghaziabad": "Ghaziabad",
  "jaipur": "Jaipur",
  "indore": "Indore",
  "lucknow": "Lucknow",
  "chandigarh": "Chandigarh",
  "mohali": "Mohali",
  "nagpur": "Nagpur",
  "udaipur": "Udaipur",
  "kota": "Kota",
  "jodhpur": "Jodhpur",
  "bhopal": "Bhopal",
  "kanpur": "Kanpur",
  "patna": "Patna",
  "coimbatore": "Coimbatore",
  "visakhapatnam": "Visakhapatnam",
  "kochi": "Kochi",
  "surat": "Surat",
  "thane": "Thane",
  "navi-mumbai": "Navi Mumbai",
  "vadodara": "Vadodara",
  "rajkot": "Rajkot",
  "ludhiana": "Ludhiana",
  "dehradun": "Dehradun",
  "mysore": "Mysore",
  "trivandrum": "Trivandrum",
  "vijayawada": "Vijayawada",
  "guwahati": "Guwahati",
  "alwar": "Alwar",
  "prayagraj": "Prayagraj"
};

export default function DynamicCityLandingPage() {
  const { citySlug } = useParams();

  if (!citySlug) {
    return <Navigate to="/services" replace />;
  }

  // Expecting format: digital-marketing-agency-in-delhi
  const prefix = "digital-marketing-agency-in-";
  if (!citySlug.startsWith(prefix)) {
    return <Navigate to="/services" replace />;
  }

  const rawKey = citySlug.substring(prefix.length).toLowerCase();
  const cityName = CITY_NAME_MAPPING[rawKey];

  if (!cityName) {
    return <Navigate to="/services" replace />;
  }

  const pageData = {
    city: cityName,
    title: `Digital Marketing Agency in ${cityName} | RizeWorld`,
    metaDescription: `Looking for the best Digital Marketing Agency in ${cityName}? RizeWorld offers SEO, PPC, Social Media, and Web Development services in ${cityName} to scale your brand.`,
    heroHeadline: `Digital Marketing Agency in ${cityName}`,
    heroSubtitle: `RizeWorld is ${cityName}'s premium digital marketing partner, delivering result-focused SEO optimization, local search exposure, and ROI-driven paid ad campaigns.`,
    aboutHeadline: `RizeWorld – Empowering Brands in ${cityName}`,
    aboutText1: `RizeWorld is a premium digital marketing company dedicated to elevating retail, education, manufacturing, and local service brands in ${cityName}. We help businesses connect with online consumers through search rankings, localized keywords, and visual storytelling.`,
    aboutText2: `We design highly targeted growth loops that convert web visits into loyal customers, tailoring local campaigns specifically to your market challenges.`,
    aboutImg: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
    benefits: [
      "Custom Local Search Optimization",
      "High Conversion Paid Ads (PPC)",
      "Responsive & Fast Loading Websites",
      "Strategic Social Media Curation"
    ],
    faqs: [
      {
        question: `Why is RizeWorld the best Digital Marketing Agency in ${cityName}?`,
        answer: `We are performance marketing and search engine optimization specialists. We design campaigns based on actual consumer queries and local market context to ensure you get qualified leads.`
      },
      {
        question: `What digital services does RizeWorld provide in ${cityName}?`,
        answer: "We offer end-to-end digital solutions including Search Engine Optimization (SEO), Paid Advertising (Meta/Google Ads), Social Media Management (Instagram/Facebook/LinkedIn), Custom Website Development, and Graphic Designing."
      },
      {
        question: `How long does it take to rank on Google in ${cityName}?`,
        answer: "Local search and SEO campaigns usually show significant keyword ranking improvements and map pack visibility within 3 to 6 months of execution."
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

  return <CityLandingPageTemplate data={pageData} />;
}
