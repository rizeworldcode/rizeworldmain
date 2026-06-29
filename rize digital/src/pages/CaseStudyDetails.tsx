import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Trophy, ChevronRight, Sparkles, Check } from 'lucide-react';
import SEO from '../components/common/SEO';
import Breadcrumbs from '../components/common/Breadcrumbs';
import InternalLinkSection from '../components/common/InternalLinkSection';
import CASE_STUDIES_DATA from '../data/caseStudies';

export default function CaseStudyDetails() {
  const { slug } = useParams();
  const study = CASE_STUDIES_DATA.find(cs => cs.slug === slug);

  if (!study) {
    return <Navigate to="/case-studies" replace />;
  }

  const creativeWorkSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": study.title,
    "description": study.desc,
    "url": `https://rizeworld.in/case-studies/${study.slug}`,
    "author": {
      "@type": "Organization",
      "name": "RizeWorld Digital"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://rizeworld.in/" },
      { "@type": "ListItem", "position": 2, "name": "Case Studies", "item": "https://rizeworld.in/case-studies" },
      { "@type": "ListItem", "position": 3, "name": study.title, "item": `https://rizeworld.in/case-studies/${study.slug}` }
    ]
  };

  const otherStudies = CASE_STUDIES_DATA.filter(cs => cs.slug !== slug);

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 text-left font-sans selection:bg-orange-500 selection:text-white">
      <SEO
        title={`${study.title} — Case Study | RizeWorld`}
        description={study.desc}
        canonicalUrl={`https://rizeworld.in/case-studies/${study.slug}`}
        schema={[creativeWorkSchema, breadcrumbSchema]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <Breadcrumbs items={[
          { name: "Case Studies", path: "/case-studies" },
          { name: study.title }
        ]} />
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-orange-500 flex items-center gap-2 mb-4">
              <Trophy className="w-4 h-4" /> {study.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-950 uppercase tracking-tighter mb-6 leading-tight">
              {study.title}
            </h1>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8">
              {study.desc}
            </p>
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 inline-flex items-baseline gap-3">
              <span className="text-4xl font-black text-orange-500">{study.stat}</span>
              <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">{study.statDesc}</span>
            </div>
          </div>
          <div className="rounded-4xl overflow-hidden shadow-md aspect-video bg-gray-100">
            <img
              src={study.img}
              alt={study.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Challenge & Solution */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Challenge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white border border-gray-200/80 rounded-[2rem] p-8 md:p-12"
          >
            <span className="text-xs font-black uppercase tracking-widest text-red-500 block mb-4">The Challenge</span>
            <p className="text-gray-600 text-sm leading-relaxed">{study.challenge}</p>
          </motion.div>

          {/* Solution */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white border border-gray-200/80 rounded-[2rem] p-8 md:p-12"
          >
            <span className="text-xs font-black uppercase tracking-widest text-green-600 block mb-4">Our Solution</span>
            <p className="text-gray-600 text-sm leading-relaxed">{study.solution}</p>
          </motion.div>
        </div>
      </section>

      {/* Results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="bg-zinc-950 text-white rounded-[2.5rem] p-8 md:p-16 border border-zinc-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.1),transparent_50%)] pointer-events-none" />
          <div className="relative z-10">
            <span className="text-xs font-black uppercase tracking-widest text-orange-500 block mb-4">
              <Sparkles className="w-4 h-4 inline mr-2" />Key Results
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-10">
              Measurable Impact
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {study.results.map((result, idx) => (
                <div key={idx} className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-6 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={16} />
                  </div>
                  <span className="text-sm font-semibold text-zinc-300">{result}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500 block mb-2">Services Used</span>
          <h2 className="text-2xl font-black text-gray-950 uppercase tracking-tight">In This Project</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {study.services.map((srv, idx) => (
            <Link
              key={idx}
              to={srv}
              className="bg-white border border-gray-200/80 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-700 hover:border-orange-500 hover:text-orange-500 transition-all flex items-center gap-2"
            >
              {srv.split('/').pop()?.replace(/-/g, ' ')}
              <ChevronRight size={12} />
            </Link>
          ))}
        </div>
      </section>

      {/* Other Case Studies */}
      {otherStudies.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-500 block mb-2">More Work</span>
            <h2 className="text-2xl font-black text-gray-950 uppercase tracking-tight">Other Case Studies</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherStudies.map((cs, idx) => (
              <Link
                key={idx}
                to={`/case-studies/${cs.slug}`}
                className="bg-white border border-gray-200/80 rounded-3xl p-6 flex items-center gap-6 hover:border-orange-500/40 hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                  <img src={cs.img} alt={cs.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="flex-1">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">{cs.category}</span>
                  <h3 className="text-sm font-black uppercase text-gray-950 group-hover:text-orange-500 transition-colors">{cs.title}</h3>
                  <span className="text-orange-500 font-black text-lg">{cs.stat}</span>
                </div>
                <ArrowUpRight size={16} className="text-gray-300 group-hover:text-orange-500 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      )}

      <InternalLinkSection />
    </div>
  );
}
