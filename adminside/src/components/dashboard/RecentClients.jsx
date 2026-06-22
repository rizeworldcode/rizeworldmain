import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal, User, Briefcase, Clock } from 'lucide-react';

const getTimeAgo = (date) => {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} mins ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  return `${diffDays} days ago`;
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
};

const RecentClients = ({ onClientClick }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    try {
      const response = await fetch('http://localhost:45000/api/clients');
      const result = await response.json();
      if (result.success) {
        // Sort by createdAt descending (most recent first) and take top 5
        const sorted = result.data.sort((a, b) => 
          new Date(b.createdAt || b._id).getTime() - new Date(a.createdAt || a._id).getTime()
        ).slice(0, 5);
        setClients(sorted);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="glass-card p-6 rounded-2xl h-full flex flex-col transition-colors">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Recent Clients</h3>
          <p className="text-sm text-gray-500 font-medium">Activity from across your organization</p>
        </div>
        <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-gray-400 dark:text-gray-500 transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : clients.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">No clients yet</p>
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="flex-1 space-y-4"
        >
          {clients.map((client) => (
            <motion.div
              key={client._id || client.id}
              variants={item}
              onClick={() => onClientClick?.(client)}
              className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all group border border-transparent hover:border-gray-100 dark:hover:border-white/5 overflow-hidden cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center border border-gray-100 dark:border-white/10 bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <User size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                    {client.name}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-500">
                    <span className="flex items-center gap-1"><Briefcase size={10} /> {client.department}</span>
                    <span className="flex items-center gap-1 shrink-0"><Clock size={10} /> {getTimeAgo(client.createdAt || client.startDate || Date.now())}</span>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white">₹{client.totalPrice.toLocaleString('en-IN')}</p>
                <p className={`text-[10px] font-bold mt-1 uppercase tracking-wider ${
                  client.status === 'Completed' ? 'text-emerald-600 dark:text-emerald-400' : 
                  client.status === 'In Progress' ? 'text-blue-600 dark:text-blue-400' : 
                  client.status === 'On Hold' ? 'text-amber-600 dark:text-amber-400' : 
                  client.status === 'Pending' ? 'text-amber-600 dark:text-amber-400' : 
                  'text-gray-500'
                }`}>{client.status}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default RecentClients;
