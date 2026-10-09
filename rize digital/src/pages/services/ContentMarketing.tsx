import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Share2, 
  Palette, 
  Edit3, 
  Award, 
  Mail, 
  MessageSquare, 
  ChevronRight,
  Phone,
  MapPin,
  Quote
} from 'lucide-react';
import { RiCompassDiscoverLine, RiQuillPenLine } from 'react-icons/ri';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import AreasWeServe from '../../components/common/AreasWeServe';

const SERVICES_LIST = [
  {
    title: "SEO Content Writing",
    desc: "Developing web content optimized for search intent to climb search engine rankings and capture valuable organic traffic.",
    tags: ["SEO Copy", "Search Intent", "Keyword Mapping", "Rankings"],
    icon: Search
  },
  {
    title: "Blog & Article Writing",
    desc: "Crafting informative, research-backed blogs and articles that establish domain authority and engage prospective readers.",
    tags: ["Blog Posts", "Topic Research", "Editorial Calendars", "Long-form"],
    icon: Edit3
  },
  {
    title: "Website Content",
    desc: "Clear, engaging website copy that explains your offerings and builds customer trust from their first visit.",
    tags: ["Website Copy", "Brand Voice", "Service Pages", "Clarity"],
    icon: Share2
  },
  {
    title: "Landing Page Copy",
    desc: "Writing high-converting landing page copies and marketing collaterals that turn prospective visitors into inquiries.",
    tags: ["Landing Pages", "High Conversion", "CTAs", "Lead Gen"],
    icon: Palette
  },
  {
    title: "Content Strategy",
    desc: "Structured content planning tailored to your audience questions, business goals, and competitive landscape.",
    tags: ["Strategy", "Audience Research", "Editorial Blueprint", "Growth"],
    icon: RiCompassDiscoverLine
  },
  {
    title: "Content Optimization & Updates",
    desc: "Refreshing, updating, and fine-tuning existing content to maintain relevance, rankings, and factual accuracy.",
    tags: ["Content Audits", "SEO Updates", "Performance Tuning", "Re-optimization"],
    icon: Award
  }
];

const FAQS = [
  {
    question: "What is content marketing?",
    answer: "Content marketing is the process of creating useful and relevant content to attract, inform, and engage a specific audience. This can include blog posts, website content, guides, landing pages, and other resources that support a business's marketing goals."
  },
  {
    question: "How can content marketing help my business?",
    answer: "Well-planned content can help your business improve online visibility, answer customer questions, build credibility, and attract relevant visitors. It can also support SEO and create more opportunities for leads and conversions."
  },
  {
    question: "What content marketing services does RizeWorld offer?",
    answer: "RizeWorld provides SEO content writing, blog writing, website content, landing page copy, content strategy, and content optimization. The services are planned according to the business, audience, and marketing objectives."
  },
  {
    question: "How does content marketing support SEO?",
    answer: "Useful content helps search engines understand what your website is about while giving visitors valuable information. We focus on search intent, relevant topics, clear structure, and natural language rather than excessive keyword usage."
  },
  {
    question: "Can content marketing help generate leads?",
    answer: "Yes. Content can attract people who are researching a problem or looking for a solution. Helpful information, clear messaging, and relevant calls to action can guide interested visitors toward contacting your business or exploring your services."
  },
  {
    question: "How do you create content for different businesses?",
    answer: "We first understand the business, target audience, industry, services, and objectives. Content is then planned around the questions and needs of potential customers while maintaining the brand's tone and messaging."
  }
];

const STEPS = [
  {
    num: "1",
    title: "Audience Research & Strategy",
    desc: "We analyze your target audience's search intent, pain points, and preferences to build a comprehensive content blueprint.",
    details: ["Persona Definition", "Competitor Gap Audits", "Keyword Mapping"]
  },
  {
    num: "2",
    title: "Content Creation & Optimization",
    desc: "Our copywriters and SEO specialists produce high-quality, engaging content that satisfies search engines and users.",
    details: ["Drafting & Curation", "SEO Fine-tuning", "Visual Integration"]
  },
  {
    num: "3",
    title: "Distribution & ROI Analysis",
    desc: "We track and monitor key parameters like organic sessions, time on site, bounce rates, and lead conversion rates.",
    details: ["Analytics Auditing", "Backlinking Strategy", "Continuous Optimization"]
  }
];

