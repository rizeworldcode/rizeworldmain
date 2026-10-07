import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Sparkles, Building2, ArrowUpRight, ChevronDown, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/common/SEO';
import Breadcrumbs from '../components/common/Breadcrumbs';
import citiesData from '../data/cities.json';
import STATES from '../data/states';

const LANDMARK_IMAGES: Record<string, string> = {
  "delhi": "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=400",
  "mumbai": "https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&q=80&w=400",
  "bangalore": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&q=80&w=400",
  "hyderabad": "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=400",
  "pune": "https://images.unsplash.com/photo-1601999109332-542b18dbec57?auto=format&fit=crop&q=80&w=400",
  "chennai": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=400",
  "kolkata": "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&q=80&w=400",
  "ahmedabad": "https://images.unsplash.com/photo-1585155770447-2f66e2a397b5?auto=format&fit=crop&q=80&w=400",
  "gurgaon": "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=400",
  "noida": "https://images.unsplash.com/photo-1618083707368-b3823daa2726?auto=format&fit=crop&q=80&w=400",
  "faridabad": "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=400",
  "ghaziabad": "https://images.unsplash.com/photo-1562790351-d273a961e0e9?auto=format&fit=crop&q=80&w=400",
  "jaipur": "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=400",
  "indore": "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&q=80&w=400",
  "lucknow": "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&q=80&w=400",
  "chandigarh": "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&q=80&w=400",
  "mohali": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=400",
  "nagpur": "https://images.unsplash.com/photo-1617653202545-931490e8d7e7?auto=format&fit=crop&q=80&w=400",
  "udaipur": "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&q=80&w=400",
  "kota": "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=400",
  "jodhpur": "https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&q=80&w=400",
  "bhopal": "https://images.unsplash.com/photo-1569974498991-d3c12a504f95?auto=format&fit=crop&q=80&w=400",
  "kanpur": "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=80&w=400",
  "patna": "https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?auto=format&fit=crop&q=80&w=400",
  "coimbatore": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
  "visakhapatnam": "https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?auto=format&fit=crop&q=80&w=400",
  "kochi": "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=400",
  "surat": "https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?auto=format&fit=crop&q=80&w=400",
  "thane": "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&q=80&w=400",
  "navi-mumbai": "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=400",
  "vadodara": "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&q=80&w=400",
  "rajkot": "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=400",
  "ludhiana": "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=400",
  "dehradun": "https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&q=80&w=400",
  "mysore": "https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&q=80&w=400",
  "trivandrum": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=400",
  "vijayawada": "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?auto=format&fit=crop&q=80&w=400",
  "guwahati": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=400",
  "alwar": "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=400",
  "prayagraj": "https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&q=80&w=400"
};

const STATE_IMAGES: Record<string, string> = {
  "delhi-ncr": "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=400",
  "rajasthan": "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=400",
  "maharashtra": "https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&q=80&w=400",
  "karnataka": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&q=80&w=400",
  "gujarat": "https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?auto=format&fit=crop&q=80&w=400",
  "uttar-pradesh": "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=400",
  "punjab": "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&q=80&w=400",
  "haryana": "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=400",
  "madhya-pradesh": "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&q=80&w=400",
  "tamil-nadu": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=400",
  "kerala": "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=400",
  "west-bengal": "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&q=80&w=400",
  "telangana": "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=400",
  "andhra-pradesh": "https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?auto=format&fit=crop&q=80&w=400",
  "uttarakhand": "https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&q=80&w=400",
  "assam": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=400"
};

const LOCATION_SERVICES = [
  {
    title: "Search Engine Optimization",
    desc: "Improve your website's visibility on search engines with a practical SEO strategy covering keyword research, on-page optimization, technical SEO, content, and link building.",
    link: "/services/seo"
  },
  {
    title: "Local SEO",
    desc: "Get discovered by customers searching for businesses near them. We work on local search optimization, business listings, location-focused content, and other important local SEO factors.",
    link: "/services/seo"
  },
  {
    title: "Social Media Marketing",
    desc: "Build an active social presence with content that reflects your brand and connects with your target audience. Our social media strategies focus on consistency, engagement, and business objectives.",
    link: "/services/social-media-marketing"
  },
  {
    title: "Google & Paid Advertising",
    desc: "Reach potential customers faster with targeted paid campaigns. We help businesses plan, launch, and optimize Google Ads and other performance campaigns based on their goals and budget.",
    link: "/services/paid-ads"
  },
  {
    title: "Website Development",
    desc: "Your website should do more than look good. We create responsive, user-friendly websites designed to communicate your offering clearly and make it easier for visitors to take action.",
    link: "/services/web-development"
  },
  {
    title: "Content Marketing",
    desc: "Useful content can bring the right audience to your website and support your SEO efforts. We create content around real customer questions, search intent, and your business expertise.",
    link: "/services/content-marketing"
  }
];

