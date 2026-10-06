export interface TableFeature {
  feature: string;
  details: string;
}

export interface FeatureCategory {
  category: string;
  items: {
    feature: string;
    details: string;
  }[];
}

export interface PricingPackage {
  id: string;
  name: string;
  category: 'seo' | 'smm' | 'website';
  categoryTitle: string;
  proposalTitle: string;
  badge?: string;
  popular?: boolean;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'starter' | 'growth' | 'elite';
  tagline: string;
  summary: string;
  idealFor: string;
  keyHighlights: string[];
  featureCategories?: FeatureCategory[];
  tableFeatures: TableFeature[];
  notIncluded?: string[];
  paymentTerms?: string[];
  investmentNote?: string;
}

export const SEO_PACKAGES: PricingPackage[] = [
  {
    id: "seo-starter",
    name: "Rize World - SEO Starter Package",
    category: "seo",
    categoryTitle: "Search Engine Optimization",
    proposalTitle: "Search Engine Optimization Proposal",
    badge: "Foundation",
    tier: "starter",
    tagline: "Complete Website Audit, On-Page & Technical SEO Foundation",
    summary: "Complete foundational search engine optimization package designed to audit, fix technical issues, optimize on-page signals, build backlinks, and track keyword rankings.",
    idealFor: "Startups and emerging local businesses aiming to get properly indexed, fix technical errors, and establish organic Google ranking.",
    keyHighlights: [
      "Complete SEO Audit & Competitor Analysis",
      "Keyword Research (15-20 Keywords)",
      "Technical & On-Page SEO Fixes",
      "200 High-Quality Backlinks",
      "Monthly Strategy Call & Reports"
    ],
    featureCategories: [
      {
        category: "Website Audit",
        items: [
          { feature: "Complete SEO Audit", details: "Included" },
          { feature: "Competitor Analysis", details: "Included" },
          { feature: "Keyword Research (15-20 Keywords)", details: "Included" }
        ]
      },
      {
        category: "Technical SEO",
        items: [
          { feature: "Google Search Console Setup/Check", details: "Included" },
          { feature: "Google Analytics Check", details: "Included" },
          { feature: "XML Sitemap", details: "Included" },
          { feature: "Robots.txt Optimization", details: "Included" },
          { feature: "Broken Links Fix", details: "Included" },
          { feature: "404 Error Check", details: "Included" },
          { feature: "Basic Page Speed Improvement", details: "Included" },
          { feature: "Mobile Friendly Check", details: "Included" },
          { feature: "HTTPS & Indexing Check", details: "Included" }
        ]
      },
      {
        category: "On-Page SEO",
        items: [
          { feature: "Meta Title Optimization", details: "Included" },
          { feature: "Meta Description Optimization", details: "Included" },
          { feature: "H1/H2/H3 Optimization", details: "Included" },
          { feature: "URL Optimization", details: "Included" },
          { feature: "Image Alt Tags", details: "Included" },
          { feature: "Internal Linking", details: "Included" },
          { feature: "Basic Schema Markup", details: "Included" },
          { feature: "Canonical Tag Check", details: "Included" }
        ]
      },
      {
        category: "Content Optimization",
        items: [
          { feature: "Optimize 2 Existing Pages", details: "Included" },
          { feature: "SEO Optimization for 2 Blog Posts (Client Content)", details: "Included" }
        ]
      },
      {
        category: "Off-Page SEO",
        items: [
          { feature: "200 High-Quality Backlinks", details: "Included" },
          { feature: "10-15 Business Citations", details: "Included" },
          { feature: "Social Profile Optimization (if available)", details: "Included" }
        ]
      },
      {
        category: "Monitoring & Reporting",
        items: [
          { feature: "Keyword Rank Tracking", details: "Included" },
          { feature: "Crawl Error Monitoring", details: "Included" },
          { feature: "Monthly Performance Report", details: "Included" }
        ]
      },
      {
        category: "Support",
        items: [
          { feature: "One Monthly Strategy Call (30 minutes)", details: "Included" },
          { feature: "WhatsApp & Email Support", details: "Included" }
        ]
      }
    ],
    tableFeatures: [
      { feature: "Complete SEO Audit", details: "Included" },
      { feature: "Competitor Analysis", details: "Included" },
      { feature: "Keyword Research (15-20 Keywords)", details: "Included" },
      { feature: "Google Search Console Setup/Check", details: "Included" },
      { feature: "Google Analytics Check", details: "Included" },
      { feature: "XML Sitemap", details: "Included" },
      { feature: "Robots.txt Optimization", details: "Included" },
      { feature: "Broken Links Fix", details: "Included" },
      { feature: "404 Error Check", details: "Included" },
      { feature: "Basic Page Speed Improvement", details: "Included" },
      { feature: "Mobile Friendly Check", details: "Included" },
      { feature: "HTTPS & Indexing Check", details: "Included" },
      { feature: "Meta Title Optimization", details: "Included" },
      { feature: "Meta Description Optimization", details: "Included" },
      { feature: "H1/H2/H3 Optimization", details: "Included" },
      { feature: "URL Optimization", details: "Included" },
      { feature: "Image Alt Tags", details: "Included" },
      { feature: "Internal Linking", details: "Included" },
      { feature: "Basic Schema Markup", details: "Included" },
      { feature: "Canonical Tag Check", details: "Included" },
      { feature: "Optimize 2 Existing Pages", details: "Included" },
      { feature: "SEO Optimization for 2 Blog Posts (Client Content)", details: "Included" },
      { feature: "200 High-Quality Backlinks", details: "Included" },
      { feature: "10-15 Business Citations", details: "Included" },
      { feature: "Social Profile Optimization (if available)", details: "Included" },
      { feature: "Keyword Rank Tracking", details: "Included" },
      { feature: "Crawl Error Monitoring", details: "Included" },
      { feature: "Monthly Performance Report", details: "Included" },
      { feature: "One Monthly Strategy Call (30 minutes)", details: "Included" },
      { feature: "WhatsApp & Email Support", details: "Included" }
    ],
    notIncluded: [
      "Content Writing",
      "Website Redesign",
      "Google Ads / Meta Ads",
      "GMB Optimization",
      "Advanced AI SEO / GEO"
    ],
    investmentNote: "Foundational search optimization package engineered to establish clean indexing, technical health, and baseline Google rankings."
  },
  {
    id: "seo-growth",
    name: "Rize World - SEO Growth Package",
    category: "seo",
    categoryTitle: "Search Engine Optimization",
    proposalTitle: "Search Engine Optimization Proposal",
    badge: "Most Popular",
    popular: true,
    tier: "growth",
    tagline: "Targeted Search Growth, Competitive Rankings & High Authority",
    summary: "Engineered for scaling businesses looking to outrank local competitors, optimize technical performance, and acquire high-authority backlinks.",
    idealFor: "Growing businesses ready to surpass direct competitors, expand commercial keyword rankings, and drive consistent organic inquiries.",
    keyHighlights: [
      "Website Audit & Keyword Research (30 Keywords)",
      "Technical SEO & Core Web Vitals Optimization",
      "500 High-Quality Backlinks & Citations",
      "Optimize 5 Pages + 4 Blog Posts",
      "Monthly Strategy Meeting (45 Minutes)"
    ],
    featureCategories: [
      {
        category: "Website Audit & Strategy",
        items: [
          { feature: "Complete SEO Audit", details: "Included" },
          { feature: "Competitor Analysis", details: "Included" },
          { feature: "Keyword Research (30 Keywords)", details: "Included" },
          { feature: "SEO Roadmap", details: "Included" }
        ]
      },
      {
        category: "Technical SEO",
        items: [
          { feature: "Google Search Console & Analytics Review", details: "Included" },
          { feature: "XML Sitemap & Robots.txt Optimization", details: "Included" },
          { feature: "404 & Broken Link Fixes", details: "Included" },
          { feature: "Page Speed Optimization", details: "Included" },
          { feature: "Core Web Vitals Review", details: "Included" },
          { feature: "Mobile-Friendly Optimization", details: "Included" },
          { feature: "Indexing & Crawl Optimization", details: "Included" }
        ]
      },
      {
        category: "On-Page SEO",
        items: [
          { feature: "Meta Title & Description Optimization", details: "Included" },
          { feature: "Header Tag Optimization (H1-H3)", details: "Included" },
          { feature: "URL Optimization", details: "Included" },
          { feature: "Image Alt Tags", details: "Included" },
          { feature: "Internal Linking", details: "Included" },
          { feature: "Advanced Schema Markup", details: "Included" },
          { feature: "Canonical & Redirect Optimization", details: "Included" }
        ]
      },
      {
        category: "Content Optimization",
        items: [
          { feature: "Optimize 5 Existing Pages", details: "Included" },
          { feature: "SEO Optimization for 4 Blog Posts (Client Content)", details: "Included" },
          { feature: "Content Recommendations", details: "Included" }
        ]
      },
      {
        category: "Off-Page SEO",
        items: [
          { feature: "500 High-Quality Backlinks", details: "Included" },
          { feature: "20-30 Business Citations", details: "Included" },
          { feature: "Social Profile Optimization", details: "Included" },
          { feature: "Brand Mentions & Link Building", details: "Included" }
        ]
      },
      {
        category: "Monitoring & Reporting",
        items: [
          { feature: "30 Keyword Rank Tracking", details: "Included" },
          { feature: "Monthly SEO Performance Report", details: "Included" },
          { feature: "Crawl Error Monitoring", details: "Included" },
          { feature: "Traffic & Conversion Insights", details: "Included" }
        ]
      },
      {
        category: "Support",
        items: [
          { feature: "One Monthly Strategy Meeting (45 Minutes)", details: "Included" },
          { feature: "Priority WhatsApp & Email Support", details: "Included" }
        ]
      }
    ],
    tableFeatures: [
      { feature: "Complete SEO Audit", details: "Included" },
      { feature: "Competitor Analysis", details: "Included" },
      { feature: "Keyword Research (30 Keywords)", details: "Included" },
      { feature: "SEO Roadmap", details: "Included" },
      { feature: "Google Search Console & Analytics Review", details: "Included" },
      { feature: "XML Sitemap & Robots.txt Optimization", details: "Included" },
      { feature: "404 & Broken Link Fixes", details: "Included" },
      { feature: "Page Speed Optimization", details: "Included" },
      { feature: "Core Web Vitals Review", details: "Included" },
      { feature: "Mobile-Friendly Optimization", details: "Included" },
      { feature: "Indexing & Crawl Optimization", details: "Included" },
      { feature: "Meta Title & Description Optimization", details: "Included" },
      { feature: "Header Tag Optimization (H1-H3)", details: "Included" },
      { feature: "URL Optimization", details: "Included" },
      { feature: "Image Alt Tags", details: "Included" },
      { feature: "Internal Linking", details: "Included" },
      { feature: "Advanced Schema Markup", details: "Included" },
      { feature: "Canonical & Redirect Optimization", details: "Included" },
      { feature: "Optimize 5 Existing Pages", details: "Included" },
      { feature: "SEO Optimization for 4 Blog Posts (Client Content)", details: "Included" },
      { feature: "Content Recommendations", details: "Included" },
      { feature: "500 High-Quality Backlinks", details: "Included" },
      { feature: "20-30 Business Citations", details: "Included" },
      { feature: "Social Profile Optimization", details: "Included" },
      { feature: "Brand Mentions & Link Building", details: "Included" },
      { feature: "30 Keyword Rank Tracking", details: "Included" },
      { feature: "Monthly SEO Performance Report", details: "Included" },
      { feature: "Crawl Error Monitoring", details: "Included" },
      { feature: "Traffic & Conversion Insights", details: "Included" },
      { feature: "One Monthly Strategy Meeting (45 Minutes)", details: "Included" },
      { feature: "Priority WhatsApp & Email Support", details: "Included" }
    ],
    notIncluded: [
      "Content Writing",
      "Google Ads / Meta Ads Management",
      "Website Redesign",
      "Advanced AI SEO / GEO (Available as Add-on)"
    ],
    investmentNote: "Targeted multi-keyword growth plan designed for aggressive market positioning and competitive search dominance."
  },
  {
    id: "seo-elite",
    name: "Rize World - SEO Elite Package",
    category: "seo",
    categoryTitle: "Search Engine Optimization",
    proposalTitle: "Search Engine Optimization Proposal",
    badge: "Elite Authority",
    tier: "elite",
    tagline: "Total Market Dominance, AI Search & High-Velocity Authority",
    summary: "Our most comprehensive SEO growth system featuring complete technical optimization, AI SEO & GEO structuring, 700 backlinks, and a dedicated account manager.",
    idealFor: "Market leaders and ambitious brands seeking complete organic dominance, national presence, and Generative AI Search Engine visibility.",
    keyHighlights: [
      "Complete Strategy & 50+ Keywords",
      "Advanced Technical, Core Web Vitals & GA4",
      "700 High-Quality Backlinks & 40+ Citations",
      "AI SEO & Generative Engine Optimization (GEO)",
      "Monthly 60-Min Strategy Call & Dedicated Manager"
    ],
    featureCategories: [
      {
        category: "SEO Strategy & Audit",
        items: [
          { feature: "Complete Website SEO Audit", details: "Included" },
          { feature: "Advanced Competitor Analysis", details: "Included" },
          { feature: "Keyword Research (50+ Keywords)", details: "Included" },
          { feature: "Monthly SEO Growth Plan", details: "Included" }
        ]
      },
      {
        category: "Advanced Technical SEO",
        items: [
          { feature: "Google Search Console & GA4 Management", details: "Included" },
          { feature: "XML Sitemap & Robots.txt Optimization", details: "Included" },
          { feature: "Core Web Vitals Optimization", details: "Included" },
          { feature: "Page Speed Optimization", details: "Included" },
          { feature: "404 Error & Broken Link Fixes", details: "Included" },
          { feature: "Crawl Budget Optimization", details: "Included" },
          { feature: "Indexing Issue Resolution", details: "Included" }
        ]
      },
      {
        category: "Advanced On-Page SEO",
        items: [
          { feature: "Meta Title & Description Optimization", details: "Included" },
          { feature: "Header Tag Optimization (H1-H6)", details: "Included" },
          { feature: "URL Structure Optimization", details: "Included" },
          { feature: "Image SEO", details: "Included" },
          { feature: "Advanced Internal Linking", details: "Included" },
          { feature: "Schema Markup", details: "Included" },
          { feature: "Canonical & Redirect Management", details: "Included" }
        ]
      },
      {
        category: "Content Optimization",
        items: [
          { feature: "Optimize 10 Existing Pages", details: "Included" },
          { feature: "SEO Optimization for 8 Blog Posts (Client Content)", details: "Included" },
          { feature: "Content Gap Analysis", details: "Included" }
        ]
      },
      {
        category: "Premium Off-Page SEO",
        items: [
          { feature: "700 High-Quality Backlinks", details: "Included" },
          { feature: "40+ Business Citations", details: "Included" },
          { feature: "Premium Link Building", details: "Included" },
          { feature: "Brand Mentions", details: "Included" },
          { feature: "Competitor Backlink Analysis", details: "Included" }
        ]
      },
      {
        category: "AI SEO & GEO",
        items: [
          { feature: "Basic AI Search Optimization", details: "Included" },
          { feature: "Entity Optimization", details: "Included" },
          { feature: "Content Structuring for AI Search Engines", details: "Included" }
        ]
      },
      {
        category: "Monitoring & Reporting",
        items: [
          { feature: "50 Keyword Rank Tracking", details: "Included" },
          { feature: "Monthly SEO Report", details: "Included" },
          { feature: "Traffic & Conversion Analysis", details: "Included" },
          { feature: "Technical Health Report", details: "Included" }
        ]
      },
      {
        category: "Dedicated Support",
        items: [
          { feature: "Monthly Strategy Meeting (60 Minutes)", details: "Included" },
          { feature: "Priority WhatsApp & Email Support", details: "Included" },
          { feature: "Dedicated Account Manager", details: "Included" }
        ]
      }
    ],
    tableFeatures: [
      { feature: "Complete Website SEO Audit", details: "Included" },
      { feature: "Advanced Competitor Analysis", details: "Included" },
      { feature: "Keyword Research (50+ Keywords)", details: "Included" },
      { feature: "Monthly SEO Growth Plan", details: "Included" },
      { feature: "Google Search Console & GA4 Management", details: "Included" },
      { feature: "XML Sitemap & Robots.txt Optimization", details: "Included" },
      { feature: "Core Web Vitals Optimization", details: "Included" },
      { feature: "Page Speed Optimization", details: "Included" },
      { feature: "404 Error & Broken Link Fixes", details: "Included" },
      { feature: "Crawl Budget Optimization", details: "Included" },
      { feature: "Indexing Issue Resolution", details: "Included" },
      { feature: "Meta Title & Description Optimization", details: "Included" },
      { feature: "Header Tag Optimization (H1-H6)", details: "Included" },
      { feature: "URL Structure Optimization", details: "Included" },
      { feature: "Image SEO", details: "Included" },
      { feature: "Advanced Internal Linking", details: "Included" },
      { feature: "Schema Markup", details: "Included" },
      { feature: "Canonical & Redirect Management", details: "Included" },
      { feature: "Optimize 10 Existing Pages", details: "Included" },
      { feature: "SEO Optimization for 8 Blog Posts (Client Content)", details: "Included" },
      { feature: "Content Gap Analysis", details: "Included" },
      { feature: "700 High-Quality Backlinks", details: "Included" },
      { feature: "40+ Business Citations", details: "Included" },
      { feature: "Premium Link Building", details: "Included" },
      { feature: "Brand Mentions", details: "Included" },
      { feature: "Competitor Backlink Analysis", details: "Included" },
      { feature: "Basic AI Search Optimization", details: "Included" },
      { feature: "Entity Optimization", details: "Included" },
      { feature: "Content Structuring for AI Search Engines", details: "Included" },
      { feature: "50 Keyword Rank Tracking", details: "Included" },
      { feature: "Monthly SEO Report", details: "Included" },
      { feature: "Traffic & Conversion Analysis", details: "Included" },
      { feature: "Technical Health Report", details: "Included" },
      { feature: "Monthly Strategy Meeting (60 Minutes)", details: "Included" },
      { feature: "Priority WhatsApp & Email Support", details: "Included" },
      { feature: "Dedicated Account Manager", details: "Included" }
    ],
    notIncluded: [
      "Content Writing",
      "Google Ads / Meta Ads Management",
      "Website Development & Redesign (Available Separately)"
    ],
    investmentNote: "Enterprise search monopoly package engineered for national market leadership, continuous algorithmic resilience, and maximum ROI."
  }
];

