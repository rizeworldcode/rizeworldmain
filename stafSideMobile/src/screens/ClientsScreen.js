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
  RefreshControl,
  Platform,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Search,
  Users,
  PlusCircle,
  Folder,
  DollarSign,
  ChevronRight,
  X,
  CreditCard,
  Building,
  Mail,
  Phone
} from 'lucide-react-native';

const ClientsScreen = ({ staffInfo, token, onBack, onSelectClient, getApiUrl, onUpdateStaffInfo }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Add Payment Modal State
  const [selectedClientForPayment, setSelectedClientForPayment] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('Online');
  const [utrNumber, setUtrNumber] = useState('');
  const [submittingPayment, setSubmittingPayment] = useState(false);

  const fetchClients = async () => {
    try {
      const response = await fetch(getApiUrl('/staff/clients'));
      const result = await response.json();
      if (result.success) {
        setClients(result.data || []);
      } else {
        Alert.alert('Error', result.message || 'Failed to fetch clients');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Network request failed.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleAddPayment = async () => {
    const amountVal = parseFloat(paymentAmount);
    if (!amountVal || amountVal <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid payment amount.');
      return;
    }

    if (paymentMode === 'Online' && (utrNumber.trim().length < 12 || utrNumber.trim().length > 16)) {
      Alert.alert('Validation Error', 'UTR Number must be between 12 and 16 characters for Online payments.');
      return;
    }

    setSubmittingPayment(true);
    try {
      const response = await fetch(getApiUrl(`/staff/clients/${selectedClientForPayment._id}/payment`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountVal,
          mode: paymentMode,
          utr: utrNumber.trim(),
          date: new Date().toISOString()
        })
      });

      const result = await response.json();
      if (result.success) {
        Alert.alert('Success', 'Payment recorded successfully!');
        setSelectedClientForPayment(null);
        setPaymentAmount('');
        setUtrNumber('');
        fetchClients();
      } else {
        Alert.alert('Error', result.message || 'Failed to record payment.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Server connection failed.');
    } finally {
      setSubmittingPayment(false);
    }
  };

  const filteredClients = clients.filter(c => {
    const matchesSearch = (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (c.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (c.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All' || c.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return { bg: '#dcfce7', text: '#15803d' };
      case 'In Progress': return { bg: '#dbeafe', text: '#1d4ed8' };
      case 'On Hold': return { bg: '#fef9c3', text: '#a16207' };
      default: return { bg: '#f1f5f9', text: '#475569' };
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={20} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Clients Directory</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Search size={16} color="#94a3b8" style={styles.searchIcon} />
        <TextInput
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search client or company..."
          placeholderTextColor="#94a3b8"
          style={styles.searchInput}
        />
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {['All', 'Pending', 'In Progress', 'On Hold', 'Completed'].map(filter => (
          <TouchableOpacity
            key={filter}
            onPress={() => setActiveFilter(filter)}
            style={[styles.filterChip, activeFilter === filter && styles.activeFilterChip]}
          >
            <Text style={[styles.filterChipText, activeFilter === filter && styles.activeFilterChipText]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#8b5cf6" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchClients(); }} />
          }
        >
          {filteredClients.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Users size={48} color="#cbd5e1" />
              <Text style={styles.emptyText}>No clients found.</Text>
            </View>
          ) : (
            filteredClients.map(item => {
              const statusStyle = getStatusColor(item.status);
              const totalAmount = parseFloat(item.totalAmount || item.projectCost || 0);
              const paidAmount = parseFloat(item.paidAmount || 0);
              const balanceAmount = Math.max(0, totalAmount - paidAmount);

              return (
                <TouchableOpacity
                  key={item._id}
                  onPress={() => onSelectClient(item)}
                  style={styles.card}
                >
                  <View style={styles.cardTop}>
                    <View style={styles.clientTitleRow}>
                      <Text style={styles.clientName}>{item.name || 'Client'}</Text>
                      {item.company ? (
                        <Text style={styles.clientCompany}>{item.company}</Text>
                      ) : null}
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                      <Text style={[styles.statusText, { color: statusStyle.text }]}>
                        {item.status || 'Pending'}
                      </Text>
                    </View>
                  </View>

                  {/* Financial Stats */}
                  <View style={styles.financeRow}>
                    <View style={styles.financeItem}>
                      <Text style={styles.financeLabel}>Total</Text>
                      <Text style={styles.financeValue}>₹{totalAmount.toLocaleString('en-IN')}</Text>
                    </View>
                    <View style={styles.financeItem}>
                      <Text style={styles.financeLabel}>Paid</Text>
                      <Text style={[styles.financeValue, { color: '#16a34a' }]}>₹{paidAmount.toLocaleString('en-IN')}</Text>
                    </View>
                    <View style={styles.financeItem}>
                      <Text style={styles.financeLabel}>Balance</Text>
                      <Text style={[styles.financeValue, { color: balanceAmount > 0 ? '#dc2626' : '#64748b' }]}>
                        ₹{balanceAmount.toLocaleString('en-IN')}
                      </Text>
                    </View>
                  </View>

                  {/* Card Actions */}
                  <View style={styles.cardFooter}>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        setSelectedClientForPayment(item);
                      }}
                      style={styles.addPaymentBtn}
                    >
                      <PlusCircle size={14} color="#8b5cf6" />
                      <Text style={styles.addPaymentText}>Add Payment</Text>
                    </TouchableOpacity>

                    <View style={styles.viewProjectsRow}>
                      <Text style={styles.viewProjectsText}>View Details</Text>
                      <ChevronRight size={14} color="#8b5cf6" />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      )}

      {/* Add Payment Modal */}
      <Modal visible={!!selectedClientForPayment} animationType="slide" transparent onRequestClose={() => setSelectedClientForPayment(null)}>
        {selectedClientForPayment ? (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Record Client Payment</Text>
                <TouchableOpacity onPress={() => setSelectedClientForPayment(null)}>
                  <X size={24} color="#64748b" />
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={styles.modalScroll}>
                <Text style={styles.clientSubtitle}>For {selectedClientForPayment.name}</Text>

                <Text style={styles.label}>Payment Amount (₹) *</Text>
                <TextInput
                  value={paymentAmount}
                  onChangeText={setPaymentAmount}
                  placeholder="e.g. 15000"
                  keyboardType="numeric"
                  style={styles.input}
                />

                <Text style={styles.label}>Payment Mode</Text>
                <View style={styles.modeRow}>
                  {['Online', 'Cash', 'UPI', 'Bank Transfer'].map(mode => (
                    <TouchableOpacity
                      key={mode}
                      onPress={() => setPaymentMode(mode)}
                      style={[styles.modeChip, paymentMode === mode && styles.activeModeChip]}
                    >
                      <Text style={[styles.modeText, paymentMode === mode && styles.activeModeText]}>
                        {mode}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {paymentMode === 'Online' || paymentMode === 'UPI' ? (
                  <>
                    <Text style={styles.label}>UTR / Transaction Reference (12-16 chars) *</Text>
                    <TextInput
                      value={utrNumber}
                      onChangeText={setUtrNumber}
                      placeholder="e.g. 304958392019"
                      style={styles.input}
                    />
                  </>
                ) : null}

                <TouchableOpacity onPress={handleAddPayment} disabled={submittingPayment} style={styles.saveBtn}>
                  <LinearGradient colors={['#8b5cf6', '#a855f7']} style={styles.saveGradient}>
                    {submittingPayment ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>RECORD PAYMENT</Text>}
                  </LinearGradient>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        ) : null}
      </Modal>
    </View>
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
  filterScroll: { paddingHorizontal: 16, marginVertical: 10, maxHeight: 36 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 20,
    marginRight: 8
  },
  activeFilterChip: { backgroundColor: '#8b5cf6' },
  filterChipText: { fontSize: 12, fontWeight: '700', color: '#64748b' },
  activeFilterChipText: { color: '#fff' },
  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { marginTop: 12, fontSize: 14, color: '#94a3b8', fontWeight: '600' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  clientTitleRow: { flex: 1, marginRight: 8 },
  clientName: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  clientCompany: { fontSize: 12, color: '#64748b', fontWeight: '600', marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '800' },
  financeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12
  },
  financeItem: { alignItems: 'center' },
  financeLabel: { fontSize: 10, fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' },
  financeValue: { fontSize: 13, fontWeight: '800', color: '#1e293b', marginTop: 2 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10
  },
  addPaymentBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  addPaymentText: { fontSize: 12, fontWeight: '700', color: '#8b5cf6' },
  viewProjectsRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewProjectsText: { fontSize: 12, fontWeight: '700', color: '#8b5cf6' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '90%', padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  clientSubtitle: { fontSize: 13, color: '#8b5cf6', fontWeight: '700', marginBottom: 16 },
  modalScroll: { paddingBottom: 24 },
  label: { fontSize: 11, fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: 4, marginTop: 10 },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1e293b'
  },
  modeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 6 },
  modeChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, backgroundColor: '#f1f5f9' },
  activeModeChip: { backgroundColor: '#8b5cf6' },
  modeText: { fontSize: 12, fontWeight: '700', color: '#64748b' },
  activeModeText: { color: '#fff' },
  saveBtn: { marginTop: 20, borderRadius: 14, overflow: 'hidden' },
  saveGradient: { paddingVertical: 14, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '900', fontSize: 14, letterSpacing: 1 }
});

export default ClientsScreen;
