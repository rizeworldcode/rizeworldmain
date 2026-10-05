import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  Sparkles, 
  Shield, 
  Search, 
  Share2, 
  Globe, 
  ArrowRight, 
  X, 
  Award, 
  Zap, 
  CheckCircle2, 
  Layers,
  PhoneCall
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import Breadcrumbs from '../components/common/Breadcrumbs';

type CategoryType = 'seo' | 'smm' | 'website';

interface PricingPackage {
  id: string;
  name: string;
  badge?: string;
  popular?: boolean;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  tagline: string;
  summary: string;
  priceNote: string;
  keyHighlights: string[];
  categoryLabel?: string;
  deliverables: {
    category: string;
    items: string[];
  }[];
}

const SEO_PACKAGES: PricingPackage[] = [
  {
    id: "seo-bronze",
    name: "Bronze Package",
    categoryLabel: "Search Engine Optimization",
    badge: "Foundation",
    tier: "bronze",
    tagline: "Essential Local & Foundational Search Visibility",
    summary: "Perfect for startups and emerging local businesses aiming to get properly indexed, build trust on Google, and establish organic search presence.",
    priceNote: "Custom Monthly Retainer",
    keyHighlights: [
      "Up to 15 Target Keywords",
      "Google Business Profile Setup",
      "On-Page Title & Meta Tags",
      "Monthly Ranking Report"
    ],
    deliverables: [
      {
        category: "Initial Setup & Audit",
        items: [
          "Website SEO Audit & Issue Discovery",
          "Keyword Research & Target Mapping (Up to 15 keywords)",
          "Google Search Console & Google Analytics 4 Setup",
          "XML Sitemap & Robots.txt Verification"
        ]
      },
      {
        category: "On-Page Optimization",
        items: [
          "Meta Titles & Descriptions optimization for primary pages",
          "H1, H2 Header tag hierarchy structuring",
          "Basic Image Alt tag and internal linking",
          "URL slug cleanliness & canonicalization"
        ]
      },
      {
        category: "Reporting & Support",
        items: [
          "Monthly Keyword Performance Report",
          "Google Business Profile Local Citations check",
          "Email Support with 24h turnaround"
        ]
      }
    ]
  },
  {
    id: "seo-silver",
    name: "Silver Package",
    categoryLabel: "Search Engine Optimization",
    badge: "Growth",
    tier: "silver",
    tagline: "Targeted Search Growth & Competitive Rankings",
    summary: "Engineered for growing small-to-mid businesses looking to surpass local competitors, increase organic traffic, and capture high-intent search leads.",
    priceNote: "Custom Monthly Retainer",
    keyHighlights: [
      "Up to 30 Strategic Keywords",
      "Technical SEO & Speed Fixes",
      "Quality Link Building (DA 30+)",
      "Bi-Weekly Progress Syncs"
    ],
    deliverables: [
      {
        category: "Keyword & Strategy",
        items: [
          "Up to 30 High-Intent Commercial Keywords",
          "Competitor Keyword Gap & Backlink Analysis",
          "Target Audience Search Intent Mapping",
          "Local Search Geographic Dominance Setup"
        ]
      },
      {
        category: "Technical & On-Page SEO",
        items: [
          "Core Web Vitals & Page Speed optimization guidelines",
          "Structured Schema Markup (LocalBusiness, Organization)",
          "Content optimization for top landing pages",
          "Broken links and crawl error remediation"
        ]
      },
      {
        category: "Authority Building & Reporting",
        items: [
          "High-DA Niche Relevant Backlinks",
          "Google Business Profile weekly posts and geo-tagging",
          "Bi-Weekly Keyword Tracking & Analytics Report",
          "Dedicated SEO Strategist Support"
        ]
      }
    ]
  },
  {
    id: "seo-gold",
    name: "Gold Package",
    categoryLabel: "Search Engine Optimization",
    badge: "Most Popular",
    popular: true,
    tier: "gold",
    tagline: "Aggressive Multi-Keyword Organic Expansion",
    summary: "Our flagship SEO growth package designed for ambitious brands seeking substantial organic market share, higher conversion rates, and multi-location visibility.",
    priceNote: "Custom Monthly Retainer",
    keyHighlights: [
      "Up to 60 Commercial Keywords",
      "Content Strategy & Cluster Blogs",
      "High Authority Digital PR Backlinks",
      "Weekly Syncs & Priority Support"
    ],
    deliverables: [
      {
        category: "Full-Funnel Keyword Architecture",
        items: [
          "Up to 60 High-Volume & Long-Tail Conversion Keywords",
          "Comprehensive Competitor Reverse-Engineering",
          "Semantic SEO & Entity Optimization Strategy",
          "Multi-City & Regional SEO Architecture"
        ]
      },
      {
        category: "Advanced Technical & Content Engine",
        items: [
          "Full Technical Core Web Vitals Overhaul",
          "Content Topic Clusters & Pillar Page Strategy",
          "Advanced Schema (FAQ, Product, Breadcrumb, Article)",
          "Conversion Rate Optimization (CRO) UX recommendations"
        ]
      },
      {
        category: "High-Authority Off-Page & Management",
        items: [
          "Premium Tier 1 Contextual Backlinks",
          "Digital PR & Media Outreach Link Acquisitions",
          "Weekly Video Syncs & KPI Dashboard Access",
          "Priority 24/7 Dedicated Account Lead"
        ]
      }
    ]
  },
  {
    id: "seo-platinum",
    name: "Platinum Package",
    categoryLabel: "Search Engine Optimization",
    badge: "Enterprise Elite",
    tier: "platinum",
    tagline: "Absolute Market Monopoly & National Category Leadership",
    summary: "Comprehensive enterprise-tier SEO architecture built for market leaders who demand complete organic search dominance, national branding, and unmatched ROI.",
    priceNote: "Custom Enterprise Contract",
    keyHighlights: [
      "100+ Enterprise Scale Keywords",
      "Full Content & Digital PR Machine",
      "Custom JavaScript / Headless SEO",
      "Direct Slack Channel & Senior Lead"
    ],
    deliverables: [
      {
        category: "Enterprise Search Architecture",
        items: [
          "100+ Commercial, Informational & Transactional Keywords",
          "Custom International & Pan-India SEO Roadmaps",
          "Algorithmic Penalty Recovery & Disavow Audits",
          "Predictive Keyword Trend & AI Search Engine Readiness"
        ]
      },
      {
        category: "High-Velocity Tech & Content Execution",
        items: [
          "Deep JavaScript, Headless & Server-Side Rendering SEO",
          "Full End-to-End Content Production & Editorial Publishing",
          "Custom Dynamic Structured Data & Knowledge Graph Engineering",
          "Continuous Automated Log File & Crawl Budget Analysis"
        ]
      },
      {
        category: "Executive Reporting & Priority Command",
        items: [
          "Direct Dedicated Slack/Teams Channel with SEO Leads",
          "Executive C-Suite Monthly Review & Revenue Attribution",
          "Custom Live Data Studio Real-Time Analytics Dashboard",
          "Guaranteed High-Impact Authority Digital PR Placements"
        ]
      }
    ]
  }
];