export const SMM_PACKAGES: PricingPackage[] = [
  {
    id: "smm-bronze",
    name: "Bronze Package",
    category: "smm",
    categoryTitle: "Social Media Management",
    proposalTitle: "Social Media Management Proposal",
    badge: "Starter",
    tier: "bronze",
    tagline: "5 Reels, 5 Graphic Posts, 2 Shoots & Growth Essentials",
    summary: "Essential social media presence designed for small businesses, startups and local brands seeking professional reels, creative designs, and performance tracking.",
    idealFor: "Small businesses, startups and local brands.",
    keyHighlights: [
      "5 Professional Reels",
      "5 Creative Designs (Graphic Posts)",
      "2 Professional Shoots",
      "Monthly Planning Content Calendar",
      "Basic Account Optimization & Report"
    ],
    tableFeatures: [
      { feature: "Reels", details: "5 Professional Reels" },
      { feature: "Graphic Posts", details: "5 Creative Designs" },
      { feature: "Professional Shoots", details: "2 Shoots" },
      { feature: "Content Calendar", details: "Monthly Planning" },
      { feature: "Caption Writing", details: "Included" },
      { feature: "Hashtag Research", details: "Included" },
      { feature: "Account Optimization", details: "Basic Optimization" },
      { feature: "Monthly Report", details: "Performance Report" },
      { feature: "Support", details: "Business Hours Support" },
      { feature: "Revision", details: "Up to 2 revisions/post" }
    ],
    investmentNote: "Creative content, consistent branding, engaging reels, and monthly performance tracking to help grow your business online."
  },
  {
    id: "smm-silver",
    name: "Silver Package",
    category: "smm",
    categoryTitle: "Social Media Management",
    proposalTitle: "Social Media Management Proposal",
    badge: "Engagement & Video",
    tier: "silver",
    tagline: "Short-Form Video Production & Community Reach",
    summary: "Engineered for scaling brands looking to tap into viral short-form video algorithms, increased post cadence, and active conversation driving.",
    idealFor: "Growing businesses looking for consistent social media growth and branding.",
    keyHighlights: [
      "8 Professional Video Reels",
      "8 Custom Creative Graphic Posts",
      "4 Professional Shoots Guidance",
      "Complete Profile Optimization",
      "Dedicated Account Manager"
    ],
    tableFeatures: [
      { feature: "Reels", details: "8 Professional Reels" },
      { feature: "Graphic Posts", details: "8 Creative Designs" },
      { feature: "Professional Shoots", details: "4 Shoots" },
      { feature: "Content Calendar", details: "Monthly Planning" },
      { feature: "Caption Writing", details: "Included" },
      { feature: "Hashtag Research", details: "Included" },
      { feature: "Account Optimization", details: "Complete Profile Optimization" },
      { feature: "Monthly Report", details: "Performance Report with Insights" },
      { feature: "Dedicated Account Manager", details: "Included" },
      { feature: "Support", details: "Priority Business Hours Support" },
      { feature: "Revisions", details: "Up to 3 revisions per post" }
    ],
    notIncluded: [
      "Paid Ad Budget (Meta Ad Spend)",
      "Celebrity / Macro Influencer Collabs",
      "Website Redesign"
    ],
    investmentNote: "More content, stronger branding, improved engagement, and dedicated account support for businesses ready to scale."
  },
  {
    id: "smm-gold",
    name: "Gold Package",
    category: "smm",
    categoryTitle: "Social Media Management",
    proposalTitle: "Social Media Management Proposal",
    badge: "Most Popular",
    popular: true,
    tier: "gold",
    tagline: "10 Reels, 10 Graphic Posts, 6 Shoots & Dedicated Manager",
    summary: "Built for businesses that want faster growth, premium branding, and consistent content production with dedicated management.",
    idealFor: "Businesses that want faster growth, premium branding, and consistent content production.",
    keyHighlights: [
      "10 Professional Reels",
      "10 Creative Designs (Graphic Posts)",
      "6 Professional Shoots",
      "Dedicated Account Manager",
      "Detailed Performance Report & Priority Support"
    ],
    tableFeatures: [
      { feature: "Reels", details: "10 Professional Reels" },
      { feature: "Graphic Posts", details: "10 Creative Designs" },
      { feature: "Professional Shoots", details: "6 Shoots" },
      { feature: "Content Calendar", details: "Monthly Planning" },
      { feature: "Caption Writing", details: "Included" },
      { feature: "Hashtag Research", details: "Included" },
      { feature: "Account Optimization", details: "Complete Profile Optimization" },
      { feature: "Monthly Report", details: "Detailed Performance Report" },
      { feature: "Dedicated Account Manager", details: "Included" },
      { feature: "Priority Support", details: "Included" },
      { feature: "Revisions", details: "Up to 4 revisions per post" }
    ],
    investmentNote: "The Gold Package is built for brands that need high-quality content, regular shoots, stronger engagement, and premium social media management."
  },
  {
    id: "smm-platinum",
    name: "Platinum Package",
    category: "smm",
    categoryTitle: "Social Media Management",
    proposalTitle: "Social Media Management Proposal",
    badge: "Ultimate",
    tier: "platinum",
    tagline: "12 Reels, 12 Graphic Posts, 8 Shoots & Highest Priority Support",
    summary: "Built for established brands that require premium content production, maximum consistency, and dedicated social media management.",
    idealFor: "Established brands that require premium content production, maximum consistency, and dedicated social media management.",
    keyHighlights: [
      "12 Professional Reels",
      "12 Creative Designs (Graphic Posts)",
      "8 Professional Shoots",
      "Dedicated Account Manager",
      "Advanced Performance Report & Highest Priority Support"
    ],
    tableFeatures: [
      { feature: "Reels", details: "12 Professional Reels" },
      { feature: "Graphic Posts", details: "12 Creative Designs" },
      { feature: "Professional Shoots", details: "8 Shoots" },
      { feature: "Content Calendar", details: "Monthly Planning" },
      { feature: "Caption Writing", details: "Included" },
      { feature: "Hashtag Research", details: "Included" },
      { feature: "Account Optimization", details: "Premium Profile Optimization" },
      { feature: "Monthly Report", details: "Advanced Performance Report with Insights" },
      { feature: "Dedicated Account Manager", details: "Included" },
      { feature: "Priority Support", details: "Highest Priority" },
      { feature: "Revisions", details: "Up to 5 revisions per post" }
    ],
    investmentNote: "The Platinum Package delivers premium-quality content, strategic planning, high-frequency posting, dedicated account management, and priority support to help your brand achieve maximum online visibility and engagement."
  }
];

