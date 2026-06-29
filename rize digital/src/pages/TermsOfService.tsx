import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Scale, Sparkles } from 'lucide-react';

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 text-left font-sans selection:bg-orange-500 selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation back */}
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-900 hover:text-orange-500 transition-colors mb-12 group cursor-pointer"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        {/* Header Section */}
        <div className="bg-white border border-gray-200/80 rounded-[2.5rem] p-8 md:p-12 shadow-xs mb-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.05),transparent_50%)] pointer-events-none" />
          <span className="text-orange-500 font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-1.5">
            <Sparkles size={14} className="animate-pulse" /> Agency Terms
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-950 uppercase tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            Last Updated: June 16, 2026. Review RizeWorld's professional terms of service outlining our project deliverables and operational standards.
          </p>
        </div>

        {/* Content Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white border border-gray-200/80 rounded-[2.5rem] p-8 md:p-12 shadow-xs space-y-8 text-gray-700 text-sm leading-relaxed"
        >
          <section className="space-y-3">
            <h2 className="text-xl font-black text-gray-950 uppercase tracking-tight flex items-center gap-2">
              <Scale size={18} className="text-orange-500" /> 1. Acceptance of Terms
            </h2>
            <p>
              By visiting, browsing, or submitting details on this website, you agree to comply with and be bound by these Terms of Service, operating alongside our Privacy Policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-gray-950 uppercase tracking-tight flex items-center gap-2">
              <Scale size={18} className="text-orange-500" /> 2. Scope of Agency Services
            </h2>
            <p>
              RizeWorld offers search engine optimization, web development, custom UI/UX frameworks, digital marketing management, and paid advertising programs. Specific scopes, deliverables, timelines, and payment stages will be defined separately in signed client master agreements.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-gray-950 uppercase tracking-tight flex items-center gap-2">
              <Scale size={18} className="text-orange-500" /> 3. Intellectual Property Rights
            </h2>
            <p>
              The structural components, animations, design details, copy, and logos present on this website are the sole property of RizeWorld and are protected under international copyright law. Unapproved replication or extraction of site assets is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-gray-950 uppercase tracking-tight flex items-center gap-2">
              <Scale size={18} className="text-orange-500" /> 4. Disclaimer of Liability
            </h2>
            <p>
              While we strive to provide completely accurate details, RizeWorld does not promise absolute uptime or error-free rendering of this site. We are not responsible for any direct or indirect business disruptions that arise during navigation or loading failures.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-gray-950 uppercase tracking-tight flex items-center gap-2">
              <Scale size={18} className="text-orange-500" /> 5. Questions & Support
            </h2>
            <p>
              If you have any questions regarding the above terms or wish to initiate an official project inquiry, please contact our team via email at <a href="mailto:hr.rizeworld@gmail.com" className="text-orange-500 font-bold hover:underline">hr.rizeworld@gmail.com</a>.
            </p>
          </section>
        </motion.div>

      </div>
    </div>
  );
}
