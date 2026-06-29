import { Share2, Search, FileText, Palette, MousePointerClick, Layout, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SERVICES = [
  {
    title: "Social Media Marketing",
    description: "use of social media platforms to promote our products for our services , it is the time period of social techniques when mostly the audience is engaged with social platforms by using SMM we make our audience aware.",
    icon: <Share2 />,
    tags: ["Management", "Advertising", "Creation"],
    path: "/services/social-media-marketing",
    colorClass: "icon-box-blue"
  },
  {
    title: "SEO Optimization",
    description: "it involves optimizing various aspects of a website in its content, structure and technical elements to make it easier and helps to rank in top pages on google.",
    icon: <Search />,
    tags: ["Optimization", "Research", "SEO audits"],
    path: "/services/seo",
    colorClass: "icon-box-indigo"
  },
  {
    title: "Content Marketing",
    description: "Involves creating and sharing valuable ,relevant and consistent content to attract and engage a specific target audience.",
    icon: <FileText />,
    tags: ["Value", "Relevance", "Consistency"],
    path: "/services/content-marketing",
    colorClass: "icon-box-cyan"
  },
  {
    title: "Graphic Design",
    description: "Art and practice of creating visual content to communicate ideas, information, or emotions.",
    icon: <Palette />,
    tags: ["Creative", "Visual", "Strategic"],
    path: "/services/graphic-design",
    colorClass: "icon-box-gold"
  },
  {
    title: "PPC Advertising",
    description: "A digital advertising model where advertisers pay a fee each time someone clicks on their ad.",
    icon: <MousePointerClick />,
    tags: ["Targeted", "Measurable", "Instant"],
    path: "/services/paid-ads",
    colorClass: "icon-box-green"
  },
  {
    title: "Web Designing",
    description: "Process of planning, creating and arranging visual and functional elements of a website.",
    icon: <Layout />,
    tags: ["Creative", "Responsive", "User-friendly"],
    path: "/services/web-development",
    colorClass: "icon-box-blue"
  }
];

export default function ServicesGridSection() {
  return (
    <section id="services" className="relative w-full px-4 sm:px-6 lg:px-8 py-24 md:py-32 bg-rize-bg border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <span className="section-label mb-4 block">
            We Provide
          </span>
          <h2 className="section-title mb-6">
            Smart Solution
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
  );
}
