import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Calendar, Tag, ShieldCheck, ZoomIn } from 'lucide-react';
import { PROJECTS } from '../data/projects';
import SEO from '../components/common/SEO';
import Breadcrumbs from '../components/common/Breadcrumbs';

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

const PROJECT_LOGOS: Record<string, string> = {
  "7one": "/logos/7 one 1.png",
  "avantika": "/logos/avantika-removebg-preview.png",
  "b-infra": "/logos/BHAVIKINFA-removebg-preview.png",
  "daily-prints": "/logos/daily_prints-removebg-preview.png",
  "mansukh": "/logos/m.png",
  "old-rao": "/logos/old rao .png",
  "shiv-nutrition": "/logos/SHIV-NUTRATION-removebg-preview.png",
  "south-street": "/logos/south-removebg-preview.png",
  "medi-compares": "/logos/Transparent_Mono_Logo-removebg-preview.png",
  "yoga": "/logos/yoga-removebg-preview.png",
  "dwps": "/logos/logo1/dwps_alwar_14050326_165735543.jpg.jpeg_nobg2.png",
  "golden-gym": "/logos/logo1/golden_fitness_studio_14050326_165901083.jpg.jpeg_nobg2.png",
  "hydrowash": "/logos/logo1/hydrowash___14050326_165141258.jpg-removebg-preview.png",
  "jain-event": "/logos/logo1/jain_event_planner__14050326_165108726.jpg-removebg-preview.png",
  "kafesa": "/logos/logo1/kafesa_by_tijacafe_14050326_165226870.jpg-removebg-preview.png",
  "mobile-master": "/logos/logo1/mobile_master_alwar_14050326_165925798.jpg.jpeg_nobg2.png",
  "hotel-rj02": "/logos/logo1/rj02_hotel_14050326_170134229.jpg-removebg-preview (1).png",
  "roastro": "/logos/logo1/roastro_cafe_14050326_165747073.jpg-removebg-preview (1).png",
  "saniya-hospital": "/logos/logo1/saniya__hospital_14050326_165809565.jpg-removebg-preview.png",
  "shivaura": "/logos/logo1/shivaura_in_14050326_165054553.jpg-removebg-preview.png",
  "sigdi": "/logos/logo1/sigdiresort_14050326_165131449.jpg-removebg-preview.png",
  "zoniraz-jewel": "/logos/logo1/zonirazjewel_14050326_165120271.jpg-removebg-preview.png",
  "shinelimos": "/logos/shinelimo-removebg-preview.png",
  "autodetox": "/logos/autodetox.png",
  "easy-eyes": "/logos/Easyeyes_logo_-Recovered-__1_-1-1.jpg-removebg-preview (1).png",
  "ambhuti": "/logos/aa.jpg-removebg-preview.png",
  "bhavik-dairy": "/logos/logo1/bhavikdairy_14050326_165157844.jpg.jpeg_nobg.png",
  "travelia": "/logos/TT-removebg-preview.png"
};

const PROJECT_THEMES: Record<string, { bg: string; text: string; isDark: boolean }> = {
  "sigdi": { bg: "bg-black", text: "text-white", isDark: true },
  "zoniraz-jewel": { bg: "bg-black", text: "text-white", isDark: true },
  "autodetox": { bg: "bg-black", text: "text-white", isDark: true },
  "jain-event": { bg: "bg-black", text: "text-white", isDark: true },
  "hotel-rj02": { bg: "bg-black", text: "text-white", isDark: true },
  "shinelimos": { bg: "bg-black", text: "text-white", isDark: true },
  "golden-gym": { bg: "bg-amber-100", text: "text-gray-900", isDark: false },
  "hydrowash": { bg: "bg-[#27272a]", text: "text-white", isDark: true },
  "shivaura": { bg: "bg-[#2d3748]", text: "text-white", isDark: true },
  "kafesa": { bg: "bg-amber-50", text: "text-gray-900", isDark: false },
  "roastro": { bg: "bg-[#451a03]", text: "text-white", isDark: true }
};

