import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Sparkles } from 'lucide-react';

export default function AccessibilityArrangements() {
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
            <Sparkles size={14} className="animate-pulse" /> Equal Opportunity Access
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-950 uppercase tracking-tight mb-4">
            Accessibility Arrangements
          </h1>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            Last Updated: June 16, 2026. Discover how RizeWorld is actively working to make our platform accessible to everyone.
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
              <Eye size={18} className="text-orange-500" /> 1. Commitment to Accessibility
            </h2>
            <p>
              At RizeWorld, we believe the web should be available to everyone, regardless of ability or technology constraints. We aim to design our digital content to align with Web Content Accessibility Guidelines (WCAG) best practices.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-gray-950 uppercase tracking-tight flex items-center gap-2">
              <Eye size={18} className="text-orange-500" /> 2. Implemented Features
            </h2>
            <p>
              To support screen readers, keyboard navigation, and cognitive accessibility, we work to verify:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Logical heading hierarchies (`h1` through `h5`) across all custom landing grids.</li>
              <li>Sufficient color contrasts between foreground texts and background layers.</li>
              <li>Clear focus outlines and tab orders for keyboard navigation on input blocks.</li>
              <li>Text alternatives (alt tags) for key graphical banners and team photography.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-gray-950 uppercase tracking-tight flex items-center gap-2">
              <Eye size={18} className="text-orange-500" /> 3. Continual Improvement
            </h2>
            <p>
              We continuously test our interface components using standard web validators. As design elements change, our engineers actively evaluate accessibility to identify and remediate potential blockages.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-gray-950 uppercase tracking-tight flex items-center gap-2">
              <Eye size={18} className="text-orange-500" /> 4. Feedback & Alternate Formats
            </h2>
            <p>
              If you experience any difficulties using our pages or want to request information in alternative formats (such as plain text), please contact our digital support team via email at <a href="mailto:hr.rizeworld@gmail.com" className="text-orange-500 font-bold hover:underline">hr.rizeworld@gmail.com</a>. We will be happy to assist you.
            </p>
          </section>
        </motion.div>

      </div>
    </div>
  );
}
