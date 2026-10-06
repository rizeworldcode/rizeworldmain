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

const WhatsAppIcon = ({ className = "w-4 h-4 shrink-0 fill-current" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.031 0C5.397 0 0 5.397 0 12.031c0 2.119.552 4.191 1.603 6.012L0 24l6.155-1.603a12.006 12.006 0 0 0 5.876 1.603h.001c6.634 0 12.031-5.397 12.031-12.031S18.665 0 12.031 0zm0 21.724h-.001c-1.928 0-3.821-.519-5.474-1.499l-.393-.235-4.076 1.064 1.087-3.974-.256-.402c-1.077-1.693-1.644-3.649-1.644-5.659 0-5.892 4.795-10.687 10.687-10.687 2.854 0 5.536 1.112 7.55 3.136 2.014 2.023 3.125 4.707 3.124 7.561-.001 5.891-4.796 10.687-10.687 10.687zm5.85-8.006c-.321-.161-1.901-.938-2.196-1.046-.296-.108-.511-.161-.726.162-.215.323-.834 1.046-1.023 1.261-.189.215-.378.242-.7.081-.321-.161-1.356-.501-2.582-1.595-.953-.85-1.597-1.899-1.785-2.222-.189-.323-.02-.497.141-.658.146-.145.323-.378.484-.567.161-.189.215-.323.323-.54.108-.215.054-.403-.027-.567-.081-.161-.726-1.751-.994-2.395-.262-.631-.532-.544-.726-.554-.188-.011-.403-.011-.617-.011-.215 0-.564.081-.86.403-.296.323-1.129 1.102-1.129 2.688 0 1.585 1.21 3.118 1.378 3.333.161.215 2.25 3.441 5.451 4.829 2.76 1.192 3.456.953 4.075.899.617-.054 1.901-.777 2.17-1.503.269-.726.269-1.349.189-1.483-.081-.135-.304-.215-.625-.376z"/>
  </svg>
);

export default function Pricing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const categoryParam = searchParams.get('category') as CategoryType | null;
  const initialCategory: CategoryType = 
    (categoryParam === 'website' || categoryParam === 'smm' || categoryParam === 'seo')
      ? categoryParam
      : 'seo';

  const [activeCategory, setActiveCategory] = useState<CategoryType>(initialCategory);

  // Custom Card Query States
  const [customName, setCustomName] = useState('');
  const [customPhone, setCustomPhone] = useState('');
  const [customQuery, setCustomQuery] = useState('');

  // Sync state if URL search params change
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

  const handleSendWhatsapp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const categoryTitle = 
      activeCategory === 'seo' ? 'SEO Plan' :
      activeCategory === 'smm' ? 'Social Media Management Plan' :
      'Custom Website Plan';

    let message = `Hello RizeWorld! 🚀\n\nI want to discuss a *Custom ${categoryTitle}* for my business.\n\n`;
    if (customName.trim()) {
      message += `👤 *Name / Business:* ${customName.trim()}\n`;
    }
    if (customPhone.trim()) {
      message += `📞 *Phone / Contact:* ${customPhone.trim()}\n`;
    }
    if (customQuery.trim()) {
      message += `📝 *My Custom Requirements:*\n${customQuery.trim()}\n\n`;
    } else {
      message += `📝 *Requirements:* Please connect with me to discuss tailored deliverables and a custom quote.\n\n`;
    }
    message += `Shared from RizeWorld Pricing Packages.`;

    const url = `https://wa.me/919024615510?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
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
          packages: SEO_PACKAGES,
          customTitle: "Custom SEO Plan",
          customTagline: "Tailored Keywords & Organic Strategy",
          customSummary: "Have unique SEO targets, multiple domains, or an enterprise e-commerce store? Get a fully bespoke scope, custom deliverables, and dedicated timeline.",
          customPlaceholder: "Tell us your target keywords, website URL, or custom SEO goals...",
          customHighlights: [
            "Tailored Keyword Research & Target Count",
            "Custom Technical & Backlink Strategy",
            "Flexible Budget & Dedicated SEO Manager",
            "Direct WhatsApp Consultation & Proposal"
          ]
        };
      case 'smm':
        return {
          title: "Choose Your Social Media Growth Tier",
          sub: "Social Media Management",
          packages: SMM_PACKAGES,
          customTitle: "Custom Social Media Plan",
          customTagline: "Bespoke Content, Reels & Ad Campaigns",
          customSummary: "Need a custom number of reels, influencer campaigns, or cross-platform paid advertising? Let's build a tailored package suited to your exact audience.",
          customPlaceholder: "Tell us platforms, monthly reels/posts, or campaign goals...",
          customHighlights: [
            "Custom Reel & Post Production Volume",
            "Tailored Platform Mix & Paid Ad Scaling",
            "Dedicated Creative Strategist",
            "Direct WhatsApp Consultation & Proposal"
          ]
        };
      case 'website':
        return {
          title: "Choose Your Website Engineering Tier",
          sub: "Custom Website Development",
          packages: WEBSITE_PACKAGES,
          customTitle: "Custom Website Plan",
          customTagline: "Bespoke Features, Architecture & Apps",
          customSummary: "Building a complex web application, custom database, portal, or bespoke UI/UX? Share your requirements with our full-stack engineering team.",
          customPlaceholder: "Tell us your required website features, pages, or tech stack...",
          customHighlights: [
            "100% Bespoke Tech Stack & Architecture",
            "Custom Integrations (CRM, ERP, Gateways)",
            "Milestone-Based Flexible Payment Plan",
            "Direct WhatsApp Consultation & Proposal"
          ]
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
          Select a category below to explore our structured service tiers. Click any package to view its formal executive proposal, or submit your custom query directly on WhatsApp.
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
            Custom Website Development
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
          <p className="text-xs text-gray-500 hidden sm:block">Click any package for its formal proposal, or send a custom query</p>
        </div>

        <div className={`grid gap-5 items-stretch ${
          activeCategory === 'seo'
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
        }`}>
          {/* Pre-configured Packages */}
          {currentCategory.packages.map((pkg) => {
            const colors = getTierColors(pkg.tier);
            return (
              <motion.div
                key={pkg.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                onClick={() => navigate(`/pricing/${pkg.id}`)}
                className={`group bg-white border border-gray-200/90 rounded-3xl p-5 sm:p-5.5 flex flex-col justify-between relative overflow-hidden transition-all duration-300 shadow-2xs cursor-pointer ${colors.borderHover} ${colors.glow}`}
              >
                {/* Background subtle tint */}
                <div className={`absolute inset-0 bg-gradient-to-b ${colors.gradient} pointer-events-none opacity-60`} />

                {/* Popular / Tier Badge */}
                {pkg.popular && (
                  <span className="absolute top-3.5 right-3.5 bg-rize-primary text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-xs">
                    Popular
                  </span>
                )}

                <div className="relative z-10">
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${colors.pill}`}>
                      {pkg.badge}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-gray-950 uppercase tracking-tight mb-1">
                    {pkg.name}
                  </h3>

                  <p className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2 leading-tight">
                    {pkg.tagline}
                  </p>

                  <p className="text-[11px] text-gray-500 leading-relaxed mb-3 line-clamp-2">
                    {pkg.summary}
                  </p>

                  {/* Feature Highlights List - Compact 3-4 points */}
                  <div className="space-y-1.5 pt-3 border-t border-gray-100 mb-3">
                    {pkg.keyHighlights.slice(0, 3).map((hl, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-rize-primary shrink-0 mt-0.5" />
                        <span className="text-[11px] font-semibold text-gray-800 leading-tight">
                          {hl}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 mt-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/pricing/${pkg.id}`);
                    }}
                    className={`w-full py-2.5 px-3 rounded-full text-[11px] font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${colors.btn} shadow-2xs group-hover:shadow-xs`}
                  >
                    <FileText size={13} />
                    Open Proposal
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}

          {/* COMPACT CUSTOM QUERY CARD WITH WHATSAPP INTEGRATION */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}
            className="group bg-white border-2 border-emerald-500/40 hover:border-emerald-500 rounded-3xl p-5 sm:p-5.5 flex flex-col justify-between relative overflow-hidden transition-all duration-300 shadow-2xs hover:shadow-[0_16px_32px_rgba(16,185,129,0.12)]"
          >
            {/* Background emerald tint */}
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent pointer-events-none opacity-80" />

            {/* WhatsApp Direct Badge */}
            <span className="absolute top-3.5 right-3.5 bg-emerald-600 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1 z-20">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              WhatsApp Direct
            </span>

            <div className="relative z-10 flex flex-col">
              <div className="flex items-center gap-1.5 mb-2.5">
                <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border bg-emerald-100 text-emerald-900 border-emerald-300 flex items-center gap-1">
                  <Sparkles size={10} className="text-emerald-600" />
                  Custom Tier
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-gray-950 uppercase tracking-tight mb-1">
                {currentCategory.customTitle}
              </h3>

              <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-2 leading-tight">
                {currentCategory.customTagline}
              </p>

              {/* Compact Quick Feature Badges */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2 py-0.5 rounded-md">
                  ✓ Custom Scope
                </span>
                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2 py-0.5 rounded-md">
                  ✓ Flexible Budget
                </span>
                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2 py-0.5 rounded-md">
                  ✓ Quick Quote
                </span>
              </div>

              {/* Clean Form */}
              <div className="space-y-2.5 pt-2.5 border-t border-emerald-100/80">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-stone-50/90 border border-gray-200/90 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/15 focus:outline-hidden transition-all text-gray-900 placeholder:text-gray-400 font-medium"
                  />
                  <input
                    type="tel"
                    value={customPhone}
                    onChange={(e) => setCustomPhone(e.target.value)}
                    placeholder="WhatsApp No."
                    className="w-full text-xs px-3 py-2.5 rounded-xl bg-stone-50/90 border border-gray-200/90 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/15 focus:outline-hidden transition-all text-gray-900 placeholder:text-gray-400 font-medium"
                  />
                </div>

                <textarea
                  rows={3}
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  placeholder={currentCategory.customPlaceholder}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-50/90 border border-gray-200/90 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/15 focus:outline-hidden transition-all text-gray-900 placeholder:text-gray-400 resize-none min-h-[78px] leading-relaxed overflow-hidden"
                />
              </div>
            </div>

            {/* WhatsApp Action Button */}
            <div className="relative z-10 mt-3 pt-3 border-t border-emerald-100">
              <button
                type="button"
                onClick={handleSendWhatsapp}
                className="w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xs hover:shadow-md hover:shadow-emerald-600/20 hover:scale-[1.01] active:scale-[0.99]"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                <span>Send Query on WhatsApp</span>
              </button>
            </div>
          </motion.div>
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
