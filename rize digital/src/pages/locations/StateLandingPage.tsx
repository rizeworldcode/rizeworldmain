import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowUpRight, Building2, Briefcase } from 'lucide-react';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import InternalLinkSection from '../../components/common/InternalLinkSection';
import STATES from '../../data/states';
import citiesData from '../../data/cities.json';

const CITY_NAME_MAP: Record<string, string> = {};
citiesData.forEach((c) => { CITY_NAME_MAP[c.slug] = c.name; });

export default function StateLandingPage() {
  const { stateSlug } = useParams();
  const state = STATES.find(s => s.slug === stateSlug);

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
          {stateCities.map((city, idx) => (
            <motion.div
              key={city.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <Link
                to={`/service/digital-marketing-agency-in-${city.slug}`}
                className="bg-white border border-gray-200/80 rounded-3xl p-8 flex items-center gap-4 hover:border-orange-500/40 hover:shadow-lg transition-all duration-300 group cursor-pointer block"
              >
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 shrink-0">
                  <MapPin size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-black uppercase tracking-wider text-gray-950 group-hover:text-orange-500 transition-colors">
                    {city.name}
                  </h3>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    View Agency →
                  </span>
                </div>
                <ArrowUpRight size={16} className="text-gray-300 group-hover:text-orange-500 transition-colors shrink-0" />
              </Link>
            </motion.div>
          ))}
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
