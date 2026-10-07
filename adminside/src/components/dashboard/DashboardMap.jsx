import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  RefreshCw,
  Camera,
  CreditCard,
  Navigation,
  Users,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { getLiveLocations } from '../../api';

const DashboardMap = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');

  const isOnline = (lastUpdated) => {
    if (!lastUpdated) return false;
    const diff = Date.now() - new Date(lastUpdated).getTime();
    return diff < 120000;
  };

  const fetchLiveTrackingData = async () => {
    try {
      setLoading(true);
      const result = await getLiveLocations();
      if (result && result.success) {
        setEmployees(result.data || []);
      }
    } catch (err) {
      console.error('Error fetching live locations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveTrackingData();
    const interval = setInterval(fetchLiveTrackingData, 20000);
    return () => clearInterval(interval);
  }, []);

  const onlineCount = useMemo(() => {
    return employees.filter(emp => isOnline(emp.lastUpdated)).length;
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const online = isOnline(emp.lastUpdated);
      if (filterType === 'online') return online;
      if (filterType === 'offline') return !online;
      return true;
    });
  }, [employees, filterType]);

  return (
    <section className="w-full bg-white dark:bg-[#111] p-5 sm:p-6 rounded-[2rem] border border-gray-200/50 dark:border-white/5 shadow-xl space-y-5">
      {/* Top Header & Sales Action / Redirection Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title & Info */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 shrink-0">
            <Navigation size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                Sales Team Hub & Live Tracking
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {onlineCount} Online Now
              </span>
            </div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">
              Quick access to live GPS route tracking, field photos, and client visiting cards
            </p>
          </div>
        </div>

        {/* Sales Navigation & Redirection Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={fetchLiveTrackingData}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-200 dark:hover:bg-white/10 transition-all cursor-pointer"
            title="Refresh Live Status"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={() => navigate('/tracking')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/25 hover:scale-[1.02] active:scale-100 transition-all cursor-pointer"
            title="Open Full Live GPS Map"
          >
            <MapPin size={15} />
            <span>Sales Live GPS</span>
            <ExternalLink size={12} className="opacity-70" />
          </button>

          <button
            onClick={() => navigate('/tracking/photos')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-600 border border-purple-500/20 text-purple-600 dark:text-purple-400 hover:text-white font-bold text-xs shadow-sm hover:shadow-purple-500/25 transition-all cursor-pointer"
            title="View Sales Photos"
          >
            <Camera size={15} />
            <span>Sales Photos</span>
          </button>

          <button
            onClick={() => navigate('/tracking/cards')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-600 border border-amber-500/20 text-amber-600 dark:text-amber-400 hover:text-white font-bold text-xs shadow-sm hover:shadow-amber-500/25 transition-all cursor-pointer"
            title="View Visiting Cards"
          >
            <CreditCard size={15} />
            <span>Visiting Cards</span>
          </button>
        </div>
      </div>

      {/* Staff Live Status Pills & Filter Bar */}
      <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1 p-1 bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200/50 dark:border-white/5">
            {[
              { id: 'all', label: `All (${employees.length})` },
              { id: 'online', label: `Online (${onlineCount})` },
              { id: 'offline', label: `Offline (${employees.length - onlineCount})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1 text-xs font-bold rounded-lg capitalize transition-all cursor-pointer ${
                  filterType === tab.id
                    ? 'bg-white dark:bg-white/10 text-blue-600 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Staff Pills */}
        {filteredEmployees.length > 0 ? (
          <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1 scrollbar-none">
            {filteredEmployees.map((emp) => {
              const online = isOnline(emp.lastUpdated);
              return (
                <button
                  key={emp.employeeId}
                  onClick={() => navigate('/tracking')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-gray-50 dark:bg-white/5 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-white/10 hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 shrink-0 transition-all cursor-pointer text-xs font-bold"
                  title={`Click to track ${emp.employeeName} on map`}
                >
                  <span className={`w-2 h-2 rounded-full ${online ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                  <span>{emp.employeeName || 'Staff Member'}</span>
                  <span className="text-[10px] text-gray-400 font-normal">
                    {online ? 'Active' : 'Offline'}
                  </span>
                  <ChevronRight size={12} className="text-gray-400" />
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
            <Users size={14} />
            <span>No sales staff matching this filter</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default DashboardMap;