const SMM_PACKAGES: PricingPackage[] = [
  {
    id: "smm-bronze",
    name: "Bronze Package",
    categoryLabel: "Social Media Management",
    badge: "Starter Social",
    tier: "bronze",
    tagline: "Brand Consistency & Active Social Profiles",
    summary: "Essential social media presence designed for emerging brands wanting consistent branded creatives, profile optimization, and community engagement.",
    priceNote: "Custom Monthly Retainer",
    keyHighlights: [
      "12 Curated Brand Posts / Month",
      "2 Core Channels (Instagram & FB)",
      "Targeted Hashtag & Copy Strategy",
      "Monthly Engagement Analytics"
    ],
    deliverables: [
      {
        category: "Profile Branding & Setup",
        items: [
          "Bio & Profile Optimization with clickable link-in-bio setup",
          "Custom Story Highlight Icons & Banner Covers",
          "Audience Persona & Tone-of-Voice Alignment"
        ]
      },
      {
        category: "Creative Content Publishing",
        items: [
          "12 Custom Designed Graphics / Carousels per month",
          "Captions engineered for engagement with relevant hashtags",
          "Pre-scheduled content calendar for approval"
        ]
      },
      {
        category: "Management & Growth",
        items: [
          "Daily monitoring & comment responses during business hours",
          "Monthly Reach, Impressions & Follower Growth Report",
          "Email support & monthly strategy checkpoint"
        ]
      }
    ]
  },
  {
    id: "smm-silver",
    name: "Silver Package",
    categoryLabel: "Social Media Management",
    badge: "Engagement & Video",
    tier: "silver",
    tagline: "Short-Form Video Production & Community Reach",
    summary: "Engineered for scaling brands looking to tap into viral short-form video algorithms, increased post cadence, and active conversation driving.",
    priceNote: "Custom Monthly Retainer",
    keyHighlights: [
      "20 Posts + 4 Edited Reels / Month",
      "3 Platforms (IG, FB, LinkedIn)",
      "Active DM & Comment Management",
      "Bi-Weekly Performance Reviews"
    ],
    deliverables: [
      {
        category: "Content & Reel Production",
        items: [
          "20 High-Quality Visual Assets (Static, Carousels, Infographics)",
          "4 Dynamic Short-Form Video Reels with trendy audio & subtitles",
          "Weekly Story engagement prompts (Polls, Q&As, Quiz)"
        ]
      },
      {
        category: "Multi-Channel Distribution",
        items: [
          "Coordinated publishing across Instagram, Facebook & LinkedIn",
          "Platform-specific caption adaptations for B2B and B2C",
          "Competitor creative benchmarking & trend hijacking"
        ]
      },
      {
        category: "Community & Analytics",
        items: [
          "Fast-response Community Management for DMs & Comments",
          "Bi-Weekly KPI Review & Paid Boosting Recommendations",
          "Dedicated Social Media Account Manager"
        ]
      }
    ]
  },
  {
    id: "smm-gold",
    name: "Gold Package",
    categoryLabel: "Social Media Management",
    badge: "Most Popular",
    popular: true,
    tier: "gold",
    tagline: "Viral Growth Engine & Meta Ads Synergy",
    summary: "Our flagship social growth plan featuring aggressive video creation, viral storytelling, audience funnels, and integrated Meta ads management.",
    priceNote: "Custom Monthly Retainer",
    keyHighlights: [
      "30 Brand Assets + 10 High-Impact Reels",
      "Cross-Platform Dominance (4 Channels)",
      "Meta Ads Campaign Management",
      "Weekly Syncs & Dedicated Producer"
    ],
    deliverables: [
      {
        category: "Full Video & Content Machine",
        items: [
          "10 Professional Reels/Shorts with scriptwriting, hooks & motion graphics",
          "20 Carousel & Carousel-storytelling designs optimized for saves/shares",
          "Daily active story strategy & real-time trend adaptation"
        ]
      },
      {
        category: "Paid Ad Funnel Integration",
        items: [
          "Meta Ads (FB/IG) Campaign setup, testing & optimization",
          "Retargeting custom audiences & lookalike audience scaling",
          "Ad creative variations testing (creative fatigue prevention)"
        ]
      },
      {
        category: "Brand Authority & Monitoring",
        items: [
          "Influencer identification & micro-collab outreach templates",
          "Live interactive analytics dashboard & weekly strategic sync",
          "Priority 24/7 account management & brand crisis monitoring"
        ]
      }
    ]
  },
  {
    id: "smm-platinum",
    name: "Platinum Package",
    categoryLabel: "Social Media Management",
    badge: "Omnichannel Domination",
    tier: "platinum",
    tagline: "Full-Scale Studio Production & Executive Personal Branding",
    summary: "Comprehensive multi-channel social authority package for industry leaders demanding viral brand presence, executive thought-leadership, and maximum inbound leads.",
    priceNote: "Custom Enterprise Retainer",
    keyHighlights: [
      "Daily Publishing + 20 High-End Reels",
      "Founder / Executive Personal Branding",
      "On-Location / Studio Shoot Guidance",
      "Dedicated Creative Lead & Slack Channel"
    ],
    deliverables: [
      {
        category: "Executive & Corporate Suite",
        items: [
          "C-Suite / Founder LinkedIn & X (Twitter) Personal Branding program",
          "20+ High-End Edited Short-Form Videos with sound design & visual hooks",
          "Long-form to micro-content repurposing machine (Podcasts/Webinars)"
        ]
      },
      {
        category: "Omnichannel Acquisition Funnel",
        items: [
          "Multi-channel coordinated blitz (IG, FB, LinkedIn, YouTube Shorts, X)",
          "Full-funnel paid advertising management across Meta & LinkedIn",
          "Influencer campaign end-to-end management & contract coordination"
        ]
      },
      {
        category: "VIP Production & Executive Access",
        items: [
          "Direct Dedicated Slack channel with Video Editors & Creative Director",
          "Custom video shoot scripts, storyboards & on-location guidance",
          "Custom real-time C-Suite dashboard & revenue attribution reporting"
        ]
      }
    ]
  }
];

