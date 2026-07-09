import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Routes, Route, Navigate, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Overview from './pages/Overview';
import Clients from './pages/Clients';
import ClientProjects from './pages/ClientProjects';
import StaffDetails from './pages/StaffDetails';
import RemovedEmployees from './pages/RemovedEmployees';
import TodayAssignedWork from './pages/TodayAssignedWork';
import AddStaff from './pages/AddStaff';
import WalletPage from './pages/Wallet';
import AdminLogin from './pages/AdminLogin';
import SalesTracking from './pages/SalesTracking';
import SalesPhotos from './pages/SalesPhotos';
import VisitingCards from './pages/VisitingCards';
import SalarySheet from './pages/SalarySheet';
import { adminLogout } from './api';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState(() => {
    return localStorage.getItem('currentAdminEmail') || 'Admin';
  });
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    return savedTheme;
  });

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const getActiveTabFromPathname = (pathname) => {
    if (pathname === '/' || pathname === '/dashboard') return 'dashboard';
    if (pathname.startsWith('/today-work')) return 'todayWork';
    if (pathname === '/staff/add') return 'addStaff';
    if (pathname === '/staff/removed') return 'removedEmployees';
    if (pathname.startsWith('/staff')) return 'staffDetail';
    if (pathname.startsWith('/clients')) return 'clients';
    if (pathname.startsWith('/wallet')) return 'wallet';
    if (pathname.startsWith('/tracking/photos')) return 'salesPhotos';
    if (pathname.startsWith('/tracking/cards')) return 'visitingCards';
    if (pathname.startsWith('/tracking')) return 'salesTracking';
    if (pathname.startsWith('/salary-sheet')) return 'salarySheet';
    if (pathname.startsWith('/settings')) return 'settings';
    return '';
  };
  const activeTab = getActiveTabFromPathname(location.pathname);

  const handleLogin = (email) => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    if (email) {
      localStorage.setItem('currentAdminEmail', email);
      setAdminEmail(email);
    }
  };

  const handleLogout = async () => {
    try {
      await adminLogout();
    } catch (err) {
      console.error('Logout API error:', err);
    }
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentAdminEmail');
    localStorage.removeItem('adminToken');
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#030303] text-gray-900 dark:text-gray-100 flex overflow-hidden bg-gradient-mesh transition-colors duration-300">
      {!isLoggedIn ? (
        <div className="w-full">
          <AdminLogin onLogin={handleLogin} />
        </div>
      ) : (
        <>
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block sticky top-0 h-screen z-50">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={(tab) => {
                if (tab === 'dashboard') navigate('/');
                else if (tab === 'todayWork') navigate('/today-work');
                else if (tab === 'staffDetail') navigate('/staff');
                else if (tab === 'addStaff') navigate('/staff/add');
                else if (tab === 'removedEmployees') navigate('/staff/removed');
                else if (tab === 'studentAdmissions') navigate('/staff/admissions');
                else if (tab === 'clients') navigate('/clients');
                else if (tab === 'wallet') navigate('/wallet');
                else if (tab === 'salesTracking') navigate('/tracking');
                else if (tab === 'salesPhotos') navigate('/tracking/photos');
                else if (tab === 'visitingCards') navigate('/tracking/cards');
                else if (tab === 'salarySheet') navigate('/salary-sheet');
                else if (tab === 'settings') navigate('/settings');
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
                      if (tab === 'dashboard') navigate('/');
                      else if (tab === 'todayWork') navigate('/today-work');
                      else if (tab === 'staffDetail') navigate('/staff');
                      else if (tab === 'addStaff') navigate('/staff/add');
                      else if (tab === 'removedEmployees') navigate('/staff/removed');
                      else if (tab === 'studentAdmissions') navigate('/staff/admissions');
                      else if (tab === 'clients') navigate('/clients');
                      else if (tab === 'wallet') navigate('/wallet');
                      else if (tab === 'salesTracking') navigate('/tracking');
                      else if (tab === 'salesPhotos') navigate('/tracking/photos');
                      else if (tab === 'visitingCards') navigate('/tracking/cards');
                      else if (tab === 'salarySheet') navigate('/salary-sheet');
                      else if (tab === 'settings') navigate('/settings');
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
              theme={theme}
              toggleTheme={toggleTheme}
              onLogout={handleLogout}
              adminEmail={adminEmail}
            />

            <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-10">
              <div className="max-w-[1600px] mx-auto">
                <AnimatePresence mode="wait">
                  <Routes location={location} key={location.pathname}>
                    <Route path="/" element={
                      <Overview
                        onViewClient={(client) => navigate(`/clients/${client._id || client.id}`)}
                        onViewStaff={() => navigate('/staff')}
                      />
                    } />
                    <Route path="/today-work" element={
                      <TodayAssignedWork initialSearch={searchParams.get('search') || ''} />
                    } />
                    <Route path="/staff" element={
                      <StaffDetails
                        onAddStaff={() => navigate('/staff/add')}
                        onViewTasks={(name) => navigate(`/today-work?search=${encodeURIComponent(name)}`)}
                      />
                    } />
                    <Route path="/staff/add" element={
                  <AddStaff onBack={() => navigate('/staff')} />
                } />
                    <Route path="/staff/removed" element={
                      <RemovedEmployees />
                    } />
                <Route path="/clients" element={
                  <Clients onClientClick={(client) => navigate(`/clients/${client._id || client.id}`)} theme={theme} />
                } />
                    <Route path="/clients/:id" element={
                      <ClientProjects onBack={() => navigate('/clients')} />
                    } />
                    <Route path="/wallet" element={
                      <WalletPage />
                    } />
                    <Route path="/tracking" element={
                      <SalesTracking />
                    } />
                    <Route path="/tracking/photos" element={
                      <SalesPhotos />
                    } />
                    <Route path="/tracking/cards" element={
                      <VisitingCards />
                    } />
                    <Route path="/salary-sheet" element={
                      <SalarySheet />
                    } />
                    <Route path="/settings" element={
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center h-[60vh]"
                      >
                        <div className="text-center">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Settings Section
                          </h2>
                          <p className="text-gray-500">Coming soon in the next update.</p>
                        </div>
                      </motion.div>
                    } />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
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
