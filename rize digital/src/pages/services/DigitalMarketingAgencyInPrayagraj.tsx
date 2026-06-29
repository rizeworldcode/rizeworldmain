import CityLandingPageTemplate from './CityLandingPageTemplate';

const pageData = {
  city: "Prayagraj",
  title: "Digital Marketing Agency in Prayagraj | RizeWorld",
  metaDescription: "Looking for a top Digital Marketing Agency in Prayagraj? RizeWorld designs expert digital strategies, student enrollment campaigns, and search ranks for Prayagraj businesses.",
  heroHeadline: "Digital Marketing Agency in Prayagraj",
  heroSubtitle: "Scale your educational institution, coaching center, or local trade enterprise in Prayagraj. RizeWorld builds digital marketing funnels that drive online student leads and local consumer inquiries.",
  aboutHeadline: "RizeWorld – Driving Digital Transformation in Prayagraj",
  aboutText1: "As a major educational and historical administrative hub in Uttar Pradesh, Prayagraj is home to hundreds of competitive exam coaching centers, universities, healthcare clinics, and legal institutions. RizeWorld builds localized lead acquisition engines tailored for these service models.",
  aboutText2: "We optimize search rankings for highly competitive educational phrases, build high-converting landing pages for student enrollments, and deploy cost-effective local Google Map campaigns to capture patients, students, and clients.",
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
