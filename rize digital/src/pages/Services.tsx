import { Link } from 'react-router-dom';
import { 
  Share2, 
  Search, 
  FileText, 
  Palette, 
  MousePointerClick, 
  Layout, 
  Code, 
  Settings, 
  ShoppingBag, 
  Layers, 
  ArrowUpRight, 
  Sparkles
} from 'lucide-react';
import SEO from '../components/common/SEO';

const ALL_SERVICES = [
  {
    title: "Digital Marketing",
    description: "Holistic marketing campaigns designed to establish presence, build brand identity, and generate verified revenue pipelines.",
    icon: <Sparkles className="w-6 h-6" />,
    path: "/services/digital-marketing",
    tags: ["Strategy", "Growth", "Data Analytics"],
    colorClass: "icon-box-blue"
  },
  {
    title: "Web Development",
    description: "Robust, responsive, and performance-tuned web applications engineered to convert visiting traffic into customers.",
    icon: <Layout className="w-6 h-6" />,
    path: "/services/web-development",
    tags: ["Frontend", "Backend", "Speed Optimization"],
    colorClass: "icon-box-indigo"
  },
  {
    title: "SEO Optimization",
    description: "Technical audit, on-page optimization, content structure alignment, and quality link building to dominate search results.",
    icon: <Search className="w-6 h-6" />,
    path: "/services/seo",
    tags: ["Ranking", "Keywords", "Link Building"],
    colorClass: "icon-box-cyan"
  },
  {
    title: "Social Media Marketing",
    description: "Engaging and strategic social campaigns crafted to drive consumer interaction, grow followers, and build authentic connections.",
    icon: <Share2 className="w-6 h-6" />,
    path: "/services/social-media-marketing",
    tags: ["Branding", "Management", "Content Creation"],
    colorClass: "icon-box-gold"
  },
  {
    title: "PPC Advertising (Paid Ads)",
    description: "Highly targeted Pay-Per-Click campaigns that maximize advertising return on investment with laser precision.",
    icon: <MousePointerClick className="w-6 h-6" />,
    path: "/services/paid-ads",
    tags: ["Google Ads", "Meta Ads", "ROI Optimization"],
    colorClass: "icon-box-green"
  },
  {
    title: "WordPress Development",
    description: "Secure, easily manageable, and highly customized WordPress sites configured for your specific operational scale.",
    icon: <Code className="w-6 h-6" />,
    path: "/services/wordpress-development",
    tags: ["Themes", "Plugins", "CMS Scaling"],
    colorClass: "icon-box-blue"
  },
  {
    title: "Custom Website Development",
    description: "Tailor-made web solutions designed from scratch utilizing modern stacks (MERN, React, Node) to solve unique challenges.",
    icon: <Settings className="w-6 h-6" />,
    path: "/services/custom-website-development",
    tags: ["React/Vite", "Custom APIs", "Databases"],
    colorClass: "icon-box-indigo"
  },
  {
    title: "Content Marketing",
    description: "Value-focused, relevant, and SEO-optimized written copy designed to capture organic interest and address buyer queries.",
    icon: <FileText className="w-6 h-6" />,
    path: "/services/content-marketing",
    tags: ["Blogs", "Copywriting", "Authority"],
    colorClass: "icon-box-cyan"
  },
  {
    title: "Graphic Design",
    description: "Premium visual assets, brand identity guides, logos, and UI patterns designed to convey information beautifully.",
    icon: <Palette className="w-6 h-6" />,
    path: "/services/graphic-design",
    tags: ["Identity", "Illustrations", "Creative Layouts"],
    colorClass: "icon-box-gold"
  },
  {
    title: "Ecommerce Development",
    description: "Highly transactional e-commerce platforms engineered with smooth checkouts, cart recovery systems, and inventory integrations.",
    icon: <ShoppingBag className="w-6 h-6" />,
    path: "/services/ecommerce-development",
    tags: ["Shopify", "WooCommerce", "Cart Optimization"],
    colorClass: "icon-box-green"
  },
  {
    title: "UI/UX Design",
    description: "Comprehensive user journey planning, wireframing, high-fidelity prototypes, and thorough usability research.",
    icon: <Layers className="w-6 h-6" />,
    path: "/services/ui-ux-design",
    tags: ["Figma", "Wireframes", "User Journeys"],
    colorClass: "icon-box-blue"
  }
];