export const WEBSITE_PACKAGES: PricingPackage[] = [
  {
    id: "web-bronze",
    name: "Bronze Website Package",
    category: "website",
    categoryTitle: "Website Development",
    proposalTitle: "Website Development Proposal",
    badge: "Startups & Small Business",
    tier: "bronze",
    tagline: "Up to 5 Pages, Responsive Design, WhatsApp & SEO Setup",
    summary: "Engineered for small businesses and startups needing an up to 5-page responsive website, WhatsApp integration, and essential SEO setup.",
    idealFor: "Small Businesses, Startups",
    keyHighlights: [
      "Up to 5 Pages & Premium Responsive Design",
      "Mobile Friendly with WhatsApp & Click-to-Call",
      "Google Maps & Social Media Integration",
      "Basic SEO, SSL Security, XML Sitemap & Robots.txt",
      "7 Days Technical Support & 2 Minor Revisions"
    ],
    tableFeatures: [
      { feature: "Up to 5 Pages", details: "Included" },
      { feature: "Premium Responsive Design", details: "Included" },
      { feature: "Mobile Friendly", details: "Included" },
      { feature: "Contact Form", details: "Included" },
      { feature: "WhatsApp Chat Integration", details: "Included" },
      { feature: "Click-to-Call Button", details: "Included" },
      { feature: "Google Maps Integration", details: "Included" },
      { feature: "Social Media Integration", details: "Included" },
      { feature: "Basic SEO Setup", details: "Included" },
      { feature: "SSL Security", details: "Included" },
      { feature: "XML Sitemap", details: "Included" },
      { feature: "Robots.txt", details: "Included" },
      { feature: "Google Search Console Setup", details: "Included" },
      { feature: "Google Analytics Setup", details: "Included" },
      { feature: "Speed Optimization", details: "Included" },
      { feature: "Image Optimization", details: "Included" },
      { feature: "Basic Security", details: "Included" },
      { feature: "7 Days Technical Support", details: "Included" },
      { feature: "2 Minor Revisions", details: "Included" }
    ],
    paymentTerms: [
      "50% Advance",
      "50% Before Final Delivery",
      "GST Extra",
      "Domain & Hosting Extra"
    ],
    investmentNote: "Engineered for small businesses and startups needing up to 5 pages, responsive design, contact forms, and foundational technical setup."
  },
  {
    id: "web-silver",
    name: "Silver Website Package",
    category: "website",
    categoryTitle: "Website Development",
    proposalTitle: "Website Development Proposal",
    badge: "Growing Businesses",
    tier: "silver",
    tagline: "Up to 10 Pages, Blog, UI/UX & Lead Generation",
    summary: "Engineered for growing businesses requiring up to 10 pages, premium UI/UX, blog setup, lead generation forms, and technical support.",
    idealFor: "Growing Businesses",
    keyHighlights: [
      "Everything in Bronze Included",
      "Up to 10 Pages & Premium UI/UX",
      "Blog Setup, Gallery, FAQ & Testimonials",
      "Lead Generation Forms & Spam Protection",
      "30 Days Technical Support & 3 Minor Revisions"
    ],
    tableFeatures: [
      { feature: "Everything in Bronze", details: "Included" },
      { feature: "Up to 10 Pages", details: "Included" },
      { feature: "Premium UI/UX", details: "Included" },
      { feature: "Blog Setup", details: "Included" },
      { feature: "Gallery", details: "Included" },
      { feature: "FAQ", details: "Included" },
      { feature: "Testimonials", details: "Included" },
      { feature: "Team Section", details: "Included" },
      { feature: "Lead Generation Forms", details: "Included" },
      { feature: "Privacy Policy", details: "Included" },
      { feature: "Terms & Conditions", details: "Included" },
      { feature: "Backup Setup", details: "Included" },
      { feature: "Spam Protection", details: "Included" },
      { feature: "Schema Setup", details: "Included" },
      { feature: "30 Days Technical Support", details: "Included" },
      { feature: "3 Minor Revisions", details: "Included" }
    ],
    paymentTerms: [
      "50% Advance",
      "50% Before Final Delivery",
      "GST Extra",
      "Domain & Hosting Extra"
    ],
    investmentNote: "Engineered for growing businesses requiring up to 10 pages, premium UI/UX, lead generation forms, and technical support."
  },
  {
    id: "web-gold",
    name: "Gold Website Package",
    category: "website",
    categoryTitle: "Website Development",
    proposalTitle: "Website Development Proposal",
    badge: "Premium Businesses",
    popular: true,
    tier: "gold",
    tagline: "Up to 15 Pages, Portfolio, Career Page & Dynamic Blog",
    summary: "Engineered for premium businesses requiring up to 15 pages, custom portfolio, career page, dynamic blog, and 60 days technical support.",
    idealFor: "Premium Businesses",
    keyHighlights: [
      "Everything in Silver Included",
      "Up to 15 Pages & Premium UI/UX",
      "Portfolio, Career Page & Dynamic Blog",
      "Google Reviews Integration & Technical SEO",
      "60 Days Technical Support & 5 Minor Revisions"
    ],
    tableFeatures: [
      { feature: "Everything in Silver", details: "Included" },
      { feature: "Up to 15 Pages", details: "Included" },
      { feature: "Premium UI/UX", details: "Included" },
      { feature: "Portfolio", details: "Included" },
      { feature: "Career Page", details: "Included" },
      { feature: "Dynamic Blog", details: "Included" },
      { feature: "Google Reviews Integration", details: "Included" },
      { feature: "Advanced Contact Forms", details: "Included" },
      { feature: "Technical SEO", details: "Included" },
      { feature: "Performance Optimization", details: "Included" },
      { feature: "60 Days Technical Support", details: "Included" },
      { feature: "5 Minor Revisions", details: "Included" }
    ],
    paymentTerms: [
      "50% Advance",
      "50% Before Final Delivery",
      "GST Extra",
      "Domain & Hosting Extra"
    ],
    investmentNote: "Engineered for premium businesses requiring up to 15 pages, portfolio, career page, dynamic blog, and 60 days technical support."
  },
  {
    id: "web-platinum",
    name: "Platinum E-Commerce Package",
    category: "website",
    categoryTitle: "Website Development",
    proposalTitle: "Website Development Proposal",
    badge: "Online Stores",
    tier: "platinum",
    tagline: "Premium Store Design, Unlimited Products & Secure Checkout",
    summary: "Complete e-commerce platform engineered for online stores requiring unlimited products, payment gateway, shipping setup, and analytics dashboard.",
    idealFor: "Online Stores",
    keyHighlights: [
      "Everything in Gold Included",
      "Premium Store Design & Unlimited Product Support",
      "Shopping Cart, Secure Checkout & Payment Gateway",
      "Shipping Setup, GST Invoicing, Coupon & Wishlist",
      "Customer Login, Order Tracking & 60 Days Priority Support"
    ],
    tableFeatures: [
      { feature: "Everything in Gold", details: "Included" },
      { feature: "Premium Store Design", details: "Included" },
      { feature: "Unlimited Product Support", details: "Included" },
      { feature: "Shopping Cart", details: "Included" },
      { feature: "Secure Checkout", details: "Included" },
      { feature: "Payment Gateway Integration", details: "Included" },
      { feature: "Shipping Setup", details: "Included" },
      { feature: "GST Invoice Support", details: "Included" },
      { feature: "Coupon System", details: "Included" },
      { feature: "Wishlist", details: "Included" },
      { feature: "Customer Login", details: "Included" },
      { feature: "Order Tracking", details: "Included" },
      { feature: "Basic Product SEO", details: "Included" },
      { feature: "Analytics Dashboard", details: "Included" },
      { feature: "60 Days Priority Support", details: "Included" }
    ],
    paymentTerms: [
      "50% Advance",
      "50% Before Final Delivery",
      "GST Extra",
      "Domain & Hosting Extra"
    ],
    investmentNote: "Engineered for online stores requiring complete e-commerce infrastructure, secure payment gateways, and priority technical support."
  }
];

export const ALL_PACKAGES: PricingPackage[] = [
  ...SEO_PACKAGES,
  ...SMM_PACKAGES,
  ...WEBSITE_PACKAGES
];

export function getPackageById(id: string): PricingPackage | undefined {
  return ALL_PACKAGES.find(pkg => pkg.id.toLowerCase() === id.toLowerCase());
}
