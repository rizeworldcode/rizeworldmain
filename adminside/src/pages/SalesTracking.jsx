import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  MapPin,
  Search,
  RefreshCw,
  Phone,
  Navigation,
  Maximize2,
  Download,
  FileText,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Navigation2
} from 'lucide-react';
import { getLiveLocations, getLocationHistory } from '../api';

// Set Mapbox Access Token
// @ts-ignore
const env = import.meta.env || {};
mapboxgl.accessToken = env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1Ijoicml6ZXdvcmxkIiwiYSI6ImNsdzF6cjhpZTA1NGQya21zcHphNDRxbmoifQ.placeholder_token';

const SalesTracking = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({}); // Stores marker instances keyed by employeeId
  const historyPhotoMarkersRef = useRef([]); // Stores photo markers on route history

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'online', 'offline'

  // Selected Employee Detail States
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [reverseGeocodedAddress, setReverseGeocodedAddress] = useState('Loading address...');
  const [isAddressLoading, setIsAddressLoading] = useState(false);

  // Route History States
  const [historyEmployeeId, setHistoryEmployeeId] = useState(null);
  const [selectedHistoryDate, setSelectedHistoryDate] = useState(new Date().toISOString().split('T')[0]);
  const [routeHistoryData, setRouteHistoryData] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  // Polling interval state
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  // Check if user is online (updated in last 2 minutes)
  const isOnline = (lastUpdated) => {
    if (!lastUpdated) return false;
    const diff = Date.now() - new Date(lastUpdated).getTime();
    return diff < 120000; // 2 minutes in ms
  };

  // Fetch Live Location data from backend
  const fetchLiveTrackingData = async () => {
    try {
      const result = await getLiveLocations();
      if (result.success) {
        setEmployees(result.data);
      }
    } catch (err) {
      console.error('Error fetching live locations:', err);
    } finally {
      setLoading(false);
      setLastRefreshed(new Date());
    }
  };

  // Reverse Geocoding via Mapbox API
  const reverseGeocode = async (lng, lat) => {
    setIsAddressLoading(true);
    setReverseGeocodedAddress('Retrieving current address...');
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      if (data && data.features && data.features.length > 0) {
        setReverseGeocodedAddress(data.features[0].place_name);
      } else {
        setReverseGeocodedAddress('Address not found');
      }
    } catch (err) {
      console.error('Reverse geocoding error:', err);
      setReverseGeocodedAddress('Failed to retrieve address');
    } finally {
      setIsAddressLoading(false);
    }
  };

  // Initialize Mapbox map on component mount
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const token = env.VITE_MAPBOX_ACCESS_TOKEN;
    const isTokenPlaceholder = !token ||
      !token.startsWith('pk.') ||
      token.includes('placeholder') ||
      token.includes('your_mapbox_token') ||
      token.trim() === '';

    if (isTokenPlaceholder) {
      // Load initial data
      fetchLiveTrackingData();
      // Auto-refresh every 10 seconds
      const interval = setInterval(fetchLiveTrackingData, 10000);
      return () => {
        clearInterval(interval);
      };
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [78.9629, 20.5937], // Default center of India
      zoom: 4
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    mapRef.current = map;

    // Load initial data
    fetchLiveTrackingData();

    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchLiveTrackingData, 10000);

    return () => {
      clearInterval(interval);
      if (mapRef.current) {
        map.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update Markers on map when employee locations change
  useEffect(() => {
    if (!mapRef.current || !employees) return;

    const map = mapRef.current;
    const currentLiveIds = new Set();

    employees.forEach((emp) => {
      const { employeeId, employeeName, latitude, longitude, lastUpdated } = emp;
      currentLiveIds.add(employeeId);

      const online = isOnline(lastUpdated);

      // Element for custom marker design
      const el = document.createElement('div');
      el.className = `w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-lg cursor-pointer transition-all ${online ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
        }`;
      el.innerHTML = `<span class="text-white text-xs font-bold font-sans">${employeeName.charAt(0)}</span>`;

      // If marker already exists, update position smoothly
      if (markersRef.current[employeeId]) {
        markersRef.current[employeeId].setLngLat([longitude, latitude]);

        // Update marker DOM element background
        const markerElement = markersRef.current[employeeId].getElement();
        markerElement.className = `w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-lg cursor-pointer transition-all ${online ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
          }`;
      } else {
        // Create new marker instance
        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([longitude, latitude])
          .addTo(map);

        // Click marker action
        el.addEventListener('click', () => {
          setSelectedEmployee(emp);
          reverseGeocode(longitude, latitude);
        });

        markersRef.current[employeeId] = marker;
      }
    });

    // Remove stale markers for employees no longer in live list
    Object.keys(markersRef.current).forEach((id) => {
      if (!currentLiveIds.has(id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });
  }, [employees]);

  // Fit all markers in viewport
  const fitAllMarkers = () => {
    if (!mapRef.current || employees.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();
    employees.forEach((emp) => {
      bounds.extend([emp.longitude, emp.latitude]);
    });

    mapRef.current.fitBounds(bounds, { padding: 50, maxZoom: 14 });
  };

  // Zoom to specific employee location
  const zoomToEmployee = (emp) => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: [emp.longitude, emp.latitude],
      zoom: 15,
      essential: true
    });
    setSelectedEmployee(emp);
    reverseGeocode(emp.longitude, emp.latitude);
  };

  // Handle Filtering & Searching
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch = emp.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
      const online = isOnline(emp.lastUpdated);

      if (filterType === 'online') return matchesSearch && online;
      if (filterType === 'offline') return matchesSearch && !online;
      return matchesSearch;
    });
  }, [employees, searchQuery, filterType]);

  // Fetch Route History and Draw on Map
  const loadRouteHistory = async (empId, date) => {
    if (!mapRef.current || !empId) return;
    setIsHistoryLoading(true);
    try {
      const result = await getLocationHistory(empId, date);
      if (result.success) {
        setRouteHistoryData(result.data);
        drawHistoryRoute(result.data);
      }
    } catch (err) {
      console.error('Error fetching route history:', err);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  // Draw History Route using Mapbox Line Layer
  const drawHistoryRoute = (points) => {
    const map = mapRef.current;
    if (!map) return;

    // Clean existing layer/source if any
    if (map.getLayer('route')) map.removeLayer('route');
    if (map.getSource('route')) map.removeSource('route');
    if (map.getLayer('start-point')) map.removeLayer('start-point');
    if (map.getSource('start-point')) map.removeSource('start-point');

    // Clean existing photo markers
    historyPhotoMarkersRef.current.forEach(m => m.remove());
    historyPhotoMarkersRef.current = [];

    if (!points || points.length === 0) return;

    const coordinates = points.map(p => [p.longitude, p.latitude]);

    // Add route source
    map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates
        }
      }
    });

    // Add route line layer
    map.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#3b82f6',
        'line-width': 4,
        'line-opacity': 0.8
      }
    });

    // Add starting point source and layer
    map.addSource('start-point', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: coordinates[0]
        }
      }
    });

    map.addLayer({
      id: 'start-point',
      type: 'circle',
      source: 'start-point',
      paint: {
        'circle-radius': 6,
        'circle-color': '#10b981',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff'
      }
    });

    // Add photo markers
    const photoPoints = points.filter(p => p.photoUrl);
    photoPoints.forEach(p => {
      const el = document.createElement('div');
      el.className = 'w-10 h-10 rounded-full border-2 border-white flex items-center justify-center shadow-lg cursor-pointer bg-blue-500 hover:bg-blue-600 transition-all z-20';
      el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>';

      let imgUrl;
      if (p.photoUrl.startsWith('http://') || p.photoUrl.startsWith('https://')) {
        imgUrl = p.photoUrl;
      } else {
        const baseUrl = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
          ? 'http://localhost:45000'
          : 'https://rizeworldmain.onrender.com';
        const photoPath = p.photoUrl.startsWith('/') ? p.photoUrl.slice(1) : p.photoUrl;
        imgUrl = `${baseUrl}/public-file?path=${photoPath}`;
      }

      const popup = new mapboxgl.Popup({ offset: 25, closeButton: true, className: 'photo-popup' }).setHTML(`
        <div class="p-2 space-y-2 min-w-[200px]">
          <img src="${imgUrl}" alt="Location Photo" class="w-full h-auto rounded-lg shadow-md block object-cover" style="min-height: 150px; background: #eee;" />
          <p class="text-xs font-bold text-gray-800 text-center">${new Date(p.timestamp).toLocaleTimeString()}</p>
        </div>
      `);

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([p.longitude, p.latitude])
        .setPopup(popup)
        .addTo(map);

      historyPhotoMarkersRef.current.push(marker);
    });

    // Fit bounds to route
    const bounds = new mapboxgl.LngLatBounds();
    coordinates.forEach(coord => bounds.extend(coord));
    map.fitBounds(bounds, { padding: 40, maxZoom: 15 });
  };

  // Export Route History as CSV
  const exportRouteHistoryCSV = (empName) => {
    if (routeHistoryData.length === 0) {
      alert('No history data available to export');
      return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Employee ID,Name,Timestamp,Latitude,Longitude,Accuracy,Speed\n';

    routeHistoryData.forEach((row) => {
      csvContent += `${row.employeeId},${row.employeeName},${new Date(row.timestamp).toLocaleString()},${row.latitude},${row.longitude},${row.accuracy || 'N/A'},${row.speed || 'N/A'}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `route_history_${empName.replace(/\s+/g, '_')}_${selectedHistoryDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export PDF Report of Route History
  const exportRouteHistoryPDF = (empName) => {
    if (routeHistoryData.length === 0) {
      alert('No history data available to export');
      return;
    }
    // Print window triggers browser print layout
    window.print();
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <MapPin className="text-blue-500" /> Sales Team Live Tracking
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Real-time tracking and route history analysis</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={fetchLiveTrackingData}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white font-bold text-sm hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button
            onClick={fitAllMarkers}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md"
          >
            <Maximize2 size={16} />
            <span>Fit All Markers</span>
          </button>
        </div>
      </div>

      {/* Main Map & Dashboard Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left Column: Filter and Employee List */}
        <div className="xl:col-span-1 space-y-6 flex flex-col max-h-[80vh]">
          {/* Controls Box */}
          <div className="bg-white dark:bg-[#111] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search Employee..."
                className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl pl-11 pr-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 p-1 bg-gray-100 dark:bg-white/5 rounded-2xl">
              {['all', 'online', 'offline'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl capitalize transition-all ${filterType === type
                    ? 'bg-white dark:bg-white/10 text-blue-600 dark:text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* List Scroll Container */}
          <div className="bg-white dark:bg-[#111] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm flex-1 overflow-y-auto min-h-[40vh] space-y-3">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
              Sales Staff ({filteredEmployees.length})
            </h3>

            {filteredEmployees.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-sm">
                No matching sales employees.
              </div>
            ) : (
              filteredEmployees.map((emp) => {
                const online = isOnline(emp.lastUpdated);
                return (
                  <motion.div
                    key={emp.employeeId}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => zoomToEmployee(emp)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${selectedEmployee?.employeeId === emp.employeeId
                      ? 'bg-blue-50/50 dark:bg-white/5 border-blue-500/30'
                      : 'bg-gray-50 dark:bg-white/5 border-transparent hover:border-gray-200 dark:hover:border-white/10'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${online ? 'bg-emerald-500' : 'bg-gray-400'
                        }`}>
                        {emp.employeeName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">{emp.employeeName}</h4>
                        <p className="text-[10px] text-gray-500 font-medium">ID: {emp.employeeId}</p>
                      </div>
                    </div>
                    <span className={`w-2.5 h-2.5 rounded-full ${online ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Center/Right: Mapbox Map Container */}
        <div className="xl:col-span-3 space-y-6 flex flex-col h-[80vh]">
          <div className="bg-white dark:bg-[#111] rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden flex-1 relative min-h-[50vh]">
            <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

            {/* If token is placeholder or missing, show overlay explanation */}
            {(!env.VITE_MAPBOX_ACCESS_TOKEN ||
              !env.VITE_MAPBOX_ACCESS_TOKEN.startsWith('pk.') ||
              env.VITE_MAPBOX_ACCESS_TOKEN.includes('placeholder') ||
              env.VITE_MAPBOX_ACCESS_TOKEN.includes('your_mapbox_token') ||
              env.VITE_MAPBOX_ACCESS_TOKEN.trim() === '') && (
                <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-8 text-center">
                  <AlertCircle className="w-16 h-16 text-yellow-500 animate-bounce mb-4" />
                  <h3 className="text-2xl font-black text-white mb-2">Mapbox Access Token Required</h3>
                  <p className="text-gray-300 max-w-md text-sm leading-relaxed mb-6">
                    Real-time mapping requires a valid Mapbox Public Access Token. Please add <code className="bg-black/40 px-2 py-1 rounded text-yellow-400 font-mono">VITE_MAPBOX_ACCESS_TOKEN</code> to your <code className="bg-black/40 px-2 py-1 rounded text-yellow-400 font-mono">adminside/.env</code> file and restart the development server.
                  </p>
                  <div className="bg-white/10 text-xs text-left p-4 rounded-xl border border-white/15 text-gray-200 font-mono">
                    # Example adminside/.env configuration:<br />
                    VITE_MAPBOX_ACCESS_TOKEN=pk.ey...your_mapbox_token_here
                  </div>
                </div>
              )}

            {/* Float HUD card for selected employee */}
            <AnimatePresence>
              {selectedEmployee && (
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 50, scale: 0.95 }}
                  className="absolute bottom-6 left-6 right-6 bg-white/95 dark:bg-[#111]/95 backdrop-blur-md p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl max-w-2xl z-10 flex flex-col md:flex-row gap-6"
                >
                  <div className="flex-1 space-y-4 text-left">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                        {selectedEmployee.employeeName}
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${isOnline(selectedEmployee.lastUpdated) ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                          {isOnline(selectedEmployee.lastUpdated) ? 'Online' : 'Offline'}
                        </span>
                      </h3>
                      <button
                        onClick={() => setSelectedEmployee(null)}
                        className="text-gray-400 hover:text-gray-700 dark:hover:text-white font-bold text-sm p-1"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <p className="text-gray-400 uppercase font-black tracking-widest text-[9px]">Employee ID</p>
                        <p className="font-bold text-gray-900 dark:text-white mt-0.5">{selectedEmployee.employeeId}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 uppercase font-black tracking-widest text-[9px]">Mobile Number</p>
                        <p className="font-bold text-gray-900 dark:text-white mt-0.5 flex items-center gap-1">
                          <Phone size={10} /> {selectedEmployee.phone || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 uppercase font-black tracking-widest text-[9px]">Speed / Heading</p>
                        <p className="font-bold text-gray-900 dark:text-white mt-0.5">
                          {selectedEmployee.speed ? `${Math.round(selectedEmployee.speed * 3.6)} km/h` : '0 km/h'}
                          {selectedEmployee.heading ? ` (${Math.round(selectedEmployee.heading)}°)` : ''}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 uppercase font-black tracking-widest text-[9px]">Accuracy</p>
                        <p className="font-bold text-gray-900 dark:text-white mt-0.5">
                          {selectedEmployee.accuracy ? `± ${Math.round(selectedEmployee.accuracy)} m` : 'N/A'}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-400 uppercase font-black tracking-widest text-[9px]">Last Updated</p>
                        <p className="font-bold text-gray-900 dark:text-white mt-0.5 flex items-center gap-1">
                          <Clock size={10} /> {new Date(selectedEmployee.lastUpdated).toLocaleString('en-US', { hour12: true })}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 dark:border-white/5">
                      <p className="text-gray-400 uppercase font-black tracking-widest text-[9px]">Current Location Address</p>
                      <p className="font-bold text-gray-900 dark:text-white mt-1 text-xs">
                        {isAddressLoading ? 'Reverse geocoding coordinates...' : reverseGeocodedAddress}
                      </p>
                    </div>
                  </div>

                  {/* Route History Tab inside Popup */}
                  <div className="md:w-60 border-t md:border-t-0 md:border-l border-gray-100 dark:border-white/5 pt-4 md:pt-0 md:pl-6 flex flex-col justify-between">
                    <div className="space-y-3 text-left">
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Route Analysis</h4>
                      <input
                        type="date"
                        className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white outline-none"
                        value={selectedHistoryDate}
                        onChange={(e) => setSelectedHistoryDate(e.target.value)}
                      />
                      <button
                        onClick={() => {
                          setHistoryEmployeeId(selectedEmployee.employeeId);
                          loadRouteHistory(selectedEmployee.employeeId, selectedHistoryDate);
                        }}
                        className="w-full flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all"
                      >
                        <Navigation2 size={12} />
                        <span>Draw Route</span>
                      </button>
                    </div>

                    {routeHistoryData.length > 0 && historyEmployeeId === selectedEmployee.employeeId && (
                      <div className="pt-4 flex gap-2">
                        <button
                          onClick={() => exportRouteHistoryCSV(selectedEmployee.employeeName)}
                          className="flex-1 flex items-center justify-center gap-1 p-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white hover:bg-gray-200 text-[10px] font-bold"
                        >
                          <Download size={10} />
                          <span>CSV</span>
                        </button>
                        <button
                          onClick={() => exportRouteHistoryPDF(selectedEmployee.employeeName)}
                          className="flex-1 flex items-center justify-center gap-1 p-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white hover:bg-gray-200 text-[10px] font-bold"
                        >
                          <FileText size={10} />
                          <span>PDF</span>
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesTracking;
