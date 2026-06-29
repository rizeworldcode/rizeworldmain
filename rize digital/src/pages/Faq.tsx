import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Sparkles, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import Breadcrumbs from '../components/common/Breadcrumbs';

const FAQS_LIST = [
  {
    question: "What services does RizeWorld offer?",
    answer: "We offer full-service digital strategies including Search Engine Optimization (SEO), Paid Ads (PPC), Custom Web Development (React, Node, WordPress), Social Media Marketing, Content Marketing, and Graphic Design."
  },
  {
    question: "How long does it take to see SEO results?",
    answer: "Typically, local SEO projects show progress in rankings and organic traffic within 3 to 6 months. National or highly competitive campaigns can take 6 to 12 months for mature traffic volume returns."
  },
  {
    question: "Do you build custom web applications?",
    answer: "Yes, we specialize in high-performance custom applications using React, Node.js, and modern relational/NoSQL databases. We also build secure, editable custom WordPress themes and Shopify structures."
  },
  {
    question: "How do you optimize paid advertising campaigns?",
    answer: "We perform comprehensive audience targeting, keyword research, A/B ad creative testing, and design custom high-converting landing pages to ensure you maximize your return on ad spend (ROAS)."
  },
  {
    question: "Where are your services available?",
    answer: "We serve clients worldwide, with dedicated regional solutions across major Indian cities including Delhi, Mumbai, Bangalore, Pune, Hyderabad, Alwar, Chandigarh, Udaipur, and Indore."
  }
];

export default function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS_LIST.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
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
        "name": "Frequently Asked Questions",
        "item": "https://rizeworld.in/faq"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 text-left font-sans selection:bg-orange-500 selection:text-white">
      <SEO 
        title="Frequently Asked Questions | RizeWorld"
        description="Find answers to common questions about RizeWorld's digital marketing, search engine optimization, web development, and branding design services."
        canonicalUrl="https://rizeworld.in/faq"
        schema={[faqSchema, breadcrumbSchema]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <Breadcrumbs items={[{ name: "FAQ" }]} />
      </div>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-orange-500 flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 animate-pulse" /> Support Hub
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-gray-950 uppercase tracking-tighter mb-6">
            Frequently Asked <br />
            Questions.
          </h1>
          <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">
            Everything you need to know about our workflow, service categories, timelines, and custom delivery systems.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS_LIST.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx} 
                className="bg-white border border-gray-200/80 rounded-3xl overflow-hidden shadow-2xs transition-all duration-300"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none cursor-pointer"
                >
                  <div className="flex items-center gap-4 pr-4">
                    <HelpCircle className={`w-5 h-5 shrink-0 ${isOpen ? 'text-orange-500' : 'text-gray-400'}`} />
                    <span className="text-sm md:text-base font-bold text-gray-950 uppercase">{faq.question}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-orange-500' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 md:px-8 pb-8 pt-2 border-t border-gray-100">
                        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-950 text-white rounded-[2.5rem] p-8 md:p-16 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_50%)] pointer-events-none" />
          <div className="relative z-10 max-w-xl text-left">
            <h2 className="text-2xl md:text-4xl font-black uppercase mb-4">Have More Questions?</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Our support team is ready to consult with you. Send us your requirements and let us customize a package for your business.
            </p>
          </div>
          <div className="relative z-10">
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider py-4 px-8 rounded-full transition-all shadow-md cursor-pointer"
            >
              Ask Us Anything <MessageSquare size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
