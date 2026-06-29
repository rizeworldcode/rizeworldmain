import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import Breadcrumbs from '../components/common/Breadcrumbs';
import CASE_STUDIES_DATA from '../data/caseStudies';


export default function CaseStudies() {
  const caseStudiesSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": "RizeWorld Case Studies & Success Stories",
    "description": "Explore client success stories, search engine ranking results, paid ad campaigns, and customized software development audits.",
    "url": "https://rizeworld.in/case-studies"
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
        "name": "Case Studies",
        "item": "https://rizeworld.in/case-studies"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 text-left font-sans selection:bg-orange-500 selection:text-white">
      <SEO 
        title="Success Stories & Digital Case Studies | RizeWorld"
        description="Browse RizeWorld's client case studies. Review real-world outcomes for SEO audits, paid media spend, custom web development, and digital marketing."
        canonicalUrl="https://rizeworld.in/case-studies"
        schema={[caseStudiesSchema, breadcrumbSchema]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <Breadcrumbs items={[{ name: "Case Studies" }]} />
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-orange-500 flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-4 h-4" /> Portfolios of Growth
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-gray-950 uppercase tracking-tighter mb-6">
            Proven Performance. <br />
            Measurable Results.
          </h1>
          <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">
            Discover how our digital strategy, custom engineering, and search optimization frameworks translate directly into metrics that count.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {CASE_STUDIES_DATA.map((cs, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              key={idx}
              className="bg-white border border-gray-200/80 rounded-4xl overflow-hidden shadow-2xs hover:shadow-md hover:border-orange-500/20 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="aspect-video relative overflow-hidden bg-gray-100">
                  <img 
                    src={cs.img} 
                    alt={cs.title} 
                    className="w-full h-full object-cover" 
                    loading="lazy" 
                  />
                  <div className="absolute top-4 left-4 bg-gray-950/80 backdrop-blur-xs text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                    {cs.category}
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-black text-orange-500">{cs.stat}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{cs.statDesc}</span>
                  </div>

                  <h3 className="text-lg font-black uppercase text-gray-950 mb-3">{cs.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{cs.desc}</p>
                </div>
              </div>

              <div className="p-8 pt-0 mt-auto">
                <Link
                  to={`/case-studies/${cs.slug}`}
                  className="w-full inline-flex items-center justify-between border-t border-gray-100 pt-5 text-[10px] font-black tracking-widest text-orange-500 uppercase hover:text-orange-600 transition-colors cursor-pointer group"
                >
                  View Case Study
                  <div className="w-8 h-8 rounded-full bg-gray-50 text-gray-800 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                    <ArrowUpRight size={14} />
                  </div>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Counter Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-50 border border-gray-200/60 rounded-4xl p-8 flex flex-col md:flex-row justify-around gap-6 items-center text-center">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-orange-500" />
            <div className="text-left">
              <span className="text-2xl font-black text-gray-950 block leading-none">120+</span>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Active Accounts</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-orange-500" />
            <div className="text-left">
              <span className="text-2xl font-black text-gray-950 block leading-none">99.8%</span>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Customer Retainment</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-orange-500" />
            <div className="text-left">
              <span className="text-2xl font-black text-gray-950 block leading-none">4.9/5.0</span>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Client Satisfaction</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
