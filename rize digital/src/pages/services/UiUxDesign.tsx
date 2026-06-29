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

const SERVICES_LIST = [
  {
    title: "User Research & Discovery",
    desc: "Understanding buyer psychology, building maps, evaluating expectations, and setting up structural briefs.",
    tags: ["User Personas", "Discovery Audits", "Customer Journeys", "Goal Mapping"],
    icon: Search
  },
  {
    title: "Wireframing & Prototyping",
    desc: "Drawing structural low-fidelity outlines and high-fidelity clickable interactive prototypes.",
    tags: ["Figma Layouts", "Clickable Demos", "UX Workflows", "A/B Testing Structure"],
    icon: Share2
  },
  {
    title: "Visual Interface (UI) Design",
    desc: "Crafting beautiful grids, dark-mode/light-mode stylesheets, font pairings, and responsive visual patterns.",
    tags: ["UI Styles", "Color Palette Rules", "Typography Pairs", "Responsive UI"],
    icon: Palette
  },
  {
    title: "Interaction Design & Micro-animations",
    desc: "Adding custom transitions, hover triggers, button micro-feedback states to enhance client interactions.",
    tags: ["Transitions", "Lottie Assets", "Micro-feedback", "Hover States"],
    icon: Edit3
  },
  {
    title: "Usability Testing & Refinements",
    desc: "Observing user navigations, heatmaps, identifying design bottlenecks, and executing final design fixes.",
    tags: ["Usability Audits", "Heatmap Analysis", "Design Refinements"],
    icon: Award
  }
];

const STEPS = [
  {
    num: "1",
    title: "Research & Discovery",
    desc: "We dive deep into your target audience's requirements and map out the overall structure and pages flow.",
    details: ["Audience Mapping", "Flow Diagrams", "Creative Questionnaire"]
  },
  {
    num: "2",
    title: "UI Design & Prototyping",
    desc: "Our creative Figma specialists code layouts, pair fonts, configure themes, and assemble interactive mockups.",
    details: ["Figma Mockups", "Interactive Prototypes", "Theme Settings"]
  },
  {
    num: "3",
    title: "Usability Audits & Handover",
    desc: "We perform strict layout checks, execute testing protocols, and hand over the responsive assets cleanly.",
    details: ["Usability Testing", "Asset Exporting", "Developer Handover"]
  }
];

const TESTIMONIALS = [
  {
    quote: "RizeWorld's UI/UX specialists transformed our software interface. Our customer support requests dropped by 60% due to the intuitive layout configurations.",
    author: "Elena Rostova",
    role: "UX Lead, Tech Corp",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120"
  },
  {
    quote: "The interactive prototype they delivered was incredibly detailed. It helped us secure our seed funding round by visually demonstrating our SaaS tool perfectly.",
    author: "Arthur Pendelton",
    role: "Founder, SaaS Lab",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120"
  }
];

export default function UiUxDesign() {
  const navigate = useNavigate();
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "UI/UX Design",
    "provider": {
      "@type": "Organization",
      "name": "RizeWorld Digital",
      "url": "https://rizeworld.in/"
    },
    "description": "User interface and user experience design services. Comprehensive wireframing, high-fidelity Figma prototypes, and consumer journey mapping."
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
        "name": "UI/UX Design",
        "item": "https://rizeworld.in/services/ui-ux-design"
      }
    ]
  };

  const [activeStep, setActiveStep] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 overflow-hidden text-left font-sans selection:bg-orange-500 selection:text-white">
      
      
      <SEO 
        title="UI/UX Research, Wireframes & Prototypes | RizeWorld"
        description="User interface and user experience design services. Comprehensive wireframing, high-fidelity Figma prototypes, and consumer journey mapping."
        canonicalUrl="https://rizeworld.in/services/ui-ux-design"
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

        <Breadcrumbs items={[{ name: "Services", path: "/services" }, { name: "UI/UX Design" }]} />
      </div>

      {/* 2. HERO COLLAGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_2.2fr_1fr] gap-6 items-stretch">
          
          {/* LEFT COLLAGE BLOCK */}
          <div className="flex flex-col gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-orange-100/70 border border-orange-200/60 rounded-4xl p-8 flex flex-col justify-center h-auto min-h-[180px] shadow-xs relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-200/30 rounded-full blur-2xl -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-500" />
              <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest block mb-3">Who We Are</span>
              <p className="text-gray-800 text-sm leading-relaxed font-semibold">
                RizeWorld – Creating Delightful User-Centric Interfaces
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
                alt="creative design whiteboard" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </motion.div>
          </div>

          {/* CENTER MAIN CONTENT BLOCK */}
          <div className="flex flex-col gap-6 justify-between">
            <motion.div 
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-white border border-gray-200/80 rounded-[2.5rem] p-8 md:p-12 shadow-sm flex flex-col justify-center grow relative overflow-hidden"
            >
              <span className="text-orange-500 font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-1.5">
                <Sparkles size={14} className="animate-pulse" /> Elegant Creative Interfaces
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-black text-gray-950 leading-[1.05] uppercase tracking-tighter mb-6">
                UI/UX <br />
                Design <span className="relative inline-block px-4 py-1 mx-1 mt-1">
                  Services
                  <svg className="absolute inset-0 w-full h-full text-orange-500" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M 5, 50 C 5, 20 95, 20 95, 50 C 95, 80 5, 80 5, 50 Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="300" strokeDashoffset="0" className="animate-[dash_2s_ease-in-out_infinite]" />
                  </svg>
                </span>
              </h1>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-xl">
                We craft intuitive wireframes, responsive visual interfaces, and custom user flows that elevate brand perception and increase conversions.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="bg-white border border-gray-200/80 rounded-4xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <p className="text-gray-500 text-xs font-semibold max-w-sm text-center sm:text-left leading-relaxed">
                Creative design assets that translate concepts into cohesive customer journeys.
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
                  <span className="text-base font-black text-gray-950 block leading-none">12+</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Design Deliveries</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT STATS COLUMN */}
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
              <p className="text-sky-900/85 text-2xl font-black mb-1">8+</p>
              <p className="text-sky-900/70 text-xs font-semibold uppercase tracking-wider">
                Creative UI/UX Designers
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
              <p className="text-yellow-900/85 text-2xl font-black mb-1">80+</p>
              <p className="text-yellow-900/70 text-xs font-semibold uppercase tracking-wider">
                Completed Layout Deliveries
              </p>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 3. CORE SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500">Solution Provide</span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-950 uppercase tracking-tight mt-1 mb-6 leading-tight">
            Delivering Exceptional User Experiences.
          </h2>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            We structure wireframes and prototypes that optimize clicks and navigation paths.
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

      {/* 4. PROCESS TIMELINE */}
      <section className="bg-white border-t border-b border-gray-200 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-16 items-start mb-20">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-orange-500 block mb-3">Our Process</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-950 uppercase tracking-tight">
                3 STEPS TO EXCEPTIONAL <br />EXPERIENCES.
              </h2>
            </div>
            <div>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                We handle the end-to-end user research and wireframing setups.
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

      {/* Testimonials Section */}
      <section className="bg-stone-100 py-24 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-500">CLIENT FEEDBACK</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-950 uppercase tracking-tight mt-1 mb-6 leading-tight">
              What Our Partners Say <br />About Us.
            </h2>
            <p className="text-gray-500 text-sm">
              We help brands grow authority with consistent value and high-conversion copy.
            </p>
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

            {/* Areas We Serve */}
      <AreasWeServe />

      {/* 5. LET'S TALK PANEL */}
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