export default function Services() {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "RizeWorld Digital Services Hub",
    "description": "Our complete agency services range from SEO and graphic design to web development and performance marketing.",
    "itemListElement": ALL_SERVICES.map((s, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `https://rizeworld.in${s.path}`,
      "name": s.title
    }))
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
      }
    ]
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 text-left font-sans selection:bg-blue-600 selection:text-white">
      <SEO 
        title="Our Services | Full-Service Digital Agency - RizeWorld"
        description="Explore RizeWorld's premium marketing and engineering services. We offer search engine optimization, web development, content marketing, UI/UX, graphic design, and custom software development."
        canonicalUrl="https://rizeworld.in/services"
        schema={[schemaMarkup, breadcrumbSchema]}
      />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-wider">
          <Link to="/" className="hover:text-rize-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-rize-primary">Services</span>
        </div>
      </div>

      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-4xl">
          <span className="text-xs font-black uppercase tracking-widest text-rize-primary flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-rize-primary" /> Solutions Hub
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-gray-950 leading-[0.95] uppercase tracking-tighter mb-8">
            Digital Capabilities <br />
            & Solutions.
          </h1>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-2xl">
            We operate at the convergence of strategic branding, performance marketing, and high-quality software engineering. Explore our complete suite of solutions to scale your business.
          </p>
        </div>
      </section>

      {/* Grid List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ALL_SERVICES.map((s, idx) => (
            <Link 
              key={idx}
              to={s.path}
              className="bg-white border border-gray-200/80 rounded-4xl p-8 flex flex-col justify-between group hover:border-rize-primary/40 hover:shadow-[0_20px_50px_rgba(26,86,219,0.06)] transition-all duration-500 relative overflow-hidden cursor-pointer"
            >
              <div>
                <div className={`icon-box ${s.colorClass} mb-8 shadow-xs`}>
                  {s.icon}
                </div>
                <h3 className="text-xl font-bold uppercase text-gray-950 mb-3 group-hover:text-rize-primary transition-colors">
                  {s.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-8 h-16 overflow-hidden line-clamp-3">
                  {s.description}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {s.tags.map((tag, i) => (
                    <span key={i} className="text-[9px] font-black uppercase tracking-wide text-gray-500 bg-stone-100 px-3.5 py-1.5 rounded-full group-hover:bg-rize-primary/5 group-hover:text-rize-primary transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-5 mt-auto flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-widest text-rize-primary uppercase">Explore Details</span>
                  <div className="w-8 h-8 rounded-full bg-gray-50 text-gray-800 flex items-center justify-center group-hover:bg-rize-primary group-hover:text-white transition-colors duration-300">
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Areas we serve summary */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 pt-20 border-t border-gray-200">
        <div className="bg-gray-950 text-white rounded-[2.5rem] p-8 md:p-16 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(26,86,219,0.12),transparent_50%)] pointer-events-none" />
          <div className="relative z-10 max-w-xl text-left">
            <h2 className="text-2xl md:text-4xl font-bold uppercase mb-4">Areas We Serve</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              We deliver digital success across cities like Alwar, Udaipur, Prayagraj, Indore, and Chandigarh. Let us grow your local business presence.
            </p>
          </div>
          <div className="relative z-10 flex flex-wrap gap-3 justify-center md:justify-end">
            <Link to="/service/digital-marketing-agency-in-alwar" className="px-6 py-3 bg-zinc-800 hover:bg-rize-primary hover:text-white text-xs font-bold rounded-full transition-colors uppercase">Alwar</Link>
            <Link to="/service/digital-marketing-agency-in-udaipur" className="px-6 py-3 bg-zinc-800 hover:bg-rize-primary hover:text-white text-xs font-bold rounded-full transition-colors uppercase">Udaipur</Link>
            <Link to="/service/digital-marketing-agency-in-prayagraj" className="px-6 py-3 bg-zinc-800 hover:bg-rize-primary hover:text-white text-xs font-bold rounded-full transition-colors uppercase">Prayagraj</Link>
            <Link to="/service/digital-marketing-agency-in-indore" className="px-6 py-3 bg-zinc-800 hover:bg-rize-primary hover:text-white text-xs font-bold rounded-full transition-colors uppercase">Indore</Link>
            <Link to="/service/digital-marketing-agency-in-chandigarh" className="px-6 py-3 bg-zinc-800 hover:bg-rize-primary hover:text-white text-xs font-bold rounded-full transition-colors uppercase">Chandigarh</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
