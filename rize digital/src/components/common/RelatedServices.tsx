import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const SERVICES = [
  { name: "Digital Marketing", path: "/services/digital-marketing" },
  { name: "SEO", path: "/services/seo" },
  { name: "Social Media Marketing", path: "/services/social-media-marketing" },
  { name: "Paid Ads", path: "/services/paid-ads" },
  { name: "Web Development", path: "/services/web-development" },
  { name: "Content Marketing", path: "/services/content-marketing" },
  { name: "WordPress Development", path: "/services/wordpress-development" },
  { name: "Custom Web Development", path: "/services/custom-website-development" },
  { name: "E-Commerce Development", path: "/services/ecommerce-development" },
  { name: "UI/UX Design", path: "/services/ui-ux-design" },
  { name: "Graphic Design", path: "/services/graphic-design" },
];

interface RelatedServicesProps {
  exclude?: string[];
  limit?: number;
}

export default function RelatedServices({ exclude = [], limit = 4 }: RelatedServicesProps) {
  const filtered = SERVICES.filter(s => !exclude.includes(s.path)).slice(0, limit);

  if (filtered.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-500 block mb-2">Explore More</span>
        <h2 className="text-2xl md:text-3xl font-black text-gray-950 uppercase tracking-tight">
          Related Services
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((srv, idx) => (
          <Link
            key={idx}
            to={srv.path}
            className="bg-white border border-gray-200/80 rounded-2xl p-5 flex items-center justify-between gap-3 hover:border-orange-500/40 hover:shadow-md transition-all duration-300 group"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700 group-hover:text-orange-500 transition-colors">
              {srv.name}
            </span>
            <ArrowUpRight size={14} className="text-gray-300 group-hover:text-orange-500 transition-colors shrink-0" />
          </Link>
        ))}
      </div>
    </section>
  );
}
