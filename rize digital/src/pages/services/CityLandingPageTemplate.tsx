import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowUpRight, 
  Search, 
  Share2, 
  Palette, 
  Edit3, 
  Award, 
  Mail, 
  MessageSquare, 
  ChevronRight, 
  Phone, 
  MapPin, 
  Sparkles, 
  Check, 
  Quote
} from 'lucide-react';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';

interface CityContent {
  city: string;
  title: string;
  metaDescription: string;
  heroHeadline: string;
  heroSubtitle: string;
  aboutHeadline: string;
  aboutText1: string;
  aboutText2: string;
  aboutImg: string;
  benefits: string[];
  faqs: { question: string; answer: string }[];
  localSchemaAddress: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  phone: string;
  email: string;
}

export default function CityLandingPageTemplate({ data }: { data: CityContent }) {
  const [activeStep, setActiveStep] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `RizeWorld Digital Marketing Pvt Ltd - ${data.city}`,
    "image": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
    "@id": window.location.href,
    "url": window.location.href,
    "telephone": data.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": data.localSchemaAddress.streetAddress,
      "addressLocality": data.localSchemaAddress.addressLocality,
      "addressRegion": data.localSchemaAddress.addressRegion,
      "postalCode": data.localSchemaAddress.postalCode,
      "addressCountry": data.localSchemaAddress.addressCountry
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "27.6050538",
      "longitude": "76.6215195"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": data.faqs.map(faq => ({
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
        "name": "Services",
        "item": "https://rizeworld.in/services"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `Digital Marketing Agency in ${data.city}`,
        "item": window.location.href
      }
    ]
  };

  const SERVICES_LIST = [
    {
      title: "Digital Marketing",
      desc: `Comprehensive campaigns designed to establish presence and drive growth in ${data.city}.`,
      tags: ["Strategy", "Growth", "Analytics"],
      icon: Sparkles,
      path: "/services/digital-marketing"
    },
    {
      title: "Search Engine Optimization",
      desc: `Rank on the first page of Google in ${data.city}. We focus on technical audits, keyword optimization, and link building.`,
      tags: ["On-Page SEO", "Link Building", "Technical Audits"],
      icon: Search,
      path: "/services/seo"
    },
    {
      title: "Social Media Marketing",
      desc: "Drive direct audience interaction and build community loyalty on Instagram, Facebook, and LinkedIn.",
      tags: ["Creative Copy", "Grid Curation", "Community"],
      icon: Share2,
      path: "/services/social-media-marketing"
    },
    {
      title: "Paid Ads (PPC)",
      desc: "Instant lead generation and high conversion rates through targeted Google Ads, Meta Ads, and LinkedIn campaigns.",
      tags: ["Google Ads", "Meta Ads", "A/B Testing"],
      icon: Palette,
      path: "/services/paid-ads"
    },
    {
      title: "Web Development",
      desc: "Stunning, high-performance, and responsive custom websites designed to convert visitors into loyal clients.",
      tags: ["Custom Coding", "Fast Speeds", "UI/UX"],
      icon: Edit3,
      path: "/services/web-development"
    },
    {
      title: "Content Marketing",
      desc: "Engage your prospect pipeline with authority-building blogs, infographics, and email campaigns.",
      tags: ["Copywriting", "Email Lists", "Analytics"],
      icon: Award,
      path: "/services/content-marketing"
    }
  ];

  const STEPS = [
    {
      num: "1",
      title: "Consultation & Discovery",
      desc: `We analyze your business goals, local competition in ${data.city}, and existing digital assets to map opportunities.`,
      details: ["Competitor Analysis", "Audit & Benchmarking", "Strategy Mapping"]
    },
    {
      num: "2",
      title: "Implementation & Launch",
      desc: "We build targeted SEO campaigns, design high-converting landing pages, and launch highly optimized ad sets.",
      details: ["Ad Creative Design", "On-Page SEO Execution", "Conversion Setup"]
    },
    {
      num: "3",
      title: "Data-Driven Growth Loop",
      desc: "We monitor performance daily, continuously testing ad copy, landing pages, and search ranks to scale conversion growth.",
      details: ["Weekly KPI Audits", "Continuous A/B Tests", "Programmatic Scaling"]
    }
  ];

  const TESTIMONIALS = [
    {
      quote: `RizeWorld transformed our online reach. Their tailored digital marketing solutions helped us capture high-intent leads in ${data.city} within the first three months.`,
      author: "Rahul Sharma",
      role: "Founder, local enterprise",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120"
    },
    {
      quote: "Absolute professionals. Their communication is clear, their processes are fully transparent, and the return on investment of our paid ad spend has exceeded expectations.",
      author: "Pooja Mehta",
      role: "Marketing Director",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120"
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 overflow-hidden text-left font-sans selection:bg-orange-500 selection:text-white">
      <SEO 
        title={data.title}
        description={data.metaDescription}
        schema={[localBusinessSchema, faqSchema, breadcrumbSchema]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <Breadcrumbs items={[
          { name: "Services", path: "/services" },
          { name: `Agency in ${data.city}` }
        ]} />
      </div>
      
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr_1fr] gap-6 items-stretch">
          
          {/* Left Collage Block */}
          <div className="flex flex-col gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-orange-100/70 border border-orange-200/60 rounded-4xl p-8 flex flex-col justify-center h-auto min-h-[180px] shadow-xs relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-200/30 rounded-full blur-2xl -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-500" />
              <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest block mb-3">Targeted Growth</span>
              <p className="text-gray-800 text-sm leading-relaxed font-semibold">
                Elevating brands with custom marketing strategies that increase search rankings and conversion metrics.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="rounded-4xl overflow-hidden aspect-video bg-gray-200 border border-gray-200 shadow-sm relative group cursor-pointer"
            >
              <div className="absolute inset-0 bg-orange-950/10 group-hover:bg-transparent z-10 transition-colors duration-300" />
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600" 
                alt="team strategy session" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </motion.div>
          </div>

          {/* Center Main Content Block */}
          <div className="flex flex-col gap-6 justify-between">
            <motion.div 
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-white border border-gray-200/80 rounded-[2.5rem] p-8 md:p-12 shadow-sm flex flex-col justify-center grow relative overflow-hidden"
            >
              <span className="text-orange-500 font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-1.5">
                <Sparkles size={14} className="animate-pulse" /> Certified Digital Marketing Partner
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-[3.2rem] font-black text-gray-950 leading-[1.05] uppercase tracking-tighter mb-6">
                {data.heroHeadline}
              </h1>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-xl">
                {data.heroSubtitle}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="bg-white border border-gray-200/80 rounded-4xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <p className="text-gray-500 text-xs font-semibold max-w-sm text-center sm:text-left leading-relaxed">
                Expert local search optimization, content execution, and ROI-driven ad management.
              </p>
              <div className="flex items-center gap-3.5 shrink-0">
                <div className="flex -space-x-3">
                  {[
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80",
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=80"
                  ].map((avatar, i) => (
                    <img key={i} src={avatar} alt="user" className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-xs" />
                  ))}
                </div>
                <div>
                  <span className="text-base font-black text-gray-950 block leading-none">100+</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Success Stories</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Stats Column */}
          <div className="flex flex-col gap-6">
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-sky-50 border border-sky-100 rounded-4xl p-8 flex flex-col justify-center h-full min-h-[160px] shadow-xs hover:-translate-y-1 transition-transform duration-300"
            >
              <h4 className="text-sm font-black text-sky-950 uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-sky-500 rounded-full" /> Experts
              </h4>
              <p className="text-sky-900/85 text-2xl font-black mb-1">70+</p>
              <p className="text-sky-900/70 text-xs font-semibold uppercase tracking-wider">
                Digital Specialists
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="bg-yellow-50/70 border border-yellow-100 rounded-4xl p-8 flex flex-col justify-center h-full min-h-[160px] shadow-xs hover:-translate-y-1 transition-transform duration-300"
            >
              <h4 className="text-sm font-black text-yellow-950 uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" /> Projects
              </h4>
              <p className="text-yellow-900/85 text-2xl font-black mb-1">150+</p>
              <p className="text-yellow-900/70 text-xs font-semibold uppercase tracking-wider">
                Completed Deliveries
              </p>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 2. ABOUT CITY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white border border-gray-200/80 rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.02),transparent_60%)] pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-500">WHO WE ARE</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-950 uppercase tracking-tight leading-tight">
              {data.aboutHeadline}
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              {data.aboutText1}
            </p>
            <p className="text-gray-500 text-sm leading-relaxed">
              {data.aboutText2}
            </p>

            <div className="pt-4 flex flex-wrap gap-3">
              {data.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-stone-50 border border-gray-200/80 px-4 py-2 rounded-full text-xs font-bold text-gray-900 uppercase">
                  <Check size={14} className="text-orange-500" /> {benefit}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-4xl overflow-hidden shadow-md aspect-video lg:aspect-square relative group">
            <img 
              src={data.aboutImg} 
              alt={`RizeWorld office in ${data.city}`} 
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
            />
          </div>
        </div>
      </section>

      {/* 3. DIGITAL MARKETING SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500">SERVICES LIST</span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-950 uppercase tracking-tight mt-1 mb-6 leading-tight">
            Our Digital Solutions in {data.city}
          </h2>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            We deliver result-focused advertising campaigns tailored to capture local search visibility and drive business conversions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES_LIST.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <motion.div
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                key={idx}
                className="bg-white border border-gray-200/80 rounded-4xl p-8 flex flex-col justify-between group hover:border-orange-500/40 hover:shadow-[0_20px_50px_rgba(249,115,22,0.08)] transition-all duration-500 relative overflow-hidden cursor-pointer"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-orange-500/15 text-orange-500 flex items-center justify-center mb-8 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                    <Icon size={24} />
                  </div>

                  <h3 className="text-xl font-black uppercase text-gray-950 mb-3 group-hover:text-orange-500 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 h-12 overflow-hidden line-clamp-2">
                    {srv.desc}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-8">
                    {srv.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] font-black uppercase tracking-wide text-gray-500 bg-stone-100 px-3.5 py-1.5 rounded-full group-hover:bg-orange-500/5 group-hover:text-orange-600 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-5 flex items-center justify-between">
                  <Link to={srv.path} className="text-[10px] font-black tracking-widest text-gray-400 group-hover:text-orange-500 uppercase flex items-center gap-1.5 transition-colors">
                    Learn More <ArrowUpRight size={14} />
                  </Link>
                  <Link to="/contact" className="text-[10px] font-bold text-orange-500 hover:text-orange-600 uppercase transition-colors">
                    Proposal
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="bg-zinc-950 text-white rounded-[2.5rem] py-20 px-6 sm:px-12 max-w-7xl mx-auto mb-24 relative overflow-hidden border border-zinc-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.1),transparent_50%)] pointer-events-none" />
        <div className="max-w-3xl mb-16 relative z-10">
          <span className="text-xs font-black uppercase tracking-widest text-orange-500">WHY RIZEWORLD</span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mt-2 mb-6">
            Driving Digital Domination
          </h2>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
            We combine target audience mapping, content curation, and real-time optimization to build campaigns that deliver maximum lead conversion metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {[
            {
              title: "100% Transparent Tracking",
              desc: "Get granular weekly and monthly dashboards tracking your exact search visibility growth, leads, and conversion costs."
            },
            {
              title: "Custom Local Strategy",
              desc: `No cookie-cutter plans. We analyze the specific market behaviors in ${data.city} to optimize search capture.`
            },
            {
              title: "Expert Certified Agency Team",
              desc: "Work directly with digital strategists, graphic designers, copywriters, and search engineers committed to business growth."
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-zinc-900 border border-zinc-800/80 rounded-3xl p-8 space-y-4">
              <span className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold text-sm">
                0{idx + 1}
              </span>
              <h4 className="text-lg font-black uppercase text-white">{item.title}</h4>
              <p className="text-zinc-400 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PROCESS WORKFLOW */}
      <section className="bg-white border-t border-b border-gray-200 py-24 mb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-16 items-start mb-20">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-orange-500 block mb-3">OUR APPROACH</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-950 uppercase tracking-tight">
                OUR SOLUTION <br />PROCESS
              </h2>
            </div>
            <div>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                Our systematic methodology takes the guesswork out of digital marketing, ensuring your advertising budgets deliver maximum performance.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-12 items-start">
            <div className="flex flex-col gap-3">
              {STEPS.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full flex items-center justify-between p-6 rounded-4xl border text-left transition-all duration-300 cursor-pointer ${
                    activeStep === idx 
                      ? 'border-orange-500/40 bg-orange-500/5 text-orange-500 shadow-xs' 
                      : 'border-gray-200/80 bg-stone-50 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-sm font-black ${activeStep === idx ? 'text-orange-500' : 'text-gray-400'}`}>
                      0{step.num}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider">{step.title}</span>
                  </div>
                  <ChevronRight size={16} className={`transition-transform duration-300 ${activeStep === idx ? 'rotate-90 text-orange-500' : 'text-gray-400'}`} />
                </button>
              ))}
            </div>

            <div className="bg-stone-50 border border-gray-200/80 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden min-h-[340px] flex flex-col justify-between shadow-xs">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.03),transparent_60%)] pointer-events-none" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="relative z-10"
                >
                  <span className="text-8xl font-black text-gray-200/80 absolute right-0 top-0 select-none leading-none">
                    0{STEPS[activeStep].num}
                  </span>

                  <h3 className="text-2xl md:text-3xl font-black uppercase text-gray-950 mb-4 pr-24 leading-tight">
                    {STEPS[activeStep].title}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8 max-w-xl">
                    {STEPS[activeStep].desc}
                  </p>

                  <div className="border-t border-gray-200 pt-8 mt-4">
                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Key Focus Points</h5>
                    <div className="flex flex-wrap gap-4">
                      {STEPS[activeStep].details.map((detail, i) => (
                        <div key={i} className="flex items-center gap-2.5 bg-white border border-gray-200/80 py-3 px-6 rounded-full shadow-2xs">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-900">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="bg-stone-100 py-24 border-t border-b border-gray-200 mb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-500">CLIENT FEEDBACK</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-950 uppercase tracking-tight mt-1 mb-6 leading-tight">
              What local business <br />owners say.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 items-center">
            <div className="bg-white border border-gray-200/80 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-xs min-h-[280px] flex flex-col justify-between">
              <Quote className="absolute right-8 top-8 text-orange-500/10 w-24 h-24 pointer-events-none" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed font-medium mb-8 pr-12 italic">
                    "{TESTIMONIALS[activeTestimonial].quote}"
                  </p>
                  
                  <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
                    <img 
                      src={TESTIMONIALS[activeTestimonial].avatar} 
                      alt={TESTIMONIALS[activeTestimonial].author} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-orange-500/20"
                    />
                    <div>
                      <h4 className="text-sm font-black text-gray-950 uppercase">{TESTIMONIALS[activeTestimonial].author}</h4>
                      <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">{TESTIMONIALS[activeTestimonial].role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex flex-col gap-3">
              {TESTIMONIALS.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`w-full flex items-center justify-between p-5 rounded-3xl border text-left transition-all duration-300 cursor-pointer ${
                    activeTestimonial === idx 
                      ? 'border-orange-500/40 bg-orange-500/5 text-orange-500' 
                      : 'border-gray-200/80 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider">{t.author}</span>
                  <ChevronRight size={16} className={`transition-transform duration-300 ${activeTestimonial === idx ? 'rotate-90 text-orange-500' : 'text-gray-400'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQS SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-24">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500">FAQ</span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-950 uppercase tracking-tight mt-2">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {data.faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx}
                className="bg-white border border-gray-200/85 rounded-3xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer hover:bg-stone-50/50"
                >
                  <span className="text-sm sm:text-base font-bold text-gray-950 uppercase tracking-tight pr-6">
                    {faq.question}
                  </span>
                  <ChevronRight 
                    size={18} 
                    className={`text-orange-500 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-90' : ''}`} 
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-6 pt-0 border-t border-gray-100 text-gray-600 text-sm leading-relaxed">
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

      {/* 8. CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-950 text-white rounded-[2.5rem] p-8 md:p-16 flex flex-col lg:flex-row lg:items-stretch justify-between gap-12 relative overflow-hidden shadow-2xl border border-zinc-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_50%)] pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl flex flex-col justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-orange-500 block mb-4">LET’S TALK</span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-none mb-6">
                Grow Your Business Today
              </h2>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
                Connect with our certified digital marketing experts to plan a tailored local search campaign for your brand.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-zinc-800">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Email Address</span>
                  <a href={`mailto:${data.email}`} className="text-sm font-semibold hover:text-orange-500 transition-colors">{data.email}</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Phone Number</span>
                  <a href={`tel:${data.phone}`} className="text-sm font-semibold hover:text-orange-500 transition-colors">{data.phone}</a>
                </div>
              </div>

              <div className="flex items-start gap-4 md:col-span-2">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Our Location</span>
                  <span className="text-sm font-semibold text-zinc-300">
                    {data.localSchemaAddress.streetAddress}, {data.localSchemaAddress.addressLocality}, {data.localSchemaAddress.addressRegion} {data.localSchemaAddress.postalCode}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 shrink-0 flex flex-col sm:flex-row lg:flex-col lg:justify-center gap-4 min-w-[240px]">
            <Link 
              to="/contact" 
              className="inline-flex items-center justify-center gap-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider py-4.5 px-8 rounded-full transition-all shadow-md shadow-orange-500/10 group cursor-pointer"
            >
              Get In Touch <MessageSquare size={14} className="group-hover:scale-105 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
