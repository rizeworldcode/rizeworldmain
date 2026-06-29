export interface Service {
  id: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  benefits: string[];
}

export const SERVICES: Service[] = [
  {
    id: "digital-marketing",
    title: "Digital Marketing Service",
    tagline: "Drive visibility and engagement to maximize conversions.",
    description: "Our comprehensive digital marketing solutions help your business achieve dominant online visibility. We combine creative storytelling with data-driven audience insights to build campaigns that convert passive browsers into loyal brand advocates.",
    features: [
      "In-depth market research & competitor benchmarking",
      "End-to-end multi-channel campaign strategy",
      "High-converting landing page creation & A/B testing",
      "Robust audience segmentation and analytics tracking",
      "Regular performance audits & ROI optimization reporting"
    ],
    benefits: [
      "Accelerated brand recognition & online authority",
      "Higher quality lead generation & sales volume",
      "Improved marketing spend efficiency and attribution clarity"
    ]
  },
  {
    id: "web-development",
    title: "Web Development",
    tagline: "Build high-performance, responsive websites that scale.",
    description: "We craft custom web applications tailored to your exact business specifications. Leveraging state-of-the-art architectures, we focus on blazing-fast load speeds, robust security practices, and flawless cross-browser compatibility.",
    features: [
      "Full-stack custom software & web application development",
      "Highly responsive mobile-first UI component styling",
      "Secure API integrations & custom database design",
      "High-speed server setup & search engine ready markup",
      "Scalable headless CMS integrations (React, NextJS, etc.)"
    ],
    benefits: [
      "Zero layout shifts and superior site speed parameters",
      "Enhanced business workflow automation & digital tooling",
      "Maximum protection against security vulnerabilities"
    ]
  },
  {
    id: "seo",
    title: "Search Engine Optimization",
    tagline: "Rank higher on Google and attract organic traffic.",
    description: "Get discovered by clients actively searching for your solutions. Our technical and on-page SEO services optimize your website's hierarchy, content relevance, and indexability to secure stable top-tier rankings on major search engines.",
    features: [
      "Comprehensive keyword research & intent mapping",
      "Technical audits covering indexability, Core Web Vitals",
      "On-page content optimization & schema markup deployment",
      "High-quality authoritative backlink outreach strategies",
      "Detailed organic search impressions & keywords tracking"
    ],
    benefits: [
      "Continuous stream of high-converting organic website traffic",
      "Reduced dependency on expensive paid advertising channels",
      "Long-term digital footprint compounding over time"
    ]
  },
  {
    id: "social-media-marketing",
    title: "Social Media Marketing",
    tagline: "Build a community around your brand identity.",
    description: "Turn social media feeds into valuable brand touchpoints. We conceptualize, design, and manage highly engaging social profiles across Instagram, LinkedIn, and Twitter to build authentic communities and boost customer loyalty.",
    features: [
      "Bespoke social media content calendars & visual assets design",
      "Active brand page management and follower interaction",
      "Targeted local influencer outreach & partnership coordination",
      "Comprehensive social listening & sentiment tracking",
      "Monthly metrics growth reports (Reach, Impressions, Engagement)"
    ],
    benefits: [
      "Authentic community growth and customer brand advocates",
      "Consistent, premium visual identity across all platforms",
      "Real-time customer feedback & direct consumer connection"
    ]
  },
  {
    id: "paid-ads",
    title: "Paid Ads",
    tagline: "Maximize advertising ROI with laser-targeted campaigns.",
    description: "Launch instant-impact campaigns that target ready-to-buy audiences. We construct and manage ROI-focused PPC campaigns across Google Search, YouTube, and Meta Networks to drive immediate lead capture and sales conversions.",
    features: [
      "Laser-targeted search, display, and social ad creation",
      "Advanced demographic, keyword, and placement targeting",
      "Continuous bid optimization and ad copy A/B tests",
      "Conversion tracking setups (Pixels, GTM, Server-side API)",
      "Transparent budget distribution and CPA analysis reporting"
    ],
    benefits: [
      "Immediate search engine visibility and top-of-funnel traffic",
      "Highly predictable customer acquisition budgets",
      "Actionable data insights on audience search behaviors"
    ]
  },
  {
    id: "wordpress-development",
    title: "WordPress Development Services",
    tagline: "Custom theme design and modular Gutenberg blocks.",
    description: "Utilize the flexibility of WordPress without the bloat. We build custom, lightweight Gutenberg-compatible themes and plugins that give your editorial teams absolute content control while maintaining top-tier page performance.",
    features: [
      "100% custom theme design & Gutenberg block components creation",
      "Secure WooCommerce setups and custom payment integrations",
      "Advanced custom fields (ACF) configuration for easy edits",
      "Rigorous plugin audits and database optimization practices",
      "Reliable site migration and automatic staging updates"
    ],
    benefits: [
      "Extremely user-friendly visual editor interface for your team",
      "Clean, block-based codebase for easy website maintenance",
      "Rapid template deployment for marketing campaigns"
    ]
  },
  {
    id: "custom-website-development",
    title: "Custom Website Development",
    tagline: "Bespoke digital experiences built from the ground up.",
    description: "When template solutions don't cut it, we design bespoke digital solutions. From complex booking platforms to custom dashboards and web interfaces, we write clean code designed specifically for your unique business goals.",
    features: [
      "Bespoke code architecture matching custom business requirements",
      "Interactive data charts, dashboards, and client portals",
      "Robust integration with external ERP and CRM software",
      "Headless architectures using cutting-edge frontend tooling",
      "Strict data protection frameworks and high-performance routing"
    ],
    benefits: [
      "Complete ownership over code assets and software features",
      "Unlimited design flexibility and custom interactivity options",
      "Seamless integration with your internal business workflows"
    ]
  }
];
