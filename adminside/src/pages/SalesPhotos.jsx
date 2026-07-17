import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Calendar, 
  MapPin, 
  Search, 
  RefreshCw, 
  ZoomIn, 
  ExternalLink, 
  X, 
  User, 
  Clock,
  Compass,
  ArrowRight
} from 'lucide-react';
import { getLocationPhotos } from '../api';

export default function SalesPhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  
  // Lightbox / Selected Photo Modal
  const [activePhoto, setActivePhoto] = useState(null);

  const fetchPhotos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getLocationPhotos();
      if (response.success) {
        setPhotos(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch photos');
      }
    } catch (err) {
      console.error(err);
      setError('Network error: Could not fetch photos list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const getImageUrl = (photoUrl) => {
    if (!photoUrl) return '';
    if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
      return photoUrl;
    }
    const baseUrl = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:45000'
      : 'https://rizeworldmain.onrender.com';
    const photoPath = photoUrl.startsWith('/') ? photoUrl.slice(1) : photoUrl;
    return `${baseUrl}/public-file?path=${photoPath}`;
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filtered List
  const filteredPhotos = photos.filter(p => {
    const nameMatch = p.employeeName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let dateMatch = true;
    if (selectedDate) {
      const photoDateStr = new Date(p.timestamp).toISOString().split('T')[0];
      dateMatch = photoDateStr === selectedDate;
    }
    
    return nameMatch && dateMatch;
  });

  // Stats Calculations
  const totalCaptures = photos.length;
  const uniqueStaffCount = new Set(photos.map(p => p.employeeId)).size;
  const latestUpload = photos.length > 0 ? photos[0].timestamp : null;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <Camera size={32} className="text-blue-600 dark:text-blue-500" />
            Field Verification Gallery
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            Real-time live snapshot logs captured by the Sales Team with high-accuracy GPS logs.
          </p>
        </div>
        
        <button
          onClick={fetchPhotos}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-2xl font-bold text-sm text-gray-700 dark:text-gray-200 shadow-sm transition-all disabled:opacity-50 active:scale-95"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh Feed
        </button>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="clay-card p-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Captures</span>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-2xl text-blue-600 dark:text-blue-400">
              <Camera size={20} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-gray-900 dark:text-white">{totalCaptures}</span>
            <p className="text-xs text-gray-400 mt-1">Images saved in records</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="clay-card p-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Active Field Staff</span>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl text-indigo-600 dark:text-indigo-400">
              <User size={20} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-gray-900 dark:text-white">{uniqueStaffCount}</span>
            <p className="text-xs text-gray-400 mt-1">Staff members represented</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="clay-card p-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Latest Activity</span>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl text-emerald-600 dark:text-emerald-400">
              <Clock size={20} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xl font-black text-gray-900 dark:text-white truncate block">
              {latestUpload ? `${formatDate(latestUpload)} ${formatTime(latestUpload)}` : 'No activity yet'}
            </span>
            <p className="text-xs text-gray-400 mt-1">Most recent check-in snapshot</p>
          </div>
        </motion.div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row gap-4 p-5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl shadow-sm">
        {/* Search bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by staff name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-150 dark:border-white/10 rounded-2xl text-sm font-semibold text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Date Filter */}
        <div className="relative min-w-[200px]">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-150 dark:border-white/10 rounded-2xl text-sm font-semibold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
          />
        </div>

        {/* Clear Filters */}
        {(searchTerm || selectedDate) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedDate('');
            }}
            className="px-4 py-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-bold text-sm rounded-2xl hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Error View */}
      {error && (
        <div className="p-6 bg-rose-50 dark:bg-rose-950/10 border-2 border-rose-200 dark:border-rose-950/30 rounded-3xl text-rose-600 dark:text-rose-400 font-bold text-center">
          <p>{error}</p>
        </div>
      )}

      {/* Grid Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-bold">Retrieving field photo logs...</p>
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="clay-card bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-12 text-center rounded-3xl flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 text-gray-400 rounded-3xl flex items-center justify-center mb-4">
            <Camera size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">No captured photos found</h3>
          <p className="text-gray-400 text-sm max-w-sm mt-2">
            {searchTerm || selectedDate 
              ? "We couldn't find any photo entries matching your search filter parameters."
              : "No verification photos have been captured by sales employees yet."
            }
          </p>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredPhotos.map((photo) => {
              const displayUrl = getImageUrl(photo.photoUrl);
              return (
                <motion.div
                  key={photo._id || photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  className="clay-card bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden group shadow-sm hover:shadow-md transition-all flex flex-col"
                >
                  {/* Image container */}
                  <div className="relative w-full aspect-[4/3] bg-gray-100 dark:bg-white/5 overflow-hidden">
                    <img 
                      src={displayUrl} 
                      alt={`Captured by ${photo.employeeName}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={() => setActivePhoto(photo)}
                        className="p-3 bg-white text-gray-900 rounded-full hover:scale-110 transition-transform shadow-lg"
                        title="Enlarge View"
                      >
                        <ZoomIn size={18} />
                      </button>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${photo.latitude},${photo.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-blue-600 text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                        title="View on Google Maps"
                      >
                        <ExternalLink size={18} />
                      </a>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                          {photo.employeeName?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white truncate max-w-[150px]">{photo.employeeName}</h4>
                          <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase">Sales Team</span>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2 border-t border-gray-100 dark:border-white/5 pt-3 text-xs font-semibold text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400 shrink-0" />
                          <span>{formatDate(photo.timestamp)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-gray-400 shrink-0" />
                          <span>{formatTime(photo.timestamp)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-gray-400 shrink-0" />
                          <span className="truncate">
                            {photo.latitude.toFixed(5)}, {photo.longitude.toFixed(5)}
                            {photo.accuracy && ` (±${photo.accuracy.toFixed(0)}m)`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-gray-100 dark:border-white/5 flex gap-2">
                      <button
                        onClick={() => setActivePhoto(photo)}
                        className="flex-1 py-2 px-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 font-bold text-xs rounded-xl transition-colors text-center"
                      >
                        Inspect
                      </button>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${photo.latitude},${photo.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 px-3 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/40 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
                      >
                        Map Link
                        <ArrowRight size={12} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Lightbox / Inspector Dialog */}
      <AnimatePresence>
        {activePhoto && (
          <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="clay-card max-w-4xl w-full bg-white dark:bg-[#0c0c0c] rounded-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Close button */}
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 w-10 h-10 clay-flat rounded-2xl flex items-center justify-center text-black dark:text-white hover:clay-inset hover:text-rose-500 transition-all z-10"
              >
                <X size={20} />
              </button>

              {/* Large Image container */}
              <div className="flex-1 bg-black flex items-center justify-center relative overflow-hidden md:h-auto min-h-[300px]">
                <img
                  src={getImageUrl(activePhoto.photoUrl)}
                  alt={`Captured by ${activePhoto.employeeName}`}
                  className="w-full h-full object-contain max-h-[50vh] md:max-h-[80vh]"
                />
              </div>

              {/* Detail side bar */}
              <div className="w-full md:w-80 p-6 md:p-8 flex flex-col justify-between bg-white dark:bg-[#0c0c0c] border-t md:border-t-0 md:border-l border-gray-150 dark:border-white/10 overflow-y-auto">
                <div className="space-y-6">
                  {/* Staff Info */}
                  <div>
                    <span className="text-[10px] text-gray-400 font-black tracking-wider uppercase block mb-1">Captured By</span>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-lg shadow-sm">
                        {activePhoto.employeeName?.charAt(0) || 'S'}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white">{activePhoto.employeeName}</h3>
                        <p className="text-xs font-bold text-blue-600 dark:text-blue-400">Sales Representative</p>
                      </div>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-white/5">
                    <div>
                      <span className="text-[10px] text-gray-400 font-black tracking-wider uppercase block mb-1">Date & Time</span>
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-200">
                        <Calendar size={16} className="text-gray-400" />
                        <span>{formatDate(activePhoto.timestamp)}</span>
                        <span className="text-gray-300 dark:text-white/10">|</span>
                        <Clock size={16} className="text-gray-400" />
                        <span>{formatTime(activePhoto.timestamp)}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-400 font-black tracking-wider uppercase block mb-1">Coordinates</span>
                      <div className="flex items-start gap-2 text-sm font-bold text-gray-700 dark:text-gray-200">
                        <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                        <div>
                          <p>Lat: {activePhoto.latitude.toFixed(6)}</p>
                          <p>Lng: {activePhoto.longitude.toFixed(6)}</p>
                          {activePhoto.accuracy && (
                            <p className="text-xs text-gray-400 mt-0.5">Accuracy radius: ±{activePhoto.accuracy.toFixed(1)} meters</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* External Actions */}
                <div className="pt-6 border-t border-gray-100 dark:border-white/5 space-y-3 mt-6">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${activePhoto.latitude},${activePhoto.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-sm rounded-2xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Compass size={16} />
                    Open In Google Maps
                  </a>
                  <button
                    onClick={() => setActivePhoto(null)}
                    className="w-full py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 font-black text-sm rounded-2xl transition-colors"
                  >
                    Close Inspector
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
