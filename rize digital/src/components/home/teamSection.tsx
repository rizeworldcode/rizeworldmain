import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-5xl mx-auto text-center mb-16 md:mb-20">
    <span className="section-label mb-4 block">
      Our Team
    </span>
    <h2 className="section-title mb-6">
      {children}
    </h2>
    <p className="section-subtitle max-w-3xl mx-auto">
      Meet the brilliant minds behind RizeWorld. Our team of experts brings together data-driven strategy, creative excellence, and technical innovation to deliver measurable growth for our clients.
    </p>
    <Link to="/team" className="btn-primary mt-10 shadow-none group">
      Join Our Team
      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </Link>
  </div>
);

const TEAM_MEMBERS = [
  {
    name: "Devesh Choudhary",
    role: "Digital Marketing Specialist",
    image: "/team/D1.png",
  },
  {
    name: "Mohit Srivastava",
    role: "Senior Graphic Designer",
    image: "/team/mohit.jpg.jpeg",
    zoom: "scale-[1.35] group-hover:scale-[1.45]",
  },
  {
    name: "Kaveendra Saini",
    role: "Video Editor",
    image: "/team/kavin.jpg.jpeg",
    zoom: "scale-[1.15] group-hover:scale-[1.25]"
  },
  {
    name: "Sahil Gupta",
    role: "HR Lead",
    image: "/team/hr.jpg.jpeg",
    zoom: "scale-[1.35] translate-y-6 group-hover:scale-[1.45] group-hover:translate-y-6",
  },
  {
    name: "DEVENDRA SINGH",
    role: "SEO EXECUTIVE",
    image: "/team/bhai.jpg.jpeg",
    zoom: "scale-[1.35] group-hover:scale-[1.45]",
  },
    {
    name: "Manoj kumar",
    role: "Data analyst",
    image: "/team/manoj.jpg.jpeg",
    zoom: "scale-[1.35] group-hover:scale-[1.45]",
  },
  {
    name: "Aman",
    role: "Web developer",
    image: "/team/aman.jpg.jpeg",
  },
];

const TeamMemberCard = ({ data }: { data: typeof TEAM_MEMBERS[0] }) => (
  <div className="group relative rounded-3xl overflow-hidden border border-gray-150 bg-white p-4 transition-all duration-500 hover:-translate-y-2 hover:border-rize-primary/20 hover:shadow-[0_0_40px_rgba(26,86,219,0.1)] flex flex-col w-[280px] sm:w-[320px] shrink-0">
    {/* Image Section */}
    <div className="relative overflow-hidden rounded-2xl mb-6 aspect-4/5 shrink-0 bg-gray-50 flex items-center justify-center">
      <img 
        src={data.image} 
        alt={data.name} 
        className={`w-full h-full object-cover transition-transform duration-700 lg:grayscale lg:group-hover:grayscale-0 ${data.zoom || 'group-hover:scale-105'} transform-[translateZ(0)] backface-hidden will-change-[transform,filter]`}
      />
    </div>

    {/* Content */}
    <div className="flex flex-col items-center text-center px-2 pb-4">
      <h3 className="text-black text-2xl font-bold leading-none mb-3 uppercase">{data.name}</h3>
      <p className="text-rize-primary font-bold tracking-widest text-xs uppercase">{data.role}</p>
    </div>
  </div>
);

export default function CaseStudiesSection() {
  return (
    <section className="relative w-full min-h-screen px-4 sm:px-6 md:px-8 lg:px-12 py-20 md:py-32 flex flex-col justify-center bg-rize-bg overflow-hidden border-t border-gray-100">
      
      <div className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col h-full">
        
        {/* Header Section */}
        <SectionHeading>
          The <span className="gradient-text">Experts</span> Behind<br />
          Your Digital Growth
        </SectionHeading>

        {/* Scrolling Marquee Container */}
        <div className="relative w-full mt-auto pb-10 mask-image-horizontal">
          <style>
            {`
              @keyframes marquee-horizontal {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee-horizontal {
                animation: marquee-horizontal 30s linear infinite;
              }
              /* Hover pause */
              .animate-marquee-horizontal:hover {
                animation-play-state: paused;
              }
            `}
          </style>

          <div className="flex w-max animate-marquee-horizontal gap-6 md:gap-8 px-4">
            {/* Repeat the cards for infinite scroll illusion */}
            {[...TEAM_MEMBERS, ...TEAM_MEMBERS, ...TEAM_MEMBERS, ...TEAM_MEMBERS].map((member, idx) => (
              <TeamMemberCard key={`${member.name}-${idx}`} data={member} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
