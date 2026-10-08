import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingBag, 
  CreditCard, 
  Layers, 
  TrendingUp, 
  ShieldCheck, 
  Mail, 
  MessageSquare, 
  ChevronRight,
  Phone,
  MapPin,
  Quote
} from 'lucide-react';
import { RiShoppingBag3Line } from 'react-icons/ri';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import AreasWeServe from '../../components/common/AreasWeServe';
import { LOGOS } from '../../data/logos';

const SERVICES_LIST = [
  {
    title: "Custom Storefront Design",
    desc: "We create clean, responsive storefronts that make it easy for customers to explore products, compare options, and complete their purchases across different devices.",
    tags: ["UI/UX Design", "Responsive Design", "Product Pages", "Store Layouts"],
    icon: ShoppingBag
  },
  {
    title: "Payment Gateway Integration",
    desc: "We integrate reliable payment solutions to provide a smooth and secure checkout experience, including payment gateways, multiple payment methods, and transaction workflows.",
    tags: ["Payment Integration", "Checkout Setup", "Payment Methods", "Secure Transactions"],
    icon: CreditCard
  },
  {
    title: "Inventory & Catalog Management",
    desc: "Keep products, categories, pricing, and stock information organized with an ecommerce setup designed to make catalog and inventory management easier.",
    tags: ["Product Catalog", "Stock Management", "Product Categories", "Inventory Sync"],
    icon: Layers
  },
  {
    title: "Checkout Optimization",
    desc: "A complicated checkout can lead to abandoned carts. We simplify the purchase journey with clear checkout flows, streamlined forms, and user-friendly order summaries.",
    tags: ["Checkout Experience", "Cart Optimization", "Order Forms", "Conversion Optimization"],
    icon: TrendingUp
  },
  {
    title: "Ecommerce Maintenance & Support",
    desc: "We help keep ecommerce websites reliable with regular updates, performance checks, security improvements, backups, and ongoing technical support.",
    tags: ["Website Maintenance", "Security Updates", "Performance Monitoring", "Technical Support"],
    icon: ShieldCheck
  }
];

const FAQS = [
  {
    question: "What is ecommerce development?",
    answer: "Ecommerce development is the process of building an online store where customers can browse products, add items to a cart, make payments, and manage their orders."
  },
  {
    question: "What ecommerce development services does RizeWorld provide?",
    answer: "RizeWorld provides custom ecommerce website development, storefront design, payment integration, catalog and inventory solutions, checkout optimization, and ongoing website support."
  },
  {
    question: "Can you build a custom ecommerce website?",
    answer: "Yes. We can build a custom online store around your products, business model, customer journey, and required features rather than relying entirely on a pre-designed template."
  },
  {
    question: "Can you integrate payment gateways into an ecommerce website?",
    answer: "Yes. Payment gateway integration can be configured according to the store's requirements, including suitable payment methods and secure transaction workflows."
  },
  {
    question: "Can you help with product catalog and inventory management?",
    answer: "Yes. Ecommerce websites can be structured to make products, categories, pricing, attributes, and inventory easier to organize and manage."
  },
  {
    question: "How can checkout optimization improve an online store?",
    answer: "A simpler checkout process can reduce unnecessary steps and make purchasing easier for customers. Clear forms, order summaries, and a smooth payment flow can contribute to a better shopping experience."
  }
];

const STEPS = [
  {
    num: "1",
    title: "Strategy & Platform Selection",
    desc: "We analyze your products, customer journey, and operational requirements to outline the optimal ecommerce tech stack and storefront architecture.",
    details: ["Platform Strategy", "Catalog Architecture", "Checkout Planning"]
  },
  {
    num: "2",
    title: "Design & Development",
    desc: "Our commerce engineers build responsive storefronts, configure secure payment gateways, and establish robust inventory management systems.",
    details: ["Responsive Storefront Coding", "Payment Gateway Setup", "Inventory & Order Integration"]
  },
  {
    num: "3",
    title: "Testing, Launch & Optimization",
    desc: "Rigorous load tests across carts and checkout funnels, security hardening, and seamless live deployment with conversion analytics.",
    details: ["Checkout Funnel Testing", "Security & PCI Compliance", "Live Launch & Continuous Support"]
  }
];

