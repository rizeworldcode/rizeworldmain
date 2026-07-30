import { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowUpRight, Building2, Briefcase } from 'lucide-react';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import InternalLinkSection from '../../components/common/InternalLinkSection';
import STATES from '../../data/states';
import citiesData from '../../data/cities.json';

const CITY_NAME_MAP: Record<string, string> = {};
citiesData.forEach((c) => { CITY_NAME_MAP[c.slug] = c.name; });

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

export default function StateLandingPage() {
  const { stateSlug } = useParams();
  const state = STATES.find(s => s.slug === stateSlug);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  if (!state) {
    return <Navigate to="/locations" replace />;
  }

  const stateCities = state.cities
    .map(slug => ({ slug, name: CITY_NAME_MAP[slug] || slug }))
    .filter(c => c.name);

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `RizeWorld Digital Marketing - ${state.name}`,
    "url": `https://rizeworld.in/locations/${state.slug}`,
    "telephone": "+91 90246 15510",
    "address": {
      "@type": "PostalAddress",
      "addressRegion": state.name,
      "addressCountry": "India"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://rizeworld.in/" },
      { "@type": "ListItem", "position": 2, "name": "Locations", "item": "https://rizeworld.in/locations" },
      { "@type": "ListItem", "position": 3, "name": state.name, "item": `https://rizeworld.in/locations/${state.slug}` }
    ]
  };

  const SERVICES = [
    { name: "Digital Marketing", path: "/services/digital-marketing" },
    { name: "SEO", path: "/services/seo" },
    { name: "Social Media Marketing", path: "/services/social-media-marketing" },
    { name: "Paid Ads (PPC)", path: "/services/paid-ads" },
    { name: "Web Development", path: "/services/web-development" },
    { name: "Content Marketing", path: "/services/content-marketing" },
  ];

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 text-left font-sans selection:bg-orange-500 selection:text-white">
      <SEO
        title={`Digital Marketing Agency in ${state.name} | RizeWorld`}
        description={`RizeWorld offers premium digital marketing, SEO, paid ads, social media, and web development services across ${state.name}. Serving ${stateCities.map(c => c.name).join(', ')}.`}
        canonicalUrl={`https://rizeworld.in/locations/${state.slug}`}
        schema={[localBusinessSchema, breadcrumbSchema]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <Breadcrumbs items={[
          { name: "Locations", path: "/locations" },
          { name: state.name }
        ]} />
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-orange-500 flex items-center justify-center gap-2 mb-4">
            <Building2 className="w-4 h-4" /> Regional Hub
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-gray-950 uppercase tracking-tighter mb-6">
            Digital Marketing in {state.name}
          </h1>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
            RizeWorld delivers localized digital marketing campaigns, SEO optimization, and custom web solutions across {stateCities.length} cities in {state.name}.
          </p>
        </div>
      </section>

      {/* Cities Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500 block mb-2">Our Presence</span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-950 uppercase tracking-tight">
            Cities We Serve in {state.name}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stateCities.map((city, idx) => {
            const isHovered = hoveredCity === city.slug;
            return (
              <motion.div
                key={city.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                <Link
                  to={`/service/digital-marketing-agency-in-${city.slug}`}
                  onMouseEnter={() => setHoveredCity(city.slug)}
                  onMouseLeave={() => setHoveredCity(null)}
                  className="bg-white border border-gray-200/80 rounded-3xl p-8 flex items-center gap-4 hover:border-orange-500/40 hover:shadow-lg transition-all duration-300 group cursor-pointer block relative overflow-hidden"
                >
                  {/* Landmark background image on hover */}
                  <AnimatePresence>
                    {isHovered && LANDMARK_IMAGES[city.slug] && (
                      <motion.div
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 0.9, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="absolute inset-0 z-0 pointer-events-none"
                      >
                        <img 
                          src={LANDMARK_IMAGES[city.slug]} 
                          alt={city.name} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-white/10" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 shrink-0 relative z-10">
                    <MapPin size={20} />
                  </div>
                  <div className="flex-1 relative z-10">
                    <h3 className="text-sm font-black uppercase tracking-wider text-gray-950 group-hover:text-orange-500 transition-colors">
                      {city.name}
                    </h3>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-orange-500/80 transition-colors">
                      View Agency →
                    </span>
                  </div>
                  <ArrowUpRight size={16} className="text-gray-300 group-hover:text-orange-500 transition-colors shrink-0 relative z-10" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Services Available */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="bg-zinc-950 text-white rounded-[2.5rem] p-8 md:p-16 border border-zinc-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.1),transparent_50%)] pointer-events-none" />
          
          <div className="relative z-10 mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-orange-500 block mb-2">
              <Briefcase className="w-4 h-4 inline mr-2" />Services
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
              Available in {state.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
            {SERVICES.map((srv, idx) => (
              <Link
                key={idx}
                to={srv.path}
                className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-6 flex items-center justify-between hover:border-orange-500/40 transition-all duration-300 group"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 group-hover:text-orange-500 transition-colors">
                  {srv.name}
                </span>
                <ArrowUpRight size={14} className="text-zinc-600 group-hover:text-orange-500 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Internal Link Section */}
      <InternalLinkSection />
    </div>
  );
}