const TESTIMONIALS = [
  {
    quote: "RizeWorld's content marketing strategy completely transformed our brand voice. Their blogs and product descriptions helped Shiivaura connect deeply with customers and drive conversions. Highly recommended!",
    author: "Harsh Tiwari",
    role: "Founder, Shiivaura",
    avatar: "/video/harsh tiwari.jpeg"
  },
  {
    quote: "Working with RizeWorld for our brand copy was a game changer for 7One. Their creative copywriters and content strategy sets them apart from the rest.",
    author: "Mr. Ajit Singh",
    role: "Founder, 7One",
    avatar: "/video/k sir.jpg"
  },
  {
    quote: "The content created by RizeWorld helped Mansukh Restaurant reach new heights. Our customer engagement increased noticeably through their storytelling.",
    author: "Mr. Sajan Chandel",
    role: "Owner, Mansukh Restaurant",
    avatar: "/video/mansukhhh.jpg"
  },
  {
    quote: "RizeWorld's content approach is highly professional and result-driven. They understood the local essence of Old Rao and crafted copy that builds real trust.",
    author: "Mr. Rahul Bhugra",
    role: "Owner, Old Rao",
    avatar: "/video/Untitled-1.jpg"
  },
  {
    quote: "I'm very satisfied with RizeWorld's content services. They helped Sushanti Dhyanyoga publish blogs and articles that truly resonate with our community.",
    author: "Mr. Neeraj Lamba",
    role: "Founder, Sushanti Dhyanyoga",
    avatar: "/video/nk s.jpg"
  }
];

