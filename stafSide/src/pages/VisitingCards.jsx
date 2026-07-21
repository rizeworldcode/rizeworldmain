import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
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
  ArrowRight,
  Phone,
  Mail,
  Building,
  Copy,
  Check,
  ArrowLeft
} from 'lucide-react';

export default function VisitingCards({ onBack }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  
  // Lightbox / Selected Card Modal
  const [activeCard, setActiveCard] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const getApiUrl = (endpoint) => {
    const base = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:45000/api'
      : 'https://rizeworldmain.onrender.com/api';
    return `${base}${endpoint}`;
  };

  const fetchCards = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(getApiUrl('/visiting-card/all'));
      const result = await response.json();
      if (result.success) {
        setCards(result.data || []);
      } else {
        setError(result.message || 'Failed to fetch visiting cards');
      }
    } catch (err) {
      console.error(err);
      setError('Network error: Could not fetch visiting cards.');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchCards();
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

  const handleCopyText = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Filtered List
  const filteredCards = cards.filter(c => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = c.employeeName?.toLowerCase().includes(searchLower);
    const cardNameMatch = c.cardData?.name?.toLowerCase().includes(searchLower);
    const cardCompanyMatch = c.cardData?.company?.toLowerCase().includes(searchLower);
    const cardPhoneMatch = c.cardData?.phone?.includes(searchTerm);
    const cardEmailMatch = c.cardData?.email?.toLowerCase().includes(searchLower);
    const rawTextMatch = c.cardData?.rawText?.toLowerCase().includes(searchLower);
    
    const matchesSearch = nameMatch || cardNameMatch || cardCompanyMatch || cardPhoneMatch || cardEmailMatch || rawTextMatch;
    
    let matchesDate = true;
    if (selectedDate) {
      const cardDateStr = new Date(c.timestamp).toISOString().split('T')[0];
      matchesDate = cardDateStr === selectedDate;
    }
    
    return matchesSearch && matchesDate;
  }).sort((a, b) => {
    const nameA = a.cardData?.company || a.cardData?.name || "";
    const nameB = b.cardData?.company || b.cardData?.name || "";
    return nameA.localeCompare(nameB);
  });

  // Summary Stats
  const totalScans = cards.length;
  
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const scansToday = cards.filter(c => new Date(c.timestamp) >= todayStart).length;

  const uniqueCompanies = new Set(
    cards
      .map(c => c.cardData?.company?.trim().toLowerCase())
      .filter(Boolean)
  ).size;

  return (
    <div className="space-y-8 pb-12 bg-white p-6 sm:p-8 rounded-3xl min-h-screen text-black shadow-inner">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          {onBack && (
            <button 
              onClick={onBack} 
              className="flex items-center gap-2 text-sm text-purple-600 font-bold uppercase tracking-wider mb-3 bg-transparent border-none cursor-pointer hover:text-purple-700 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
          )}
          <h1 className="text-3xl font-black text-black flex items-center gap-3">
            <CreditCard size={32} className="text-purple-600" />
            Field Visiting Cards
          </h1>
          <p className="text-gray-800 mt-2 font-medium">
            Browse and inspect business cards scanned by field staff along with location check-in details.
          </p>
        </div>
        
        <button
          onClick={fetchCards}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl font-bold text-sm text-black shadow-sm transition-all disabled:opacity-50 active:scale-95"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh Cards
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="clay-card p-6 bg-white border border-gray-200 rounded-3xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-800 uppercase tracking-wider">Total Scanned</span>
            <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
              <CreditCard size={20} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-black">{totalScans}</span>
            <p className="text-xs text-gray-600 mt-1">Cards registered in records</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="clay-card p-6 bg-white border border-gray-200 rounded-3xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-800 uppercase tracking-wider">Scans Today</span>
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
              <Calendar size={20} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-black">{scansToday}</span>
            <p className="text-xs text-gray-600 mt-1">Check-ins scanned today</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="clay-card p-6 bg-white border border-gray-200 rounded-3xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-800 uppercase tracking-wider">Unique Firms</span>
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
              <Building size={20} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-black">{uniqueCompanies}</span>
            <p className="text-xs text-gray-600 mt-1">Different firms logged</p>
          </div>
        </motion.div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 p-5 bg-white border border-gray-200 rounded-3xl shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
          <input
            type="text"
            placeholder="Search by company, person name, email, or representative..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-150 rounded-2xl text-sm font-semibold text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
        </div>

        <div className="relative min-w-[200px]">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-150 rounded-2xl text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer"
          />
        </div>

        {(searchTerm || selectedDate) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedDate('');
            }}
            className="px-4 py-3 bg-rose-50 text-rose-600 font-bold text-sm rounded-2xl hover:bg-rose-100 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="p-6 bg-rose-50 border-2 border-rose-200 rounded-3xl text-rose-600 font-bold text-center">
          <p>{error}</p>
        </div>
      )}

      {/* Loading & Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-800 font-bold">Retrieving visiting cards directory...</p>
        </div>
      ) : filteredCards.length === 0 ? (
        <div className="clay-card bg-white border border-gray-200 p-12 text-center rounded-3xl flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 bg-gray-100 text-gray-600 rounded-3xl flex items-center justify-center mb-4">
            <CreditCard size={28} />
          </div>
          <h3 className="text-xl font-bold text-black">No scanned cards found</h3>
          <p className="text-gray-600 text-sm max-w-sm mt-2">
            {searchTerm || selectedDate 
              ? "We couldn't find any card logs matching your filter search parameters."
              : "No visiting cards have been scanned by the sales team yet."
            }
          </p>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredCards.map((card) => {
              const displayUrl = getImageUrl(card.photoUrl);
              return (
                <motion.div
                  key={card._id || card.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  className="clay-card bg-white border border-gray-200 rounded-3xl overflow-hidden group shadow-sm hover:shadow-md transition-all flex flex-col"
                >
                  {/* Aspect ratio 1.75 matches visiting card */}
                  <div className="relative w-full aspect-[7/4] bg-gray-100 overflow-hidden border-b border-gray-100">
                    <img 
                      src={displayUrl} 
                      alt={`Card for ${card.cardData?.name || 'Contact'}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                      loading="lazy"
                    />
                    
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={() => setActiveCard(card)}
                        className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-lg"
                        title="Enlarge View"
                      >
                        <ZoomIn size={18} />
                      </button>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${card.latitude},${card.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-purple-600 text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                        title="View Scan Coordinates"
                      >
                        <ExternalLink size={18} />
                      </a>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] text-gray-600 font-bold tracking-wider uppercase block mb-0.5">Scanned Contact</span>
                        <h4 className="font-black text-lg text-black truncate">
                          {card.cardData?.name || 'Unknown Contact'}
                        </h4>
                        {card.cardData?.company && (
                          <p className="text-xs font-bold text-purple-600 flex items-center gap-1.5 mt-0.5">
                            <Building size={12} />
                            {card.cardData.company}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5 pt-2 text-xs font-semibold text-gray-900">
                        {card.cardData?.phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={13} className="text-gray-600 shrink-0" />
                            <span className="truncate">{card.cardData.phone}</span>
                          </div>
                        )}
                        {card.cardData?.email && (
                          <div className="flex items-center gap-2">
                            <Mail size={13} className="text-gray-600 shrink-0" />
                            <span className="truncate">{card.cardData.email}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Meta info bottom */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-purple-500 text-white font-bold flex items-center justify-center text-[10px]">
                          {card.employeeName?.charAt(0) || 'S'}
                        </div>
                        <span className="truncate max-w-[100px] text-black">{card.employeeName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={11} />
                        <span>{formatDate(card.timestamp)}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={() => setActiveCard(card)}
                        className="flex-1 py-2 px-3 bg-gray-50 hover:bg-gray-100 text-black font-bold text-xs rounded-xl transition-colors text-center"
                      >
                        Inspect details
                      </button>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${card.latitude},${card.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 bg-purple-50 text-purple-600 hover:bg-purple-100 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
                        title="Show on map"
                      >
                        Map Pin
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

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeCard && (
          <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="clay-card max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setActiveCard(null);
                  setCopiedField(null);
                }}
                className="absolute top-4 right-4 w-10 h-10 clay-flat rounded-2xl flex items-center justify-center text-black hover:clay-inset hover:text-rose-500 transition-all z-10"
              >
                <X size={20} />
              </button>

              {/* Large Image Area */}
              <div className="flex-1 bg-black flex items-center justify-center p-4 relative overflow-hidden md:h-auto min-h-[300px]">
                <img
                  src={getImageUrl(activeCard.photoUrl)}
                  alt="Visiting Card full preview"
                  className="w-full h-full object-contain max-h-[50vh] md:max-h-[80vh] rounded-xl"
                />
              </div>

              {/* Details Pane */}
              <div className="w-full md:w-80 p-6 md:p-8 flex flex-col justify-between bg-white border-t md:border-t-0 md:border-l border-gray-150 overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] text-gray-600 font-black tracking-wider uppercase block mb-1">Scanned Data Card</span>
                    <h3 className="text-xl font-black text-black leading-tight">
                      {activeCard.cardData?.name || 'No Name Scanned'}
                    </h3>
                    {activeCard.cardData?.company && (
                      <p className="text-sm font-bold text-purple-600 mt-1 flex items-center gap-1.5">
                        <Building size={14} />
                        {activeCard.cardData.company}
                      </p>
                    )}
                  </div>

                  {/* Copyable fields list */}
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    {activeCard.cardData?.phone && (
                      <div className="group relative">
                        <span className="text-[10px] text-gray-600 font-bold block mb-0.5">Phone Number</span>
                        <div className="flex items-center justify-between gap-2 text-sm font-bold text-black">
                          <span className="truncate">{activeCard.cardData.phone}</span>
                          <button
                            onClick={() => handleCopyText(activeCard.cardData.phone, 'phone')}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            {copiedField === 'phone' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                          </button>
                        </div>
                      </div>
                    )}

                    {activeCard.cardData?.email && (
                      <div className="group relative">
                        <span className="text-[10px] text-gray-600 font-bold block mb-0.5">Email Address</span>
                        <div className="flex items-center justify-between gap-2 text-sm font-bold text-black">
                          <span className="truncate">{activeCard.cardData.email}</span>
                          <button
                            onClick={() => handleCopyText(activeCard.cardData.email, 'email')}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            {copiedField === 'email' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                          </button>
                        </div>
                      </div>
                    )}

                    {activeCard.cardData?.rawText && (
                      <div>
                        <span className="text-[10px] text-gray-600 font-bold block mb-0.5">Scanned text / Notes</span>
                        <p className="text-xs font-semibold text-gray-900 bg-gray-50 p-3 rounded-xl max-h-[120px] overflow-y-auto break-words leading-relaxed">
                          {activeCard.cardData.rawText}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Geolocation check-in stats */}
                  <div className="space-y-3 pt-4 border-t border-gray-100 text-xs font-semibold text-gray-800">
                    <div>
                      <span className="text-[10px] text-gray-600 font-black tracking-wider uppercase block mb-1">Audit Details</span>
                      <div className="flex items-center gap-2 text-black">
                        <User size={14} />
                        <span>Logged by {activeCard.employeeName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-black">
                      <Clock size={14} />
                      <span>{formatDate(activeCard.timestamp)} at {formatTime(activeCard.timestamp)}</span>
                    </div>

                    <div className="flex items-start gap-2 text-black">
                      <MapPin size={14} className="mt-0.5 shrink-0" />
                      <div>
                        <span>Lat: {activeCard.latitude.toFixed(6)}</span>
                        <br />
                        <span>Lng: {activeCard.longitude.toFixed(6)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 space-y-3 mt-6">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${activeCard.latitude},${activeCard.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-sm rounded-2xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Compass size={16} />
                    Locate Scan Coordinates
                  </a>
                  <button
                    onClick={() => {
                      setActiveCard(null);
                      setCopiedField(null);
                    }}
                    className="w-full py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-black font-black text-sm rounded-2xl transition-colors"
                  >
                    Close
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
