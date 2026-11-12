import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, GraduationCap, LayoutDashboard, TrendingUp, CreditCard, Users, BookOpen, Fingerprint } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import StaffLogin from './pages/StaffLogin';
import HearingManagement from './pages/HearingManagement';
import StudentAdmissions from './pages/StudentAdmissions';
import SalesTeam from './pages/SalesTeam';
import VisitingCards from './pages/VisitingCards';
import Clients from './pages/Clients';
import ClientProjects from './pages/ClientProjects';
import BlogManagement from './pages/BlogManagement';
import StaffProgressReport from './pages/StaffProgressReport';
import BiometricModal from './components/BiometricModal';

const MainLayout = ({ onLogout }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id: clientId } = useParams();
  const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') || 'dashboard');
  const staffInfo = (() => {
    try {
      const raw = localStorage.getItem('staffInfo');
      if (!raw || raw === 'undefined' || raw === 'null') return {};
      return JSON.parse(raw);
    } catch {
      return {};
    }
  })();

  const isHR = staffInfo.role?.toLowerCase() === 'hr';
  const isCounselor = staffInfo.role?.toLowerCase() === 'counselor';
  const isSalesTeam = staffInfo.role?.toLowerCase() === 'sales team' || staffInfo.role?.toLowerCase() === 'sales';
  const isVisitingCardsAllowed = ['admin', 'data analyst'].includes(staffInfo.role?.toLowerCase()) && staffInfo.employeeId !== 'RW-4559';
  const isClientsAllowed = ['admin', 'data analyst'].includes(staffInfo.role?.toLowerCase()) && staffInfo.employeeId !== 'RW-4559';
  const isMarketing = (staffInfo.department?.toLowerCase() || '').includes('marketing') || (staffInfo.role?.toLowerCase() || '').includes('marketing');

  const [isBiometricOpen, setIsBiometricOpen] = useState(false);

  const getTabClass = (tabKey) => {
    const isActive = activeTab === tabKey;
    return isActive
      ? 'clay-flat text-[#8b5cf6] font-bold shadow-md shadow-purple-500/10'
      : 'text-[#64748b] hover:text-[#8b5cf6]';
  };

  useEffect(() => {
    const isAllowed =
      activeTab === 'dashboard' ||
      activeTab === 'progress' ||
      (activeTab === 'hearing' && isHR) ||
      (activeTab === 'admissions' && isCounselor) ||
      (activeTab === 'sales' && isSalesTeam) ||
      (activeTab === 'clients' && isClientsAllowed) ||
      (activeTab === 'visitingCards' && isVisitingCardsAllowed) ||
      (activeTab === 'blogs' && isMarketing);

    if (!isAllowed) {
      setActiveTab('dashboard');
      navigate('/dashboard?tab=dashboard', { replace: true });
    }
  }, [activeTab, isHR, isCounselor, isSalesTeam, isClientsAllowed, isVisitingCardsAllowed, isMarketing, navigate]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/dashboard?tab=${tab}`);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#eef2f6] text-[#334155]">
      {/* Background Ambience: Atmospheric Blobs */}
      <motion.div 
        animate={{ 
          x: [0, 50, 0],
          y: [0, 100, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="blob w-[600px] h-[600px] bg-[#8b5cf6] -top-[10%] -left-[10%]"
      />
      <motion.div 
        animate={{ 
          x: [0, -100, 0],
          y: [0, -50, 0],
          scale: [1, 1.3, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="blob w-[500px] h-[500px] bg-[#facc15] -bottom-[10%] -right-[10%]"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="blob w-[400px] h-[400px] bg-[#f472b6] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />

      {/* Top Navbar */}
      <div className="flex items-center justify-between p-4 z-40 sticky top-0 bg-[#eef2f6]">
        <div className="flex items-center gap-3 overflow-x-auto py-1 max-w-[85vw]">
          <div 
            onClick={() => handleTabChange('dashboard')}
            className="p-1 rounded-xl bg-white shadow-md shrink-0 cursor-pointer hover:scale-105 transition-all flex items-center justify-center border border-slate-200"
            title="RizeWorld Dashboard"
          >
            <img src="/logo.png" className="w-8 h-8 sm:w-9 sm:h-9 object-contain" alt="RizeWorld Logo" />
          </div>
          
          {/* Universal Navigation Tabs Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2 p-1 rounded-2xl shrink-0 transition-all bg-[#eef2f6] clay-inset">
            <button 
              onClick={() => handleTabChange('dashboard')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${getTabClass('dashboard')}`}
            >
              <LayoutDashboard size={15} />
              Dashboard
            </button>

            <button 
              onClick={() => handleTabChange('progress')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${getTabClass('progress')}`}
            >
              <TrendingUp size={15} />
              Progress Report
            </button>

            {isHR && (
              <button 
                onClick={() => handleTabChange('hearing')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all whitespace-nowrap ${getTabClass('hearing')}`}
              >
                Hearing
              </button>
            )}

            {isCounselor && (
              <button 
                onClick={() => handleTabChange('admissions')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${getTabClass('admissions')}`}
              >
                <GraduationCap size={15} />
                Admissions
              </button>
            )}

            {isSalesTeam && (
              <button 
                onClick={() => handleTabChange('sales')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${getTabClass('sales')}`}
              >
                <TrendingUp size={15} />
                Sales log
              </button>
            )}

            {isClientsAllowed && (
              <button 
                onClick={() => handleTabChange('clients')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${getTabClass('clients')}`}
              >
                <Users size={15} />
                Clients
              </button>
            )}

            {isVisitingCardsAllowed && (
              <button 
                onClick={() => handleTabChange('visitingCards')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${getTabClass('visitingCards')}`}
              >
                <CreditCard size={15} />
                Visiting Cards
              </button>
            )}

            {isMarketing && (
              <button 
                onClick={() => handleTabChange('blogs')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${getTabClass('blogs')}`}
              >
                <BookOpen size={15} />
                Blog Editor
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsBiometricOpen(true)}
            className="px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 text-xs sm:text-sm font-bold cursor-pointer clay-flat text-blue-600 hover:text-blue-700 hover:clay-inset"
            title="Setup Touch ID / Face ID / Fingerprint"
          >
            <Fingerprint size={16} />
            <span className="hidden md:inline">Biometrics</span>
          </button>

          <button 
            onClick={onLogout}
            className="p-3 rounded-xl transition-all shrink-0 cursor-pointer clay-flat text-[#64748b] hover:text-rose-500 hover:clay-inset"
            title="Logout"
          >
            <LogOut size={22} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 relative z-10">
        {clientId && isClientsAllowed ? (
          <ClientProjects onBack={() => navigate('/dashboard?tab=clients')} />
        ) : (
          <>
            {activeTab === 'dashboard' && <Dashboard onNavigateToProgress={() => handleTabChange('progress')} />}
            {activeTab === 'progress' && <StaffProgressReport onBack={() => handleTabChange('dashboard')} />}
            {activeTab === 'hearing' && isHR && <HearingManagement />}
            {activeTab === 'admissions' && isCounselor && <StudentAdmissions onBack={() => handleTabChange('dashboard')} />}
            {activeTab === 'sales' && isSalesTeam && <SalesTeam onBack={() => handleTabChange('dashboard')} />}
            {activeTab === 'visitingCards' && isVisitingCardsAllowed && <VisitingCards onBack={() => handleTabChange('dashboard')} />}
            {activeTab === 'clients' && isClientsAllowed && <Clients onClientClick={(client) => navigate(`/clients/${client._id || client.id}`)} />}
            {activeTab === 'blogs' && isMarketing && <BlogManagement onBack={() => handleTabChange('dashboard')} />}
          </>
        )}
      </main>

      {/* Biometric Touch ID / Face ID / Fingerprint Setup Modal */}
      <BiometricModal
        isOpen={isBiometricOpen}
        onClose={() => setIsBiometricOpen(false)}
      />

    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('staffToken'));

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('staffToken');
    localStorage.removeItem('staffInfo');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        {/* Main Route shows Login if not authenticated, else redirects to Dashboard */}
        <Route 
          path="/" 
          element={
            !isAuthenticated ? (
              <StaffLogin onLogin={handleLoginSuccess} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          } 
        />

        {/* Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? (
              <MainLayout onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />

        <Route 
          path="/clients/:id" 
          element={
            isAuthenticated ? (
              <MainLayout onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />

        {/* Catch all other routes */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} />
      </Routes>
    </Router>
  );
};

export default App;