const TESTIMONIALS = [
  {
    quote: "RizeWorld delivered a highly stable e-commerce storefront for Shiivaura. The layout is optimized to handle high-intent shoppers smoothly. Highly recommended!",
    author: "Harsh Tiwari",
    role: "Founder, Shiivaura",
    avatar: "/video/harsh tiwari.jpeg"
  },
  {
    quote: "Working with RizeWorld for our retail platform was a game changer for 7One. Their custom e-commerce setups and payment integrations are flawless.",
    author: "Mr. Ajit Singh",
    role: "Founder, 7One",
    avatar: "/video/k sir.jpg"
  },
  {
    quote: "The digital ordering system and online store designed by RizeWorld helped Mansukh Restaurant scale deliveries easily. Excellent e-commerce work!",
    author: "Mr. Sajan Chandel",
    role: "Owner, Mansukh Restaurant",
    avatar: "/video/mansukhhh.jpg"
  },
  {
    quote: "Their approach to e-commerce is highly professional. They built a clean, secure shop layout for Old Rao that our customers love using.",
    author: "Mr. Rahul Bhugra",
    role: "Owner, Old Rao",
    avatar: "/video/Untitled-1.jpg"
  },
  {
    quote: "I'm very satisfied with RizeWorld's e-commerce setup. They built a peaceful and fast-loading web-store for our yoga community offerings.",
    author: "Mr. Neeraj Lamba",
    role: "Founder, Sushanti Dhyanyoga",
    avatar: "/video/nk s.jpg"
  }
];

