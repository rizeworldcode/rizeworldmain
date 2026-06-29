import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Sparkles, Building2, ArrowUpRight } from 'lucide-react';
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

export default function Locations() {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

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
        description="Explore the directory of local cities and regional hubs served by RizeWorld Digital. Connect with localized SEO and marketing support near you."
        canonicalUrl="https://rizeworld.in/locations"
        schema={[schemaMarkup, breadcrumbSchema]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <Breadcrumbs items={[{ name: "Locations" }]} />
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-orange-500 flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-4 h-4" /> Global Footprint
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-gray-950 uppercase tracking-tighter mb-6">
            Cities We Serve.
          </h1>
          <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">
            RizeWorld delivers premium marketing capabilities, search rank growth, and enterprise software engineering locally across 38 regional markets.
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
          {STATES.map((state, idx) => (
            <motion.div
              key={state.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.04 }}
            >
              <Link
                to={`/locations/${state.slug}`}
                className="bg-white border border-gray-200/85 hover:border-orange-500 p-5 rounded-2xl flex items-center justify-between transition-all duration-300 shadow-2xs cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <Building2 size={16} className="text-gray-400 group-hover:text-orange-500 transition-colors shrink-0" />
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-gray-800 group-hover:text-orange-500 transition-colors block">
                      {state.name}
                    </span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                      {state.cities.length} {state.cities.length === 1 ? 'city' : 'cities'}
                    </span>
                  </div>
                </div>
                <ArrowUpRight size={14} className="text-gray-300 group-hover:text-orange-500 transition-colors shrink-0" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
