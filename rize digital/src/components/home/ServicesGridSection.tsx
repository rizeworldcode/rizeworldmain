import { Share2, Search, FileText, Palette, MousePointerClick, Layout, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SERVICES = [
  {
    title: "Social Media Marketing",
    description: "Grow your online presence with professional social media marketing services, SMM agency strategies, and custom paid social advertising campaigns designed to build community engagement.",
    icon: <Share2 />,
    tags: ["SMM Services", "Instagram Marketing", "Brand Promotion"],
    path: "/services/social-media-marketing",
    colorClass: "icon-box-blue"
  },
  {
    title: "SEO Optimization",
    description: "Our SEO services India and local SEO services utilize technical website audit procedures, on-page optimization, and targeted keyword research to dominate Google search results.",
    icon: <Search />,
    tags: ["SEO Specialist", "WordPress SEO", "On-Page SEO"],
    path: "/services/seo",
    colorClass: "icon-box-indigo"
  },
  {
    title: "Content Marketing",
    description: "Engage your audience with premium content writing services. Our content creation agency writes high-converting website content writing copy and strategic blog writing services.",
    icon: <FileText />,
    tags: ["SEO Content Writing", "Website Copywriting", "Content Strategy"],
    path: "/services/content-marketing",
    colorClass: "icon-box-cyan"
  },
  {
    title: "Graphic Design",
    description: "Work with a leading graphic design company. We offer custom logo design, brochure design, and comprehensive brand identity design services tailored for corporate growth.",
    icon: <Palette />,
    tags: ["Logo Design", "Graphic Design Studio", "Infographic Design"],
    path: "/services/graphic-design",
    colorClass: "icon-box-gold"
  },
  {
    title: "PPC Advertising",
    description: "Maximize your campaign returns with results-driven PPC management services, programmatic pay per click services, and Google ads agency setups.",
    icon: <MousePointerClick />,
    tags: ["PPC Campaign", "Google Ads Agency", "Remarketing Ads"],
    path: "/services/paid-ads",
    colorClass: "icon-box-green"
  },
  {
    title: "Web Designing",
    description: "Elevate your digital platform with a professional web design company. We provide custom web design services, mobile friendly web design layouts, and responsive website structures.",
    icon: <Layout />,
    tags: ["Web Design Services", "Website Design Company", "Custom Web Design"],
    path: "/services/web-development",
    colorClass: "icon-box-blue"
  }
];

const COMPANY_LOGOS = [
  "/compney/BEST COMPANIES png 3.png",
  "/compney/CLUTCH.png",
  "/compney/METAA.png",
  "/compney/REVIEWS.png",
  "/compney/goggle partner.png",
  "/compney/good firms.png",
  "/compney/msme.png",
  "/compney/oneflare.png",
  "/compney/tech behemoths.png",
  "/compney/top 100 company clutch.png",
  "/compney/toppccss.png"
];

const repeatedCompanyLogos = [...COMPANY_LOGOS, ...COMPANY_LOGOS, ...COMPANY_LOGOS, ...COMPANY_LOGOS];

export default function ServicesGridSection() {
  return (
    <>
      {/* Partner Companies Ticker */}
      <section className="py-10 bg-[#f5f9fb] border-t border-b border-gray-200 overflow-hidden relative w-full">
        <style>
          {`
            @keyframes marquee-companies {
              0% { transform: translate3d(0, 0, 0); }
              100% { transform: translate3d(-50%, 0, 0); }
            }
            .animate-marquee-companies {
              animation: marquee-companies 35s linear infinite;
              will-change: transform;
              backface-visibility: hidden;
              -webkit-backface-visibility: hidden;
            }
          `}
        </style>
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 mb-6 text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-black block">
            certified partner networks
          </span>
        </div>
        <div className="flex-1 overflow-hidden mask-image-horizontal w-full">
          <div className="flex w-max animate-marquee-companies items-center">
            {repeatedCompanyLogos.map((src, idx) => (
              <div key={idx} className="w-56 h-24 mx-4 flex items-center justify-center shrink-0 p-2 bg-white rounded-4xl shadow-sm border border-gray-100/50 overflow-hidden">
                <img 
                  src={src} 
                  alt="Partner Company Logo" 
                  className="max-h-[92%] max-w-[92%] object-contain" 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="relative w-full px-4 sm:px-6 lg:px-8 py-24 md:py-32 bg-rize-bg border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-gray-900 font-bold leading-tight tracking-tight text-5xl md:text-6xl lg:text-7xl">
            We Provide <span className="text-orange-500">Smart Solution</span>
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Offer a wide range of services to help businesses establish and enhance their online presence.
          </p>
        </div>

        {/* 3x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => (
            <Link 
              key={index} 
              to={service.path}
              className="premium-card flex flex-col cursor-pointer h-full text-left"
            >
              {/* Icon */}
              <div className={`icon-box ${service.colorClass} mb-8 shadow-sm transition-transform duration-500 ease-out`}>
                {service.icon}
              </div>
              
              {/* Text */}
              <h3 className="text-black text-2xl font-bold mb-4 tracking-tight">
                {service.title}
              </h3>
              <p className="text-gray-500 text-base leading-relaxed font-medium mb-8 flex-1">
                {service.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {service.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="px-3 py-1 bg-gray-50 border border-gray-100 text-gray-600 text-xs font-semibold rounded-full tracking-wide">
                    {tag}
                  </span>
                ))}
              </div>

              {/* View More Button */}
              <div className="mt-auto border-t border-gray-100 pt-6">
                <span className="flex items-center gap-2 text-rize-primary font-bold text-sm tracking-wide group-hover:gap-4 transition-all duration-300">
                  View More <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  </>
  );
}
