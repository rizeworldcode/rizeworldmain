import { Menu, User, Sun, Moon, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = ({ onMenuClick, theme, toggleTheme, onLogout, adminEmail }) => {
  const adminName = adminEmail ? adminEmail.split('@')[0] : 'Admin';
  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-gray-200 dark:border-white/10 px-6 py-4 flex items-center justify-between lg:justify-end backdrop-blur-md transition-colors duration-300">
      {/* Mobile Menu Button */}
      <button 
        onClick={onMenuClick}
        className="lg:hidden p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
      >
        <Menu className="w-6 h-6 text-gray-500 dark:text-gray-400" />
      </button>

      {/* Search Bar */}
      {/* <div className="hidden md:flex items-center flex-1 max-w-md bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 focus-within:border-blue-500/50 transition-all">
        <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3" />
        <input 
          type="text" 
          placeholder="Search staff, clients, or reports..." 
          className="bg-transparent border-none outline-none text-sm text-gray-800 dark:text-gray-200 w-full placeholder:text-gray-400 dark:placeholder:text-gray-600"
        />
        <div className="flex items-center gap-1 ml-2">
          <kbd className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-white/10 bg-black/5 dark:bg-white/5 text-[10px] text-gray-400 dark:text-gray-500">⌘</kbd>
          <kbd className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-white/10 bg-black/5 dark:bg-white/5 text-[10px] text-gray-400 dark:text-gray-500">K</kbd>
        </div>
      </div> */}

      {/* Right Side Actions */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Logout Button */}
        {onLogout && (
          <button 
            onClick={onLogout}
            className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 dark:hover:bg-rose-500/10 transition-all"
            title="Sign Out"
          >
            <LogOut size={20} />
          </button>
        )}

        {/* System Status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">System Live</span>
        </div>

        {/* Notifications */}
        {/* <button className="relative p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors group">
          <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-gray-50 dark:border-[#030303]" />
        </button> */}

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 sm:pl-6 border-l border-gray-200 dark:border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900 dark:text-white capitalize">{adminName}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-500">{adminEmail || 'Administrator'}</p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-0.5"
          >
            <div className="w-full h-full rounded-full bg-white dark:bg-[#030303] flex items-center justify-center overflow-hidden border border-white/10">
              <User className="w-6 h-6 text-gray-400" />
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;
