import { motion } from 'framer-motion';
import { ArrowRight, MoveRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/common/SEO';
import Breadcrumbs from '../components/common/Breadcrumbs';

const SERVICES = [
  {
    title: "Social Media Marketing",
    tags: ["SMM Services", "Instagram Marketing", "Brand Promotion"],
    desc: "Grow your online presence with professional social media marketing services, SMM agency strategies, and custom paid social advertising campaigns designed to build community engagement.",
    path: "/services/social-media-marketing"
  },
  {
    title: "SEO Optimization",
    tags: ["SEO Specialist", "WordPress SEO", "On-Page SEO"],
    desc: "Our SEO services India and local SEO services utilize technical website audit procedures, on-page optimization, and targeted keyword research to dominate Google search results.",
    path: "/services/seo"
  },
  {
    title: "Content Marketing",
    tags: ["SEO Content Writing", "Website Copywriting", "Content Strategy"],
    desc: "Engage your audience with premium content writing services. Our content creation agency writes high-converting website content writing copy and strategic blog writing services.",
    path: "/services/content-marketing"
  },
  {
    title: "Graphic Design",
    tags: ["Logo Design", "Graphic Design Studio", "Infographic Design"],
    desc: "Work with a leading graphic design company. We offer custom logo design, brochure design, and comprehensive brand identity design services tailored for corporate growth.",
    path: "/services/graphic-design"
  },
  {
    title: "PPC Advertising",
    tags: ["PPC Campaign", "Google Ads Agency", "Remarketing Ads"],
    desc: "Maximize your campaign returns with results-driven PPC management services, programmatic pay per click services, and Google ads agency setups.",
    path: "/services/paid-ads"
  },
  {
    title: "Web Designing",
    tags: ["Web Design Services", "Website Design Company", "Custom Web Design"],
    desc: "Elevate your digital platform with a professional web design company. We provide custom web design services, mobile friendly web design layouts, and responsive website structures.",
    path: "/services/web-development"
  }
];

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

export default function About() {
  const navigate = useNavigate();

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "RizeWorld Digital",
    "url": "https://rizeworld.in/",
    "logo": "https://rizeworld.in/images/logo/RW.png",
    "sameAs": [
      "https://www.facebook.com/share/1BcNrvpmuJ/",
      "https://www.instagram.com/rizeworld?igsh=MWYxOGs5NGhhdnNsNA==",
      "https://www.linkedin.com/company/rizeworld/"
    ]
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
        "name": "About Us",
        "item": "https://rizeworld.in/about"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-rize-bg overflow-hidden">
      <SEO 
        title="About Our Digital Marketing Agency | RizeWorld"
        description="Learn more about RizeWorld, a leading digital solutions company. Discover how our online marketing services and professional web design agency scale brands."
        canonicalUrl="https://rizeworld.in/about"
        schema={[orgSchema, breadcrumbSchema]}
      />
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen bg-rize-bg overflow-hidden flex flex-col pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 relative flex flex-col">
          <div className="mt-4">
            <Breadcrumbs items={[{ name: "About Us" }]} />
          </div>
          
          {/* Floating Dot */}
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="absolute right-1/4 top-[45%] w-3 h-3 bg-rize-primary rounded-full hidden lg:block" 
          />

          <div className="flex-1 flex flex-col justify-center max-w-3xl mt-12 mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="section-label mb-8"
            >
              About Us
            </motion.h2>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-hero mb-8 text-left! leading-[1.05]"
            >
              Full Service <br className="hidden md:block"/> 
              <span className="gradient-text">Digital Marketing Agency</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-body max-w-[600px] text-left!"
            >
              At RizeWorld, we are a dedicated <strong>digital solutions company</strong> providing comprehensive <strong>digital marketing solutions</strong>, custom web development, and search engine optimization. We blend creativity and analytics to drive business growth.
            </motion.p>
          </div>

          {/* Bottom Elements */}
          <div className="mt-auto flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pt-8">
            
            {/* Social Icons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center gap-3"
            >
              <a href="https://www.instagram.com/rizeworld?igsh=MWYxOGs5NGhhdnNsNA==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-rize-primary hover:text-rize-primary hover:bg-rize-primary/5 transition-all">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://www.facebook.com/share/1BcNrvpmuJ/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-rize-primary hover:text-rize-primary hover:bg-rize-primary/5 transition-all">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/rizeworld/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-rize-primary hover:text-rize-primary hover:bg-rize-primary/5 transition-all">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </motion.div>

            {/* Scroll to Explore */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-gray-900 uppercase cursor-pointer hover:text-rize-primary transition-colors"
            >
              SCROLL TO EXPLORE
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                <line x1="5" y1="5" x2="19" y2="19" />
                <polyline points="10 19 19 19 19 10" />
              </svg>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. WHO WE ARE */}
      <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
          
          {/* Column 1: Title, Image, Text */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col text-left"
          >
            <h2 className="text-h3 mb-6 uppercase tracking-wide">
              Who We Are?
            </h2>
            <div className="rounded-3xl overflow-hidden bg-gray-200 mb-6 aspect-4/3 border border-gray-150">
              <img 
                src="/images/about/about 2.png" 
                alt="Team collaborating" 
                className="w-full h-full object-cover" 
              />
            </div>
            <p className="text-body">
              Whether you're a seasoned player in the digital landscape or just stepping into it, we have the expertise and strategies to propel your brand. At RizeWorld, we are passionate about empowering brands to thrive in the digital realm.
            </p>
          </motion.div>

          {/* Column 2: Large Vertical Image */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col h-full"
          >
            <div className="rounded-3xl overflow-hidden bg-gray-200 h-full min-h-[400px] md:min-h-0 border border-gray-150">
              <img 
                src="/images/about/about 3.png" 
                alt="Design process" 
                className="w-full h-full object-cover" 
              />
            </div>
          </motion.div>

          {/* Column 3: Text and Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col justify-center text-left"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
              We're a dynamic digital marketing agency committed to making your business thrive.
            </h3>
            <div className="space-y-6 text-gray-500 leading-relaxed mb-8">
              <p className="text-body">Founded on the principles of creativity and innovation, we understand that every business has a unique story to tell.</p>
              <p className="text-body">Our mission is to craft compelling narratives and strategies that resonate with your audience and elevate your brand.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/contact" className="btn-primary text-xs uppercase tracking-wider py-3! px-6! rounded-full! group">
                Contact Us
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </Link>
              <Link to="/portfolio" className="btn-secondary text-xs uppercase tracking-wider py-3! px-6! rounded-full!">
                Our Projects
              </Link>
            </div>

            {/* Floating Dot */}
            <div className="w-2 h-2 bg-rize-primary rounded-full mt-12 ml-16 hidden lg:block" />
          </motion.div>
          
        </div>
      </section>

      {/* 3. STATISTICS & BANNER */}
      <section className="pb-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Banner Image */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full h-[180px] sm:h-[250px] md:h-[500px] rounded-3xl overflow-hidden mb-20 md:mb-32 border border-gray-150"
        >
          <img 
            src="/images/about/about 1.png" 
            alt="Abstract design background" 
            className="w-full h-full object-cover md:object-contain bg-neutral-100/50"
          />
        </motion.div>

        {/* Stats Intro Text */}
        <div className="text-center max-w-4xl mx-auto mb-20 md:mb-28 relative">
          <h2 className="section-title mb-6 leading-snug">
            Dive into our studio's core – numbers that mirror our dedication, creativity, and pursuit of excellence. These stats offer a glimpse into our design prowess and its real-world impact.
          </h2>
          {/* Floating Dot */}
          <div className="absolute right-0 top-1/2 translate-x-12 w-2 h-2 bg-rize-primary rounded-full hidden lg:block" />
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          {[
            { num: "260", suffix: "+", label: "Campaigns Launched" },
            { num: "5", suffix: "x", label: "Client ROI" },
            { num: "10M", suffix: "+", label: "Total Audience Reach" },
            { num: "98", suffix: "%", label: "Client Satisfaction" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold text-rize-primary mb-4 tracking-tighter flex items-start">
                {stat.num}
                <span className="text-3xl md:text-4xl lg:text-5xl mt-1">{stat.suffix}</span>
              </div>
              <div className="text-sm md:text-base font-bold text-gray-900 uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>






      {/* 5. OUR SERVICES */}
      <section className="pt-20 md:pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="section-title mb-12 md:mb-20">
          Our Services
        </h2>
        
        <div className="flex flex-col mb-12 border-t border-gray-200">
          {SERVICES.map((service, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              onClick={() => navigate(service.path)}
              className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_2fr] gap-6 md:gap-12 py-10 md:py-12 border-b border-gray-255 group cursor-pointer hover:bg-blue-50/20 transition-all text-left"
            >
              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-rize-primary transition-colors">
                <Link to={service.path} onClick={(e) => e.stopPropagation()}>{service.title}</Link>
              </h3>
              <div className="flex flex-col gap-2">
                {service.tags.map((tag, idx) => (
                  <span key={idx} className="text-gray-700 font-semibold uppercase text-xs tracking-wider">{tag}</span>
                ))}
              </div>
              <div>
                <p className="text-gray-500 leading-relaxed mb-6">
                  {service.desc}
                </p>
                <Link to={service.path} onClick={(e) => e.stopPropagation()} className="btn-ghost py-0! text-xs uppercase tracking-wider hover:text-rize-primary transition-colors">
                  VIEW MORE <MoveRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </section>

      {/* 6. SERVICES MARQUEE (DOUBLE SCROLL) */}
      <section className="py-20 md:py-32 bg-[#111] overflow-hidden flex flex-col gap-4 md:gap-8 relative">
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

      {/* 7. FINAL CTA */}
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
