import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Overview from './pages/Overview';
import Clients from './pages/Clients';
import ClientProjects from './pages/ClientProjects';
import StaffDetails from './pages/StaffDetails';
import TodayAssignedWork from './pages/TodayAssignedWork';
import AddStaff from './pages/AddStaff';
import WalletPage from './pages/Wallet';
import AdminLogin from './pages/AdminLogin';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedClient, setSelectedClient] = useState(null);
  const [staffSearchTerm, setStaffSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  // Initialize theme from localStorage or default to light
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Handle viewing client projects
  const viewClientProjects = (client) => {
    setSelectedClient(client);
    setActiveTab('clientProjects');
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Overview 
          key="overview" 
          onViewClient={viewClientProjects} 
          onViewStaff={() => setActiveTab('staffDetail')}
        />;
      case 'todayWork':
        return <TodayAssignedWork key="todayWork" initialSearch={staffSearchTerm} />;
      case 'staffDetail':
        return <StaffDetails 
          key="staffDetail" 
          onAddStaff={() => setActiveTab('addStaff')} 
          onViewTasks={(name) => {
            setStaffSearchTerm(name);
            setActiveTab('todayWork');
          }}
        />;
      case 'addStaff':
        return <AddStaff key="addStaff" onBack={() => setActiveTab('staffDetail')} />;
      case 'clients':
        return <Clients key="clients" onClientClick={viewClientProjects} theme={theme} />;
      case 'wallet':
        return <WalletPage key="wallet" />;
      case 'clientProjects':
        if (!selectedClient) {
          setActiveTab('clients');
          return null;
        }
        return <ClientProjects 
          key="clientProjects" 
          client={selectedClient} 
          onBack={() => {
            setSelectedClient(null);
            setActiveTab('clients');
          }} 
        />;
      default:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center h-[60vh]"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {activeTab ? activeTab.charAt(0).toUpperCase() + activeTab.slice(1) : 'Unknown'} Section
              </h2>
              <p className="text-gray-500">Coming soon in the next update.</p>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#030303] text-gray-900 dark:text-gray-100 flex overflow-hidden bg-gradient-mesh transition-colors duration-300">
      {!isLoggedIn ? (
        <div className="w-full">
          {/* We'll need to modify AdminLogin to call setIsLoggedIn on login */}
          <AdminLogin onLogin={() => setIsLoggedIn(true)} />
        </div>
      ) : (
        <>
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block sticky top-0 h-screen z-50">
            <Sidebar 
              activeTab={activeTab} 
              setActiveTab={(tab) => {
                setActiveTab(tab);
                if (tab !== 'todayWork') setStaffSearchTerm('');
              }} 
            />
          </div>

          {/* Mobile Sidebar Overlay */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
                />
                <motion.div
                  initial={{ x: -280 }}
                  animate={{ x: 0 }}
                  exit={{ x: -280 }}
                  className="fixed left-0 top-0 h-full z-[70] lg:hidden"
                >
                  <Sidebar 
                    activeTab={activeTab} 
                    setActiveTab={(tab) => {
                      setActiveTab(tab);
                      if (tab !== 'todayWork') setStaffSearchTerm('');
                      setIsMobileMenuOpen(false);
                    }} 
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
            <Header 
              onMenuClick={() => setIsMobileMenuOpen(true)} 
              activeTab={activeTab}
              theme={theme}
              toggleTheme={toggleTheme}
            />
            
            <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-10">
              <div className="max-w-[1600px] mx-auto">
                <AnimatePresence mode="wait">
                  {renderContent()}
                </AnimatePresence>
              </div>
            </main>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
