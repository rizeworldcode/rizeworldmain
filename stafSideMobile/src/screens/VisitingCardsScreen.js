import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  Image,
  Linking,
  Clipboard,
  RefreshControl,
  Platform,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Search,
  CreditCard,
  Phone,
  Mail,
  Building,
  MapPin,
  Calendar,
  X,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react-native';

const VisitingCardsScreen = ({ staffInfo, token, onBack, getApiUrl }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const fetchCards = async () => {
    try {
      const response = await fetch(getApiUrl('/visiting-card/all'));
      const result = await response.json();
      if (result.success) {
        setCards(result.data || []);
      } else {
        Alert.alert('Error', result.message || 'Failed to fetch visiting cards');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Network connection failed.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const getImageUrl = (photoUrl) => {
    if (!photoUrl) return null;
    if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
      return photoUrl;
    }
    const photoPath = photoUrl.startsWith('/') ? photoUrl.slice(1) : photoUrl;
    return `https://rizeworldmain.onrender.com/public-file?path=${photoPath}`;
  };

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    Clipboard.setString(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const filteredCards = cards.filter(card => {
    const q = searchTerm.toLowerCase();
    return (
      (card.name || '').toLowerCase().includes(q) ||
      (card.company || '').toLowerCase().includes(q) ||
      (card.position || card.title || '').toLowerCase().includes(q) ||
      (card.phone || card.mobile || '').toLowerCase().includes(q) ||
      (card.email || '').toLowerCase().includes(q)
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={20} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Visiting Cards</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Search size={16} color="#94a3b8" style={styles.searchIcon} />
        <TextInput
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search card by name, company, phone..."
          placeholderTextColor="#94a3b8"
          style={styles.searchInput}
        />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#8b5cf6" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchCards(); }} />
          }
        >
          {filteredCards.length === 0 ? (
            <View style={styles.emptyContainer}>
              <CreditCard size={48} color="#cbd5e1" />
              <Text style={styles.emptyText}>No visiting cards found.</Text>
            </View>
          ) : (
            filteredCards.map(item => {
              const imageUri = getImageUrl(item.photoUrl || item.cardImage || item.image);
              return (
                <TouchableOpacity
                  key={item._id}
                  onPress={() => setSelectedCard(item)}
                  style={styles.card}
                >
                  <View style={styles.cardRow}>
                    {imageUri ? (
                      <Image source={{ uri: imageUri }} style={styles.cardImageThumbnail} resizeMode="cover" />
                    ) : (
                      <View style={styles.cardImagePlaceholder}>
                        <CreditCard size={24} color="#8b5cf6" />
                      </View>
                    )}

                    <View style={styles.cardMainInfo}>
                      <Text style={styles.cardName}>{item.name || item.personName || 'Unnamed Contact'}</Text>
                      {item.position || item.title ? (
                        <Text style={styles.cardTitle}>{item.position || item.title}</Text>
                      ) : null}
                      {item.company ? (
                        <View style={styles.iconRow}>
                          <Building size={12} color="#64748b" />
                          <Text style={styles.companyText}>{item.company}</Text>
                        </View>
                      ) : null}
                      {item.phone || item.mobile ? (
                        <View style={styles.iconRow}>
                          <Phone size={12} color="#16a34a" />
                          <Text style={styles.phoneText}>{item.phone || item.mobile}</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      )}

      {/* Card Detail Modal */}
      <Modal visible={!!selectedCard} animationType="slide" transparent onRequestClose={() => setSelectedCard(null)}>
        {selectedCard ? (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Card Details</Text>
                <TouchableOpacity onPress={() => setSelectedCard(null)}>
                  <X size={24} color="#64748b" />
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={styles.modalScroll}>
                {getImageUrl(selectedCard.photoUrl || selectedCard.cardImage || selectedCard.image) ? (
                  <Image
                    source={{ uri: getImageUrl(selectedCard.photoUrl || selectedCard.cardImage || selectedCard.image) }}
                    style={styles.fullCardImage}
                    resizeMode="contain"
                  />
                ) : null}

                <Text style={styles.detailName}>{selectedCard.name || 'Unnamed Contact'}</Text>
                <Text style={styles.detailPosition}>{selectedCard.position || selectedCard.title || 'Contact'}</Text>

                <View style={styles.detailSection}>
                  {selectedCard.company ? (
                    <View style={styles.detailRow}>
                      <Building size={16} color="#8b5cf6" />
                      <Text style={styles.detailRowText}>{selectedCard.company}</Text>
                    </View>
                  ) : null}

                  {selectedCard.phone || selectedCard.mobile ? (
                    <View style={styles.detailRowBetween}>
                      <TouchableOpacity
                        onPress={() => Linking.openURL(`tel:${selectedCard.phone || selectedCard.mobile}`)}
                        style={styles.detailRow}
                      >
                        <Phone size={16} color="#16a34a" />
                        <Text style={[styles.detailRowText, { color: '#16a34a', textDecorationLine: 'underline' }]}>
                          {selectedCard.phone || selectedCard.mobile}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleCopy(selectedCard.phone || selectedCard.mobile, 'phone')}>
                        {copiedField === 'phone' ? <Check size={16} color="#16a34a" /> : <Copy size={16} color="#94a3b8" />}
                      </TouchableOpacity>
                    </View>
                  ) : null}

                  {selectedCard.email ? (
                    <View style={styles.detailRowBetween}>
                      <TouchableOpacity
                        onPress={() => Linking.openURL(`mailto:${selectedCard.email}`)}
                        style={styles.detailRow}
                      >
                        <Mail size={16} color="#2563eb" />
                        <Text style={[styles.detailRowText, { color: '#2563eb', textDecorationLine: 'underline' }]}>
                          {selectedCard.email}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleCopy(selectedCard.email, 'email')}>
                        {copiedField === 'email' ? <Check size={16} color="#16a34a" /> : <Copy size={16} color="#94a3b8" />}
                      </TouchableOpacity>
                    </View>
                  ) : null}

                  {selectedCard.address ? (
                    <View style={styles.detailRow}>
                      <MapPin size={16} color="#ef4444" />
                      <Text style={styles.detailRowText}>{selectedCard.address}</Text>
                    </View>
                  ) : null}
                </View>
              </ScrollView>
            </View>
          </View>
        ) : null}
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 8 : 14,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0'
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    height: 44
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 13, color: '#1e293b' },
  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { marginTop: 12, fontSize: 14, color: '#94a3b8', fontWeight: '600' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2
  },
  cardRow: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  cardImageThumbnail: { width: 64, height: 64, borderRadius: 14 },
  cardImagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardMainInfo: { flex: 1 },
  cardName: { fontSize: 15, fontWeight: '800', color: '#0f172a' },
  cardTitle: { fontSize: 12, fontWeight: '600', color: '#8b5cf6', marginBottom: 2 },
  iconRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  companyText: { fontSize: 12, color: '#475569', fontWeight: '600' },
  phoneText: { fontSize: 12, color: '#16a34a', fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '90%', padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  modalScroll: { paddingBottom: 24 },
  fullCardImage: { width: '100%', height: 200, borderRadius: 16, marginBottom: 16, backgroundColor: '#f1f5f9' },
  detailName: { fontSize: 20, fontWeight: '900', color: '#0f172a', textAlign: 'center' },
  detailPosition: { fontSize: 14, fontWeight: '700', color: '#8b5cf6', textAlign: 'center', marginBottom: 16 },
  detailSection: { backgroundColor: '#f8fafc', borderRadius: 16, padding: 16, gap: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  detailRowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  detailRowText: { fontSize: 14, fontWeight: '600', color: '#334155', flex: 1 }
});

export default VisitingCardsScreen;
