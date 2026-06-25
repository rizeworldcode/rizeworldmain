import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { getRevenueAnalytics } from '../../api';

const COLORS = [
  '#3b82f6', // Blue
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#a855f7', // Purple
  '#d946ef', // Fuchsia
  '#ec4899', // Pink
  '#f43f5e', // Rose
  '#f97316', // Orange
  '#eab308', // Yellow
  '#84cc16', // Lime
  '#22c55e', // Green
  '#10b981'  // Emerald
];

const CustomTooltip = ({ active, payload, data }) => {
  if (active && payload && payload.length > 0 && Array.isArray(data) && data.length > 0) {
    const dataItem = payload[0]?.payload || {};
    const { name = 'Unknown', revenue = 0 } = dataItem;
    const total = data.reduce((acc, curr) => acc + (curr?.revenue || 0), 0);
    const percentage = total > 0 ? ((revenue / total) * 100).toFixed(1) : 0;

    return (
      <div className="glass-card p-4 rounded-xl border border-gray-200 dark:border-white/10 shadow-2xl backdrop-blur-2xl">
        <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mb-2">{name}</p>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dataItem.fill || payload[0]?.color || COLORS[0] }} />
              <span className="text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-wider font-medium">Revenue</span>
            </div>
            <span className="text-gray-900 dark:text-white font-bold">₹{(revenue || 0).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center justify-between gap-8">
            <span className="text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-wider font-medium">Contribution</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">{percentage}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const RevenueChart = () => {
  const [timeRange, setTimeRange] = useState('Month');
  const [data, setData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchRevenueData = async (period) => {
    setLoading(true);
    try {
      const result = await getRevenueAnalytics(period.toLowerCase());
      if (result.success) {
        setData(result.data.chartData);
        setTotalRevenue(result.data.totalRevenue);
      }
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData(timeRange);
  }, [timeRange]);

  return (
    <div className="glass-card p-4 sm:p-6 rounded-2xl h-full flex flex-col transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Revenue Analytics</h3>
          <p className="text-sm text-gray-500 font-medium">Revenue distribution across {timeRange.toLowerCase()}s</p>
        </div>
        
        <div className="flex items-center gap-1 p-1 bg-black/5 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
          {['Day', 'Week', 'Month'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeRange === range 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-[250px] sm:min-h-[350px]">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : data.length === 0 || data.every(item => item.revenue === 0) ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[250px] sm:min-h-[350px]">
          <div className="w-20 h-20 mb-4 rounded-2xl bg-gray-100 dark:bg-white/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
          </div>
          <p className="text-gray-500 font-semibold text-lg mb-2">No Revenue Data Yet</p>
          <p className="text-gray-400 text-sm">Add client payments to see revenue analytics</p>
        </div>
      ) : (
        <>
          <div className="flex-1 w-full h-[260px] sm:h-[350px] relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={isMobile ? 60 : 85}
                  outerRadius={isMobile ? 80 : 120}
                  paddingAngle={5}
                  dataKey="revenue"
                  animationBegin={0}
                  animationDuration={1500}
                  animationEasing="ease-out"
                >
                  {Array.isArray(data) && data.map((item, index) => (
                    <Cell 
                      key={item?.name || `cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      stroke="none"
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip content={(props) => <CustomTooltip {...props} data={data} />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-center"
              >
                <p className="text-[8px] sm:text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.1em] sm:tracking-[0.2em] mb-0.5">Total Revenue</p>
                <h4 className="text-base sm:text-3xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
                  ₹{(totalRevenue || 0).toLocaleString('en-IN')}
                </h4>
                <div className="mt-0.5 sm:mt-2 flex items-center gap-1 justify-center">
                  <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] sm:text-[10px] font-bold text-emerald-600 dark:text-emerald-500 uppercase">Live</span>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {Array.isArray(data) && data.slice(0, 6).map((item, index) => (
              <div key={item?.name || `legend-${index}`} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase truncate">{item?.name || 'N/A'}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RevenueChart;
