import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Code, 
  Layers, 
  Smartphone, 
  Cpu, 
  Share2, 
  Wrench, 
  Mail, 
  MessageSquare, 
  ChevronRight,
  Phone,
  MapPin,
  Sparkles
} from 'lucide-react';
import SEO from '../../components/common/SEO';
import { LOGOS } from '../../data/logos';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import AreasWeServe from '../../components/common/AreasWeServe';

const SERVICES_LIST = [
  {
    title: "Custom Website Development",
    desc: "We build websites around your specific requirements rather than limiting the project to a pre-built template. From the page structure to custom functionality, each part is planned according to the project.",
    tags: ["Custom Architecture", "Bespoke Logic", "Scalable", "Unique UI"],
    icon: Code
  },
  {
    title: "Full-Stack Web Development",
    desc: "Our development approach can cover both the front end that users interact with and the back end that supports your website's functionality, data, and integrations.",
    tags: ["Frontend & Backend", "API Architecture", "Database Modeling", "High Performance"],
    icon: Layers
  },
  {
    title: "Responsive Development",
    desc: "Your customers may access your website from different devices. We create responsive layouts that adapt seamlessly to desktops, tablets, and mobile screens.",
    tags: ["Mobile First", "Cross-Browser", "Fluid Layouts", "Consistent UX"],
    icon: Smartphone
  },
  {
    title: "Business Web Applications",
    desc: "When a standard website isn't enough, we can develop custom web applications and functionality designed around specific business processes and user requirements.",
    tags: ["Web Portals", "Custom Dashboards", "Process Automation", "Secure Data"],
    icon: Cpu
  },
  {
    title: "API & Third-Party Integrations",
    desc: "We can connect websites with suitable third-party tools and services when your project requires additional functionality or data exchange.",
    tags: ["REST & GraphQL", "Payment Gateways", "CRM & ERP", "Data Sync"],
    icon: Share2
  },
  {
    title: "Website Improvements & Maintenance",
    desc: "Already have a website? We can work on existing projects to improve functionality, update features, fix issues, and make the platform easier to maintain.",
    tags: ["Feature Upgrades", "Speed Optimization", "Code Refactoring", "Support"],
    icon: Wrench
  }
];

const FAQS = [
  {
    question: "What is custom website development?",
    answer: "Custom website development means building a website around a business's specific goals, design requirements, features, and user experience instead of relying only on a pre-built template."
  },
  {
    question: "What does custom website development include?",
    answer: "It can include custom UI design, frontend and backend development, responsive layouts, database integration, APIs, third-party integrations, and performance optimization based on the project's requirements."
  },
  {
    question: "Why choose a custom website instead of a template?",
    answer: "A custom website provides more control over design, functionality, scalability, and user experience. It is particularly useful when standard templates cannot meet specific business requirements."
  },
  {
    question: "Can you create a website from scratch?",
    answer: "Yes. RizeWorld can develop a website from the ground up, starting with the structure and design and then building the required frontend, backend, and functionality."
  },
  {
    question: "Can custom websites be optimized for SEO?",
    answer: "Yes. A custom website can be developed with a clean structure, crawlable pages, optimized performance, proper headings, metadata, and other technical considerations that support SEO."
  },
  {
    question: "Will a custom website work on mobile devices?",
    answer: "Yes. Responsive development allows the website layout and content to adapt to different screen sizes, including smartphones, tablets, and desktops."
  }
];

const STEPS = [
  {
    num: "1",
    title: "Discovery & Planning",
    desc: "Understanding your business goals, target audience, and architecture requirements to outline an actionable development roadmap.",
    details: ["Consultation & Scoping", "Architecture Strategy", "Technical Specifications"]
  },
  {
    num: "2",
    title: "Design & Prototyping",
    desc: "Creating user-centric wireframes and interactive prototypes that ensure seamless UX and clear user journeys before coding.",
    details: ["Wireframes & Flowcharts", "Interactive UI Mockups", "Responsive Design Systems"]
  },
  {
    num: "3",
    title: "Full-Stack Development",
    desc: "Writing clean, scalable code for both frontend and backend systems, with custom API integrations and database modeling.",
    details: ["Modern Frontend Frameworks", "Robust Backend Systems", "Custom API Integrations"]
  },
  {
    num: "4",
    title: "Testing, Launch & Growth",
    desc: "Rigorous quality assurance, performance audits, and security checks before deploying your platform for live traffic.",
    details: ["QA & Cross-Device Testing", "Speed & Security Hardening", "Live Deployment & Support"]
  }
];

