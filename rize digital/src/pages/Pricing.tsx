import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Shield, 
  Search, 
  Share2, 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  FileText,
  Layers,
  Grid
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'deck' | 'grid'>('deck');

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

  const FRAMER_BOX_SHADOW = "-30px 21px 122px 0px rgba(0, 0, 0, 0.25), inset 5px 5px 0px 0px rgba(255, 255, 255, 0.25), inset -5px -5px 0px 0px rgba(255, 255, 255, 0.15)";

  const DECK_PALETTES = [
    {
      bg: "rgb(17, 202, 236)", // Cyan
      isDarkText: true,
      pill: "bg-black/15 text-gray-950 border-black/15",
      btn: "bg-gray-950 hover:bg-white text-white hover:text-gray-950",
      check: "text-gray-950",
      accent: "text-gray-900"
    },
    {
      bg: "rgb(249, 86, 176)", // Magenta / Pink
      isDarkText: true,
      pill: "bg-black/15 text-gray-950 border-black/15",
      btn: "bg-gray-950 hover:bg-white text-white hover:text-gray-950",
      check: "text-gray-950",
      accent: "text-gray-900"
    },
    {
      bg: "rgb(255, 219, 75)", // Yellow / Gold
      isDarkText: true,
      pill: "bg-black/15 text-gray-950 border-black/15",
      btn: "bg-gray-950 hover:bg-white text-white hover:text-gray-950",
      check: "text-gray-950",
      accent: "text-gray-900"
    },
    {
      bg: "rgb(183, 33, 29)", // Crimson Red
      isDarkText: false,
      pill: "bg-white/20 text-white border-white/30",
      btn: "bg-white hover:bg-gray-950 text-gray-950 hover:text-white",
      check: "text-white",
      accent: "text-rose-100"
    },
    {
      bg: "rgb(13, 75, 84)", // Deep Forest Teal
      isDarkText: false,
      pill: "bg-white/20 text-white border-white/30",
      btn: "bg-white hover:bg-gray-950 text-gray-950 hover:text-white",
      check: "text-white",
      accent: "text-teal-100"
    },
    {
      bg: "rgb(255, 96, 22)", // Sunset Orange
      isDarkText: false,
      pill: "bg-white/20 text-white border-white/30",
      btn: "bg-white hover:bg-gray-950 text-gray-950 hover:text-white",
      check: "text-white",
      accent: "text-orange-100"
    },
    {
      bg: "rgb(39, 89, 182)", // Royal Electric Blue
      isDarkText: false,
      pill: "bg-white/20 text-white border-white/30",
      btn: "bg-white hover:bg-gray-950 text-gray-950 hover:text-white",
      check: "text-white",
      accent: "text-blue-100"
    }
  ];

  const CUSTOM_PALETTE = {
    bg: "rgb(16, 185, 129)", // Vibrant Emerald
    isDarkText: false,
    pill: "bg-white/20 text-white border-white/30",
    btn: "bg-white hover:bg-gray-950 text-emerald-950 hover:text-white",
    check: "text-white",
    accent: "text-emerald-100"
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

      {/* Main Content Area: Framer Card Deck Component */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 overflow-visible">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-rize-primary">
              {currentCategory.sub}
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-gray-950 uppercase tracking-tight mt-1">
              {currentCategory.title}
            </h2>
          </div>

          {/* View Mode Switcher & Hint */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden md:block">
              {viewMode === 'deck' ? 'Hover a card to elevate from the deck' : 'Click any tier for executive proposal'}
            </span>
            <div className="inline-flex items-center gap-1 bg-stone-200/90 p-1 rounded-full border border-stone-300 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode('deck')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'deck'
                    ? 'bg-gray-950 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-950'
                }`}
              >
                <Layers size={13} />
                <span>Deck</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-gray-950 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-950'
                }`}
              >
                <Grid size={13} />
                <span>Grid</span>
              </button>
            </div>
          </div>
        </div>

        {/* 1. DECK VIEW (Framer Card_Deck Interactive Overlap Container) */}
        {viewMode === 'deck' && (
          <div className="relative overflow-visible">
            {/* Desktop Overlapping Card Deck */}
            <div 
              onMouseLeave={() => setHoveredIndex(null)}
              className="hidden lg:flex items-center justify-center -space-x-12 xl:-space-x-16 pt-28 pb-16 px-4 overflow-visible relative min-h-[620px]"
            >
              {currentCategory.packages.map((pkg, i) => {
                const palette = DECK_PALETTES[i % DECK_PALETTES.length];
                const isHovered = hoveredIndex === i;
                return (
                  <motion.div
                    key={pkg.id}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onClick={() => navigate(`/pricing/${pkg.id}`)}
                    animate={{
                      y: isHovered ? -96 : 0,
                      scale: isHovered ? 1.05 : 1,
                      zIndex: isHovered ? 45 : 10 + i,
                    }}
                    transition={{ type: "spring", bounce: 0.22, duration: 0.4 }}
                    style={{
                      backgroundColor: palette.bg,
                      boxShadow: FRAMER_BOX_SHADOW,
                      borderRadius: 24,
                    }}
                    className={`w-[275px] xl:w-[295px] h-[505px] p-6 flex flex-col justify-between shrink-0 cursor-pointer relative select-none border border-white/20 transition-colors ${
                      palette.isDarkText ? 'text-gray-950' : 'text-white'
                    }`}
                  >
                    {/* Top Content */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${palette.pill}`}>
                          {pkg.badge || `Tier ${i + 1}`}
                        </span>
                        {pkg.popular && (
                          <span className="bg-gray-950 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-xs">
                            Popular
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-black uppercase tracking-tight leading-tight mb-2">
                        {pkg.name}
                      </h3>

                      <p className={`text-xs font-bold uppercase tracking-wider mb-3 leading-snug ${
                        palette.isDarkText ? 'text-gray-800' : 'text-white/80'
                      }`}>
                        {pkg.tagline}
                      </p>

                      <p className={`text-xs leading-relaxed mb-4 line-clamp-2 ${
                        palette.isDarkText ? 'text-gray-700' : 'text-white/70'
                      }`}>
                        {pkg.summary}
                      </p>

                      {/* Feature Highlights */}
                      <div className="space-y-2 pt-3 border-t border-black/10 dark:border-white/10">
                        {pkg.keyHighlights.slice(0, 3).map((hl, hIdx) => (
                          <div key={hIdx} className="flex items-start gap-2">
                            <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${palette.check}`} />
                            <span className={`text-xs font-semibold leading-tight ${
                              palette.isDarkText ? 'text-gray-900' : 'text-white/90'
                            }`}>
                              {hl}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-4 border-t border-black/10 dark:border-white/10">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/pricing/${pkg.id}`);
                        }}
                        className={`w-full py-3 px-4 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm ${palette.btn}`}
                      >
                        <FileText size={14} />
                        <span>Open Proposal</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}

              {/* Custom WhatsApp Tier Deck Card */}
              <motion.div
                onMouseEnter={() => setHoveredIndex(currentCategory.packages.length)}
                animate={{
                  y: hoveredIndex === currentCategory.packages.length ? -96 : 0,
                  scale: hoveredIndex === currentCategory.packages.length ? 1.05 : 1,
                  zIndex: hoveredIndex === currentCategory.packages.length ? 45 : 10 + currentCategory.packages.length,
                }}
                transition={{ type: "spring", bounce: 0.22, duration: 0.4 }}
                style={{
                  backgroundColor: CUSTOM_PALETTE.bg,
                  boxShadow: FRAMER_BOX_SHADOW,
                  borderRadius: 24,
                }}
                className="w-[275px] xl:w-[295px] h-[505px] p-6 flex flex-col justify-between shrink-0 relative select-none border border-white/20 text-white"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${CUSTOM_PALETTE.pill} flex items-center gap-1`}>
                      <Sparkles size={11} />
                      Custom Tier
                    </span>
                    <span className="bg-white text-emerald-950 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      WhatsApp
                    </span>
                  </div>

                  <h3 className="text-xl font-black uppercase tracking-tight leading-tight mb-2">
                    {currentCategory.customTitle}
                  </h3>

                  <p className="text-xs font-bold uppercase tracking-wider mb-3 leading-snug text-emerald-100">
                    {currentCategory.customTagline}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-white/15">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-50">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
                      <span>Custom Scope & Deliverables</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-50">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
                      <span>Flexible Budget & Timeline</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-50">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
                      <span>Direct Executive Proposal</span>
                    </div>
                  </div>

                  {/* Quick Input Fields */}
                  <div className="space-y-2 pt-3 mt-3 border-t border-white/15">
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full text-xs px-3 py-2 rounded-xl bg-white/20 border border-white/30 placeholder:text-emerald-100/70 text-white focus:bg-white focus:text-gray-900 focus:outline-hidden transition-all"
                    />
                    <input
                      type="tel"
                      value={customPhone}
                      onChange={(e) => setCustomPhone(e.target.value)}
                      placeholder="WhatsApp Number"
                      className="w-full text-xs px-3 py-2 rounded-xl bg-white/20 border border-white/30 placeholder:text-emerald-100/70 text-white focus:bg-white focus:text-gray-900 focus:outline-hidden transition-all"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-white/15">
                  <button
                    type="button"
                    onClick={handleSendWhatsapp}
                    className={`w-full py-3 px-4 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm ${CUSTOM_PALETTE.btn}`}
                  >
                    <WhatsAppIcon className="w-4 h-4 fill-current" />
                    <span>Send on WhatsApp</span>
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Mobile / Tablet Horizontal Swipe Deck */}
            <div className="lg:hidden">
              <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pt-4 pb-8 px-2 scrollbar-none">
                {currentCategory.packages.map((pkg, i) => {
                  const palette = DECK_PALETTES[i % DECK_PALETTES.length];
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => navigate(`/pricing/${pkg.id}`)}
                      style={{
                        backgroundColor: palette.bg,
                        boxShadow: FRAMER_BOX_SHADOW,
                        borderRadius: 24,
                      }}
                      className={`w-[275px] h-[490px] p-6 flex flex-col justify-between shrink-0 snap-center cursor-pointer border border-white/20 ${
                        palette.isDarkText ? 'text-gray-950' : 'text-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${palette.pill}`}>
                            {pkg.badge || `Tier ${i + 1}`}
                          </span>
                          {pkg.popular && (
                            <span className="bg-gray-950 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-xs">
                              Popular
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl font-black uppercase tracking-tight leading-tight mb-2">
                          {pkg.name}
                        </h3>

                        <p className={`text-xs font-bold uppercase tracking-wider mb-3 leading-snug ${
                          palette.isDarkText ? 'text-gray-800' : 'text-white/80'
                        }`}>
                          {pkg.tagline}
                        </p>

                        <p className={`text-xs leading-relaxed mb-4 line-clamp-2 ${
                          palette.isDarkText ? 'text-gray-700' : 'text-white/70'
                        }`}>
                          {pkg.summary}
                        </p>

                        <div className="space-y-2 pt-3 border-t border-black/10 dark:border-white/10">
                          {pkg.keyHighlights.slice(0, 3).map((hl, hIdx) => (
                            <div key={hIdx} className="flex items-start gap-2">
                              <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${palette.check}`} />
                              <span className={`text-xs font-semibold leading-tight ${
                                palette.isDarkText ? 'text-gray-900' : 'text-white/90'
                              }`}>
                                {hl}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-black/10 dark:border-white/10">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/pricing/${pkg.id}`);
                          }}
                          className={`w-full py-3 px-4 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm ${palette.btn}`}
                        >
                          <FileText size={14} />
                          <span>Open Proposal</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Mobile Custom Card */}
                <div
                  style={{
                    backgroundColor: CUSTOM_PALETTE.bg,
                    boxShadow: FRAMER_BOX_SHADOW,
                    borderRadius: 24,
                  }}
                  className="w-[275px] h-[490px] p-6 flex flex-col justify-between shrink-0 snap-center border border-white/20 text-white"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${CUSTOM_PALETTE.pill} flex items-center gap-1`}>
                        <Sparkles size={11} />
                        Custom Tier
                      </span>
                      <span className="bg-white text-emerald-950 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-xs">
                        WhatsApp
                      </span>
                    </div>

                    <h3 className="text-xl font-black uppercase tracking-tight leading-tight mb-2">
                      {currentCategory.customTitle}
                    </h3>

                    <p className="text-xs font-bold uppercase tracking-wider mb-3 leading-snug text-emerald-100">
                      {currentCategory.customTagline}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-white/15">
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-50">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
                        <span>Custom Deliverables</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-50">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
                        <span>Flexible Budget</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-3 mt-3 border-t border-white/15">
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full text-xs px-3 py-2 rounded-xl bg-white/20 border border-white/30 placeholder:text-emerald-100/70 text-white focus:bg-white focus:text-gray-900 focus:outline-hidden transition-all"
                      />
                      <input
                        type="tel"
                        value={customPhone}
                        onChange={(e) => setCustomPhone(e.target.value)}
                        placeholder="WhatsApp Number"
                        className="w-full text-xs px-3 py-2 rounded-xl bg-white/20 border border-white/30 placeholder:text-emerald-100/70 text-white focus:bg-white focus:text-gray-900 focus:outline-hidden transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/15">
                    <button
                      type="button"
                      onClick={handleSendWhatsapp}
                      className={`w-full py-3 px-4 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm ${CUSTOM_PALETTE.btn}`}
                    >
                      <WhatsAppIcon className="w-4 h-4 fill-current" />
                      <span>Send on WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-center text-xs text-gray-400 mt-2">
                ← Swipe horizontally to explore all tiers →
              </p>
            </div>
          </div>
        )}

        {/* 2. GRID VIEW (All cards side-by-side) */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 pt-4 pb-8">
            {currentCategory.packages.map((pkg, i) => {
              const palette = DECK_PALETTES[i % DECK_PALETTES.length];
              return (
                <motion.div
                  key={pkg.id}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                  onClick={() => navigate(`/pricing/${pkg.id}`)}
                  style={{
                    backgroundColor: palette.bg,
                    boxShadow: FRAMER_BOX_SHADOW,
                    borderRadius: 24,
                  }}
                  className={`p-6 flex flex-col justify-between cursor-pointer border border-white/20 min-h-[490px] ${
                    palette.isDarkText ? 'text-gray-950' : 'text-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${palette.pill}`}>
                        {pkg.badge || `Tier ${i + 1}`}
                      </span>
                      {pkg.popular && (
                        <span className="bg-gray-950 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-xs">
                          Popular
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-black uppercase tracking-tight leading-tight mb-2">
                      {pkg.name}
                    </h3>

                    <p className={`text-xs font-bold uppercase tracking-wider mb-3 leading-snug ${
                      palette.isDarkText ? 'text-gray-800' : 'text-white/80'
                    }`}>
                      {pkg.tagline}
                    </p>

                    <p className={`text-xs leading-relaxed mb-4 line-clamp-2 ${
                      palette.isDarkText ? 'text-gray-700' : 'text-white/70'
                    }`}>
                      {pkg.summary}
                    </p>

                    <div className="space-y-2 pt-3 border-t border-black/10 dark:border-white/10">
                      {pkg.keyHighlights.slice(0, 3).map((hl, hIdx) => (
                        <div key={hIdx} className="flex items-start gap-2">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${palette.check}`} />
                          <span className={`text-xs font-semibold leading-tight ${
                            palette.isDarkText ? 'text-gray-900' : 'text-white/90'
                          }`}>
                            {hl}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-black/10 dark:border-white/10">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/pricing/${pkg.id}`);
                      }}
                      className={`w-full py-3 px-4 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm ${palette.btn}`}
                    >
                      <FileText size={14} />
                      <span>Open Proposal</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })}

            {/* Custom Card in Grid */}
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
              style={{
                backgroundColor: CUSTOM_PALETTE.bg,
                boxShadow: FRAMER_BOX_SHADOW,
                borderRadius: 24,
              }}
              className="p-6 flex flex-col justify-between border border-white/20 text-white min-h-[490px]"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${CUSTOM_PALETTE.pill} flex items-center gap-1`}>
                    <Sparkles size={11} />
                    Custom Tier
                  </span>
                  <span className="bg-white text-emerald-950 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-xs">
                    WhatsApp
                  </span>
                </div>

                <h3 className="text-xl font-black uppercase tracking-tight leading-tight mb-2">
                  {currentCategory.customTitle}
                </h3>

                <p className="text-xs font-bold uppercase tracking-wider mb-3 leading-snug text-emerald-100">
                  {currentCategory.customTagline}
                </p>

                <div className="space-y-2 pt-2 border-t border-white/15">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-50">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
                    <span>Custom Deliverables</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-50">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
                    <span>Flexible Budget</span>
                  </div>
                </div>

                <div className="space-y-2 pt-3 mt-3 border-t border-white/15">
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-white/20 border border-white/30 placeholder:text-emerald-100/70 text-white focus:bg-white focus:text-gray-900 focus:outline-hidden transition-all"
                  />
                  <input
                    type="tel"
                    value={customPhone}
                    onChange={(e) => setCustomPhone(e.target.value)}
                    placeholder="WhatsApp Number"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-white/20 border border-white/30 placeholder:text-emerald-100/70 text-white focus:bg-white focus:text-gray-900 focus:outline-hidden transition-all"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/15">
                <button
                  type="button"
                  onClick={handleSendWhatsapp}
                  className={`w-full py-3 px-4 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm ${CUSTOM_PALETTE.btn}`}
                >
                  <WhatsAppIcon className="w-4 h-4 fill-current" />
                  <span>Send on WhatsApp</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
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