const LOCATION_FAQS = [
  {
    question: "Which locations does RizeWorld serve?",
    answer: "RizeWorld works with businesses across major Indian cities and regional markets, including Delhi, Mumbai, Bangalore, Hyderabad, Pune, Jaipur, Gurgaon, Noida, Chennai, Ahmedabad, and many more."
  },
  {
    question: "Do I need to be located in one of the listed cities?",
    answer: "No. Our listed locations represent some of the markets we serve. Businesses from other cities can also work with our team remotely."
  },
  {
    question: "Can RizeWorld help my business attract local customers?",
    answer: "Yes. We can use local SEO, content, paid advertising, social media, and website optimization to help businesses become more visible to customers in their target areas."
  },
  {
    question: "Do you create different strategies for different cities?",
    answer: "Yes. Every market has different competition, customer behaviour, and search patterns. We adapt our approach according to the business and the market it wants to reach."
  },
  {
    question: "Can you manage marketing across multiple locations?",
    answer: "Yes. We can help businesses build a broader digital marketing strategy while tailoring targeting and campaigns for individual cities or markets."
  },
  {
    question: "What services are useful for local business growth?",
    answer: "Depending on your goals, services such as local SEO, SEO, Google Ads, social media marketing, content marketing, website development, and UI/UX design can work together to improve your online presence."
  },
  {
    question: "Can RizeWorld help us expand into a new market?",
    answer: "Yes. We can help you identify digital opportunities, understand your target audience, improve search visibility, and build campaigns designed for the new market."
  }
];

