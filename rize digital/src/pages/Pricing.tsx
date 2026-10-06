import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Shield, 
  Search, 
  Share2, 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SEO from '../components/common/SEO';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { 
  SEO_PACKAGES, 
  SMM_PACKAGES, 
  WEBSITE_PACKAGES, 
  type PricingPackage 
} from '../data/pricingData';

type CategoryType = 'seo' | 'smm' | 'website';

export default function Pricing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const categoryParam = searchParams.get('category') as CategoryType | null;
  const initialCategory: CategoryType = 
    (categoryParam === 'website' || categoryParam === 'smm' || categoryParam === 'seo')
      ? categoryParam
      : 'seo';

  const [activeCategory, setActiveCategory] = useState<CategoryType>(initialCategory);

  // Sync state if URL search params change (e.g. browser back/forward or programmatic navigation)
  useEffect(() => {
    const cat = searchParams.get('category') as CategoryType | null;
    if (cat === 'website' || cat === 'smm' || cat === 'seo') {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  const handleCategoryChange = (cat: CategoryType) => {
    setActiveCategory(cat);
    setSearchParams({ category: cat }, { replace: true });
  };

  const pricingSchema = {
    "@context": "https://schema.org",
    "@type": "PricingPage",
    "name": "RizeWorld Digital Pricing Packages & Proposals",
    "description": "Explore transparent SEO, Social Media Management, and Custom Website Development pricing packages and formal client proposals.",
    "url": "https://rizeworld.in/pricing"
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
        "name": "Pricing",
        "item": "https://rizeworld.in/pricing"
      }
    ]
  };

  const getTierColors = (tier: PricingPackage['tier']) => {
    switch (tier) {
      case 'bronze':
      case 'starter':
        return {
          pill: 'bg-amber-100 text-amber-800 border-amber-300',
          gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
          borderHover: 'hover:border-amber-500/60',
          btn: 'bg-amber-600 hover:bg-amber-700 text-white',
          glow: 'group-hover:shadow-[0_20px_40px_rgba(217,119,6,0.12)]'
        };
      case 'silver':
        return {
          pill: 'bg-slate-100 text-slate-800 border-slate-300',
          gradient: 'from-slate-500/10 via-slate-500/5 to-transparent',
          borderHover: 'hover:border-slate-500/60',
          btn: 'bg-slate-700 hover:bg-slate-800 text-white',
          glow: 'group-hover:shadow-[0_20px_40px_rgba(100,116,139,0.12)]'
        };
      case 'gold':
      case 'growth':
        return {
          pill: 'bg-yellow-100 text-yellow-900 border-yellow-400',
          gradient: 'from-amber-400/20 via-yellow-500/10 to-transparent',
          borderHover: 'hover:border-yellow-500 border-yellow-400/80 shadow-md shadow-yellow-500/10',
          btn: 'bg-rize-primary hover:bg-blue-700 text-white',
          glow: 'group-hover:shadow-[0_20px_40px_rgba(234,179,8,0.16)]'
        };
      case 'platinum':
      case 'elite':
        return {
          pill: 'bg-indigo-100 text-indigo-950 border-indigo-300',
          gradient: 'from-indigo-600/15 via-blue-500/10 to-transparent',
          borderHover: 'hover:border-indigo-500/70',
          btn: 'bg-gray-950 hover:bg-rize-primary text-white',
          glow: 'group-hover:shadow-[0_20px_40px_rgba(79,70,229,0.14)]'
        };
    }
  };

  const getActiveCategoryData = () => {
    switch (activeCategory) {
      case 'seo':
        return {
          title: "Choose Your SEO Growth Tier",
          sub: "Search Engine Optimization",
          packages: SEO_PACKAGES
        };
      case 'smm':
        return {
          title: "Choose Your Social Media Growth Tier",
          sub: "Social Media Management",
          packages: SMM_PACKAGES
        };
      case 'website':
        return {
          title: "Choose Your Website Engineering Tier",
          sub: "Custom Website Development",
          packages: WEBSITE_PACKAGES
        };
    }
  };

  const currentCategory = getActiveCategoryData();

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 text-left font-sans selection:bg-rize-primary selection:text-white">
      <SEO 
        title="SEO, Social Media & Web Development Pricing Packages | RizeWorld"
        description="Explore our transparent SEO plans (Starter, Growth, Elite), Social Media Management plans, and Custom Website Development pricing proposals."
        canonicalUrl="https://rizeworld.in/pricing"
        schema={[pricingSchema, breadcrumbSchema]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Breadcrumbs items={[{ name: "Pricing Packages" }]} />
      </div>

      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200/60 rounded-full px-4 py-1.5 mb-5 shadow-xs">
          <Sparkles className="w-4 h-4 text-rize-primary" />
          <span className="text-xs font-black text-rize-primary uppercase tracking-widest">
            Transparent Pricing Systems
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-950 uppercase tracking-tighter mb-6 leading-tight">
          Performance Packages <br />
          Built For Growth.
        </h1>
        <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Select a category below to explore our structured service tiers. Click any package to view its formal executive proposal and complete scope of deliverables.
        </p>

        {/* 3 Categories Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-10 p-1.5 bg-stone-200/80 backdrop-blur-md rounded-full max-w-fit mx-auto border border-stone-300/80 shadow-xs">
          <button
            onClick={() => handleCategoryChange('seo')}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              activeCategory === 'seo'
                ? 'bg-rize-primary text-white shadow-md shadow-rize-primary/30 scale-102'
                : 'text-gray-700 hover:text-rize-primary hover:bg-white/60'
            }`}
          >
            <Search size={15} />
            SEO
          </button>

          <button
            onClick={() => handleCategoryChange('smm')}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              activeCategory === 'smm'
                ? 'bg-rize-primary text-white shadow-md shadow-rize-primary/30 scale-102'
                : 'text-gray-700 hover:text-rize-primary hover:bg-white/60'
            }`}
          >
            <Share2 size={15} />
            Social Media Management
          </button>

          <button
            onClick={() => handleCategoryChange('website')}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              activeCategory === 'website'
                ? 'bg-rize-primary text-white shadow-md shadow-rize-primary/30 scale-102'
                : 'text-gray-700 hover:text-rize-primary hover:bg-white/60'
            }`}
          >
            <Globe size={15} />
            Website
          </button>
        </div>
      </section>

      {/* Main Content Area: Dynamic Cards for Active Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-rize-primary">
              {currentCategory.sub}
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-gray-950 uppercase tracking-tight mt-1">
              {currentCategory.title}
            </h2>
          </div>
          <p className="text-xs text-gray-500 hidden sm:block">Click any package to open its formal proposal</p>
        </div>

        <div className={`grid gap-6 items-stretch ${
          currentCategory.packages.length === 3
            ? 'grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
        }`}>
          {currentCategory.packages.map((pkg) => {
            const colors = getTierColors(pkg.tier);
            return (
              <motion.div
                key={pkg.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                onClick={() => navigate(`/pricing/${pkg.id}`)}
                className={`group bg-white border border-gray-200/90 rounded-4xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden transition-all duration-300 shadow-xs cursor-pointer ${colors.borderHover} ${colors.glow}`}
              >
                {/* Background subtle tint */}
                <div className={`absolute inset-0 bg-gradient-to-b ${colors.gradient} pointer-events-none opacity-60`} />

                {/* Popular / Tier Badge */}
                {pkg.popular && (
                  <span className="absolute top-4 right-4 bg-rize-primary text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                    Popular
                  </span>
                )}

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${colors.pill}`}>
                      {pkg.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-gray-950 uppercase tracking-tight mb-2">
                    {pkg.name}
                  </h3>

                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4 leading-snug">
                    {pkg.tagline}
                  </p>

                  <p className="text-xs text-gray-500 leading-relaxed mb-6 line-clamp-3">
                    {pkg.summary}
                  </p>

                  {/* Feature Highlights List */}
                  <div className="space-y-3 pt-5 border-t border-gray-100 mb-6">
                    {pkg.keyHighlights.map((hl, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-rize-primary shrink-0 mt-0.5" />
                        <span className="text-xs font-semibold text-gray-800 leading-snug">
                          {hl}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 mt-4 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/pricing/${pkg.id}`);
                    }}
                    className={`w-full py-3.5 px-4 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${colors.btn} shadow-xs group-hover:shadow-md`}
                  >
                    <FileText size={14} />
                    Open Package Proposal
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Trust Badge Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-8">
        <div className="inline-flex items-center gap-2 bg-stone-100 border border-gray-200/60 rounded-full px-5 py-2.5 shadow-2xs">
          <Shield className="w-4 h-4 text-rize-primary" />
          <span className="text-[10px] font-black text-gray-800 uppercase tracking-widest">
            100% Secure Custom Growth Contracts - Transparent Deliverables
          </span>
        </div>
      </section>
    </div>
  );
}
