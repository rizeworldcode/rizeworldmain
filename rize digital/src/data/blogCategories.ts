export interface BlogCategory {
  slug: string;
  name: string;
  description: string;
  servicePath: string;
}

const BLOG_CATEGORIES: BlogCategory[] = [
  {
    slug: "digital-marketing",
    name: "Digital Marketing",
    description: "Expert guides on digital marketing strategy, campaign management, and growth frameworks.",
    servicePath: "/services/digital-marketing"
  },
  {
    slug: "seo",
    name: "SEO",
    description: "Search engine optimization insights, technical audits, keyword research, and ranking strategies.",
    servicePath: "/services/seo"
  },
  {
    slug: "social-media-marketing",
    name: "Social Media Marketing",
    description: "Social media strategy, content curation, community management, and engagement tactics.",
    servicePath: "/services/social-media-marketing"
  },
  {
    slug: "paid-ads",
    name: "Paid Ads",
    description: "PPC campaign strategies, Google Ads optimization, Meta Ads scaling, and ROAS improvement guides.",
    servicePath: "/services/paid-ads"
  },
  {
    slug: "web-development",
    name: "Web Development",
    description: "Web development best practices, performance optimization, and modern frontend architecture.",
    servicePath: "/services/web-development"
  },
  {
    slug: "content-marketing",
    name: "Content Marketing",
    description: "Content strategy, copywriting frameworks, email marketing, and thought leadership guides.",
    servicePath: "/services/content-marketing"
  },
  {
    slug: "ecommerce",
    name: "E-Commerce",
    description: "E-commerce growth strategies, conversion optimization, and online store development insights.",
    servicePath: "/services/ecommerce-development"
  },
  {
    slug: "ui-ux",
    name: "UI/UX Design",
    description: "User experience design principles, interface patterns, and design system best practices.",
    servicePath: "/services/ui-ux-design"
  }
];

export default BLOG_CATEGORIES;
