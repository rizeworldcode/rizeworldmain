import { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';
import Breadcrumbs from '../components/common/Breadcrumbs';

const SKILLS_MARQUEE = [
  { text: "PHOTOSHOP", color: "text-amber-500" },
  { text: "VIDEO EDITING", color: "text-orange-600" },
  { text: "SMO", color: "text-emerald-600" },
  { text: "SEO", color: "text-blue-800" },
  { text: "META ADS", color: "text-yellow-500" },
  { text: "GRAPHIC DESIGN", color: "text-purple-600" },
  { text: "WEB DEVELOPMENT", color: "text-cyan-600" },
  { text: "DATA ANALYTICS", color: "text-indigo-600" }
];

const TEAM_MEMBERS = [
  {
    name: "Devesh Choudhary",
    role: "Digital Marketing Specialist",
    image: "/team/D1.png",
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" }
  },
  {
    name: "Mohit Srivastava",
    role: "Senior Graphic Designer",
    image: "/team/mohit.jpg.jpeg",
    zoom: "scale-[1.35] group-hover:scale-[1.45]",
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" }
  },
  {
    name: "Kaveendra Saini",
    role: "Video Editor",
    image: "/team/kavin.jpg.jpeg",
    zoom: "scale-[1.15] group-hover:scale-[1.25]",
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" }
  },
  {
    name: "Sahil Gupta",
    role: "HR Lead",
    image: "/team/hr.jpg.jpeg",
    zoom: "scale-[1.35] translate-y-6 group-hover:scale-[1.45] group-hover:translate-y-6",
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" }
  },

  {
    name: "Manoj kumar",
    role: "Data Analyst",
    image: "/team/manoj.jpg.jpeg",
    zoom: "scale-[1.35] group-hover:scale-[1.45]",
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" }
  },
  {
    name: "Aman",
    role: "Web Developer",
    image: "/team/aman.jpg.jpeg",
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" }
  },
  {
    name: "DEVENDRA SINGH",
    role: "SEO Executive",
    image: "/team/bhai.jpg.jpeg",
    zoom: "scale-[1.35] group-hover:scale-[1.45]",
    socials: { linkedin: "#", twitter: "#", instagram: "#", facebook: "#" }
  },
];

export default function Team() {
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    setActiveCardIndex(prev => prev === index ? null : index);
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
        "name": "Our Team",
        "item": "https://rizeworld.in/team"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-rize-bg overflow-hidden">
      <SEO 
        title="Our Team | Expert Digital Marketing & Design Specialists - RizeWorld"
        description="Meet the RizeWorld Digital agency team. Our creative directors, web developers, graphic designers, copywriters, and local SEO managers work together to scale your business."
        canonicalUrl="https://rizeworld.in/team"
        schema={[breadcrumbSchema]}
      />
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-36 pb-20 bg-rize-bg text-center flex flex-col items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center">
          <Breadcrumbs items={[{ name: "Our Team" }]} />
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-4"
          >
            Our Team
          </motion.h1>
        </div>
      </section>

      {/* 2. SERVICES MARQUEE */}
      <section className="py-6 bg-white overflow-hidden flex items-center relative border-y border-gray-200">
        <style>
          {`
            @keyframes marquee-skills {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee-skills {
              animation: marquee-skills 25s linear infinite;
            }
          `}
        </style>
        <div className="flex w-max animate-marquee-skills items-center">
          {[...SKILLS_MARQUEE, ...SKILLS_MARQUEE, ...SKILLS_MARQUEE].map((skill, i) => (
            <div key={i} className="flex items-center shrink-0">
              <span className={`text-xl md:text-2xl font-semibold font-serif tracking-wide ${skill.color}`}>{skill.text}</span>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-rize-primary/80 mx-8 shrink-0">
                <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
              </svg>
            </div>
          ))}
        </div>
      </section>

      {/* 3. MEET EXPERT TEAM SECTION */}
      <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-rize-bg">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-3 h-3 bg-rize-primary rounded-full" />
            <span className="text-xs font-bold uppercase tracking-widest text-rize-primary">Our Team</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-950">
            Meet Our Expert Team
          </h2>
        </div>

        {/* TEAM GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {TEAM_MEMBERS.map((member, i) => {
            const isActive = activeCardIndex === i;

            // Determine correct responsive zoom classes to match the original desktop effects
            let zoomClasses = "";
            if (member.name === "Mohit Srivastava" || member.name === "DEVENDRA SINGH" || member.name === "Manoj kumar") {
              zoomClasses = isActive 
                ? "scale-[1.45]" 
                : "scale-[1.35] md:group-hover:scale-[1.45]";
            } else if (member.name === "Kaveendra Saini") {
              zoomClasses = isActive 
                ? "scale-[1.25]" 
                : "scale-[1.15] md:group-hover:scale-[1.25]";
            } else if (member.name === "Sahil Gupta") {
              zoomClasses = isActive 
                ? "scale-[1.45] translate-y-6" 
                : "scale-[1.35] translate-y-6 md:group-hover:scale-[1.45]";
            } else {
              zoomClasses = isActive 
                ? "scale-105" 
                : "md:group-hover:scale-105";
            }

            return (
              <div
                key={i}
                onClick={() => handleCardClick(i)}
                className={`w-full max-w-[360px] rounded-3xl p-4 border transition-all duration-300 flex flex-col relative overflow-hidden cursor-pointer select-none group ${
                  isActive 
                    ? 'border-rize-primary/40 shadow-[0_20px_50px_rgba(26,86,219,0.15)] bg-gray-900 text-white' 
                    : 'bg-white border-gray-200 shadow-sm text-gray-900 md:hover:border-rize-primary/40 md:hover:shadow-[0_20px_50px_rgba(26,86,219,0.15)] md:hover:bg-gray-900 md:hover:text-white'
                }`}
              >
                {/* Image Section */}
                <div className="relative overflow-hidden rounded-2xl aspect-4/5 bg-gray-100 mb-6 flex items-center justify-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      isActive ? 'grayscale-0' : 'md:grayscale md:group-hover:grayscale-0'
                    } ${zoomClasses} transform-[translateZ(0)] backface-hidden will-change-[transform,filter]`}
                  />

                  {/* Gradient Overlay with Name and Role on Hover */}
                  <div 
                    className={`absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5 text-left transition-all duration-500 ${
                      isActive 
                        ? 'opacity-100 pointer-events-auto' 
                        : 'opacity-0 pointer-events-none md:group-hover:opacity-100 md:group-hover:pointer-events-auto'
                    }`}
                  >
                    <h3 className="text-xl md:text-2xl font-bold uppercase text-white leading-tight">
                      {member.name}
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-wider mt-1 text-rize-primary">
                      {member.role}
                    </p>
                  </div>
                  

                </div>

                {/* Info Footer */}
                <div className={`px-2 pb-2 transition-all duration-300 ${
                  isActive 
                    ? 'opacity-0 pointer-events-none' 
                    : 'opacity-100 md:group-hover:opacity-0 md:group-hover:pointer-events-none'
                }`}>
                  <h3 className={`text-2xl font-bold uppercase ${isActive ? 'text-white' : 'text-gray-950 md:group-hover:text-white'}`}>
                    {member.name}
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-wider mt-1.5 text-rize-primary">
                    {member.role}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
