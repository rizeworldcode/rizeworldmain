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
  Check
} from 'lucide-react';
import { getAllVisitingCards } from '../api';

export default function VisitingCards() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  
  // Lightbox / Selected Card Modal
  const [activeCard, setActiveCard] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const fetchCards = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllVisitingCards();
      if (response.success) {
        setCards(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch visiting cards');
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
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <CreditCard size={32} className="text-purple-600 dark:text-purple-500" />
            Field Visiting Cards
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            Browse and inspect business cards scanned by field staff along with location check-in details.
          </p>
        </div>
        
        <button
          onClick={fetchCards}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-2xl font-bold text-sm text-gray-700 dark:text-gray-200 shadow-sm transition-all disabled:opacity-50 active:scale-95"
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
          className="clay-card p-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Scanned</span>
            <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-2xl text-purple-600 dark:text-purple-400">
              <CreditCard size={20} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-gray-900 dark:text-white">{totalScans}</span>
            <p className="text-xs text-gray-400 mt-1">Cards registered in records</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="clay-card p-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Scans Today</span>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl text-emerald-600 dark:text-emerald-400">
              <Calendar size={20} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-gray-900 dark:text-white">{scansToday}</span>
            <p className="text-xs text-gray-400 mt-1">Check-ins scanned today</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="clay-card p-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Unique Firms</span>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-2xl text-blue-600 dark:text-blue-400">
              <Building size={20} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-gray-900 dark:text-white">{uniqueCompanies}</span>
            <p className="text-xs text-gray-400 mt-1">Different firms logged</p>
          </div>
        </motion.div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 p-5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by company, person name, email, or representative..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-150 dark:border-white/10 rounded-2xl text-sm font-semibold text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
        </div>

        <div className="relative min-w-[200px]">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-150 dark:border-white/10 rounded-2xl text-sm font-semibold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer"
          />
        </div>

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

      {/* Error */}
      {error && (
        <div className="p-6 bg-rose-50 dark:bg-rose-950/10 border-2 border-rose-200 dark:border-rose-950/30 rounded-3xl text-rose-600 dark:text-rose-400 font-bold text-center">
          <p>{error}</p>
        </div>
      )}

      {/* Loading & Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-bold">Retrieving visiting cards directory...</p>
        </div>
      ) : filteredCards.length === 0 ? (
        <div className="clay-card bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-12 text-center rounded-3xl flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 text-gray-400 rounded-3xl flex items-center justify-center mb-4">
            <CreditCard size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">No scanned cards found</h3>
          <p className="text-gray-400 text-sm max-w-sm mt-2">
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
                  className="clay-card bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden group shadow-sm hover:shadow-md transition-all flex flex-col"
                >
                  {/* Aspect ratio 1.75 matches visiting card */}
                  <div className="relative w-full aspect-[7/4] bg-gray-100 dark:bg-white/5 overflow-hidden border-b border-gray-100 dark:border-white/5">
                    <img 
                      src={displayUrl} 
                      alt={`Card for ${card.cardData?.name || 'Contact'}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                      loading="lazy"
                    />
                    
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={() => setActiveCard(card)}
                        className="p-3 bg-white text-gray-900 rounded-full hover:scale-110 transition-transform shadow-lg"
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
                        <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase block mb-0.5">Scanned Contact</span>
                        <h4 className="font-black text-lg text-gray-900 dark:text-white truncate">
                          {card.cardData?.name || 'Unknown Contact'}
                        </h4>
                        {card.cardData?.company && (
                          <p className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5 mt-0.5">
                            <Building size={12} />
                            {card.cardData.company}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5 pt-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
                        {card.cardData?.phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={13} className="text-gray-400 shrink-0" />
                            <span className="truncate">{card.cardData.phone}</span>
                          </div>
                        )}
                        {card.cardData?.email && (
                          <div className="flex items-center gap-2">
                            <Mail size={13} className="text-gray-400 shrink-0" />
                            <span className="truncate">{card.cardData.email}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Meta info bottom */}
                    <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-[11px] font-bold text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-purple-500 text-white font-bold flex items-center justify-center text-[10px]">
                          {card.employeeName?.charAt(0) || 'S'}
                        </div>
                        <span className="truncate max-w-[100px] text-gray-700 dark:text-gray-300">{card.employeeName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={11} />
                        <span>{formatDate(card.timestamp)}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={() => setActiveCard(card)}
                        className="flex-1 py-2 px-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 font-bold text-xs rounded-xl transition-colors text-center"
                      >
                        Inspect details
                      </button>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${card.latitude},${card.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-950/40 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
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
              className="clay-card max-w-4xl w-full bg-white dark:bg-[#0c0c0c] rounded-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setActiveCard(null);
                  setCopiedField(null);
                }}
                className="absolute top-4 right-4 w-10 h-10 clay-flat rounded-2xl flex items-center justify-center text-black dark:text-white hover:clay-inset hover:text-rose-500 transition-all z-10"
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
              <div className="w-full md:w-80 p-6 md:p-8 flex flex-col justify-between bg-white dark:bg-[#0c0c0c] border-t md:border-t-0 md:border-l border-gray-150 dark:border-white/10 overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] text-gray-400 font-black tracking-wider uppercase block mb-1">Scanned Data Card</span>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight">
                      {activeCard.cardData?.name || 'No Name Scanned'}
                    </h3>
                    {activeCard.cardData?.company && (
                      <p className="text-sm font-bold text-purple-600 dark:text-purple-400 mt-1 flex items-center gap-1.5">
                        <Building size={14} />
                        {activeCard.cardData.company}
                      </p>
                    )}
                  </div>

                  {/* Copyable fields list */}
                  <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
                    {activeCard.cardData?.phone && (
                      <div className="group relative">
                        <span className="text-[10px] text-gray-400 font-bold block mb-0.5">Phone Number</span>
                        <div className="flex items-center justify-between gap-2 text-sm font-bold text-gray-700 dark:text-gray-200">
                          <span className="truncate">{activeCard.cardData.phone}</span>
                          <button
                            onClick={() => handleCopyText(activeCard.cardData.phone, 'phone')}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {copiedField === 'phone' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                          </button>
                        </div>
                      </div>
                    )}

                    {activeCard.cardData?.email && (
                      <div className="group relative">
                        <span className="text-[10px] text-gray-400 font-bold block mb-0.5">Email Address</span>
                        <div className="flex items-center justify-between gap-2 text-sm font-bold text-gray-700 dark:text-gray-200">
                          <span className="truncate">{activeCard.cardData.email}</span>
                          <button
                            onClick={() => handleCopyText(activeCard.cardData.email, 'email')}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {copiedField === 'email' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                          </button>
                        </div>
                      </div>
                    )}

                    {activeCard.cardData?.rawText && (
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold block mb-0.5">Scanned text / Notes</span>
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/5 p-3 rounded-xl max-h-[120px] overflow-y-auto break-words leading-relaxed">
                          {activeCard.cardData.rawText}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Geolocation check-in stats */}
                  <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-white/5 text-xs font-semibold text-gray-500">
                    <div>
                      <span className="text-[10px] text-gray-400 font-black tracking-wider uppercase block mb-1">Audit Details</span>
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <User size={14} />
                        <span>Logged by {activeCard.employeeName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Clock size={14} />
                      <span>{formatDate(activeCard.timestamp)} at {formatTime(activeCard.timestamp)}</span>
                    </div>

                    <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                      <MapPin size={14} className="mt-0.5 shrink-0" />
                      <div>
                        <span>Lat: {activeCard.latitude.toFixed(6)}</span>
                        <br />
                        <span>Lng: {activeCard.longitude.toFixed(6)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-white/5 space-y-3 mt-6">
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
                    className="w-full py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 font-black text-sm rounded-2xl transition-colors"
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
