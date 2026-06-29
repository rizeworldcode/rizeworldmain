import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Sparkles } from 'lucide-react';

export default function PrivacyPolicy() {
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
            <Sparkles size={14} className="animate-pulse" /> Legal & Compliance
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-950 uppercase tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            Last Updated: June 16, 2026. Learn how RizeWorld collects, uses, and safeguards your personal information when using our agency website.
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
              <Shield size={18} className="text-orange-500" /> 1. Information Collection
            </h2>
            <p>
              We collect information that you directly provide to us, notably when you fill out our contact and strategy inquiry forms. This may include your full name, business email address, phone number, and details regarding your digital project goals.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-gray-950 uppercase tracking-tight flex items-center gap-2">
              <Shield size={18} className="text-orange-500" /> 2. Use of Information
            </h2>
            <p>
              RizeWorld uses the gathered details to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Respond to your service requests, project inquiries, and questions.</li>
              <li>Provide tailored consultation proposals for search engine optimization, web development, and digital marketing.</li>
              <li>Analyze web traffic logs to optimize page performance, user experiences, and navigation flows.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-gray-950 uppercase tracking-tight flex items-center gap-2">
              <Shield size={18} className="text-orange-500" /> 3. Data Protection & Safety
            </h2>
            <p>
              We prioritize your privacy. RizeWorld implements modern security measures, including transport-layer encryption (SSL/HTTPS), to safeguard transmission blocks. We never sell, lease, or distribute your email addresses or contact details to third-party advertisers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-gray-950 uppercase tracking-tight flex items-center gap-2">
              <Shield size={18} className="text-orange-500" /> 4. Cookies & Web Analytics
            </h2>
            <p>
              Our platform uses essential and analytical cookies to understand how users interact with our sections. You have full controls via browser preferences to refuse cookies, though doing so might affect specific platform capabilities.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-gray-950 uppercase tracking-tight flex items-center gap-2">
              <Shield size={18} className="text-orange-500" /> 5. Your Rights
            </h2>
            <p>
              You maintain the absolute right to request access to the personal data we hold, request corrections, or request complete removal of your business records. For any compliance requests, please write directly to our HR team at <a href="mailto:hr.rizeworld@gmail.com" className="text-orange-500 font-bold hover:underline">hr.rizeworld@gmail.com</a>.
            </p>
          </section>
        </motion.div>

      </div>
    </div>
  );
}
