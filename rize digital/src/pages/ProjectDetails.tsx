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
    <div className="min-h-screen bg-rize-bg pt-32 pb-24 overflow-hidden">
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
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-900 hover:text-rize-primary transition-colors group cursor-pointer w-fit"
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
          <h1 className="text-5xl md:text-6xl font-black text-gray-950 leading-none uppercase tracking-tighter mb-8">
            {project.title}
          </h1>

          <div className="border-t border-b border-gray-200/80 py-8 my-2 space-y-6">
            <p className="text-gray-600 leading-relaxed text-base md:text-lg">
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
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Project Date</p>
                <p className="text-gray-950 font-bold text-xs">June 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rize-primary/10 text-rize-primary flex items-center justify-center">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Status</p>
                <p className="text-gray-950 font-bold text-xs">Completed</p>
              </div>
            </div>
          </div>

          <div>
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-2 bg-gray-950 hover:bg-rize-primary text-white font-bold text-xs uppercase tracking-wider py-4 px-8 rounded-full transition-all"
            >
              Start Your Project <ExternalLink size={14} />
            </Link>
          </div>
        </div>

        {/* Right Main Image Card */}
        <div className="relative rounded-4xl overflow-hidden aspect-192/100 bg-gray-100 border border-gray-200 shadow-xl group">
          <FallbackImage
            src={project.image}
            fallback={project.fallback}
            alt={project.title}
            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-102"
          />
        </div>

      </section>

      {/* 3. PROJECT IMAGE GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-200/60 pt-20">
        <div className="text-left mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-rize-primary">Visual Showcase</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-950 uppercase tracking-tight mt-1">
            Project Gallery
          </h2>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {project.images.map((imgUrl, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedGalleryImage(imgUrl)}
              className="relative rounded-3xl overflow-hidden aspect-192/100 bg-gray-100 border border-gray-200 shadow-sm cursor-pointer group"
            >
              <FallbackImage
                src={imgUrl}
                fallback={project.fallback}
                alt={`${project.title} screenshot ${i + 1}`}
                className="w-full h-full object-contain"
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
