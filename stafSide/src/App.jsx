import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import StaffLogin from './pages/StaffLogin';

const MainLayout = ({ onLogout }) => {
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
        <div className="w-10 h-10 bg-gradient-to-br from-[#8b5cf6] to-[#f472b6] rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
          <span className="text-white font-black text-lg">R</span>
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
        <Dashboard />
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