export default function CustomWebsiteDevelopment() {
  const navigate = useNavigate();
  const repeatedLogos = [...LOGOS, ...LOGOS, ...LOGOS];
  const [activeStep, setActiveStep] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Custom Website Development Services",
    "provider": {
      "@type": "Organization",
      "name": "RizeWorld Digital",
      "url": "https://rizeworld.in/"
    },
    "description": "Purpose-built custom websites designed around your business, users, and long-term goals with responsive full-stack architecture."
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
        "name": "Custom Website Development",
        "item": "https://rizeworld.in/services/custom-website-development"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 overflow-hidden text-left font-sans selection:bg-orange-500 selection:text-white">
      
      <SEO 
        title="Custom Website Development Services | RizeWorld"
        description="Purpose-built websites designed around your business, users, and long-term goals. RizeWorld develops responsive and scalable custom websites."
        canonicalUrl="https://rizeworld.in/services/custom-website-development"
        schema={[serviceSchema, breadcrumbSchema, faqSchema]}
      />
      
      {/* 1. BREADCRUMBS & NAVIGATION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-900 hover:text-orange-500 transition-colors group cursor-pointer"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <Breadcrumbs items={[{ name: "Services", path: "/services" }, { name: "Custom Website Development" }]} />
      </div>

      {/* 2. HERO COLLAGE */}
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
              <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest block mb-3">PLANNED STRATEGY</span>
              <p className="text-gray-800 text-sm leading-relaxed font-semibold text-justify">
                Building Custom Websites Around Your Business Requirements
              </p>
            </motion.div>

            {/* Visual Team Card */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="rounded-4xl overflow-hidden aspect-video bg-white border border-gray-200 shadow-sm relative group cursor-pointer"
            >
              <div className="absolute inset-0 bg-orange-950/5 group-hover:bg-transparent z-10 transition-colors duration-300" />
              <img 
                src="/services/custom 1.jpg.jpeg" 
                alt="Custom Website Development" 
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
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
                <Sparkles size={14} className="animate-pulse" /> Scalable Full-Stack Architecture
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-black text-gray-950 leading-[1.05] uppercase tracking-tighter mb-6">
                Custom Website <br />
                Development <span className="relative inline-block px-4 py-1 mx-1 mt-1">
                  Services
                  <svg className="absolute inset-0 w-full h-full text-orange-500" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M 5, 50 C 5, 20 95, 20 95, 50 C 95, 80 5, 80 5, 50 Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="300" strokeDashoffset="0" className="animate-[dash_2s_ease-in-out_infinite]" />
                  </svg>
                </span>
              </h1>
              <div className="space-y-4 text-gray-800 text-sm md:text-base leading-relaxed max-w-xl text-justify">
                <p className="font-semibold text-gray-900">
                  Purpose-built websites designed around your business, users, and long-term goals.
                </p>
                <p>
                  RizeWorld develops responsive and scalable websites with custom functionality, clean user experiences, and a technical foundation built for growth.
                </p>
                <p>
                  Every business has different requirements, so a standard website solution does not always make sense. A custom website gives you more flexibility to create the features, structure, and user experience your business actually needs. At RizeWorld, we develop custom websites that combine thoughtful design with reliable functionality. We focus on understanding your business first, then building a website around your users, processes, and long-term goals.
                </p>
              </div>
            </motion.div>

            {/* Bottom Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="bg-white border border-gray-200/80 rounded-4xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <p className="text-gray-700 text-xs sm:text-sm font-semibold max-w-sm text-justify leading-relaxed">
                Custom development focused on functionality, usability, performance, and future growth.
              </p>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-50 border border-orange-200/80 px-4 py-2 rounded-full shadow-2xs">
                  CUSTOM • DEVELOPMENT • EXPERIENCE
                </span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT STATS COLUMN */}
          <div className="flex flex-col gap-6">
            {/* Teamwork Card */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-sky-50 border border-sky-100 rounded-4xl p-8 flex flex-col justify-center h-full min-h-[160px] shadow-xs hover:-translate-y-1 transition-transform duration-300"
            >
              <h4 className="text-sm font-black text-sky-950 uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-sky-500 rounded-full" /> TEAMWORK
              </h4>
              <p className="text-sky-950 text-sm font-bold mb-1">
                Design & Development Working Together
              </p>
              <p className="text-sky-900/80 text-xs font-semibold leading-relaxed">
                Planning • Development • Testing
              </p>
            </motion.div>

            {/* Performance Card */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="bg-yellow-50/70 border border-yellow-100 rounded-4xl p-8 flex flex-col justify-center h-full min-h-[160px] shadow-xs hover:-translate-y-1 transition-transform duration-300"
            >
              <h4 className="text-sm font-black text-yellow-950 uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" /> PERFORMANCE
              </h4>
              <p className="text-yellow-950 text-sm font-bold mb-1">
                Scalable Architecture & Clean Code
              </p>
              <p className="text-yellow-900/80 text-xs font-semibold leading-relaxed">
                Frontend • Backend • Security
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
              0% { transform: translate3d(0, 0, 0); }
              100% { transform: translate3d(-50%, 0, 0); }
            }
            .animate-marquee-brands {
              animation: marquee-brands 60s linear infinite;
              will-change: transform;
              backface-visibility: hidden;
              -webkit-backface-visibility: hidden;
            }
          `}
        </style>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Loved by teams around the world</span>
        </div>
        <div className="flex-1 overflow-hidden mask-image-horizontal w-full">
          <div className="flex w-max animate-marquee-brands items-center">
            {repeatedLogos.map((item, idx) => (
              <div key={idx} className={`w-56 h-24 mx-4 flex items-center justify-center shrink-0 p-2 rounded-4xl shadow-sm border border-gray-100 overflow-hidden ${item.bg}`}>
                <img 
                  src={item.src} 
                  alt="Client Logo" 
                  className={`${item.customClass || "max-h-[92%] max-w-[92%]"} object-contain`} 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SIX CORE SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500">OUR SPECIALIZED SERVICES</span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-950 uppercase tracking-tight mt-1 mb-6 leading-tight">
            Our Custom Website <br />Development Services
          </h2>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed text-justify">
            We build flexible, custom websites engineered around your brand, technical workflows, and business goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES_LIST.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white border border-gray-200/80 rounded-4xl p-8 flex flex-col justify-between group hover:border-orange-500/40 hover:shadow-[0_20px_50px_rgba(249,115,22,0.08)] transition-all duration-500 relative overflow-hidden cursor-pointer"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-orange-500/15 text-orange-500 flex items-center justify-center mb-8 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                    <Icon size={24} />
                  </div>

                  <h3 className="text-xl font-black uppercase text-gray-950 mb-3 group-hover:text-orange-500 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 text-justify">
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

      {/* 5. PROCESS / WHY CHOOSE RIZEWORLD */}
      <section className="bg-white border-t border-b border-gray-200 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-16 items-start mb-20">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-orange-500 block mb-3">WHY CHOOSE RIZEWORLD?</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-950 uppercase tracking-tight">
                DEVELOPMENT WITH PERFORMANCE & SCALABILITY IN MIND.
              </h2>
            </div>
            <div>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed text-justify mb-4">
                A custom website should not only perform its required functions; it should also provide a smooth experience for users. We pay attention to website structure, responsive behavior, performance, usability, and maintainability during development. We also consider SEO requirements where appropriate, so the technical foundation of the website can support your wider online marketing efforts.
              </p>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed text-justify">
                We combine web design, development, SEO, and digital marketing knowledge to build websites with the bigger picture in mind. Instead of creating features simply because they are available, we focus on what your business actually needs. The result is a website that is easier to use, more aligned with your goals, and flexible enough to grow with your business.
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
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8 max-w-xl text-justify">
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

      {/* FAQS SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500">FAQ</span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-950 uppercase tracking-tight mt-2">
            Custom Website Development – FAQs
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
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
                      <div className="p-6 pt-0 border-t border-gray-100 text-gray-600 text-sm leading-relaxed text-justify">
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
                Reach out today to discuss your custom website project and build a tailored digital platform.
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
                  <a href="https://maps.google.com/?q=Rizeworld+Digital+Marketing+Pvt+Ltd+Company+C198,+near+Telco+Circle,+UIT+colony,+Shalimar+Nagar,+Alwar,+Rajasthan+301001" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-zinc-300 hover:text-orange-500 transition-colors">C-198, near Telco Circle, UIT colony, Shalimar Nagar, Alwar, Rajasthan 301001, India</a>
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
              Contact now <Mail size={14} />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
