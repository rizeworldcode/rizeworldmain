import { Link } from 'react-router-dom';
import { ArrowUpRight, Briefcase, HelpCircle, DollarSign, FolderOpen, Phone } from 'lucide-react';

const LINKS = [
  { name: "Portfolio", path: "/portfolio", icon: FolderOpen, desc: "View our work" },
  { name: "Pricing", path: "/pricing", icon: DollarSign, desc: "Transparent models" },
  { name: "FAQ", path: "/faq", icon: HelpCircle, desc: "Common questions" },
  { name: "Services", path: "/services", icon: Briefcase, desc: "All solutions" },
  { name: "Contact", path: "/contact", icon: Phone, desc: "Get in touch" },
];

export default function InternalLinkSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-gray-50 border border-gray-200/60 rounded-[2rem] p-6 md:p-8">
        <div className="flex flex-wrap justify-center gap-3">
          {LINKS.map((link, idx) => {
            const Icon = link.icon;
            return (
              <Link
                key={idx}
                to={link.path}
                className="bg-white border border-gray-200/80 rounded-2xl px-5 py-3 flex items-center gap-3 hover:border-orange-500/40 hover:shadow-sm transition-all duration-300 group"
              >
                <Icon size={16} className="text-gray-400 group-hover:text-orange-500 transition-colors shrink-0" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700 group-hover:text-orange-500 transition-colors block leading-tight">
                    {link.name}
                  </span>
                  <span className="text-[9px] text-gray-400 font-medium">{link.desc}</span>
                </div>
                <ArrowUpRight size={12} className="text-gray-300 group-hover:text-orange-500 transition-colors shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