export default function EcommerceDevelopment() {
  const navigate = useNavigate();
  const repeatedLogos = [...LOGOS, ...LOGOS, ...LOGOS];
  const [activeStep, setActiveStep] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Ecommerce Development Services",
    "provider": {
      "@type": "Organization",
      "name": "RizeWorld Digital",
      "url": "https://rizeworld.in/"
    },
    "description": "RizeWorld builds fast, secure, and user-friendly ecommerce websites designed around your products, customers, and business goals."
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
        "name": "Ecommerce Development",
        "item": "https://rizeworld.in/services/ecommerce-development"
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
        title="Ecommerce Development Services & Online Store Agency | RizeWorld"
        description="Fast, secure, and user-friendly ecommerce websites built around your products, customers, and business goals. Custom ecommerce solutions by RizeWorld."
        canonicalUrl="https://rizeworld.in/services/ecommerce-development"
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

        <Breadcrumbs items={[{ name: "Services", path: "/services" }, { name: "Ecommerce Development" }]} />
      </div>

      {/* 2. HERO COLLAGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_2.2fr_1fr] gap-6 items-stretch">
          
          {/* LEFT COLLAGE BLOCK */}
          <div className="flex flex-col gap-6">
            {/* Strategy Banner Card */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-orange-100/70 border border-orange-200/60 rounded-4xl p-8 flex flex-col justify-center h-auto min-h-[180px] shadow-xs relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-200/30 rounded-full blur-2xl -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-500" />
              <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest block mb-3">HIGH-PERFORMANCE COMMERCE</span>
              <p className="text-gray-800 text-sm leading-relaxed font-semibold text-justify">
                RizeWorld – Scalable & Secure eCommerce Solutions Designed for Growth
              </p>
            </motion.div>

            {/* Visual Team Card */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="rounded-4xl overflow-hidden aspect-video bg-white border border-gray-200 shadow-sm relative group cursor-pointer"
            >
              <div className="absolute inset-0 bg-orange-950/5 group-hover:bg-transparent z-10 transition-colors duration-300" />
              <img 
                src="/services/ecommerece.jpg.jpeg" 
                alt="Ecommerce Development Services" 
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </motion.div>
          </div>

          {/* CENTER MAIN CONTENT BLOCK */}
          <div className="flex flex-col gap-6 justify-between">
            {/* Title Solution Card */}
            <motion.div 
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-white border border-gray-200/80 rounded-[2.5rem] p-8 md:p-12 shadow-sm flex flex-col justify-center grow relative overflow-hidden"
            >
              <span className="text-orange-500 font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-1.5">
                <RiShoppingBag3Line size={15} className="shrink-0" /> High-Performance Commerce Platforms
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-black text-gray-950 leading-[1.05] uppercase tracking-tighter mb-6">
                Ecommerce <br />
                Development <span className="relative inline-block px-4 py-1 mx-1 mt-1">
                  Services
                  <svg className="absolute inset-0 w-full h-full text-orange-500" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M 5, 50 C 5, 20 95, 20 95, 50 C 95, 80 5, 80 5, 50 Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="300" strokeDashoffset="0" className="animate-[dash_2s_ease-in-out_infinite]" />
                  </svg>
                </span>
              </h1>
              <div className="space-y-4 text-gray-800 text-sm md:text-base leading-relaxed max-w-xl text-justify">
                <p className="font-semibold text-gray-900">
                  RizeWorld builds fast, secure, and user-friendly ecommerce websites designed around your products, customers, and business goals.
                </p>
                <p>
                  From store setup and custom features to responsive design and checkout optimization, we create online shopping experiences that make it easier for customers to browse, buy, and return.
                </p>
                <p>
                  Custom ecommerce solutions built to simplify shopping journeys, improve user experience, and support sustainable online growth.
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
                Custom ecommerce solutions built to simplify shopping journeys, improve user experience, and support sustainable online growth.
              </p>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-50 border border-orange-200/80 px-4 py-2 rounded-full shadow-2xs">
                  ECOMMERCE • DEVELOPMENT • GROWTH
                </span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT STATS COLUMN */}
          <div className="flex flex-col gap-6">
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-sky-50 border border-sky-100 rounded-4xl p-8 flex flex-col justify-center h-full min-h-[160px] shadow-xs hover:-translate-y-1 transition-transform duration-300"
            >
              <h4 className="text-sm font-black text-sky-950 uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-sky-500 rounded-full" /> DEVELOPERS
              </h4>
              <p className="text-sky-900/85 text-3xl font-black mb-1">12+</p>
              <p className="text-sky-900/80 text-xs font-semibold uppercase tracking-wider">
                Full-Stack Commerce Engineers
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="bg-yellow-50/70 border border-yellow-100 rounded-4xl p-8 flex flex-col justify-center h-full min-h-[160px] shadow-xs hover:-translate-y-1 transition-transform duration-300"
            >
              <h4 className="text-sm font-black text-yellow-950 uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" /> SECURITY
              </h4>
              <p className="text-yellow-900/85 text-3xl font-black mb-1">100%</p>
              <p className="text-yellow-900/80 text-xs font-semibold uppercase tracking-wider">
                Security-Focused Infrastructure
              </p>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 3. LOVED BY TEAMS LOGO MARQUEE */}
      <section className="py-12 bg-white border-t border-b border-gray-200/80 overflow-hidden relative">
        <style>
          {`
            @keyframes marquee-brands {
              0% { transform: translate3d(0, 0, 0); }
              100% { transform: translate3d(-50%, 0, 0); }
            }
            .animate-marquee-brands {
              animation: marquee-brands 60s linear infinite;
              will-change: transform;
              backface-visibility: hidden;
              -webkit-backface-visibility: hidden;
            }
          `}
        </style>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Loved by teams around the world</span>
        </div>
        <div className="flex-1 overflow-hidden mask-image-horizontal w-full">
          <div className="flex w-max animate-marquee-brands items-center">
            {repeatedLogos.map((item, idx) => (
              <div key={idx} className={`w-56 h-24 mx-4 flex items-center justify-center shrink-0 p-2 rounded-4xl shadow-sm border border-gray-100 overflow-hidden ${item.bg}`}>
                <img 
                  src={item.src} 
                  alt="Client Logo" 
                  className={`${item.customClass || "max-h-[92%] max-w-[92%]"} object-contain`} 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CORE SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500">OUR COMMERCE EXPERTISE</span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-950 uppercase tracking-tight mt-1 mb-6 leading-tight">
            Ecommerce Development <br />Services We Offer
          </h2>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed text-justify">
            From intuitive storefronts to robust inventory synchronization and frictionless checkouts, we build online shopping experiences tailored to convert.
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

      {/* 5. PROCESS TIMELINE */}
      <section className="bg-white border-t border-b border-gray-200 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-16 items-start mb-20">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-orange-500 block mb-3">OUR PROVEN METHODOLOGY</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-950 uppercase tracking-tight">
                3 STEPS TO ECOMMERCE <br />GROWTH.
              </h2>
            </div>
            <div>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed text-justify">
                We handle the end-to-end design, secure payment integrations, and performance engineering of your store to ensure high conversions and smooth operational reliability.
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
                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Key Focus Points</h5>
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
            Ecommerce Development – FAQs
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
              We help retail brands convert visitors to brand advocates.
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
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed font-medium mb-8 pr-12 italic text-justify">
                    "{TESTIMONIALS[activeTestimonial].quote}"
                  </p>
                  
                  <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
                    <img 
                      src={TESTIMONIALS[activeTestimonial].avatar} 
                      alt={TESTIMONIALS[activeTestimonial].author} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-orange-500/20"
                    />
                    <div>
                      <h4 className="text-sm font-black text-gray-950 uppercase">{TESTIMONIALS[activeTestimonial].author}</h4>
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

      {/* 6. LET'S TALK PANEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-gray-950 text-white rounded-[2.5rem] p-8 md:p-16 flex flex-col lg:flex-row lg:items-stretch justify-between gap-12 relative overflow-hidden shadow-2xl border border-zinc-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_50%)] pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl flex flex-col justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-orange-500 block mb-4">LET’S TALK</span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-none mb-6">
                Connect Us
              </h2>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
                Reach out today to discuss your ecommerce project and build a high-converting digital storefront.
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