export default function Locations() {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "RizeWorld Serviced Locations Directory",
    "description": "Directory of all locations we serve with premium digital marketing, local SEO optimization, PPC paid advertising campaigns, and custom web applications.",
    "itemListElement": citiesData.map((c, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `https://rizeworld.in/service/digital-marketing-agency-in-${c.slug}`,
      "name": `Digital Marketing Agency in ${c.name}`
    }))
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": LOCATION_FAQS.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://rizeworld.in/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Our Locations",
        "item": "https://rizeworld.in/locations"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 text-left font-sans selection:bg-orange-500 selection:text-white">
      <SEO 
        title="Our Serviced Cities & Regional Office Mappings | RizeWorld"
        description="From fast-moving metros to emerging business hubs, RizeWorld helps brands turn local opportunities into meaningful digital growth across India."
        canonicalUrl="https://rizeworld.in/locations"
        schema={[schemaMarkup, faqSchema, breadcrumbSchema]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <Breadcrumbs items={[{ name: "Locations" }]} />
      </div>

      {/* Hero Header Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-4xl mx-auto">
          <span className="text-xs font-black uppercase tracking-widest text-orange-500 flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-4 h-4" /> WHERE IDEAS MEET OPPORTUNITY
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-gray-950 uppercase tracking-tighter mb-6 leading-tight">
            BUILT FOR BUSINESSES, WHEREVER THEY GROW.
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
            From fast-moving metros to emerging business hubs, RizeWorld helps brands turn local opportunities into meaningful digital growth. Our team brings SEO, paid media, social, web, and creative expertise together for businesses across India.
          </p>
        </div>
      </section>

      {/* Digital Reach & Cities Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-xs font-black uppercase tracking-widest text-orange-500 flex items-center justify-center gap-2 mb-4">
            <Building2 className="w-4 h-4" /> OUR DIGITAL REACH
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-950 uppercase tracking-tighter mb-6 leading-tight">
            YOUR MARKET IS LOCAL. YOUR POTENTIAL DOESN'T HAVE TO BE.
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            Different cities bring different audiences, competitors, and buying habits. That's why we don't believe in copying the same marketing strategy from one market to another. We shape our approach around where your customers are, what they are searching for, and how your business wants to grow.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {citiesData.map((c, idx) => {
            const isHovered = hoveredCity === c.slug;
            return (
              <Link
                key={idx}
                to={`/service/digital-marketing-agency-in-${c.slug}`}
                onMouseEnter={() => setHoveredCity(c.slug)}
                onMouseLeave={() => setHoveredCity(null)}
                className="bg-white border border-gray-200/85 hover:border-orange-500 hover:text-orange-500 p-6 rounded-3xl flex items-center gap-3 transition-all duration-500 shadow-2xs cursor-pointer group relative overflow-hidden h-[90px]"
              >
                {/* Landmark background image on hover */}
                <AnimatePresence>
                  {isHovered && LANDMARK_IMAGES[c.slug] && (
                    <motion.div
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 0.9, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="absolute inset-0 z-0 pointer-events-none"
                    >
                      <img 
                        src={LANDMARK_IMAGES[c.slug]} 
                        alt={c.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-white/10" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="w-10 h-10 rounded-2xl bg-stone-50 group-hover:bg-orange-50 text-gray-400 group-hover:text-orange-500 flex items-center justify-center transition-colors relative z-10 shrink-0">
                  <MapPin size={18} />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-gray-800 group-hover:text-orange-500 transition-colors relative z-10">
                  {c.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Browse by State Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-orange-500 flex items-center justify-center gap-2 mb-4">
            <Building2 className="w-4 h-4" /> Regional Hubs
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-950 uppercase tracking-tighter mb-4">
            Browse by State
          </h2>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            Explore our presence across major Indian states and regions.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {STATES.map((state, idx) => {
            const isHovered = hoveredState === state.slug;
            return (
              <motion.div
                key={state.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
              >
                <Link
                  to={`/locations/${state.slug}`}
                  onMouseEnter={() => setHoveredState(state.slug)}
                  onMouseLeave={() => setHoveredState(null)}
                  className="bg-white border border-gray-200/85 hover:border-orange-500 p-5 rounded-2xl flex items-center justify-between transition-all duration-300 shadow-2xs cursor-pointer group relative overflow-hidden"
                >
                  {/* State background image on hover */}
                  <AnimatePresence>
                    {isHovered && STATE_IMAGES[state.slug] && (
                      <motion.div
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 0.9, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="absolute inset-0 z-0 pointer-events-none"
                      >
                        <img 
                          src={STATE_IMAGES[state.slug]} 
                          alt={state.name} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-white/10" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center gap-3 relative z-10">
                    <Building2 size={16} className="text-gray-400 group-hover:text-orange-500 transition-colors shrink-0" />
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-gray-800 group-hover:text-orange-500 transition-colors block">
                        {state.name}
                      </span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-orange-500/80 transition-colors">
                        {state.cities.length} {state.cities.length === 1 ? 'city' : 'cities'}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight size={14} className="text-gray-300 group-hover:text-orange-500 transition-colors shrink-0 relative z-10" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Digital Marketing Services We Offer Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-xs font-black uppercase tracking-widest text-orange-500 flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-4 h-4" /> Full Spectrum Solutions
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-950 uppercase tracking-tighter mb-6">
            Digital Marketing Services We Offer
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            Comprehensive digital marketing solutions tailored to help your brand dominate local search queries, scale client engagement, and maximize return on ad spend.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LOCATION_SERVICES.map((srv, idx) => (
            <Link
              key={idx}
              to={srv.link}
              className="bg-white border border-gray-200/85 hover:border-orange-500 p-8 rounded-3xl flex flex-col justify-between transition-all duration-300 shadow-2xs hover:shadow-md group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-gray-950 group-hover:text-orange-500 transition-colors mb-3">
                  {srv.title}
                </h3>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                  {srv.desc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-orange-500 group-hover:translate-x-1 transition-transform">
                <span>Learn More</span>
                <ArrowUpRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQs Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-orange-500 flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-4 h-4" /> Clarifications & Answers
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-950 uppercase tracking-tighter mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-sm max-w-xl mx-auto">
            Everything you need to know about our location coverage and localized digital marketing capabilities.
          </p>
        </div>

        <div className="space-y-4">
          {LOCATION_FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white border border-gray-200/85 rounded-2xl overflow-hidden shadow-2xs transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/80 transition-colors"
                >
                  <span className="font-black text-gray-950 text-sm md:text-base uppercase tracking-tight">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center shrink-0 text-gray-600 transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-orange-100 text-orange-600" : ""
                    }`}
                  >
                    <ChevronDown size={18} />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-2 text-gray-600 text-xs md:text-sm leading-relaxed border-t border-gray-100">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
