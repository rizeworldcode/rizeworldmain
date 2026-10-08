import { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowUpRight, Building2, Briefcase, ChevronDown, CheckCircle2, Target, Users } from 'lucide-react';
import { RiAwardLine, RiCompassDiscoverLine, RiQuestionAnswerLine } from 'react-icons/ri';
import { HiMiniGlobeAmericas } from 'react-icons/hi2';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import InternalLinkSection from '../../components/common/InternalLinkSection';
import STATES from '../../data/states';
import citiesData from '../../data/cities.json';
import { STATE_CUSTOM_CONTENT } from '../../data/stateContent';

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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!state) {
    return <Navigate to="/locations" replace />;
  }

  const customContent = STATE_CUSTOM_CONTENT[state.slug];

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

  const faqSchema = customContent?.faqs && customContent.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": customContent.faqs.slice(0, 6).map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  } : null;

  const SERVICES = [
    { name: "Digital Marketing", path: "/services/digital-marketing" },
    { name: "SEO", path: "/services/seo" },
    { name: "Social Media Marketing", path: "/services/social-media-marketing" },
    { name: "Paid Ads (PPC)", path: "/services/paid-ads" },
    { name: "Web Development", path: "/services/web-development" },
    { name: "Content Marketing", path: "/services/content-marketing" },
  ];

  const seoTitle = customContent?.heroHeadline 
    ? `${customContent.heroHeadline} | RizeWorld`
    : `Digital Marketing Agency in ${state.name} | RizeWorld`;

  const seoDesc = customContent?.heroDescription
    ? customContent.heroDescription
    : `RizeWorld offers premium digital marketing, SEO, paid ads, social media, and web development services across ${state.name}. Serving ${stateCities.map(c => c.name).join(', ')}.`;

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 text-left font-sans selection:bg-orange-500 selection:text-white">
      <SEO
        title={seoTitle}
        description={seoDesc}
        canonicalUrl={`https://rizeworld.in/locations/${state.slug}`}
        schema={faqSchema ? [localBusinessSchema, breadcrumbSchema, faqSchema] : [localBusinessSchema, breadcrumbSchema]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <Breadcrumbs items={[
          { name: "Locations", path: "/locations" },
          { name: state.name }
        ]} />
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-4xl mx-auto">
          <span className="text-xs font-black uppercase tracking-widest text-orange-500 flex items-center justify-center gap-2 mb-4">
            <Building2 className="w-4 h-4" /> {customContent?.eyebrow || `${state.name} Regional Hub`}
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-gray-950 uppercase tracking-tighter mb-6 leading-tight">
            {customContent?.heroHeadline || `Digital Marketing in ${state.name}`}
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
            {customContent?.heroDescription || `RizeWorld delivers localized digital marketing campaigns, SEO optimization, and custom web solutions across ${stateCities.length} cities in ${state.name}.`}
          </p>
        </div>
      </section>

      {/* Cities Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500 block mb-2">Our Presence</span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-950 uppercase tracking-tight mb-3">
            Cities We Serve in {state.name}
          </h2>
          {customContent?.presenceSubtitle && (
            <p className="text-gray-600 text-sm md:text-base max-w-2xl leading-relaxed">
              {customContent.presenceSubtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stateCities.map((city, idx) => {
            const isHovered = hoveredCity === city.slug;
            const citySpecificDesc = customContent?.cityDescriptions?.[city.slug];
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
                  className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-orange-500/60 hover:shadow-lg transition-all duration-300 group cursor-pointer block relative overflow-hidden h-full min-h-[160px]"
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
                        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/40" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 shrink-0">
                        <MapPin size={20} />
                      </div>
                      <ArrowUpRight size={18} className="text-gray-300 group-hover:text-orange-500 transition-colors" />
                    </div>

                    <h3 className="text-base font-black uppercase tracking-wider text-gray-950 group-hover:text-orange-500 transition-colors mb-2 relative z-10">
                      {city.name}
                    </h3>

                    {citySpecificDesc ? (
                      <p className="text-gray-600 text-xs leading-relaxed relative z-10 mb-4">
                        {citySpecificDesc}
                      </p>
                    ) : (
                      <p className="text-gray-400 text-[11px] leading-relaxed relative z-10 mb-4">
                        Comprehensive localized digital marketing & SEO services for businesses in {city.name}.
                      </p>
                    )}
                  </div>

                  <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest group-hover:translate-x-1 transition-transform relative z-10 flex items-center gap-1">
                    View Agency Page →
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Market Fit Section */}
      {customContent?.marketFit && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="bg-white border border-gray-200/85 rounded-[2.5rem] p-8 md:p-14 shadow-2xs">
            <span className="text-xs font-black uppercase tracking-widest text-orange-500 flex items-center gap-2 mb-4">
              <Target className="w-4 h-4" /> Market Alignment
            </span>
            <h2 className="text-2xl md:text-4xl font-black text-gray-950 uppercase tracking-tight mb-8 max-w-2xl">
              {customContent.marketFit.headline}
            </h2>
            <div className="space-y-4 max-w-4xl text-gray-600 text-sm md:text-base leading-relaxed">
              {customContent.marketFit.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Section */}
      {customContent?.whyChoose && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-orange-500 flex items-center justify-center gap-2 mb-3">
              <RiAwardLine className="w-4 h-4" /> Strategic Advantage
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-950 uppercase tracking-tight mb-4">
              {customContent.whyChoose.headline}
            </h2>
            {customContent.whyChoose.description && (
              <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                {customContent.whyChoose.description}
              </p>
            )}
          </div>

          {customContent.whyChoose.points && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {customContent.whyChoose.points.map((pt, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200/85 rounded-3xl p-8 hover:border-orange-500/50 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mb-6 font-black text-sm">
                    0{i + 1}
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-gray-950 mb-3">
                    {pt.title}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                    {pt.desc}
                  </p>
                </div>
              ))}
            </div>
          )}

          {customContent.whyChoose.bullets && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {customContent.whyChoose.bullets.map((b, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200/85 rounded-2xl p-6 flex items-start gap-4 hover:border-orange-500/50 hover:shadow-sm transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={18} />
                  </div>
                  <span className="text-sm font-black text-gray-950 uppercase tracking-tight leading-snug">
                    {b}
                  </span>
                </div>
              ))}
            </div>
          )}

          {customContent.whyChoose.closingText && (
            <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-3xl mx-auto text-center mt-8 font-medium">
              {customContent.whyChoose.closingText}
            </p>
          )}
        </section>
      )}

      {/* Expansion Section */}
      {customContent?.expansionSection && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="bg-white border border-gray-200/85 rounded-[2.5rem] p-8 md:p-14 shadow-2xs">
            <span className="text-xs font-black uppercase tracking-widest text-orange-500 flex items-center gap-2 mb-4">
              <HiMiniGlobeAmericas className="w-4 h-4" /> Scalable Reach
            </span>
            <h2 className="text-2xl md:text-4xl font-black text-gray-950 uppercase tracking-tight mb-6 max-w-2xl">
              {customContent.expansionSection.headline}
            </h2>
            <div className="space-y-4 max-w-4xl text-gray-600 text-sm md:text-base leading-relaxed mb-8">
              {customContent.expansionSection.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {customContent.expansionSection.ctaText && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-6 border-t border-gray-100">
                <span className="text-sm md:text-base font-black uppercase tracking-tight text-gray-950">
                  {customContent.expansionSection.ctaText}
                </span>
                <Link
                  to={customContent.expansionSection.ctaLink || "/contact"}
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs uppercase tracking-widest px-6 py-3 rounded-full transition-colors shadow-sm w-fit cursor-pointer"
                >
                  <span>{customContent.expansionSection.ctaButton || "Let's Talk →"}</span>
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Our Approach Section */}
      {customContent?.approach && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-orange-500 flex items-center justify-center gap-2 mb-3">
              <RiCompassDiscoverLine className="w-4 h-4" /> Methodology
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-950 uppercase tracking-tight">
              {customContent.approach.headline}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {customContent.approach.steps.map((st, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200/85 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-orange-500/50 hover:shadow-md transition-all duration-300"
              >
                <div>
                  <span className="text-2xl font-black text-orange-500 block mb-4">
                    {st.number}.
                  </span>
                  <h3 className="text-base font-black uppercase tracking-tight text-gray-950 mb-3">
                    {st.title}
                  </h3>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Who We Work With Section */}
      {customContent?.whoWeWorkWith && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="bg-stone-100/70 border border-gray-200/80 rounded-[2.5rem] p-8 md:p-14">
            <div className="text-center mb-10 max-w-2xl mx-auto">
              <span className="text-xs font-black uppercase tracking-widest text-orange-500 flex items-center justify-center gap-2 mb-3">
                <Users className="w-4 h-4" /> Client Diversity
              </span>
              <h2 className="text-2xl md:text-4xl font-black text-gray-950 uppercase tracking-tight">
                {customContent.whoWeWorkWith.headline}
              </h2>
              <p className="text-gray-500 text-xs md:text-sm mt-2">
                Our digital marketing solutions can be adapted for:
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
              {customContent.whoWeWorkWith.items.map((item, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200/85 px-5 py-3 rounded-full text-xs font-black uppercase tracking-wider text-gray-800 shadow-2xs hover:border-orange-500 hover:text-orange-500 transition-colors flex items-center gap-2"
                >
                  <CheckCircle2 size={14} className="text-orange-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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

      {/* FAQs Section (Top 6 FAQs) */}
      {customContent?.faqs && customContent.faqs.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-orange-500 flex items-center justify-center gap-2 mb-3">
              <RiQuestionAnswerLine className="w-4 h-4" /> FAQs
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-950 uppercase tracking-tight mb-4">
              FAQs About Digital Marketing in {state.name}
            </h2>
            <p className="text-gray-500 text-xs md:text-sm max-w-xl mx-auto">
              Common questions answered about our coverage, timelines, and specialized strategies.
            </p>
          </div>

          <div className="space-y-4">
            {customContent.faqs.slice(0, 6).map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white border border-gray-200/85 rounded-2xl overflow-hidden shadow-2xs transition-all duration-300"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
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
      )}

      {/* CTA Section */}
      {customContent?.cta && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="bg-orange-500 text-white rounded-[2.5rem] p-8 md:p-14 text-center shadow-lg shadow-orange-500/20 relative overflow-hidden">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6">
              {customContent.cta.headline}
            </h2>
            <p className="text-orange-100 text-sm md:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
              {customContent.cta.text}
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white text-gray-950 hover:bg-gray-950 hover:text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 shadow-md cursor-pointer"
            >
              <span>{customContent.cta.buttonText}</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </section>
      )}

      {/* Internal Link Section */}
      <InternalLinkSection />
    </div>
  );
}
