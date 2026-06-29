import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
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
  Quote
} from 'lucide-react';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import AreasWeServe from '../../components/common/AreasWeServe';

const LOGOS_DATA = [
  { src: "/logos/7.png", bg: "bg-white" },
  { src: "/logos/Old Rao 100x41.png", bg: "bg-zinc-100" },
  { src: "/logos/m.png", bg: "bg-white" },
  { src: "/logos/yga.png", bg: "bg-white" },
  { src: "/logos/logo1/bhavikdairy_14050326_165157844.jpg.jpeg_nobg.png", bg: "bg-blue-50" },
  { src: "/logos/logo1/dwps_alwar_14050326_165735543.jpg.jpeg_nobg2.png", bg: "bg-white" },
  { src: "/logos/logo1/golden_fitness_studio_14050326_165901083.jpg.jpeg_nobg2.png", bg: "bg-amber-100" },
  { src: "/logos/logo1/hydrowash___14050326_165141258.jpg-removebg-preview.png", bg: "bg-[#27272a]" },
  { src: "/logos/logo1/jain_event_planner__14050326_165108726.jpg-removebg-preview.png", bg: "bg-black" },
  { src: "/logos/logo1/kafesa_by_tijacafe_14050326_165226870.jpg-removebg-preview.png", bg: "bg-amber-50" },
  { src: "/logos/logo1/mobile_master_alwar_14050326_165925798.jpg.jpeg_nobg2.png", bg: "bg-white" },
  { src: "/logos/logo1/rj02_hotel_14050326_170134229.jpg-removebg-preview (1).png", bg: "bg-stone-900" },
  { src: "/logos/logo1/roastro_cafe_14050326_165747073.jpg-removebg-preview (1).png", bg: "bg-[#451a03]" },
  { src: "/logos/logo1/saniya__hospital_14050326_165809565.jpg-removebg-preview.png", bg: "bg-teal-50" },
  { src: "/logos/logo1/shivaura_in_14050326_165054553.jpg-removebg-preview.png", bg: "bg-[#2d3748]" },
  { src: "/logos/logo1/sigdiresort_14050326_165131449.jpg-removebg-preview.png", bg: "bg-[#1c1917]" },
  { src: "/logos/logo1/zonirazjewel_14050326_165120271.jpg-removebg-preview.png", bg: "bg-black" }
];

const SERVICES_LIST = [
  {
    title: "On-Page SEO",
    desc: "Optimize your website's content, HTML tags, and structural layout to rank higher and earn more relevant traffic.",
    tags: ["Keyword Optimization", "Meta Titles & Descriptions", "Header Tags Optimization", "URL Structure", "Internal Linking", "Image Optimization"],
    icon: Search
  },
  {
    title: "Off-Page SEO",
    desc: "Build authority and high-quality link networks to improve search page credibility.",
    tags: ["Backlinks", "Guest Posts", "PR Outreach", "Brand Mentions"],
    icon: Share2
  },
  {
    title: "Technical SEO",
    desc: "Optimize site crawlability, rendering, indexation, and Core Web Vitals performance.",
    tags: ["Site Speed", "XML Sitemaps", "Schema Markup", "Crawl Budget"],
    icon: Palette
  },
  {
    title: "Local SEO",
    desc: "Dominate local searches and maps to drive immediate nearby foot and online traffic.",
    tags: ["Local Keywords", "Directory Listings", "Geo-targeting"],
    icon: Edit3
  },
  {
    title: "GMB SEO",
    desc: "Optimize Google My Business setups to increase local visibility and calls.",
    tags: ["GMB Profile", "Reviews Strategy", "Local Pack Rank"],
    icon: Award
  }
];

