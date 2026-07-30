import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { getApiBaseUrl, getImageUrl, formatDate } from '../utils/api';

export interface DynamicBlog {
  title: string;
  category: string;
  date: string;
  image: string;
  intro: string;
  contentHtml?: string;
  sections?: { heading: string; content: string }[];
}

export interface NavBlog {
  id: string | number;
  slug: string;
  title: string;
  date: string;
  image: string;
  description: string;
}

export default function BlogDetails() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [fetchedBlog, setFetchedBlog] = useState<DynamicBlog | null>(null);
  const [allBlogs, setAllBlogs] = useState<NavBlog[]>(blogsList);

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadBlog = async () => {
      try {
        if (slug) {
          const res = await fetch(`${getApiBaseUrl()}/blogs/${slug}`);
          const data = await res.json();
          if (data.success && data.data) {
            const b = data.data;
            setFetchedBlog({
              title: b.title,
              category: b.category || 'Digital Marketing',
              date: formatDate(b.createdAt),
              image: getImageUrl(b.coverImage),
              intro: b.subheading || '',
              contentHtml: b.content || ''
            });
          }
        }
      } catch (err) {
        console.error('Error fetching blog detail:', err);
      }
    };

    const loadAllBlogs = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/blogs`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const backendList: NavBlog[] = data.data.map((b: any) => ({
            id: b._id,
            slug: b.slug,
            title: b.title,
            date: formatDate(b.createdAt),
            image: getImageUrl(b.coverImage),
            description: b.subheading || ''
          }));
          const backendSlugs = new Set(backendList.map(b => b.slug));
          const filteredStatic = blogsList.filter(b => !backendSlugs.has(b.slug));
          setAllBlogs([...backendList, ...filteredStatic]);
        }
      } catch (err) {
        console.error('Error fetching all blogs for nav:', err);
      }
    };

    loadBlog();
    loadAllBlogs();
  }, [slug]);

  const fallbackBlog = blogsData[slug || ''] || blogsData['why-your-business-needs-a-professional-digital-marketing-company'];
  const blog: DynamicBlog = fetchedBlog || {
    title: fallbackBlog.title,
    category: fallbackBlog.category,
    date: fallbackBlog.date,
    image: fallbackBlog.image,
    intro: fallbackBlog.intro,
    sections: fallbackBlog.sections
  };

  // Prev / Next / More Blogs navigation logic
  const currentIndex = allBlogs.findIndex(b => b.slug === slug);
  const prevBlog = allBlogs[currentIndex <= 0 ? allBlogs.length - 1 : currentIndex - 1];
  const nextBlog = allBlogs[currentIndex === allBlogs.length - 1 ? 0 : currentIndex + 1];
  const moreBlogs = allBlogs.filter(b => b.slug !== slug).slice(0, 3);

  const blogUrl = `${window.location.origin}/blogs/${slug}`;

  // Helper to parse dates like "JUN 25, 2024" to "2024-06-25"
  const parseDate = (dStr: string) => {
    try {
      const d = new Date(dStr);
      return d.toISOString().split('T')[0];
    } catch {
      return "2024-06-25";
    }
  };

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "image": blog.image.startsWith('http') ? blog.image : `${window.location.origin}${blog.image}`,
    "datePublished": parseDate(blog.date),
    "description": blog.intro,
    "author": {
      "@type": "Organization",
      "name": "RizeWorld Digital",
      "url": window.location.origin
    },
    "publisher": {
      "@type": "Organization",
      "name": "RizeWorld Digital",
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": blogUrl
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${window.location.origin}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blogs",
        "item": `${window.location.origin}/blogs`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": blog.title,
        "item": blogUrl
      }
    ]
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 overflow-hidden text-left font-sans selection:bg-orange-500 selection:text-white">
      <SEO
        title={`${blog.title} | RizeWorld Digital Blog`}
        description={blog.intro}
        canonicalUrl={blogUrl}
        ogType="article"
        schema={[blogPostingSchema, breadcrumbSchema]}
      />
      
      {/* 1. BREADCRUMBS & BACK */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button 
          onClick={() => navigate('/blogs')}
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-900 hover:text-orange-500 transition-colors group cursor-pointer w-fit"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Blogs
        </button>

        <Breadcrumbs items={[{ name: 'Blogs', path: '/blogs' }, { name: blog.title }]} />
      </div>

      {/* 2. BLOG HEADER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <h1 className="text-gray-950 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] mb-12 uppercase max-w-4xl mx-auto">
          {blog.title}
        </h1>

        <div className="flex justify-center items-center gap-16 md:gap-24 border-t border-b border-gray-200 py-6 max-w-xl mx-auto">
          <div className="text-center">
            <span className="text-gray-400 text-xs uppercase tracking-widest block mb-1">Posted on</span>
            <span className="text-gray-950 font-black text-sm uppercase tracking-wider">{blog.category}</span>
          </div>
          <div className="text-center">
            <span className="text-gray-400 text-xs uppercase tracking-widest block mb-1">Posted at</span>
            <span className="text-gray-950 font-black text-sm uppercase tracking-wider">{blog.date}</span>
          </div>
        </div>
      </section>

      {/* 3. HERO IMAGE */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="w-full aspect-video rounded-4xl overflow-hidden bg-stone-100 shadow-sm">
          <img 
            src={blog.image} 
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 4. BLOG CONTENT */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        {/* Intro text */}
        {blog.intro && (
          <p className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed mb-10 italic border-l-4 border-orange-500 pl-4 py-1">
            {blog.intro}
          </p>
        )}

        {blog.contentHtml ? (
          <div 
            className="prose-blog"
            dangerouslySetInnerHTML={{ __html: blog.contentHtml }} 
          />
        ) : (
          <div className="space-y-12">
            {blog.sections?.map((section, index) => (
              <div key={index} className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-black text-gray-950 tracking-tight leading-snug">
                  {section.heading}
                </h2>
                <p className="text-gray-500 text-base md:text-lg font-medium leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </article>

      {/* Prev / Next Navigation */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-200 pt-12 pb-16 flex flex-col sm:flex-row justify-between items-center gap-8 mt-12">
        {/* Prev Column */}
        {prevBlog && (
          <div 
            onClick={() => navigate(`/blogs/${prevBlog.slug}`)}
            className="group cursor-pointer flex flex-col items-start text-left w-full sm:w-1/2"
          >
            <span className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Prev</span>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                <img src={prevBlog.image} alt={prevBlog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase block mb-1">{prevBlog.date}</span>
                <h4 className="text-sm font-black text-gray-950 tracking-tight leading-snug group-hover:text-orange-500 transition-colors line-clamp-2 max-w-xs">{prevBlog.title}</h4>
              </div>
            </div>
          </div>
        )}

        {/* Next Column */}
        {nextBlog && (
          <div 
            onClick={() => navigate(`/blogs/${nextBlog.slug}`)}
            className="group cursor-pointer flex flex-col items-end text-right w-full sm:w-1/2 ml-auto"
          >
            <span className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">Next</span>
            <div className="flex items-center gap-4 justify-end">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase block mb-1">{nextBlog.date}</span>
                <h4 className="text-sm font-black text-gray-950 tracking-tight leading-snug group-hover:text-orange-500 transition-colors line-clamp-2 max-w-xs text-right">{nextBlog.title}</h4>
              </div>
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                <img src={nextBlog.image} alt={nextBlog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* More Blog Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-200">
        <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight mb-12 uppercase">
          More Blog
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {moreBlogs.map((item) => (
            <div 
              key={item.id} 
              onClick={() => navigate(`/blogs/${item.slug}`)}
              className="group cursor-pointer flex flex-col text-left"
            >
              <div className="w-full aspect-4/3 rounded-2xl overflow-hidden mb-4 bg-stone-100 relative">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
              </div>
              <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2 block">
                {item.date}
              </span>
              <h3 className="text-lg font-black text-gray-950 tracking-tight leading-snug mb-2 group-hover:text-orange-500 transition-colors duration-300 line-clamp-2">
                {item.title}
              </h3>
              <p className="text-gray-500 text-xs md:text-sm font-medium leading-relaxed line-clamp-3">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SERVICES MARQUEE (DOUBLE SCROLL) */}
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

      {/* 6. FINAL CTA */}
      <section className="pt-20 pb-32 md:pt-32 md:pb-48 px-4 sm:px-6 lg:px-8 bg-[#f5f5f5] overflow-hidden">
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
          <Link to="/contact" className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-900 flex items-center justify-center shrink-0 hover:scale-105 hover:bg-orange-500 transition-all group shadow-xl">
            <ArrowRight className="w-8 h-8 md:w-10 md:h-10 text-white group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>
      </section>

    </div>
  );
}

const blogsList = [
  {
    id: 1,
    slug: 'why-your-business-needs-a-professional-digital-marketing-company',
    category: 'Digital Marketing',
    image: '/images/blogs/blog_prototyping_design.png',
    date: 'JUL 14, 2026',
    title: 'Why Your Business Needs a Professional Digital Marketing Company',
    description: 'Discover how partnering with a leading digital marketing company can scale your online presence, drive higher conversion rates, and build robust online marketing services.'
  },
  {
    id: 2,
    slug: 'how-to-choose-the-best-web-design-company',
    category: 'Web Design',
    image: '/images/blogs/blog_ux_design.png',
    date: 'JUL 13, 2026',
    title: 'How to Choose the Best Web Design Company for Your Brand',
    description: 'Learn the essential considerations when selecting a website design company. Find out how professional web design services can translate into measurable brand credibility.'
  },
  {
    id: 3,
    slug: 'unlocking-organic-growth-local-seo-services',
    category: 'SEO',
    image: '/images/blogs/blog_future_product_design.png',
    date: 'JUL 12, 2026',
    title: 'Unlocking Organic Growth: The Power of Local SEO Services',
    description: 'Max out your visibility with target local SEO services. Learn how ranking on Google maps and working with an SEO services India specialist drives nearby foot traffic.'
  },
  {
    id: 4,
    slug: 'guide-to-ppc-management-services',
    category: 'PPC',
    image: '/images/blogs/blog_design_principles.png',
    date: 'JUL 11, 2026',
    title: 'A Guide to PPC Management Services: Maximize Your ROI',
    description: 'Find out how programmatic pay per click services and a certified Google ads agency can boost your lead generation pipelines instantly.'
  },
  {
    id: 5,
    slug: 'social-media-marketing-services-brand-building',
    category: 'SMM',
    image: '/images/blogs/blog_responsive_design.png',
    date: 'JUL 10, 2026',
    title: 'Social Media Marketing Services: Building a Brand That Stands Out',
    description: 'Understand the core strategies used by a premier SMM agency and social media management company to convert social engagement into loyal customer pools.'
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

interface BlogSection {
  heading: string;
  content: string;
}

interface BlogDetailsData {
  title: string;
  category: string;
  date: string;
  image: string;
  intro: string;
  sections: BlogSection[];
}

const blogsData: Record<string, BlogDetailsData> = {
  'why-your-business-needs-a-professional-digital-marketing-company': {
    title: 'Why Your Business Needs a Professional Digital Marketing Company',
    category: 'Digital Marketing',
    date: 'Jul 14, 2026',
    image: '/images/blogs/blog_prototyping_design.png',
    intro: 'In today\'s hyper-competitive online space, partnering with a leading digital marketing company is no longer optional. Professional digital marketing services help you navigate search algorithms, scale lead generation, and drive business growth through digital marketing.',
    sections: [
      {
        heading: '1. What a Digital Marketing Company Does',
        content: 'A professional digital marketing company coordinates multi-channel strategies including search engine optimization, paid advertising, and email marketing. They act as a specialized digital solutions company that builds scalable traffic models for your enterprise.'
      },
      {
        heading: '2. Access to Expert Online Marketing Services',
        content: 'By hiring a full service digital marketing agency, you gain immediate access to experienced specialists in copywriting, local search rankings, and programmatic media buying. This removes the overhead of building an in-house team from scratch.'
      },
      {
        heading: '3. Data-Driven ROI Analytics',
        content: 'Professional agencies set up custom event tracking and conversion models to audit every rupee of ad spend. They focus on delivering a high return on investment (ROI) and sustainable customer acquisition loops.'
      },
      {
        heading: '4. Summary',
        content: 'Working with the right digital marketing solutions partner ensures your brand establishes market authority and sustains long-term lead volume growth.'
      }
    ]
  },
  'how-to-choose-the-best-web-design-company': {
    title: 'How to Choose the Best Web Design Company for Your Brand',
    category: 'Web Design',
    date: 'Jul 13, 2026',
    image: '/images/blogs/blog_ux_design.png',
    intro: 'Your website is the face of your business. Selecting the right website design company and professional web design services is critical to convert visitors into loyal customers. Here is how to find the perfect web design partner.',
    sections: [
      {
        heading: '1. Review Their Custom Web Design Portfolio',
        content: 'A reputable web design company should showcase a diverse portfolio of custom website design layouts, responsive website structures, and mobile friendly web design features across industries.'
      },
      {
        heading: '2. Verify Web Development and Coding Expertise',
        content: 'Look for companies with expertise in custom website development services, professional website development services, and secure CMS configurations. Avoid agencies that rely solely on templated designs.'
      },
      {
        heading: '3. Focus on UI UX Design Services',
        content: 'The best website designer will prioritize user experience. Your layout must follow WCAG accessibility standards, load instantly, and feature clear call-to-action (CTA) buttons.'
      },
      {
        heading: '4. Conclusion',
        content: 'Choosing a design team that aligns with your brand objectives guarantees a high-converting digital storefront that supports business expansion.'
      }
    ]
  },
  'unlocking-organic-growth-local-seo-services': {
    title: 'Unlocking Organic Growth: The Power of Local SEO Services',
    category: 'SEO',
    date: 'Jul 12, 2026',
    image: '/images/blogs/blog_future_product_design.png',
    intro: 'If your business serves local clients, ranking on Google map packs and local listings is crucial. Using target local SEO services and SEO services India methods will put your brand directly in front of nearby searchers.',
    sections: [
      {
        heading: '1. The Value of Local SEO Services',
        content: 'Local search queries (e.g., "near me" searches) have extremely high buying intent. Optimizing your Google My Business profile and maintaining consistent directory listings ensures your business ranks #1 on local maps.'
      },
      {
        heading: '2. Technical SEO Audits and Keyword Research',
        content: 'Working with an SEO specialist allows you to fix indexation errors, speed up load times, and target long-tail keywords. Technical SEO optimizations and structured sitemaps keep search bots indexing your pages correctly.'
      },
      {
        heading: '3. Content Optimization and Link Building',
        content: 'Publishing location-specific blogs and landing pages optimized with target terms drives local search visibility. Combined with high-quality PR backlinks, you establish local market dominance.'
      },
      {
        heading: '4. Summary',
        content: 'Investing in search engine optimization establishes continuous organic traffic and local brand exposure without recurring click costs.'
      }
    ]
  },
  'guide-to-ppc-management-services': {
    title: 'A Guide to PPC Management Services: Maximize Your ROI',
    category: 'PPC',
    date: 'Jul 11, 2026',
    image: '/images/blogs/blog_design_principles.png',
    intro: 'Paid advertising provides instant leads and customer acquisitions. By leveraging professional PPC management services and programmatic pay per click services, you can scale your campaigns while keeping acquisition costs low.',
    sections: [
      {
        heading: '1. Working with a Certified Google Ads Agency',
        content: 'A certified Google ads agency understands bid strategies, search query reports, and ad extensions. They structure campaigns to target buyers ready to make a purchase decision.'
      },
      {
        heading: '2. Programmatic PPC Management Services',
        content: 'Professional PPC setups use demographic data, remarketing pixels, and custom audiences to ensure your ads only show to high-quality prospects.'
      },
      {
        heading: '3. Landing Page Design and Conversion Optimization',
        content: 'An ad campaign is only as good as the landing page it links to. Professional agencies design high-converting, mobile-friendly landing pages that match search query intent.'
      },
      {
        heading: '4. Conclusion',
        content: 'Strategic paid advertising managed by experts is the fastest way to drive immediate revenue and scale client customer acquisition models.'
      }
    ]
  },
  'social-media-marketing-services-brand-building': {
    title: 'Social Media Marketing Services: Building a Brand That Stands Out',
    category: 'SMM',
    date: 'Jul 10, 2026',
    image: '/images/blogs/blog_responsive_design.png',
    intro: 'Social platforms are the modern town square. Harnessing professional social media marketing services, SMM agency workflows, and social media management company strategies is crucial to build customer loyalty.',
    sections: [
      {
        heading: '1. Organic Branding and Social Media Services',
        content: 'Creating engaging video content, custom graphics, and authentic stories builds an active community around your brand. SMM services keep your audience connected to product launches.'
      },
      {
        heading: '2. Paid Social Advertising Campaigns',
        content: 'Paid social campaigns target specific user profiles based on hobbies, interests, and lookalikes. This ensures your ad budget drives direct conversions and high click-through rates.'
      },
      {
        heading: '3. Influencer Collaboration and PR',
        content: 'Partnering with creators and industry figures expands your reach. Professional agencies coordinate these partnerships to establish social proof and brand credibility.'
      },
      {
        heading: '4. Summary',
        content: 'Building a consistent social media strategy fosters community trust, enhances online visibility, and translates directly into business growth.'
      }
    ]
  }
};
