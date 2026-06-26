import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users2,
  Users,
  Wallet,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  UserPlus,
  MapPin
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: CalendarCheck, label: 'Today asigned work', id: 'todayWork' },
  { icon: Users2, label: 'Employee Detail', id: 'staffDetail' },
  { icon: UserPlus, label: 'Add Employee', id: 'addStaff' },
  { icon: Users, label: 'Clients', id: 'clients' },
  { icon: Wallet, label: 'Wallet', id: 'wallet' },
  { icon: MapPin, label: 'Sales Tracking', id: 'salesTracking' },
  // { icon: Settings, label: 'Settings', id: 'settings' },
];

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      className="h-screen glass border-r border-gray-200 dark:border-white/10 flex flex-col transition-colors duration-300"
    >
      {/* Logo Section */}
      <div className="p-6 flex items-center gap-3">
        {/* <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Sparkles className="text-white w-6 h-6" />
        </div> */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 whitespace-nowrap"
            >
              <div className='w-50 h-30'><img src="/images/logo_img.png" alt="" /></div>

              {/* Rizeworld */}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group relative
              ${activeTab === item.id
                ? 'bg-blue-50 dark:bg-white/10 text-blue-600 dark:text-white shadow-inner'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}`}
          >
            <item.icon className={`w-6 h-6 shrink-0 ${activeTab === item.id ? 'text-blue-600 dark:text-blue-400' : 'group-hover:text-blue-600 dark:group-hover:text-blue-400'}`} />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-bold whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Active Indicator */}
            {activeTab === item.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute left-0 w-1 h-6 bg-blue-600 dark:bg-blue-500 rounded-r-full"
              />
            )}
          </button>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-4 border-t border-gray-200 dark:border-white/10">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