const WEBSITE_PACKAGES: PricingPackage[] = [
  {
    id: "web-bronze",
    name: "Bronze Package",
    categoryLabel: "Website Development",
    badge: "Launchpad",
    tier: "bronze",
    tagline: "Fast, Modern High-Converting Landing Web Presence",
    summary: "Sleek, responsive single-page or 3-page web platform built to establish rapid business credibility and capture qualified inbound leads.",
    priceNote: "One-Time Custom Quote",
    keyHighlights: [
      "Up to 3 Custom Responsive Pages",
      "Ultra-Fast Mobile Optimization",
      "Lead Contact Form & WhatsApp CTA",
      "Complete SSL & Cloud Hosting Setup"
    ],
    deliverables: [
      {
        category: "Architecture & Design",
        items: [
          "Clean, modern UI/UX design tailored to your industry branding",
          "100% Mobile & Tablet responsive layouts",
          "Fast loading speeds with modern image compression"
        ]
      },
      {
        category: "Lead Capture & Functionality",
        items: [
          "Interactive Contact Form with instant email notifications",
          "One-click WhatsApp floating widget & Click-to-Call CTAs",
          "Google Maps embed & Social profile integrations"
        ]
      },
      {
        category: "Security & Launch",
        items: [
          "SSL Certificate installation & DNS configuration",
          "Foundational On-Page SEO meta tags and sitemap generation",
          "30 days post-launch technical bug support"
        ]
      }
    ]
  },
  {
    id: "web-silver",
    name: "Silver Package",
    categoryLabel: "Website Development",
    badge: "Business Standard",
    tier: "silver",
    tagline: "Multi-Page Corporate Website with Content CMS",
    summary: "Complete corporate website engineered for businesses needing detailed service pages, interactive components, dynamic blogs, and lead funnels.",
    priceNote: "One-Time Custom Quote",
    keyHighlights: [
      "Up to 7 Custom Designed Pages",
      "Easy CMS / Blog for Self Updates",
      "Interactive Micro-Animations",
      "Structured SEO & GA4 Tracking"
    ],
    deliverables: [
      {
        category: "Full Corporate Architecture",
        items: [
          "Up to 7 distinct pages (Home, About, Services, Case Studies, Blog, Contact, etc.)",
          "Modern interactive UI elements, hover effects, and sleek transitions",
          "Custom iconography and high-fidelity typography hierarchy"
        ]
      },
      {
        category: "CMS & Dynamic Capabilities",
        items: [
          "User-friendly Content Management System (CMS) to publish blogs/news",
          "Category filtering for portfolio/case studies",
          "Advanced multi-step lead capture or inquiry forms"
        ]
      },
      {
        category: "Performance & Integrations",
        items: [
          "Google Analytics 4 & Meta Pixel conversion tracking setup",
          "High Core Web Vitals optimization score (Green on PageSpeed)",
          "45 days post-launch support and CMS admin training"
        ]
      }
    ]
  },
  {
    id: "web-gold",
    name: "Gold Package",
    categoryLabel: "Website Development",
    badge: "Most Popular",
    popular: true,
    tier: "gold",
    tagline: "High-Performance Web App & Conversion Engine",
    summary: "High-performance web architecture engineered with modern frameworks (React / Next.js / Headless) tailored for maximum lead generation and user engagement.",
    priceNote: "One-Time Custom Quote",
    keyHighlights: [
      "Up to 15 Dynamic Custom Pages",
      "React / Modern JavaScript Framework",
      "CRM & Payment Gateway Integration",
      "Advanced Core Web Vitals & Speed"
    ],
    deliverables: [
      {
        category: "Custom Engineering & UX",
        items: [
          "Bespoke UI/UX design prototype in Figma with interactive wireframes",
          "Ultra-fast Single Page Application (SPA) or Server-Rendered platform",
          "Custom interactive calculators, booking calendars, or dynamic filters"
        ]
      },
      {
        category: "E-Commerce & System Integrations",
        items: [
          "Full Payment Gateway (Razorpay/Stripe) or CRM (HubSpot/Zoho) API sync",
          "Custom client portal or catalog showcase with dynamic search",
          "Automated transactional emails and WhatsApp notifications"
        ]
      },
      {
        category: "Enterprise Hardening",
        items: [
          "Advanced structured data Schema markup & comprehensive technical SEO",
          "Zero-downtime CDN deployment on cloud infrastructure",
          "60 days dedicated technical SLA support and performance audits"
        ]
      }
    ]
  },
  {
    id: "web-platinum",
    name: "Platinum Package",
    categoryLabel: "Website Development",
    badge: "Custom Enterprise",
    tier: "platinum",
    tagline: "Full-Stack Custom Platform & Headless Architecture",
    summary: "Enterprise web solutions, headless platforms, custom dashboards, and high-concurrency web systems designed for national and global market leaders.",
    priceNote: "Custom Enterprise Quote",
    keyHighlights: [
      "Unlimited Scalable Page Architecture",
      "Full-Stack Web App / Headless Commerce",
      "Custom User Dashboards & Portals",
      "Dedicated Tech Lead & SLA Guarantee"
    ],
    deliverables: [
      {
        category: "Enterprise Architecture",
        items: [
          "Custom enterprise full-stack web application (Node.js/Next.js/Python)",
          "Role-based authentication, user dashboards, and secure database schemas",
          "Microservices architecture with high concurrency support"
        ]
      },
      {
        category: "Headless & Custom Integrations",
        items: [
          "Headless CMS, ERP, inventory sync, and custom REST/GraphQL APIs",
          "Automated CI/CD deployment pipelines on AWS/Google Cloud",
          "Custom analytics pipelines and revenue attribution dashboards"
        ]
      },
      {
        category: "Security, SLA & Executive Command",
        items: [
          "Top-tier cybersecurity hardening, penetration testing & compliance",
          "Direct dedicated Slack channel with Senior Solution Architect",
          "90-day post-launch warranty with guaranteed uptime SLA"
        ]
      }
    ]
  }
];

