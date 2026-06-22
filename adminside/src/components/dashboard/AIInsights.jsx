import { motion } from 'framer-motion';
import { BrainCircuit, Sparkles, ArrowRight, Zap } from 'lucide-react';

const AIInsights = () => {
  return (
    <div className="relative group">
      {/* Floating Glow Effects */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
      
      <div className="relative glass-card p-8 rounded-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Animated AI Indicator */}
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 rounded-full border-2 border-dashed border-blue-500/30 flex items-center justify-center"
            >
              <div className="w-24 h-24 rounded-full border-2 border-blue-500/50 flex items-center justify-center">
                <BrainCircuit className="w-12 h-12 text-blue-400" />
              </div>
            </motion.div>
            
            {/* Pulsing Dots */}
            <div className="absolute top-0 left-0 w-full h-full">
              {[0, 90, 180, 270].map((deg) => (
                <motion.div
                  key={deg}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: deg / 90 }}
                  style={{ transform: `rotate(${deg}deg) translateY(-64px)` }}
                  className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-500 rounded-full blur-sm"
                />
              ))}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={12} /> AI Smart Insight
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Revenue optimization opportunity detected
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-6 leading-relaxed max-w-xl">
              Based on your last 30 days of data, switching to tiered subscription pricing could increase your MRR by up to <span className="text-gray-900 dark:text-white font-semibold">24.5%</span>.
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
              >
                Apply Recommendation <ArrowRight size={18} />
              </motion.button>
              
              <button className="px-6 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-semibold hover:bg-black/10 dark:hover:bg-white/10 transition-all flex items-center gap-2">
                <Zap size={18} className="text-yellow-400" /> View Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