export default function ContentMarketing() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Content Marketing Services",
    "provider": {
      "@type": "Organization",
      "name": "RizeWorld Digital",
      "url": "https://rizeworld.in/"
    },
    "description": "Strategic content for brands that want to be found, understood, and remembered. High-conversion copywriting and content marketing solutions."
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
        "name": "Services",
        "item": "https://rizeworld.in/services"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Content Marketing",
        "item": "https://rizeworld.in/services/content-marketing"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 overflow-hidden text-left font-sans selection:bg-orange-500 selection:text-white">
      <SEO 
        title="Content Marketing Services & Content Writing Agency | RizeWorld"
        description="Looking for the best content writing services? Strategic content for brands that want to be found, understood, and remembered."
        canonicalUrl="https://rizeworld.in/services/content-marketing"
        schema={[serviceSchema, breadcrumbSchema, faqSchema]}
      />
      
      {/* 1. BREADCRUMBS & NAVIGATION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-900 hover:text-orange-500 transition-colors group cursor-pointer"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <Breadcrumbs items={[{ name: "Services", path: "/services" }, { name: "Content Marketing" }]} />
      </div>

      {/* 2. HERO COLLAGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_2.2fr_1fr] gap-6 items-stretch">
          
          {/* LEFT COLLAGE BLOCK */}
          <div className="flex flex-col gap-6">
            {/* Left Card (WHO WE ARE) */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-orange-100/70 border border-orange-200/60 rounded-4xl p-8 flex flex-col justify-center h-auto min-h-[180px] shadow-xs relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-200/30 rounded-full blur-2xl -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-500" />
              <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest block mb-3">WHO WE ARE</span>
              <p className="text-gray-800 text-sm leading-relaxed font-semibold text-justify">
                RizeWorld – Strategic Content That Connects Brands With Their Audience
              </p>
            </motion.div>

            {/* Visual Team Card */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="rounded-4xl overflow-hidden aspect-video bg-gray-200 border border-gray-200 shadow-sm relative group cursor-pointer"
            >
              <div className="absolute inset-0 bg-orange-950/10 group-hover:bg-transparent z-10 transition-colors duration-300" />
              <img 
                src="/services/content marketing..jpg.jpeg" 
                alt="Content Marketing Strategy" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </motion.div>
          </div>

          {/* CENTER MAIN CONTENT BLOCK */}
          <div className="flex flex-col gap-6 justify-between">
            <motion.div 
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-white border border-gray-200/80 rounded-[2.5rem] p-8 md:p-12 shadow-sm flex flex-col justify-center grow relative overflow-hidden"
            >
              <span className="text-orange-500 font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-1.5">
                <RiQuillPenLine size={15} className="shrink-0" /> Engaging Brand Stories
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-[3.2rem] font-black text-gray-950 leading-[1.05] uppercase tracking-tighter mb-6">
                Content Marketing <br />
                Services <span className="relative inline-block px-4 py-1 mx-1 mt-1">
                  Agency
                  <svg aria-hidden="true" focusable="false" className="absolute inset-0 w-full h-full text-orange-500" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M 5, 50 C 5, 20 95, 20 95, 50 C 95, 80 5, 80 5, 50 Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="300" strokeDashoffset="0" className="animate-[dash_2s_ease-in-out_infinite]" />
                  </svg>
                </span>
              </h1>
              <div className="space-y-4 text-gray-800 text-sm md:text-base leading-relaxed max-w-xl text-justify">
                <p className="font-semibold text-gray-900">
                  Strategic content for brands that want to be found, understood, and remembered.
                </p>
                <p>
                  Good content should do more than fill a website. It should answer questions, explain your services clearly, and give people a reason to trust your brand. At RizeWorld, we create practical and engaging content that is aligned with your audience, business goals, and search intent.
                </p>
                <p>
                  Our content marketing services cover everything from SEO-focused blog writing and website content to landing pages and content optimization. We focus on clear messaging, useful information, and a natural writing style so your content works for both your audience and your overall digital marketing strategy.
                </p>
              </div>
            </motion.div>

            {/* Bottom Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="bg-white border border-gray-200/80 rounded-4xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <p className="text-gray-700 text-xs sm:text-sm font-semibold max-w-sm text-justify leading-relaxed">
                Content created to support visibility, credibility, and conversions.
              </p>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-50 border border-orange-200/80 px-4 py-2 rounded-full shadow-2xs">
                  SEO + CONTENT + DIGITAL STRATEGY
                </span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT STATS COLUMN */}
          <div className="flex flex-col gap-6">
            {/* Right Card 1 (EXPERTISE) */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-sky-50 border border-sky-100 rounded-4xl p-8 flex flex-col justify-center h-full min-h-[160px] shadow-xs hover:-translate-y-1 transition-transform duration-300"
            >
              <p className="text-sm font-black text-sky-950 uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-sky-500 rounded-full" /> EXPERTISE
              </p>
              <p className="text-sky-950 text-sm font-bold mb-1">
                Content Strategy & SEO Writing
              </p>
              <p className="text-sky-900/80 text-xs font-semibold leading-relaxed">
                Strategy • Research • Writing • Optimization
              </p>
            </motion.div>

            {/* Right Card 2 (CONTENT) */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="bg-yellow-50/70 border border-yellow-100 rounded-4xl p-8 flex flex-col justify-center h-full min-h-[160px] shadow-xs hover:-translate-y-1 transition-transform duration-300"
            >
              <p className="text-sm font-black text-yellow-950 uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" /> CONTENT
              </p>
              <p className="text-yellow-950 text-sm font-bold mb-1">
                Original, Purpose-Driven Content
              </p>
              <p className="text-yellow-900/80 text-xs font-semibold leading-relaxed">
                Blogs • Website Copy • Landing Pages • Guides
              </p>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 3. CORE SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500">Our Services</span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-950 uppercase tracking-tight mt-1 mb-6 leading-tight">
            Our Content Marketing Approach
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed text-justify mb-4">
            We start by understanding your business, customers, industry, and the topics that matter to your audience. From there, we plan and create original content that fits your brand and supports your marketing objectives.
          </p>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed text-justify">
            Every piece of content has a purpose. Whether you want to improve organic visibility, educate potential customers, build brand authority, or generate more enquiries, we create content around the outcome you want to achieve.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES_LIST.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <motion.div
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                key={idx}
                className="bg-white border border-gray-200/80 rounded-4xl p-8 flex flex-col justify-between group hover:border-orange-500/40 hover:shadow-[0_20px_50px_rgba(249,115,22,0.08)] transition-all duration-500 relative overflow-hidden cursor-pointer"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-orange-500/15 text-orange-500 flex items-center justify-center mb-8 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                    <Icon size={24} />
                  </div>

                  <h3 className="text-xl font-black uppercase text-gray-950 mb-3 group-hover:text-orange-500 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 text-justify">
                    {srv.desc}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {srv.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] font-black uppercase tracking-wide text-gray-500 bg-stone-100 px-3.5 py-1.5 rounded-full group-hover:bg-orange-500/5 group-hover:text-orange-600 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. PROCESS TIMELINE */}
      <section className="bg-white border-t border-b border-gray-200 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-16 items-start mb-20">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-orange-500 block mb-3">SEO Integration</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-950 uppercase tracking-tight">
                CONTENT THAT SUPPORTS <br />YOUR SEO STRATEGY.
              </h2>
            </div>
            <div>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed text-justify mb-4">
                Content and SEO work best when they are planned together. We use relevant topics and search intent to create content that is easy to understand and genuinely useful to visitors. Instead of repeating keywords, we focus on covering a subject naturally and providing the information people are actually looking for.
              </p>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed text-justify">
                As a digital marketing agency, RizeWorld can also align your content with SEO, website development, social media, and other digital marketing activities, giving your brand a more consistent online presence.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-12 items-start">
            <div className="flex flex-col gap-3">
              {STEPS.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full flex items-center justify-between p-6 rounded-4xl border text-left transition-all duration-300 cursor-pointer ${
                    activeStep === idx 
                      ? 'border-orange-500/40 bg-orange-500/5 text-orange-500 shadow-xs' 
                      : 'border-gray-200/80 bg-stone-50 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-sm font-black ${activeStep === idx ? 'text-orange-500' : 'text-gray-400'}`}>
                      0{step.num}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider">{step.title}</span>
                  </div>
                  <ChevronRight size={16} className={`transition-transform duration-300 ${activeStep === idx ? 'rotate-90 text-orange-500' : 'text-gray-400'}`} />
                </button>
              ))}
            </div>

            <div className="bg-stone-50 border border-gray-200/80 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden min-h-[340px] flex flex-col justify-between shadow-xs">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.03),transparent_60%)] pointer-events-none" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="relative z-10"
                >
                  <span className="text-8xl font-black text-gray-200/80 absolute right-0 top-0 select-none leading-none">
                    0{STEPS[activeStep].num}
                  </span>

                  <h3 className="text-2xl md:text-3xl font-black uppercase text-gray-950 mb-4 pr-24 leading-tight">
                    {STEPS[activeStep].title}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8 max-w-xl text-justify">
                    {STEPS[activeStep].desc}
                  </p>

                  <div className="border-t border-gray-200 pt-8 mt-4">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Key Focus Points</h4>
                    <div className="flex flex-wrap gap-4">
                      {STEPS[activeStep].details.map((detail, i) => (
                        <div key={i} className="flex items-center gap-2.5 bg-white border border-gray-200/80 py-3 px-6 rounded-full shadow-2xs">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-900">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </section>

      {/* FAQS SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500">FAQ</span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-950 uppercase tracking-tight mt-2">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx}
                className="bg-white border border-gray-200/85 rounded-3xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer hover:bg-stone-50/50"
                >
                  <span className="text-sm sm:text-base font-bold text-gray-950 uppercase tracking-tight pr-6">
                    {faq.question}
                  </span>
                  <ChevronRight 
                    size={18} 
                    className={`text-orange-500 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-90' : ''}`} 
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-6 pt-0 border-t border-gray-100 text-gray-600 text-sm leading-relaxed text-justify">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-stone-100 py-24 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-500">CLIENT FEEDBACK</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-950 uppercase tracking-tight mt-1 mb-6 leading-tight">
              What Our Partners Say <br />About Us.
            </h2>
            <p className="text-gray-500 text-sm">
              We help brands grow authority with consistent value and high-conversion copy.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 items-center">
            <div className="bg-white border border-gray-200/80 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-xs min-h-[280px] flex flex-col justify-between">
              <Quote className="absolute right-8 top-8 text-orange-500/10 w-24 h-24 pointer-events-none" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed font-medium mb-8 pr-12 italic">
                    "{TESTIMONIALS[activeTestimonial].quote}"
                  </p>
                  
                  <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
                    <img 
                      src={TESTIMONIALS[activeTestimonial].avatar} 
                      alt={TESTIMONIALS[activeTestimonial].author} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-orange-500/20"
                    />
                    <div>
                      <p className="text-sm font-black text-gray-950 uppercase">{TESTIMONIALS[activeTestimonial].author}</p>
                      <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">{TESTIMONIALS[activeTestimonial].role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex flex-col gap-3">
              {TESTIMONIALS.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`w-full flex items-center justify-between p-5 rounded-3xl border text-left transition-all duration-300 cursor-pointer ${
                    activeTestimonial === idx 
                      ? 'border-orange-500/40 bg-orange-500/5 text-orange-500' 
                      : 'border-gray-200/80 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider">{t.author}</span>
                  <ChevronRight size={16} className={`transition-transform duration-300 ${activeTestimonial === idx ? 'rotate-90 text-orange-500' : 'text-gray-400'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Areas We Serve */}
      <AreasWeServe />

      {/* 5. LET'S TALK PANEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-gray-950 text-white rounded-[2.5rem] p-8 md:p-16 flex flex-col lg:flex-row lg:items-stretch justify-between gap-12 relative overflow-hidden shadow-2xl border border-zinc-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_50%)] pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl flex flex-col justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-orange-500 block mb-4">LET’S TALK</span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-none mb-6">
                Let's Create Better Content for Your Business
              </h2>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 text-justify">
                If your website needs clearer messaging, useful blog content, or a more structured content strategy, RizeWorld can help. We create content that feels natural to your audience while supporting your long-term online growth.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-zinc-800">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Email Address</span>
                  <a href="mailto:hr.rizeworld@gmail.com" className="text-sm font-semibold hover:text-orange-500 transition-colors">hr.rizeworld@gmail.com</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Phone Number</span>
                  <a href="tel:+919024615510" className="text-sm font-semibold hover:text-orange-500 transition-colors">+91 90246 15510</a>
                </div>
              </div>

              <div className="flex items-start gap-4 md:col-span-2">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Our Location</span>
                  <a href="https://maps.google.com/?q=Rizeworld+Digital+Marketing+Pvt+Ltd+Company+C198,+near+Telco+Circle,+UIT+colony,+Shalimar+Nagar,+Alwar,+Rajasthan+301001" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-zinc-300 hover:text-orange-500 transition-colors">C-198, near Telco Circle, UIT colony, Shalimar Nagar, Alwar, Rajasthan 301001, India</a>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 shrink-0 flex flex-col sm:flex-row lg:flex-col lg:justify-center gap-4 min-w-[240px]">
            <Link 
              to="/contact" 
              className="inline-flex items-center justify-center gap-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider py-4.5 px-8 rounded-full transition-all shadow-md shadow-orange-500/10 group cursor-pointer"
            >
              Get In Touch <MessageSquare size={14} className="group-hover:scale-105 transition-transform" />
            </Link>
            <a 
              href="mailto:hr.rizeworld@gmail.com" 
              className="inline-flex items-center justify-center gap-2.5 bg-zinc-800 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider py-4.5 px-8 rounded-full transition-all cursor-pointer"
            >
              Contact Now <Mail size={14} />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
