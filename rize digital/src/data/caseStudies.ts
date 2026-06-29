export interface CaseStudyData {
  slug: string;
  title: string;
  category: string;
  stat: string;
  statDesc: string;
  desc: string;
  img: string;
  challenge: string;
  solution: string;
  results: string[];
  services: string[];
}

const CASE_STUDIES_DATA: CaseStudyData[] = [
  {
    slug: "ecommerce-roas-optimization",
    title: "E-Commerce ROAS Optimization",
    category: "Paid Ads / PPC",
    stat: "+380%",
    statDesc: "Increase in conversion sales values",
    desc: "Optimized multi-channel campaign architectures, restructuring ad set triggers to scale high-intent consumer checkout volumes.",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
    challenge: "The client's e-commerce platform was experiencing stagnant ROAS with rising cost-per-acquisition across Google and Meta ad channels. Campaign structure was flat with no audience segmentation.",
    solution: "We restructured the entire campaign architecture into segmented ad sets by purchase intent, implemented dynamic retargeting funnels, and optimized bidding strategies with automated rules for scaling winning creatives.",
    results: [
      "380% increase in return on ad spend",
      "62% reduction in cost per acquisition",
      "45% increase in average order value",
      "3x growth in monthly conversion volume"
    ],
    services: ["/services/paid-ads", "/services/digital-marketing"]
  },
  {
    slug: "regional-b2b-lead-funnel",
    title: "Regional B2B Lead Funnel Build",
    category: "Local SEO / Web Dev",
    stat: "1,200+",
    statDesc: "New qualified target queries monthly",
    desc: "Built structured service templates, optimized technical crawler indexing, and established map pack authority parameters.",
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600",
    challenge: "A regional B2B services company had zero organic visibility. Their website had no structured content, poor technical SEO, and no local search presence in their target markets.",
    solution: "We built structured landing page templates targeting local service queries, implemented comprehensive technical SEO fixes, optimized Google Business Profiles, and established authoritative backlink profiles.",
    results: [
      "1,200+ new qualified search queries per month",
      "Page 1 rankings for 85+ local keywords",
      "Google Map Pack visibility in 4 target cities",
      "340% increase in organic lead submissions"
    ],
    services: ["/services/seo", "/services/web-development"]
  },
  {
    slug: "fintech-platform-speed-tuning",
    title: "FinTech Platform Speed Tuning",
    category: "Web Engineering",
    stat: "99/100",
    statDesc: "Mobile page speed benchmarks",
    desc: "Restructured dynamic code imports, loaded components asynchronously, and compressed dynamic media loading patterns.",
    img: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=600",
    challenge: "A fintech platform had mobile Lighthouse scores below 40, with 8+ second load times causing high bounce rates and poor conversion metrics on mobile devices.",
    solution: "We implemented aggressive code splitting with dynamic imports, optimized critical rendering paths, compressed and lazy-loaded all media assets, and restructured the component architecture for progressive hydration.",
    results: [
      "99/100 mobile Lighthouse performance score",
      "Sub-2 second Time to Interactive",
      "78% reduction in JavaScript bundle size",
      "52% decrease in mobile bounce rate"
    ],
    services: ["/services/web-development", "/services/custom-website-development"]
  }
];

export default CASE_STUDIES_DATA;