const STEPS = [
  {
    num: "1",
    title: "Website Audit & Analysis",
    desc: "We analyze your website, competitors, and current search performance to identify opportunities for growth.",
    details: ["Initial Consultation", "Competitor Analysis", "Current Performance Review"]
  },
  {
    num: "2",
    title: "SEO Strategy & Implementation",
    desc: "We develop a tailored SEO plan, including keyword optimization, on-page SEO, technical SEO fixes, and content improvements.",
    details: ["Keyword Research & Optimization", "On-Page & Technical SEO", "Content Strategy Development"]
  },
  {
    num: "3",
    title: "Monitor, Report & Optimize",
    desc: "We continuously track rankings, traffic, and conversions, making data-driven adjustments to maximize your search visibility and ROI.",
    details: ["Performance Tracking & Analytics", "SEO Reporting", "Continuous Optimization"]
  }
];

const TESTIMONIALS = [
  {
    quote: "RizeWorld transformed our online presence completely. Their SEO strategies helped Shiivaura rank on the first page within just a few months. Highly recommended!",
    author: "Harsh Tiwari",
    role: "Founder, Shiivaura",
    avatar: "/video/harsh tiwari.jpeg"
  },
  {
    quote: "Working with RizeWorld was a game changer for 7One. Their digital marketing expertise and dedication to results truly sets them apart from the rest.",
    author: "Mr. Ajit Singh",
    role: "Founder, 7One",
    avatar: "/video/k sir.jpg"
  },
  {
    quote: "The team at RizeWorld helped Mansukh Restaurant reach new customers through smart social campaigns. Our footfall increased noticeably after partnering with them.",
    author: "Mr. Sajan Chandel",
    role: "Owner, Mansukh Restaurant",
    avatar: "/video/mansukhhh.jpg"
  },
  {
    quote: "RizeWorld's approach is professional and result-driven. They understood our brand identity at Old Rao and built a strategy that genuinely delivered growth.",
    author: "Mr. Rahul Bhugra",
    role: "Owner, Old Rao",
    avatar: "/video/Untitled-1.jpg"
  },
  {
    quote: "I'm very satisfied with RizeWorld's services. They helped Sushanti Dhyanyoga build a strong digital identity that resonates with our community.",
    author: "Mr. Neeraj Lamba",
    role: "Founder, Sushanti Dhyanyoga",
    avatar: "/video/nk s.jpg"
  }
];

