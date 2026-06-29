import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Phone, Mail, Award } from 'lucide-react';
import { PROJECTS } from '../data/projects';
import SEO from '../components/common/SEO';
import Breadcrumbs from '../components/common/Breadcrumbs';

const CATEGORIES = [
  "All",
  "Ambience & Experience",
  "Auto Detailing",
  "Banquet & Events",
  "Community & Learning",
  "Dining & Cuisine",
  "Dining Experience",
  "Electronics & Accessories",
  "Fine Dine Restaurant",
  "Food & Cuisine",
  "Fragrances & Perfumes",
  "Hospitality",
  "Jewellery & Accessories",
  "Lifestyle & Wellness",
  "Multi-Cuisine Dining",
  "Residential Projects",
  "South Indian Restaurant",
  "Sports & Performance Nutrition",
  "Uniform Supply",
  "Yoga Practices"
];

function FallbackImage({ src, fallback, alt, className }: { src: string; fallback: string; alt: string; className: string }) {
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (imgSrc !== fallback) {
          setImgSrc(fallback);
        }
      }}
    />
  );
}

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();

  const filteredProjects = activeCategory === "All"
    ? PROJECTS
    : PROJECTS.filter(project => project.category === activeCategory);

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
        "name": "Portfolio",
        "item": "https://rizeworld.in/portfolio"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-rize-bg overflow-hidden pt-28">
      <SEO 
        title="Our Creative Design & Development Portfolio | RizeWorld"
        description="Browse RizeWorld Digital's marketing and software engineering case studies. We build beautiful user journeys, design premium logos, and develop high-converting online platforms."
        canonicalUrl="https://rizeworld.in/portfolio"
        schema={[breadcrumbSchema]}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <Breadcrumbs items={[{ name: "Portfolio" }]} />
      </div>

      {/* 1. HERO THREE-COLUMN LAYOUT (Styled like the design image) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-[1.2fr_1.5fr_1fr] gap-12 items-center">
        
        {/* Left Column: Title & Intro */}
        <div className="flex flex-col text-left">
          <span className="text-gray-500 font-medium text-sm tracking-wide mb-2 block">
            Hey there. We are
          </span>
          <h1 className="text-6xl md:text-7xl font-black text-gray-950 leading-[0.95] uppercase tracking-tighter mb-6">
            RIZEWORLD <br />
            PORTFOLIO
          </h1>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8 max-w-sm">
            Helping brands stand out with thoughtful and compelling design solutions. Turning complex challenges into simple, human-centric visual narratives.
          </p>
          <div>
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-3 bg-rize-primary text-white font-bold text-xs uppercase tracking-wider py-4 px-8 rounded-full hover:opacity-90 hover:scale-105 transition-all group shadow-md shadow-rize-primary/20"
            >
              Lets Talk Brief 
              <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform">
                <ArrowUpRight size={14} />
              </span>
            </Link>
          </div>
        </div>

        {/* Center Column: Portrait / Featured visual card */}
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-[380px] aspect-4/5 rounded-[2.5rem] bg-gray-200 border border-gray-300/60 p-4 shadow-lg overflow-hidden flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800" 
              alt="Creative Director" 
              className="w-full h-full object-cover rounded-4xl"
            />
            {/* Floating Social Circles on Right edge */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3">
              {['be', 'dr', 'in', 'ig'].map((s, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-9 h-9 rounded-full bg-white/90 hover:bg-rize-primary hover:text-white text-gray-700 shadow-md flex items-center justify-center text-xs font-bold uppercase transition-all duration-300 hover:scale-110"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
          {/* Status badge */}
          <div className="flex items-center gap-2 mt-6 text-xs font-bold uppercase tracking-wider text-gray-700 bg-white px-5 py-2.5 rounded-full border border-gray-200 shadow-sm">
            <span className="w-2.5 h-2.5 bg-rize-primary rounded-full animate-pulse" />
            Available For New Projects
          </div>
        </div>

        {/* Right Column: Achievements & Trust */}
        <div className="flex flex-col text-left lg:pl-6 border-l border-gray-200/60 h-full justify-center">
          <span className="text-rize-primary font-bold uppercase tracking-widest text-xs flex items-center gap-1.5 mb-2">
            <Award size={14} /> Firm of the Year 2026
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-950 uppercase leading-none tracking-tight mb-6">
            DIGITAL <br className="hidden lg:block"/>
            CREATIVE <br className="hidden lg:block"/>
            AGENCY
          </h2>
          {/* Avatar group */}
          <div className="flex items-center gap-1.5 mb-3">
            {[
              "/video/harsh tiwari.jpeg",
              "/video/k sir.jpg",
              "/video/mansukhhh.jpg",
              "/video/Untitled-1.jpg",
              "/video/nk s.jpg"
            ].map((avatar, i) => (
              <img 
                key={i} 
                src={avatar} 
                alt="user avatar" 
                className="w-8 h-8 rounded-full border-2 border-white object-cover -ml-2 first:ml-0" 
              />
            ))}
            <div className="w-8 h-8 rounded-full bg-rize-primary text-white flex items-center justify-center text-[10px] font-black -ml-2 border-2 border-white">
              99%
            </div>
          </div>
          <p className="text-xs font-bold uppercase text-gray-900 tracking-wider">
            Loved by founders globally
          </p>
          <p className="text-gray-400 text-xs mt-1">
            50+ Projects delivered worldwide
          </p>
        </div>

      </section>

      {/* 2. TRUSTED BY LOGO ROW (MARQUEE) */}
      <section className="w-full bg-[#f5f9fb] border-t border-b border-gray-200 py-10 my-8 overflow-hidden relative">
        <style>
          {`
            @keyframes marquee-portfolio {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee-portfolio {
              animation: marquee-portfolio 30s linear infinite;
            }
          `}
        </style>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Trusted by 20+</span>
          <h3 className="text-gray-950 font-black text-sm uppercase">best brands globally</h3>
        </div>
        <div className="flex w-max animate-marquee-portfolio items-center">
          {[
            // Root logos
            { src: "/logos/7.png", bg: "bg-white" },
            { src: "/logos/Old Rao 100x41.png", bg: "bg-zinc-100" },
            { src: "/logos/m.png", bg: "bg-white" },
            { src: "/logos/yga.png", bg: "bg-white" },
            // Logo1 transparent logos
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
            { src: "/logos/logo1/zonirazjewel_14050326_165120271.jpg-removebg-preview.png", bg: "bg-black" },
            // Repeated for smooth continuous scrolling
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
          ].map((item, i) => (
            <div key={i} className={`w-56 h-24 mx-4 flex items-center justify-center shrink-0 p-1 rounded-4xl shadow-sm border border-gray-100/50 overflow-hidden ${item.bg}`}>
              <img 
                src={item.src} 
                alt="brand logo" 
                className="max-h-full max-w-full object-contain scale-110 transform-[translateZ(0)] backface-hidden will-change-transform [image-rendering:-webkit-optimize-contrast]" 
              />
            </div>
          ))}
        </div>
      </section>

      {/* 3. MAIN WORK SECTION - Full width 3-column grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* Top CTA strip */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 pb-8 border-b border-gray-200/60">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 uppercase tracking-tight leading-tight max-w-2xl">
            We love collaborating with brands and founders. Ready to bring your next big idea to life?
          </h2>
          <div className="flex flex-wrap items-center gap-6 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rize-primary/10 text-rize-primary flex items-center justify-center">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Call Today</p>
                <p className="text-gray-950 font-bold text-sm">+91 90246 15510</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rize-primary/10 text-rize-primary flex items-center justify-center">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Us</p>
                <p className="text-gray-950 font-bold text-sm">
                  <a href="mailto:hr.rizeworld@gmail.com" className="hover:text-rize-primary transition-colors">hr.rizeworld@gmail.com</a>
                </p>
              </div>
            </div>
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-2.5 bg-gray-950 hover:bg-rize-primary text-white font-bold text-xs uppercase tracking-wider py-4 px-8 rounded-full transition-all whitespace-nowrap"
            >
              Lets Talk Brief <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Filter tags (scrolling horizontally) */}
        <div className="flex items-center gap-3 overflow-x-auto pb-6 whitespace-nowrap mb-10 scrollbar-none">
          {CATEGORIES.map((category, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 shrink-0 cursor-pointer ${
                activeCategory === category
                  ? 'bg-rize-primary text-white shadow-md shadow-rize-primary/20'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-rize-primary hover:text-rize-primary'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Full-width 3-column Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                key={project.title}
                onClick={() => navigate(`/portfolio/${project.id}`)}
                className="w-full bg-white rounded-4xl p-4 border border-gray-200/80 shadow-sm flex flex-col group hover:border-rize-primary/40 hover:shadow-[0_20px_50px_rgba(26,86,219,0.12)] transition-all duration-300 relative overflow-hidden cursor-pointer"
              >
                {/* Image Box */}
                <div className="relative overflow-hidden rounded-3xl aspect-[192/100] bg-transparent mb-5">
                  <FallbackImage
                    src={project.image}
                    fallback={project.fallback}
                    alt={project.title}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute bottom-4 left-4 bg-gray-950/70 backdrop-blur-md text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                    {project.category}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between px-2 pb-2 text-left">
                  <div>
                    <h3 className="text-lg font-bold uppercase text-gray-950 leading-tight mb-2 group-hover:text-rize-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                      {project.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-widest text-rize-primary uppercase">View Details</span>
                    <button className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-800 group-hover:bg-rize-primary group-hover:text-white transition-colors duration-300">
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full text-center py-20 bg-white rounded-4xl border border-gray-200"
          >
            <p className="text-gray-500 text-lg">No projects found in this category.</p>
          </motion.div>
        )}
      </section>

      {/* 4. PREMIUM DARK BOTTOM STATS BANNER */}
      <section className="w-full bg-gray-950 text-white py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1.5fr_2.5fr] gap-16 items-center">
          {/* Left Featured Image/Video thumbnail */}
          <div className="relative rounded-4xl overflow-hidden aspect-video bg-gray-800 border border-gray-800 max-w-lg mx-auto w-full shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" 
              alt="team collaborating video" 
              className="w-full h-full object-cover brightness-75"
            />
            {/* Play indicator */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-rize-primary/90 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer">
                <ArrowUpRight size={28} />
              </div>
            </div>
          </div>

          {/* Right Statistics details */}
          <div className="flex flex-col text-left">
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight leading-snug mb-10 max-w-2xl border-l-2 border-rize-primary pl-6">
              We are passionate about empowering individuals and businesses to drive digital transformation through user-first experiences.
            </h3>
            
            {/* Stats list */}
            <div className="grid grid-cols-3 gap-8 border-t border-gray-800 pt-8">
              <div>
                <span className="text-4xl md:text-6xl font-black text-white block tracking-tight mb-2">12</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Years of Experience</span>
              </div>
              <div>
                <span className="text-4xl md:text-6xl font-black text-white block tracking-tight mb-2">100+</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Projects Completed</span>
              </div>
              <div>
                <span className="text-4xl md:text-6xl font-black text-white block tracking-tight mb-2">98%</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Client Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
