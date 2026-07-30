import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-5xl mx-auto text-center mb-16 md:mb-20">
    <h2 className="text-gray-900 font-bold leading-tight tracking-tight text-5xl md:text-6xl lg:text-7xl mb-6">
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

// Add new team members here — the loop will auto-adjust, no other changes needed
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
    <div className="relative overflow-hidden rounded-2xl mb-6 aspect-4/5 shrink-0 bg-gray-50 flex items-center justify-center">
      <img
        src={data.image}
        alt={data.name}
        className={`w-full h-full object-cover transition-transform duration-700 lg:grayscale lg:group-hover:grayscale-0 ${data.zoom || 'group-hover:scale-105'} transform-[translateZ(0)] backface-hidden will-change-[transform,filter]`}
      />
    </div>
    <div className="flex flex-col items-center text-center px-2 pb-4">
      <h3 className="text-black text-2xl font-bold leading-none mb-3 uppercase">{data.name}</h3>
      <p className="text-rize-primary font-bold tracking-widest text-xs uppercase">{data.role}</p>
    </div>
  </div>
);

export default function CaseStudiesSection() {
  return (
    <section className="relative w-full min-h-screen py-20 md:py-32 flex flex-col justify-center bg-rize-bg border-t border-gray-100">

      {/* Heading — stays constrained */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <SectionHeading>
          Our <span className="text-orange-500">Team</span>
        </SectionHeading>
      </div>

      {/* SEAMLESS INFINITE MARQUEE — full screen width, edge to edge
          - Exactly 2 identical sets (original + duplicate)
          - translateX(-50%) = exactly 1 set width => seamless reset
          - Add members to TEAM_MEMBERS array — works automatically
      */}
      <div className="relative w-full overflow-hidden pb-10">
        <style>{`
          @keyframes team-marquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .team-marquee-track {
            display: flex;
            width: max-content;
            gap: 1.5rem;
            animation: team-marquee 30s linear infinite;
            will-change: transform;
          }
          .team-marquee-track:hover {
            animation-play-state: paused;
          }
        `}</style>

        <div className="team-marquee-track">
          {TEAM_MEMBERS.map((member, idx) => (
            <TeamMemberCard key={`s1-${idx}`} data={member} />
          ))}
          {TEAM_MEMBERS.map((member, idx) => (
            <TeamMemberCard key={`s2-${idx}`} data={member} aria-hidden="true" />
          ))}
        </div>
      </div>

    </section>
  );
}