export default function Pricing() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('seo');
  const [selectedPackage, setSelectedPackage] = useState<PricingPackage | null>(null);

  const pricingSchema = {
    "@context": "https://schema.org",
    "@type": "PricingPage",
    "name": "RizeWorld Digital Pricing Packages",
    "description": "Explore custom SEO packages including Bronze, Silver, Gold, and Platinum plans, along with Social Media Management and Custom Website Development pricing.",
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
        return {
          pill: 'bg-yellow-100 text-yellow-900 border-yellow-400',
          gradient: 'from-amber-400/20 via-yellow-500/10 to-transparent',
          borderHover: 'hover:border-yellow-500 border-yellow-400/80 shadow-md shadow-yellow-500/10',
          btn: 'bg-rize-primary hover:bg-blue-700 text-white',
          glow: 'group-hover:shadow-[0_20px_40px_rgba(234,179,8,0.16)]'
        };
      case 'platinum':
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
        description="Explore our transparent Bronze, Silver, Gold, and Platinum SEO service packages, Social Media Management plans, and Custom Website Development pricing."
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
          Select a category below to explore our structured service tiers. Every package is engineered with proven methodologies to deliver measurable ROI.
        </p>

        {/* 3 Categories Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-10 p-1.5 bg-stone-200/80 backdrop-blur-md rounded-full max-w-fit mx-auto border border-stone-300/80 shadow-xs">
          <button
            onClick={() => setActiveCategory('seo')}
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
            onClick={() => setActiveCategory('smm')}
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
            onClick={() => setActiveCategory('website')}
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

      {/* Main Content Area: 4 Cards for Active Category */}
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
          <p className="text-xs text-gray-500 hidden sm:block">Click any card to inspect full deliverables</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {currentCategory.packages.map((pkg) => {
            const colors = getTierColors(pkg.tier);
            return (
              <motion.div
                key={pkg.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedPackage(pkg)}
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
                      setSelectedPackage(pkg);
                    }}
                    className={`w-full py-3.5 px-4 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${colors.btn} shadow-xs group-hover:shadow-md`}
                  >
                    View Full Details
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* DETAIL MODAL FOR SELECTED PACKAGE */}
      <AnimatePresence>
        {selectedPackage && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPackage(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl sm:rounded-4xl p-6 sm:p-10 shadow-2xl border border-gray-200 z-10 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPackage(null)}
                className="absolute top-5 right-5 sm:top-7 sm:right-7 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close details"
              >
                <X size={20} />
              </button>

              {/* Modal Header */}
              <div className="pr-10 mb-8 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${getTierColors(selectedPackage.tier).pill}`}>
                    {selectedPackage.badge}
                  </span>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    {selectedPackage.categoryLabel || "Digital Package"}
                  </span>
                </div>

                <h3 className="text-3xl sm:text-4xl font-black text-gray-950 uppercase tracking-tight mt-1">
                  {selectedPackage.name}
                </h3>
                <p className="text-sm font-bold text-rize-primary uppercase tracking-wide mt-1">
                  {selectedPackage.tagline}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-3">
                  {selectedPackage.summary}
                </p>
              </div>

              {/* Deliverables Breakdown */}
              <div className="space-y-6 mb-8">
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <Layers size={14} className="text-rize-primary" /> Full Scope of Deliverables
                </h4>

                <div className="grid grid-cols-1 gap-6">
                  {selectedPackage.deliverables.map((group, idx) => (
                    <div key={idx} className="bg-stone-50 rounded-2xl p-5 border border-stone-200/80">
                      <h5 className="text-xs font-black uppercase text-gray-900 mb-3 tracking-wide flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-rize-primary" />
                        {group.category}
                      </h5>
                      <ul className="space-y-2">
                        {group.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-start gap-2.5 text-xs text-gray-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-rize-primary shrink-0 mt-1.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Ready to activate</p>
                  <p className="text-sm font-black text-gray-950 uppercase">{selectedPackage.name}</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedPackage(null)}
                    className="flex-1 sm:flex-none px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <Link
                    to="/contact"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-rize-primary hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider py-3.5 px-8 rounded-full transition-all shadow-md shadow-rize-primary/20"
                  >
                    Get This Package <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