export default function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);

  const project = PROJECTS.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="min-h-screen pt-36 pb-20 px-4 text-center bg-rize-bg flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-gray-950 mb-4 uppercase">Project Not Found</h2>
        <p className="text-gray-500 mb-8">The project you are looking for does not exist.</p>
        <Link to="/portfolio" className="bg-rize-primary text-white font-bold px-6 py-3 rounded-full hover:opacity-90 transition-colors uppercase text-xs tracking-wider shadow-md shadow-rize-primary/20">
          Back to Portfolio
        </Link>
      </div>
    );
  }

  const projectUrl = `${window.location.origin}/portfolio/${project.id}`;
  const theme = PROJECT_THEMES[project.id] || { bg: "bg-rize-bg", text: "text-gray-900", isDark: false };
  const isDark = theme.isDark;

  const creativeWorkSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": `${project.title} - RizeWorld Digital Portfolio`,
    "description": project.desc,
    "image": `${window.location.origin}${project.image}`,
    "genre": project.category,
    "creator": {
      "@type": "Organization",
      "name": "RizeWorld Digital",
      "url": window.location.origin
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${window.location.origin}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Portfolio",
        "item": `${window.location.origin}/portfolio`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": project.title,
        "item": projectUrl
      }
    ]
  };

  return (
    <div className={`min-h-screen pt-32 pb-24 overflow-hidden transition-colors duration-300 ${theme.bg} ${theme.text}`}>
      <SEO
        title={`${project.title} - Portfolio | RizeWorld Digital`}
        description={project.desc}
        canonicalUrl={projectUrl}
        ogType="article"
        schema={[creativeWorkSchema, breadcrumbSchema]}
      />
      
      {/* 1. BREADCRUMBS & NAVIGATION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button 
          onClick={() => navigate('/portfolio')}
          className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-colors group cursor-pointer w-fit ${isDark ? "text-white hover:text-rize-primary" : "text-gray-900 hover:text-rize-primary"}`}
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Portfolio
        </button>

        <Breadcrumbs items={[{ name: 'Portfolio', path: '/portfolio' }, { name: project.title }]} />
      </div>

      {/* 2. SPLIT HERO BLOCK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-12 items-start mb-20">
        
        {/* Left Info Column */}
        <div className="flex flex-col text-left">
          <span className="text-rize-primary font-bold uppercase tracking-widest text-xs flex items-center gap-1.5 mb-3">
            <Tag size={12} /> {project.category}
          </span>
          <h1 className="mb-8">
            {PROJECT_LOGOS[project.id] ? (
              <img 
                src={PROJECT_LOGOS[project.id]} 
                alt={project.title} 
                className="h-24 md:h-32 object-contain object-left" 
              />
            ) : (
              <span className={`text-5xl md:text-6xl font-black leading-none uppercase tracking-tighter block ${isDark ? "text-white" : "text-gray-950"}`}>
                {project.title}
              </span>
            )}
          </h1>

          <div className={`border-t border-b py-8 my-2 space-y-6 ${isDark ? "border-zinc-800/80" : "border-gray-200/80"}`}>
            <p className={`leading-relaxed text-base md:text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              {project.desc}
            </p>
          </div>

          {/* Key Parameters */}
          <div className="grid grid-cols-2 gap-6 pt-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rize-primary/10 text-rize-primary flex items-center justify-center">
                <Calendar size={18} />
              </div>
              <div>
                <p className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? "text-zinc-500" : "text-gray-400"}`}>Project Date</p>
                <p className={`font-bold text-xs ${isDark ? "text-white" : "text-gray-950"}`}>June 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rize-primary/10 text-rize-primary flex items-center justify-center">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? "text-zinc-500" : "text-gray-400"}`}>Status</p>
                <p className={`font-bold text-xs ${isDark ? "text-white" : "text-gray-950"}`}>Completed</p>
              </div>
            </div>
          </div>

          <div>
            <Link 
              to="/contact" 
              className={`inline-flex items-center gap-2 font-bold text-xs uppercase tracking-wider py-4 px-8 rounded-full transition-all ${isDark ? "bg-white text-black hover:bg-rize-primary hover:text-white" : "bg-gray-950 text-white hover:bg-rize-primary"}`}
            >
              Start Your Project <ExternalLink size={14} />
            </Link>
          </div>
        </div>

        {/* Right Main Image Card */}
        <div className={`relative rounded-4xl overflow-hidden aspect-192/100 border shadow-xl group ${isDark ? "bg-zinc-950/40 border-zinc-800/80" : "bg-gray-100 border-gray-200"}`}>
          <FallbackImage
            src={project.image}
            fallback={project.fallback}
            alt={project.title}
            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-102"
          />
        </div>

      </section>

      {/* 3. PROJECT IMAGE GALLERY */}
      <section className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t pt-20 ${isDark ? "border-zinc-900" : "border-gray-200/60"}`}>
        <div className="text-left mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-rize-primary">Visual Showcase</span>
          <h2 className={`text-3xl md:text-4xl font-extrabold uppercase tracking-tight mt-1 ${isDark ? "text-white" : "text-gray-950"}`}>
            Project Gallery
          </h2>
        </div>

        {/* Gallery Grid */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
          {project.images.map((imgUrl, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedGalleryImage(imgUrl)}
              className={`break-inside-avoid relative rounded-3xl overflow-hidden border shadow-sm cursor-pointer group mb-6 ${isDark ? "bg-zinc-950/40 border-zinc-800/80" : "bg-gray-100 border-gray-200"}`}
            >
              <FallbackImage
                src={imgUrl}
                fallback={project.fallback}
                alt={`${project.title} screenshot ${i + 1}`}
                className="w-full h-auto object-contain block"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-white text-gray-900 flex items-center justify-center shadow-lg">
                  <ZoomIn size={18} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* GALLERY LIGHTBOX MODAL */}
      {selectedGalleryImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
          onClick={() => setSelectedGalleryImage(null)}
        >
          <div className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center">
            <FallbackImage
              src={selectedGalleryImage}
              fallback={project.fallback}
              alt="Gallery Lightbox"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-zinc-800"
            />
          </div>
        </div>
      )}

    </div>
  );
}
