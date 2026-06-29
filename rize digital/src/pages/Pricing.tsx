import { motion } from 'framer-motion';
import { Check, Sparkles, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import Breadcrumbs from '../components/common/Breadcrumbs';

const PLANS = [
  {
    name: "Growth Starter",
    price: "Custom",
    desc: "Perfect for local businesses starting their digital marketing and search visibility journey.",
    features: [
      "Local SEO Optimization",
      "Google Business Profile Setup",
      "Basic Paid Ads Management",
      "Monthly KPI Reports",
      "Standard Email Support"
    ],
    cta: "Request Consultation",
    popular: false
  },
  {
    name: "Premium Scale",
    price: "Custom",
    desc: "Designed for mid-market businesses looking for comprehensive multi-channel digital campaigns.",
    features: [
      "Technical SEO & Audits",
      "Paid Ads (Google & Meta) Scaling",
      "Responsive Web Optimization",
      "Social Media Curation",
      "Bi-Weekly Strategy Syncs",
      "Priority Account Management"
    ],
    cta: "Hire Experts",
    popular: true
  },
  {
    name: "Enterprise Custom",
    price: "Custom",
    desc: "Bespoke full-funnel digital strategy, custom software buildouts, and dedicated growth support.",
    features: [
      "Custom Software Development",
      "Enterprise On-Page & Off-Page SEO",
      "Dedicated Ad Spend Strategy",
      "Advanced Conversion Optimization",
      "Direct Slack Support",
      "Weekly Progress Audits"
    ],
    cta: "Connect Enterprise",
    popular: false
  }
];

export default function Pricing() {
  const pricingSchema = {
    "@context": "https://schema.org",
    "@type": "PricingPage",
    "name": "RizeWorld Digital Pricing Plans",
    "description": "Explore custom digital marketing, search engine optimization, and custom software engineering packages at RizeWorld.",
    "url": "https://rizeworld.in/pricing"
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
        "name": "Pricing Models",
        "item": "https://rizeworld.in/pricing"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 text-left font-sans selection:bg-orange-500 selection:text-white">
      <SEO 
        title="Custom Pricing Packages & Service Plans | RizeWorld"
        description="View pricing options and custom service packages for SEO, digital advertising campaigns, graphic design, and custom software development."
        canonicalUrl="https://rizeworld.in/pricing"
        schema={[pricingSchema, breadcrumbSchema]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <Breadcrumbs items={[{ name: "Pricing" }]} />
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-orange-500 flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-4 h-4" /> Pricing Systems
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-gray-950 uppercase tracking-tighter mb-6">
            Custom Plans <br />
            Built For Growth.
          </h1>
          <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">
            Since every project demands unique parameters, we structure customized pricing contracts tailored specifically to maximize your ROI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              key={idx}
              className={`bg-white border rounded-4xl p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
                plan.popular 
                  ? 'border-orange-500 shadow-lg shadow-orange-500/5 md:-translate-y-2' 
                  : 'border-gray-200/80 shadow-2xs hover:border-orange-500/30'
              }`}
            >
              {plan.popular && (
                <span className="absolute top-4 right-4 bg-orange-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  Popular
                </span>
              )}
              <div>
                <h3 className="text-xl font-black uppercase text-gray-950 mb-2">{plan.name}</h3>
                <p className="text-gray-500 text-xs leading-relaxed mb-6">{plan.desc}</p>
                <div className="mb-8">
                  <span className="text-4xl font-black text-gray-950 uppercase">{plan.price}</span>
                </div>

                <div className="border-t border-gray-100 pt-6 space-y-4">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <Link
                  to="/contact"
                  className={`w-full inline-flex items-center justify-center py-4 px-6 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                    plan.popular
                      ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-md'
                      : 'bg-stone-150 hover:bg-orange-500 hover:text-white text-gray-800'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Badge Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-8">
        <div className="inline-flex items-center gap-2 bg-stone-100 border border-gray-200/60 rounded-full px-5 py-2.5 shadow-2xs">
          <Shield className="w-4 h-4 text-orange-500" />
          <span className="text-[10px] font-black text-gray-800 uppercase tracking-widest">
            100% Secure Custom Growth Contracts - Cancel/Pivot Anytime
          </span>
        </div>
      </section>
    </div>
  );
}
