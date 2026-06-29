import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Check, ShieldCheck, Tag } from 'lucide-react';
import { SERVICES } from '../data/services';

export default function ServiceDetails() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const service = SERVICES.find(s => s.id === serviceId);

  if (!service) {
    return (
      <div className="min-h-screen pt-36 pb-20 px-4 text-center bg-stone-50 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-gray-950 mb-4 uppercase">Service Not Found</h2>
        <p className="text-gray-500 mb-8">The service solution you are looking for does not exist.</p>
        <Link to="/" className="bg-orange-500 text-white font-bold px-6 py-3 rounded-full hover:bg-orange-600 transition-colors uppercase text-xs tracking-wider">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 overflow-hidden">
      
      {/* 1. BREADCRUMBS & NAVIGATION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-900 hover:text-orange-500 transition-colors group cursor-pointer animate-pulse"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-wider">
          <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gray-300">Solutions</span>
          <span>/</span>
          <span className="text-orange-500">{service.title}</span>
        </div>
      </div>

      {/* 2. HEADER INTRO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left mb-16">
        <span className="text-orange-500 font-bold uppercase tracking-widest text-xs flex items-center gap-1.5 mb-3">
          <Tag size={12} /> Our Solutions
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-950 leading-none uppercase tracking-tighter mb-4 max-w-4xl">
          {service.title}
        </h1>
        <p className="text-gray-500 text-base md:text-lg mb-8 italic max-w-3xl leading-relaxed">
          {service.tagline}
        </p>
        <div className="w-full h-px bg-gray-200" />
      </section>

      {/* 3. DETAILS & SPLIT INFORMATION GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1.8fr_1.2fr] gap-16 items-start mb-20">
        
        {/* Left Side: Long Description & Features */}
        <div className="flex flex-col text-left space-y-10">
          <div>
            <h3 className="text-lg font-bold uppercase text-gray-950 mb-4 tracking-wide">Detailed Overview</h3>
            <p className="text-gray-600 leading-relaxed text-base md:text-lg">
              {service.description}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold uppercase text-gray-950 mb-6 tracking-wide">Key Features & Capabilities</h3>
            <ul className="space-y-4">
              {service.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-600 leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 mt-1">
                    <Check size={12} />
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Side: Benefits */}
        <div className="bg-white border border-gray-200/80 rounded-4xl p-6 md:p-8 text-left shadow-sm">
          <h3 className="text-lg font-bold uppercase text-gray-950 mb-6 border-b border-gray-100 pb-4 tracking-wide flex items-center gap-2">
            <ShieldCheck size={18} className="text-orange-500" /> Why Choose Us
          </h3>
          <ul className="space-y-4 mb-8">
            {service.benefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-600 leading-relaxed text-sm">
                <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0 mt-2" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="pt-6 border-t border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Service Support</span>
            <p className="text-gray-900 font-bold text-sm">
              <a href="mailto:hr.rizeworld@gmail.com" className="hover:text-orange-500 transition-colors">hr.rizeworld@gmail.com</a>
            </p>
          </div>
        </div>

      </section>

      {/* 4. READY TO GROW STORY CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-950 text-white rounded-4xl p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8 text-left relative overflow-hidden shadow-xl border border-zinc-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.15),transparent_50%)] pointer-events-none" />
          <div className="relative z-10 max-w-xl">
            <h4 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-none mb-4">
              Need a Custom Brief for Your Project?
            </h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              If you require a specialized campaign or custom integration matching your exact business workflows, let's collaborate and build it together.
            </p>
          </div>
          <div className="relative z-10 shrink-0">
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider py-4 px-8 rounded-full transition-all shadow-md shadow-orange-500/20"
            >
              Let's Start Your Brief <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
