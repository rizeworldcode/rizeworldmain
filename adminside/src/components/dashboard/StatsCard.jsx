import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import TiltCard from '../shared/TiltCard';

const StatsCard = ({ title, value, change = undefined, isPositive = true, icon: Icon, gradient, loading = false, onClick }) => {
  return (
    <TiltCard className="w-full">
      <div 
        onClick={onClick}
        className={`glass-card p-4 sm:p-5 rounded-2xl h-full relative overflow-hidden group select-none ${onClick ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-300' : ''}`}
      >
        {/* Background Gradient Glow */}
        <div className={`absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-20 transition-opacity group-hover:opacity-40 bg-gradient-to-br ${gradient}`} />
        
        <div className="flex justify-between items-start mb-2">
          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient} shadow-lg shadow-blue-500/10`}>
            {Icon && <Icon className="w-5 h-5 text-white" />}
          </div>
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-xs font-bold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {change}%
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-0.5">{title}</p>
          {loading ? (
            <div className="h-8 w-28 bg-gray-200 dark:bg-white/10 animate-pulse rounded-lg" />
          ) : (
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {value}
            </h3>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-3 w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '70%' }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={`h-full bg-gradient-to-r ${gradient}`}
          />
        </div>
      </div>
    </TiltCard>
  );
};

export default StatsCard;
