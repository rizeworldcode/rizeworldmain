import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, GraduationCap, LayoutDashboard, TrendingUp } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import StaffLogin from './pages/StaffLogin';
import HearingManagement from './pages/HearingManagement';
import StudentAdmissions from './pages/StudentAdmissions';
import SalesTeam from './pages/SalesTeam';

const MainLayout = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const staffInfo = JSON.parse(localStorage.getItem('staffInfo') || '{}');
  const isHR = staffInfo.role?.toLowerCase() === 'hr';
  const isCounselor = staffInfo.role?.toLowerCase() === 'counselor';
  const isSalesTeam = staffInfo.role?.toLowerCase() === 'sales team' || staffInfo.role?.toLowerCase() === 'sales';

  return (
    <div className="min-h-screen bg-[#eef2f6] flex flex-col relative overflow-hidden">
      {/* Background Atmospheric Blobs */}
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
      <div className="flex items-center justify-between p-4 bg-[#eef2f6] z-40 sticky top-0">
        <div className="flex items-center gap-4">
          <img src="/logo.png" className="w-10 h-10 object-contain rounded-xl shadow-lg shadow-purple-500/10" alt="RizeWorld Logo" />
          {isHR && (
            <div className="flex items-center gap-2 bg-[#eef2f6] p-1 rounded-2xl clay-inset ml-2">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all ${
                  activeTab === 'dashboard'
                    ? 'clay-flat text-[#8b5cf6] font-bold shadow-md shadow-purple-500/10'
                    : 'text-[#64748b] hover:text-[#8b5cf6]'
                }`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('hearing')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all ${
                  activeTab === 'hearing'
                    ? 'clay-flat text-[#8b5cf6] font-bold shadow-md shadow-purple-500/10'
                    : 'text-[#64748b] hover:text-[#8b5cf6]'
                }`}
              >
                Hearing
              </button>
            </div>
          )}
          {isCounselor && (
            <div className="flex items-center gap-2 bg-[#eef2f6] p-1 rounded-2xl clay-inset ml-2">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all ${
                  activeTab === 'dashboard'
                    ? 'clay-flat text-[#8b5cf6] font-bold shadow-md shadow-purple-500/10'
                    : 'text-[#64748b] hover:text-[#8b5cf6]'
                }`}
              >
                <LayoutDashboard size={16} className="inline mr-1" />
                Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('admissions')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all ${
                  activeTab === 'admissions'
                    ? 'clay-flat text-[#8b5cf6] font-bold shadow-md shadow-purple-500/10'
                    : 'text-[#64748b] hover:text-[#8b5cf6]'
                }`}
              >
                <GraduationCap size={16} className="inline mr-1" />
                Admissions
              </button>
            </div>
          )}
          {isSalesTeam && (
            <div className="flex items-center gap-2 bg-[#eef2f6] p-1 rounded-2xl clay-inset ml-2">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all ${
                  activeTab === 'dashboard'
                    ? 'clay-flat text-[#8b5cf6] font-bold shadow-md shadow-purple-500/10'
                    : 'text-[#64748b] hover:text-[#8b5cf6]'
                }`}
              >
                <LayoutDashboard size={16} className="inline mr-1" />
                Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('sales')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all ${
                  activeTab === 'sales'
                    ? 'clay-flat text-[#8b5cf6] font-bold shadow-md shadow-purple-500/10'
                    : 'text-[#64748b] hover:text-[#8b5cf6]'
                }`}
              >
                <TrendingUp size={16} className="inline mr-1" />
                Sales log
              </button>
            </div>
          )}
        </div>
        <button 
          onClick={onLogout}
          className="p-3 clay-flat rounded-xl text-[#64748b] hover:text-rose-500 hover:clay-inset transition-all"
        >
          <LogOut size={24} />
        </button>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 relative z-10">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'hearing' && isHR && <HearingManagement />}
        {activeTab === 'admissions' && isCounselor && <StudentAdmissions onBack={() => setActiveTab('dashboard')} />}
        {activeTab === 'sales' && isSalesTeam && <SalesTeam onBack={() => setActiveTab('dashboard')} />}
      </main>
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

        {/* Catch all other routes */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} />
      </Routes>
    </Router>
  );
};

export default App;
