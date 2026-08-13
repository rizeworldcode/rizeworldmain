import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  MapPin,
  RefreshCw,
  Maximize2,
  AlertCircle,
  Navigation,
  Camera,
  CreditCard
} from 'lucide-react';
import { getLiveLocations } from '../../api';

// @ts-ignore
const env = (import.meta && import.meta.env) ? import.meta.env : {};
mapboxgl.accessToken = env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1Ijoicml6ZXdvcmxkIiwiYSI6ImNsdzF6cjhpZTA1NGQya21zcHphNDRxbmoifQ.placeholder_token';

const DashboardMap = () => {
  const navigate = useNavigate();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
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
        setEmployees(result.data);
      }
    } catch (err) {
      console.error('Error fetching live locations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [78.9629, 20.5937],
      zoom: 4
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    mapRef.current = map;

    fetchLiveTrackingData();
    const interval = setInterval(fetchLiveTrackingData, 10000);

    return () => {
      clearInterval(interval);
      if (mapRef.current) {
        map.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !employees) return;

    const map = mapRef.current;
    const currentLiveIds = new Set();

    employees.forEach((emp) => {
      const { employeeId, employeeName, latitude, longitude, lastUpdated } = emp;
      currentLiveIds.add(employeeId);
      const online = isOnline(lastUpdated);

      const el = document.createElement('div');
      el.className = `w-9 h-9 rounded-full border-2 border-white flex items-center justify-center shadow-lg cursor-pointer transition-all ${
        online ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
      }`;
      el.innerHTML = `<span class="text-white text-xs font-bold font-sans">${(employeeName || 'E').charAt(0)}</span>`;

      if (markersRef.current[employeeId]) {
        markersRef.current[employeeId].setLngLat([longitude, latitude]);
        const markerElement = markersRef.current[employeeId].getElement();
        markerElement.className = `w-9 h-9 rounded-full border-2 border-white flex items-center justify-center shadow-lg cursor-pointer transition-all ${
          online ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
        }`;
      } else {
        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([longitude, latitude])
          .addTo(map);

        el.addEventListener('click', () => {
          setSelectedEmployee(emp);
        });

        markersRef.current[employeeId] = marker;
      }
    });

    Object.keys(markersRef.current).forEach((id) => {
      if (!currentLiveIds.has(id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });
  }, [employees]);

  const fitAllMarkers = () => {
    if (!mapRef.current || employees.length === 0) return;
    const bounds = new mapboxgl.LngLatBounds();
    employees.forEach((emp) => {
      bounds.extend([emp.longitude, emp.latitude]);
    });
    mapRef.current.fitBounds(bounds, { padding: 50, maxZoom: 14 });
  };

  const zoomToEmployee = (emp) => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: [emp.longitude, emp.latitude],
      zoom: 15,
      essential: true
    });
    setSelectedEmployee(emp);
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const online = isOnline(emp.lastUpdated);
      if (filterType === 'online') return online;
      if (filterType === 'offline') return !online;
      return true;
    });
  }, [employees, filterType]);

  return (
    <section className="w-full bg-white dark:bg-[#111] p-4 sm:p-5 rounded-[2rem] border border-gray-200/50 dark:border-white/5 shadow-xl space-y-3.5">
      {/* Integrated Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
            <MapPin size={20} />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">Sales Team Live Tracking</h2>
            <p className="text-[11px] font-medium text-gray-500">Real-time GPS locations of active sales staff across India</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Staff Quick Pills inside header */}
          {filteredEmployees.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full lg:max-w-md py-0.5 scrollbar-none">
              {filteredEmployees.map(emp => {
                const online = isOnline(emp.lastUpdated);
                const isSelected = selectedEmployee?.employeeId === emp.employeeId;
                return (
                  <button
                    key={emp.employeeId}
                    onClick={() => zoomToEmployee(emp)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border shrink-0 transition-all cursor-pointer text-xs font-bold ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-white/10 hover:border-blue-500/40'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${online ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                    <span>{emp.employeeName}</span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex gap-1 p-0.5 bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200/50 dark:border-white/5">
            {['all', 'online', 'offline'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg capitalize transition-all ${
                  filterType === type
                    ? 'bg-white dark:bg-white/10 text-blue-600 dark:text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <button
            onClick={fetchLiveTrackingData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 text-gray-700 dark:text-white font-bold text-xs hover:bg-gray-200 dark:hover:bg-white/10 transition-all cursor-pointer"
            title="Refresh Map Data"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={fitAllMarkers}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-sm cursor-pointer"
            title="Fit All Markers in View"
          >
            <Maximize2 size={13} />
            <span className="hidden sm:inline">Fit Markers</span>
          </button>

          <button
            onClick={() => navigate('/tracking/photos')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-600 border border-purple-500/20 text-purple-600 dark:text-purple-400 hover:text-white font-bold text-xs transition-all shadow-sm cursor-pointer"
            title="View Sales Photos"
          >
            <Camera size={13} />
            <span>Sales Photos</span>
          </button>

          <button
            onClick={() => navigate('/tracking/cards')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-600 border border-amber-500/20 text-amber-600 dark:text-amber-400 hover:text-white font-bold text-xs transition-all shadow-sm cursor-pointer"
            title="View Visiting Cards"
          >
            <CreditCard size={13} />
            <span>Visiting Cards</span>
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="w-full h-[400px] sm:h-[440px] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden relative">
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

        {(!env.VITE_MAPBOX_ACCESS_TOKEN ||
          !env.VITE_MAPBOX_ACCESS_TOKEN.startsWith('pk.') ||
          env.VITE_MAPBOX_ACCESS_TOKEN.includes('placeholder') ||
          env.VITE_MAPBOX_ACCESS_TOKEN.includes('your_mapbox_token') ||
          env.VITE_MAPBOX_ACCESS_TOKEN.trim() === '') && (
            <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-8 text-center">
              <AlertCircle className="w-12 h-12 text-yellow-500 animate-bounce mb-3" />
              <h3 className="text-xl font-black text-white mb-1">Mapbox Access Token Required</h3>
              <p className="text-gray-300 max-w-md text-xs leading-relaxed">
                Add <code className="bg-black/40 px-2 py-0.5 rounded text-yellow-400 font-mono">VITE_MAPBOX_ACCESS_TOKEN</code> to your <code className="bg-black/40 px-2 py-0.5 rounded text-yellow-400 font-mono">adminside/.env</code> file.
              </p>
            </div>
          )}

        {selectedEmployee && (
          <div className="absolute bottom-6 left-6 z-10 glass p-4 rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl backdrop-blur-md max-w-xs space-y-2">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                  isOnline(selectedEmployee.lastUpdated) ? 'bg-emerald-500' : 'bg-rose-500'
                }`}>
                  {(selectedEmployee.employeeName || 'E').charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">{selectedEmployee.employeeName}</h4>
                  <p className="text-[10px] text-gray-400 font-mono">ID: {selectedEmployee.employeeId}</p>
                </div>
              </div>
              <button onClick={() => setSelectedEmployee(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-xs">✕</button>
            </div>
            <div className="text-[11px] text-gray-500 font-medium space-y-1">
              <p className="flex items-center gap-1"><Navigation size={12} className="text-blue-500" /> Lat: {selectedEmployee.latitude?.toFixed(4)}, Lng: {selectedEmployee.longitude?.toFixed(4)}</p>
              <p className="text-[10px] text-gray-400">Last updated: {selectedEmployee.lastUpdated ? new Date(selectedEmployee.lastUpdated).toLocaleTimeString() : 'N/A'}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DashboardMap;