export default function SearchEngineOptimization() {
  const navigate = useNavigate();
  const repeatedLogos = [...LOGOS_DATA, ...LOGOS_DATA, ...LOGOS_DATA];
  
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Search Engine Optimization",
    "provider": {
      "@type": "Organization",
      "name": "RizeWorld Digital",
      "url": "https://rizeworld.in/"
    },
    "description": "Professional Search Engine Optimization services. Dominate search rankings, drive high-intent organic visitors, build authoritative backlinks, and audit technical SEO."
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
        "name": "Search Engine Optimization",
        "item": "https://rizeworld.in/services/seo"
      }
    ]
  };

  const [activeStep, setActiveStep] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 overflow-hidden text-left font-sans selection:bg-orange-500 selection:text-white">
      
      <SEO 
        title="SEO Optimization & Search Rankings | RizeWorld"
        description="Professional Search Engine Optimization services. Dominate search rankings, drive high-intent organic visitors, build authoritative backlinks, and audit technical SEO."
        canonicalUrl="https://rizeworld.in/services/seo"
        schema={[serviceSchema, breadcrumbSchema]}
      />
      
      {/* 1. BREADCRUMBS & NAVIGATION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-900 hover:text-orange-500 transition-colors group cursor-pointer"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <Breadcrumbs items={[{ name: "Services", path: "/services" }, { name: "Search Engine Optimization" }]} />
      </div>

      {/* 2. HERO COLLAGE (Matches DigitiFlow Layout with project's orange theme) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_2.2fr_1fr] gap-6 items-stretch">
          
          {/* LEFT COLLAGE BLOCK */}
          <div className="flex flex-col gap-6">
            {/* Strategy Banner Card */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-orange-100/70 border border-orange-200/60 rounded-4xl p-8 flex flex-col justify-center h-auto min-h-[180px] shadow-xs relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-200/30 rounded-full blur-2xl -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-500" />
              <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest block mb-3">Who We Are</span>
              <p className="text-gray-800 text-sm leading-relaxed font-semibold">
                RizeWorld – Empowering Brands Through SEO Excellence
              </p>
            </motion.div>

            {/* Visual Team Card */}
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

          {/* CENTER MAIN CONTENT BLOCK */}
          <div className="flex flex-col gap-6 justify-between">
            {/* Title Solution Card */}
            <motion.div 
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-white border border-gray-200/80 rounded-[2.5rem] p-8 md:p-12 shadow-sm flex flex-col justify-center grow relative overflow-hidden"
            >
              <span className="text-orange-500 font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-1.5">
                <Sparkles size={14} className="animate-pulse" /> Offer a wide range of services
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-black text-gray-950 leading-[1.05] uppercase tracking-tighter mb-6">
                Search Engine <br />
                Optimization <span className="relative inline-block px-4 py-1 mx-1 mt-1">
                  Provider
                  <svg className="absolute inset-0 w-full h-full text-orange-500" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M 5, 50 C 5, 20 95, 20 95, 50 C 95, 80 5, 80 5, 50 Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="300" strokeDashoffset="0" className="animate-[dash_2s_ease-in-out_infinite]" />
                  </svg>
                </span>
              </h1>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-xl">
                We help businesses improve search rankings, drive organic traffic, and maximize online visibility.
              </p>
            </motion.div>

            {/* Happy Clients Badge Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="bg-white border border-gray-200/80 rounded-4xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <p className="text-gray-500 text-xs font-semibold max-w-sm text-center sm:text-left leading-relaxed">
                Customized SEO teams to navigate search updates with precision and strategic depth.
              </p>
              <div className="flex items-center gap-3.5 shrink-0">
                <div className="flex -space-x-3">
                  {[
                    "/video/harsh tiwari.jpeg",
                    "/video/k sir.jpg",
                    "/video/mansukhhh.jpg",
                    "/video/Untitled-1.jpg",
                    "/video/nk s.jpg"
                  ].map((avatar, i) => (
                    <img key={i} src={avatar} alt="user" className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-xs" />
                  ))}
                </div>
                <div>
                  <span className="text-base font-black text-gray-950 block leading-none">16+</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">World-wide Clients</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT STATS COLUMN */}
          <div className="flex flex-col gap-6">
            {/* Experts Card */}
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
                Professional Experts
              </p>
            </motion.div>

            {/* Projects Card */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="bg-yellow-50/70 border border-yellow-100 rounded-4xl p-8 flex flex-col justify-center h-full min-h-[160px] shadow-xs hover:-translate-y-1 transition-transform duration-300"
            >
              <h4 className="text-sm font-black text-yellow-950 uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" /> Projects
              </h4>
              <p className="text-yellow-900/85 text-2xl font-black mb-1">20+</p>
              <p className="text-yellow-900/70 text-xs font-semibold uppercase tracking-wider">
                Projects Complete
              </p>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 3. LOVED BY TEAMS LOGO MARQUEE */}
      <section className="py-12 bg-[#ffffff] border-t border-b border-gray-200 py-8 flex flex-col items-center overflow-hidden shadow-sm relative">
        <style>
          {`
            @keyframes marquee-brands {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee-brands {
              animation: marquee-brands 30s linear infinite;
            }
          `}
        </style>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Loved by teams around the world</span>
        </div>
        <div className="flex-1 overflow-hidden mask-image-horizontal w-full">
          <div className="flex w-max animate-marquee-brands items-center">
            {repeatedLogos.map((item, idx) => (
              <div key={idx} className={`w-56 h-24 mx-4 flex items-center justify-center shrink-0 p-1 rounded-4xl shadow-sm border border-gray-100 overflow-hidden ${item.bg}`}>
                <img 
                  src={item.src} 
                  alt="Client Logo" 
                  className="max-h-full max-w-full object-contain scale-110 transition-transform duration-300 hover:scale-125 transform-[translateZ(0)] backface-hidden will-change-transform [image-rendering:-webkit-optimize-contrast]" 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SIX CORE SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500">Solution Provide</span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-950 uppercase tracking-tight mt-1 mb-6 leading-tight">
            Delivering Innovative SEO Growth.
          </h2>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            We implement effective SEO strategies to boost your website’s visibility, drive organic traffic, and improve search rankings.
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

                  {/* Horizontal Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {srv.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] font-black uppercase tracking-wide text-gray-500 bg-stone-100 px-3.5 py-1.5 rounded-full group-hover:bg-orange-500/5 group-hover:text-orange-600 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 5. PROCESS TIMELINE WORKFLOW */}
      <section className="bg-white border-t border-b border-gray-200 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-16 items-start mb-20">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-orange-500 block mb-3">Our Solution Process</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-950 uppercase tracking-tight">
                3 STEPS WE HAVE <br />FOLLOWING.
              </h2>
            </div>
            <div>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                Delivering effective SEO strategies to boost your website’s visibility, drive organic traffic, and improve search rankings.
              </p>
            </div>
          </div>

          {/* Interactive Steps Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-12 items-start">
            
            {/* Step Selection Panel */}
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

            {/* Step Content Details Panel */}
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

      {/* Testimonials Section */}
      <section className="bg-stone-100 py-24 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-500">CLIENT FEEDBACK</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-950 uppercase tracking-tight mt-1 mb-6 leading-tight">
              Feedback plays <br />a crucial role.
            </h2>
            <p className="text-gray-500 text-sm">
              Offer a wide range of services to help businesses establish.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 items-center">
            
            {/* Active Testimonial Card */}
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

            {/* Testimonial Nav list */}
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

      {/* Areas We Serve */}
      <AreasWeServe />

      {/* 6. DYNAMIC LET'S TALK PANEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-gray-950 text-white rounded-[2.5rem] p-8 md:p-16 flex flex-col lg:flex-row lg:items-stretch justify-between gap-12 relative overflow-hidden shadow-2xl border border-zinc-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_50%)] pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl flex flex-col justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-orange-500 block mb-4">LET’S TALK</span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-none mb-6">
                Connect Us
              </h2>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
                Reach out today to discuss your project and discover how we can grow your brand online.
              </p>
            </div>

            {/* Direct Contact Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-zinc-800">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Email Address</span>
                  <a href="mailto:hr.rizeworld@gmail.com" className="text-sm font-semibold hover:text-orange-500 transition-colors">hr.rizeworld@gmail.com</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Phone Number</span>
                  <a href="tel:+919024615510" className="text-sm font-semibold hover:text-orange-500 transition-colors">+91 90246 15510</a>
                </div>
              </div>

              <div className="flex items-start gap-4 md:col-span-2">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Our Location</span>
                  <span className="text-sm font-semibold text-zinc-300">C-198, near Telco Circle, UIT colony, Shalimar Nagar, Alwar, Rajasthan 301001, India</span>
                </div>
              </div>

              <div className="flex items-center gap-4 md:col-span-2 pt-4 border-t border-zinc-800/50">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mr-2">Follow Us</span>
                <div className="flex gap-3">
                  <a href="https://www.instagram.com/rizeworld?igsh=MWYxOGs5NGhhdnNsNA==" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-orange-500 text-zinc-400 hover:text-white flex items-center justify-center transition-all duration-300">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  </a>
                  <a href="https://www.facebook.com/share/1BcNrvpmuJ/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-orange-500 text-zinc-400 hover:text-white flex items-center justify-center transition-all duration-300">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </a>
                  <a href="https://www.linkedin.com/company/rizeworld/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-orange-500 text-zinc-400 hover:text-white flex items-center justify-center transition-all duration-300">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                  </a>
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
            <a 
              href="mailto:hr.rizeworld@gmail.com" 
              className="inline-flex items-center justify-center gap-2.5 bg-zinc-800 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider py-4.5 px-8 rounded-full transition-all cursor-pointer"
            >
              Contact Now <Mail size={14} />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
