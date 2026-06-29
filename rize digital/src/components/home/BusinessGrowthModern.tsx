import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function BusinessGrowthModern() {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  return (
    <section className="bg-rize-bg py-20 lg:py-32 font-sans overflow-hidden border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-16 relative">
          <h2 className="section-title mb-6 leading-tight">
            BUSINESS <span className="gradient-text">GROWTH</span>
          </h2>
          
          <p className="section-subtitle max-w-2xl mx-auto mb-10">
            Build and enhance brand visibility can be seen on many factors such as business growth, online revenue, and its brand marketing.
          </p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/contact" className="btn-primary">
              Get Started
            </Link>
          </motion.div>
        </div>

        {/* Cards Section */}
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-center gap-4 lg:gap-6 w-full">
          
          {/* Card 1: Left Gradient Tall */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full sm:w-[80%] lg:w-1/5 h-[350px] lg:h-[450px] bg-linear-to-br from-rize-royal via-rize-indigo to-rize-cyan rounded-3xl lg:rounded-tl-[4rem] lg:rounded-br-[4rem] lg:rounded-tr-xl lg:rounded-bl-xl p-8 flex flex-col justify-end relative overflow-hidden group shadow-lg hover:shadow-xl transition-shadow border border-white/10"
          >
            {/* Wavy background graphic placeholder */}
            <div className="absolute top-0 left-0 w-full h-[50%] opacity-20 pointer-events-none">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-white fill-current">
                <path d="M0,0 C30,30 70,-10 100,20 L100,0 L0,0 Z" />
              </svg>
            </div>
            
            <div className="mb-4">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/30 text-white group-hover:bg-white group-hover:text-rize-royal transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </span>
            </div>
            <h3 className="text-5xl font-black text-white mb-2 tracking-tighter">2X</h3>
            <p className="text-white/90 font-medium text-sm lg:text-base leading-snug uppercase tracking-widest">
              Business Growth
            </p>
          </motion.div>

          {/* Card 2: Small White */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="w-full sm:w-[80%] lg:w-[15%] h-[250px] lg:h-[280px] bg-white rounded-3xl p-6 lg:p-8 flex flex-col justify-center items-center text-center shadow-md hover:shadow-xl transition-shadow border border-gray-100"
          >
            <h3 className="text-4xl lg:text-5xl font-black text-gray-900 mb-3 tracking-tighter">1.6X</h3>
            <p className="text-rize-primary font-bold text-xs lg:text-sm uppercase tracking-widest">
              Online Revenue
            </p>
          </motion.div>

          {/* Card 3: Center Image horizontal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onClick={() => setActiveImage('/images/growth work 1.png')}
            className="w-full sm:w-[80%] lg:w-[25%] h-[200px] lg:h-[220px] rounded-[3rem] lg:rounded-[4rem] relative overflow-hidden group mb-4 lg:mb-8 shadow-md bg-[#0a0216] cursor-pointer"
          >
            <img 
              src="/images/growth work 1.png" 
              alt="Team collaborating" 
              className="absolute inset-0 w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 flex items-center justify-center transition-colors">
              <span className="text-white font-bold text-lg drop-shadow-md tracking-wider uppercase bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-xs">Show the results</span>
            </div>
          </motion.div>

          {/* Card 4: Right Light Indigo */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="w-full sm:w-[80%] lg:w-[15%] h-[280px] lg:h-[320px] bg-blue-50/50 rounded-3xl p-6 lg:p-8 flex flex-col justify-center items-center text-center shadow-md hover:shadow-xl transition-shadow border border-blue-100/50"
          >
            <h3 className="text-4xl lg:text-5xl font-black text-rize-primary mb-3 tracking-tighter">3X</h3>
            <p className="text-gray-900 font-bold text-xs lg:text-sm uppercase tracking-widest">
              Organic Traffic
            </p>
          </motion.div>

          {/* Card 5: Far Right Image Tall */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            onClick={() => setActiveImage('/images/growth2.1.png')}
            className="w-full sm:w-[80%] lg:w-[20%] h-[350px] lg:h-[450px] bg-[#f5f5f5] rounded-3xl lg:rounded-tl-[4rem] lg:rounded-br-[4rem] lg:rounded-tr-xl lg:rounded-bl-xl relative overflow-hidden group shadow-md hover:shadow-xl transition-shadow cursor-pointer border border-gray-100"
          >
            <img 
              src="/images/growth2.1.png" 
              alt="Visibility to Revenue Poster" 
              className="absolute inset-0 w-full h-full object-contain p-0 group-hover:scale-105 transition-transform duration-700"
            />
          </motion.div>

        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 md:p-8 backdrop-blur-md cursor-zoom-out"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveImage(null);
              }}
              className="absolute top-4 right-4 md:top-6 md:right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all border border-white/10 cursor-pointer"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <motion.img
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              src={activeImage}
              alt="Enlarged view"
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
