import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowDownRight, ArrowRight, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';
import Breadcrumbs from '../components/common/Breadcrumbs';
import BLOG_CATEGORIES from '../data/blogCategories';

export default function Blogs() {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(3);

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
        "name": "Blogs",
        "item": "https://rizeworld.in/blogs"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-rize-bg pt-32 pb-24 overflow-hidden text-left font-sans selection:bg-rize-primary selection:text-white">
      <SEO 
        title="Digital Marketing Insights & Strategy Blog | RizeWorld"
        description="Read the latest RizeWorld blogs. We share expert guides, marketing strategies, search engine optimization insights, and modern design principles."
        canonicalUrl="https://rizeworld.in/blogs"
        schema={[breadcrumbSchema]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <Breadcrumbs items={[{ name: "Blogs" }]} />
      </div>

      {/* 2. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative">
        <div className="max-w-4xl">
          {/* Subheading */}
          <span className="text-rize-primary font-bold tracking-widest text-xs uppercase mb-6 block">
            Insights & Innovations
          </span>
          
          {/* Heading */}
          <h1 className="text-gray-950 text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-8 uppercase">
            Dive into the Latest <br />
            in Digital Marketing
          </h1>

          {/* Paragraph */}
          <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed max-w-3xl mb-12">
            Our team shares valuable insights, expert advice, and practical tips to keep you ahead in the ever-evolving digital landscape. Whether you're looking to boost your SEO, enhance your brand, or master social media, we've got you covered!
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Link
              to="/blogs"
              className="bg-rize-primary text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-all"
            >
              All Posts
            </Link>
            {BLOG_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to={`/blogs/category/${cat.slug}`}
                className="bg-white border border-gray-200 text-gray-600 hover:border-rize-primary hover:text-rize-primary text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-all flex items-center gap-1.5"
              >
                <Tag size={10} />
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Socials & Scroll Indicator Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 pt-8 border-t border-gray-200 mt-16">
          {/* Left Social Icons */}
          <div className="flex items-center gap-3">
            {/* Facebook */}
            <a 
              href="https://www.facebook.com/share/1BcNrvpmuJ/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:border-rize-primary hover:text-rize-primary hover:bg-rize-primary/5 transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            {/* LinkedIn */}
            <a 
              href="https://www.linkedin.com/company/rizeworld/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:border-rize-primary hover:text-rize-primary hover:bg-rize-primary/5 transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            {/* Instagram */}
            <a 
              href="https://www.instagram.com/rizeworld?igsh=MWYxOGs5NGhhdnNsNA==" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:border-rize-primary hover:text-rize-primary hover:bg-rize-primary/5 transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
          </div>

          {/* Right Scroll Indicator */}
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-900">
            <span>Scroll to explore</span>
            <ArrowDownRight size={16} className="text-rize-primary animate-bounce" />
          </div>
        </div>
      </section>

      {/* 3. BLOGS GRID SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {blogsList.slice(0, visibleCount).map((blog) => (
            <div 
              key={blog.id} 
              onClick={() => navigate(`/blogs/${blog.slug}`)}
              className="group cursor-pointer flex flex-col text-left"
            >
              {/* Image Container */}
              <div className="w-full aspect-4/3 rounded-3xl overflow-hidden mb-6 bg-stone-100 relative">
                <img 
                  src={blog.image} 
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
              </div>

              {/* Date */}
              <span className="text-[10px] sm:text-xs font-bold tracking-widest text-gray-500 uppercase mb-3 block">
                {blog.date}
              </span>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight leading-snug mb-3 group-hover:text-rize-primary transition-colors duration-300">
                {blog.title}
              </h3>

              {/* Description */}
              <p className="text-gray-500 text-sm md:text-base font-medium leading-relaxed">
                {blog.description}
              </p>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < blogsList.length && (
          <div className="flex justify-center mt-16">
            <button 
              onClick={() => setVisibleCount((prev) => Math.min(prev + 3, blogsList.length))}
              className="px-8 py-4 bg-gray-950 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-rize-primary hover:text-white transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
            >
              Load More
            </button>
          </div>
        )}
      </section>

      {/* 4. SERVICES MARQUEE (DOUBLE SCROLL) */}
      <section className="py-20 md:py-32 bg-[#111] overflow-hidden flex flex-col gap-4 md:gap-8 relative mt-16">
        <style>
          {`
            @keyframes marquee-left {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            @keyframes marquee-right {
              0% { transform: translateX(-50%); }
              100% { transform: translateX(0); }
            }
            .animate-marquee-left {
              animation: marquee-left 100s linear infinite;
            }
            .animate-marquee-right {
              animation: marquee-right 100s linear infinite;
            }
            .text-outline {
              color: transparent;
              -webkit-text-stroke: 1px rgba(255,255,255,0.4);
            }
          `}
        </style>
        
        {/* Row 1: Scrolling Left */}
        <div className="flex w-max animate-marquee-left">
          {[...SERVICES_MARQUEE, ...SERVICES_MARQUEE, ...SERVICES_MARQUEE].map((service, i) => (
            <div key={i} className="flex items-center px-4 shrink-0">
              <span className={`text-5xl md:text-7xl lg:text-[6rem] font-medium tracking-tight ${i % 2 === 0 ? 'text-outline' : 'text-white'}`}>
                {service}
              </span>
            </div>
          ))}
        </div>

        {/* Row 2: Scrolling Right */}
        <div className="flex w-max animate-marquee-right">
          {[...SERVICES_MARQUEE, ...SERVICES_MARQUEE, ...SERVICES_MARQUEE].reverse().map((service, i) => (
            <div key={i} className="flex items-center px-4 shrink-0">
              <span className={`text-5xl md:text-7xl lg:text-[6rem] font-medium tracking-tight ${i % 2 !== 0 ? 'text-outline' : 'text-white'}`}>
                {service}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="pt-20 pb-32 md:pt-32 md:pb-48 px-4 sm:px-6 lg:px-8 bg-rize-soft overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 50 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-[90%] mx-auto border-t border-gray-300 pt-8 md:pt-16 flex flex-col md:flex-row items-center justify-between gap-12"
        >
          <h2 className="text-6xl md:text-8xl lg:text-[8rem] font-medium text-gray-900 tracking-tighter leading-none">
            TELL US YOUR NEW IDEAS
          </h2>
          <Link to="/contact" className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-rize-royal flex items-center justify-center shrink-0 hover:scale-105 hover:bg-rize-primary transition-all group shadow-xl">
            <ArrowRight className="w-8 h-8 md:w-10 md:h-10 text-white group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>
      </section>
      
    </div>
  );
}

const SERVICES_MARQUEE = [
  "Branding and Strategy",
  "Analytics and Reporting",
  "Website Development",
  "Email Marketing",
  "Pay-Per-Click Advertising",
  "Content Marketing",
  "Social Media Marketing",
  "Search Engine Optimization"
];

const blogsList = [
  {
    id: 1,
    slug: 'role-of-prototyping-in-product-design',
    image: '/images/blogs/blog_prototyping_design.png',
    date: 'JUN 25, 2024',
    title: 'The Role of Prototyping in Product Design',
    description: 'This iterative process is crucial for addressing potential issues, validating design choices, and ensuring the final product aligns with user needs and expectations.'
  },
  {
    id: 2,
    slug: 'designing-for-user-experience-key-considerations',
    image: '/images/blogs/blog_ux_design.png',
    date: 'JUN 24, 2024',
    title: 'Designing for User Experience: Key Considerations',
    description: 'Methods such as user interviews, surveys, and persona development help in gaining insights into user needs, preferences, and pain points, guiding the design process.'
  },
  {
    id: 3,
    slug: 'the-future-of-product-design-trends-watch-2024',
    image: '/images/blogs/blog_future_product_design.png',
    date: 'JUN 23, 2024',
    title: 'The Future of Product Design: Trends to Watch in 2024',
    description: 'Designers are increasingly focusing on creating products that minimize environmental impact by using sustainable materials, reducing waste, and designing for circularity.'
  },
  {
    id: 4,
    slug: '10-essential-web-design-principles-for-2024',
    image: '/images/blogs/blog_design_principles.png',
    date: 'JUN 22, 2024',
    title: '10 Essential Web Design Principles for 2024',
    description: 'Start by conducting thorough user research to understand what your audience values and how they interact with websites, keeping up with layout trends.'
  },
  {
    id: 5,
    slug: 'responsive-web-design-best-practices-and-tips',
    image: '/images/blogs/blog_responsive_design.png',
    date: 'JUN 21, 2024',
    title: 'Responsive Web Design: Best Practices and Tips',
    description: 'With the proliferation of smartphones, tablets, and other mobile devices, responsive design ensures your users have a seamless browsing experience across all screen sizes.'
  }
];
