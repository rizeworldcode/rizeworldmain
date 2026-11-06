import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, GraduationCap, LayoutDashboard, TrendingUp, CreditCard, Users, BookOpen } from 'lucide-react';
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
import StaffDiwaliLanding from './components/festival/StaffDiwaliLanding';
import StaffFestiveDecor, { 
  BlinkitAmbientGlow, 
  BlinkitTopLights, 
  BlinkitFestiveBanner, 
  BlinkitToranRibbon 
} from './components/festival/StaffFestiveDecor';
import FirecrackerCanvas from './components/festival/FirecrackerCanvas';

const MainLayout = ({ onLogout, onOpenDiwaliLanding }) => {
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

  const [festiveTheme, setFestiveTheme] = useState(() => {
    return localStorage.getItem('staffFestiveTheme') || 'gold';
  });

  const cycleFestiveTheme = () => {
    const nextTheme =
      festiveTheme === 'gold' ? 'carnival' :
      festiveTheme === 'carnival' ? 'diamond' :
      festiveTheme === 'diamond' ? 'off' : 'gold';
    setFestiveTheme(nextTheme);
    localStorage.setItem('staffFestiveTheme', nextTheme);
    localStorage.setItem('staffFestiveDecor', nextTheme !== 'off' ? 'true' : 'false');
    window.dispatchEvent(new CustomEvent('staffFestiveDecorChanged', { detail: { enabled: nextTheme !== 'off', theme: nextTheme } }));
  };

  const getTabClass = (tabKey) => {
    const isActive = activeTab === tabKey;
    if (isActive) {
      return festiveTheme !== 'off'
        ? 'bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-400 text-[#451a03] font-black shadow-md shadow-amber-500/40 border border-amber-300'
        : 'clay-flat text-[#8b5cf6] font-bold shadow-md shadow-purple-500/10';
    }
    return festiveTheme !== 'off'
      ? 'text-amber-200/85 hover:text-white hover:bg-white/10'
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
    <div className={`min-h-screen flex flex-col relative overflow-hidden transition-colors duration-700 ${
      festiveTheme !== 'off' 
        ? 'festive-theme-active bg-[#3b1702] text-amber-50' 
        : 'bg-[#eef2f6] text-[#334155]'
    }`}>
      {/* Background Ambience: Blinkit Warm Golden Glow or Atmospheric Blobs */}
      {festiveTheme !== 'off' ? (
        <BlinkitAmbientGlow theme={festiveTheme} />
      ) : (
        <>
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
        </>
      )}

      {/* Top Arched Hanging Micro-LED Fairy Lights (From Blinkit screenshot) */}
      {festiveTheme !== 'off' && <BlinkitTopLights theme={festiveTheme} />}

      {/* Top Navbar */}
      <div className={`flex items-center justify-between p-4 z-40 sticky top-0 transition-colors duration-500 ${
        festiveTheme !== 'off'
          ? 'bg-[#290f01]/85 backdrop-blur-md border-b border-amber-500/30 text-amber-100 shadow-md shadow-black/30'
          : 'bg-[#eef2f6]'
      }`}>
        <div className="flex items-center gap-3 overflow-x-auto py-1 max-w-[85vw]">
          <div 
            onClick={() => handleTabChange('dashboard')}
            className="p-1 rounded-xl bg-white shadow-md shadow-amber-500/20 shrink-0 cursor-pointer hover:scale-105 transition-all flex items-center justify-center border border-amber-400/30"
            title="RizeWorld Dashboard"
          >
            <img src="/logo.png" className="w-8 h-8 sm:w-9 sm:h-9 object-contain" alt="RizeWorld Logo" />
          </div>
          
          {/* Universal Navigation Tabs Bar */}
          <div className={`flex items-center gap-1.5 sm:gap-2 p-1 rounded-2xl shrink-0 transition-all ${
            festiveTheme !== 'off'
              ? 'bg-[#180900]/85 border border-amber-500/30'
              : 'bg-[#eef2f6] clay-inset'
          }`}>
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
          <StaffFestiveDecor currentTheme={festiveTheme} onChangeTheme={cycleFestiveTheme} />

          <button 
            onClick={onOpenDiwaliLanding}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 text-xs sm:text-sm font-bold cursor-pointer ${
              festiveTheme !== 'off'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-400/40 hover:bg-amber-500/30'
                : 'clay-flat text-amber-600 hover:text-amber-700 hover:clay-inset'
            }`}
            title="Watch Diwali Celebration Video"
          >
            <span className="animate-bounce">🪔</span>
            <span className="hidden md:inline">Diwali Wish</span>
          </button>

          <button 
            onClick={onLogout}
            className={`p-3 rounded-xl transition-all shrink-0 cursor-pointer ${
              festiveTheme !== 'off'
                ? 'bg-white/10 text-amber-200 hover:text-rose-400 hover:bg-rose-500/20 border border-white/15'
                : 'clay-flat text-[#64748b] hover:text-rose-500 hover:clay-inset'
            }`}
            title="Logout"
          >
            <LogOut size={22} />
          </button>
        </div>
      </div>

      {/* Blinkit Inspired Festive Centerpiece Banner with Pixel Diyas & CHANGE LIGHTS button */}
      {festiveTheme !== 'off' && (
        <div className="relative z-20 pt-2">
          <BlinkitFestiveBanner currentTheme={festiveTheme} onChangeTheme={cycleFestiveTheme} />
          <BlinkitToranRibbon className="mt-1" />
        </div>
      )}
      
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

      {/* Traditional Toran Floral Garland at page footer */}
      {festiveTheme !== 'off' && (
        <div className="relative z-20 pb-2">
          <BlinkitToranRibbon />
        </div>
      )}

    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('staffToken'));
  const [showDiwaliLanding, setShowDiwaliLanding] = useState(true);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('staffToken');
    localStorage.removeItem('staffInfo');
    setIsAuthenticated(false);
  };

  return (
    <>
      {/* Authentic Diwali Firecrackers / Pathake Canvas Animation on Button Clicks */}
      <FirecrackerCanvas />

      {/* Immersive Diwali Celebration Video Landing Page */}
      <AnimatePresence>
        {showDiwaliLanding && (
          <StaffDiwaliLanding onClose={() => setShowDiwaliLanding(false)} />
        )}
      </AnimatePresence>

      <Router>
        <Routes>
          {/* Main Route shows Login if not authenticated, else redirects to Dashboard */}
          <Route 
            path="/" 
            element={
              !isAuthenticated ? (
                <StaffLogin 
                  onLogin={handleLoginSuccess} 
                  onOpenDiwaliLanding={() => setShowDiwaliLanding(true)} 
                />
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
                <MainLayout 
                  onLogout={handleLogout} 
                  onOpenDiwaliLanding={() => setShowDiwaliLanding(true)} 
                />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />

          <Route 
            path="/clients/:id" 
            element={
              isAuthenticated ? (
                <MainLayout 
                  onLogout={handleLogout} 
                  onOpenDiwaliLanding={() => setShowDiwaliLanding(true)} 
                />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />

          {/* Catch all other routes */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
