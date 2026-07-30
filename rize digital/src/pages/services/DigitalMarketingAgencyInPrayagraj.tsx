import CityLandingPageTemplate from './CityLandingPageTemplate';

const pageData = {
  city: "Prayagraj",
  title: "Digital Marketing Agency in Prayagraj | RizeWorld",
  metaDescription: "Looking for the best Digital Marketing Agency in Prayagraj? RizeWorld designs expert digital marketing services in Prayagraj, SEO company in Prayagraj solutions, and web design.",
  heroHeadline: "Digital Marketing Agency in Prayagraj",
  heroSubtitle: "Scale your business with our premier digital marketing company in Prayagraj. RizeWorld builds target-focused SEO services in Prayagraj and custom website design company in Prayagraj layouts.",
  aboutHeadline: "RizeWorld – Driving Digital Transformation in Prayagraj",
  aboutText1: "As a top marketing agency in Prayagraj, RizeWorld provides elite digital solutions that align with the high expectations of the market. Our SEO expert in Prayagraj team builds high-converting lead pipelines and SMM services in Prayagraj.",
  aboutText2: "Whether you need a web development services in Prayagraj setup, custom WordPress development company designs, or targeted PPC company in Prayagraj setups, our custom web design company in Prayagraj ensures premium brand positioning.",
  aboutImg: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800",
  benefits: [
    "Coaching Institute Leads",
    "Student Enrollment Funnels",
    "Local Map Pack Domination",
    "Patient Footfall Ads"
  ],
  faqs: [
    {
      question: "How can RizeWorld increase student enrollment for Prayagraj coaching centers?",
      answer: "We deploy targeted Facebook/Instagram lead generation ads and Google search ads capture high-intent students looking for exam preparation, combined with SMS and email drip automation to maximize conversion rates."
    },
    {
      question: "What SEO strategies work best for businesses in Prayagraj?",
      answer: "We focus heavily on local search queries (e.g., 'best clinic in Prayagraj', 'coaching near Civil Lines') to guarantee you rank #1 on Google maps and organic local listings."
    }
  ],
  localSchemaAddress: {
    streetAddress: "Civil Lines Main Road, near High Court",
    addressLocality: "Prayagraj",
    addressRegion: "Uttar Pradesh",
    postalCode: "211001",
    addressCountry: "India"
  },
  phone: "+91 90246 15510",
  email: "hr.rizeworld@gmail.com"
};

export default function DigitalMarketingAgencyInPrayagraj() {
  return <CityLandingPageTemplate data={pageData} />;
}
