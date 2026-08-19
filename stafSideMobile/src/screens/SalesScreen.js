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
  RefreshControl,
  Platform,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit3,
  DollarSign,
  TrendingUp,
  Package,
  Calendar,
  X,
  User,
  ShoppingBag
} from 'lucide-react-native';

const SalesScreen = ({ staffInfo, token, onBack, getApiUrl }) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    clientName: '',
    productName: '',
    saleAmount: '',
    notes: ''
  });

  const fetchSales = async () => {
    try {
      const url = `${getApiUrl('/staff/sales')}?salesPersonId=${staffInfo._id || staffInfo.id}`;
      const response = await fetch(url);
      const result = await response.json();
      if (result.success) {
        setSales(result.data || []);
      } else {
        Alert.alert('Error', result.message || 'Failed to fetch sales logs');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Network connection error.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const resetForm = () => {
    setFormData({
      clientName: '',
      productName: '',
      saleAmount: '',
      notes: ''
    });
    setEditingSale(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingSale(item);
    setFormData({
      clientName: item.clientName || '',
      productName: item.productName || '',
      saleAmount: item.saleAmount ? String(item.saleAmount) : '',
      notes: item.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.clientName.trim() || !formData.productName.trim() || !formData.saleAmount) {
      Alert.alert('Validation Error', 'Client name, product, and sale amount are required.');
      return;
    }

    setSubmitting(true);
    const body = {
      ...formData,
      saleAmount: parseFloat(formData.saleAmount),
      salesPersonId: staffInfo._id || staffInfo.id,
      salesPersonName: staffInfo.name || ''
    };

    try {
      let response;
      if (editingSale) {
        response = await fetch(`${getApiUrl('/staff/sales')}/${editingSale._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
      } else {
        response = await fetch(getApiUrl('/staff/sales'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
      }

      const result = await response.json();
      if (result.success) {
        Alert.alert('Success', editingSale ? 'Sale updated!' : 'Sale logged!');
        setIsModalOpen(false);
        resetForm();
        fetchSales();
      } else {
        Alert.alert('Error', result.message || 'Failed to save sale.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Server error while saving.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this sale entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${getApiUrl('/staff/sales')}/${id}`, {
                method: 'DELETE'
              });
              const result = await response.json();
              if (result.success) {
                fetchSales();
              }
            } catch (err) {
              console.error(err);
            }
          }
        }
      ]
    );
  };

  const totalRevenue = sales.reduce((acc, curr) => acc + (parseFloat(curr.saleAmount) || 0), 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={20} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sales Log</Text>
        <TouchableOpacity onPress={handleOpenCreateModal} style={styles.addButton}>
          <LinearGradient colors={['#10b981', '#059669']} style={styles.addGradient}>
            <Plus size={18} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Sales Stats Banner */}
      <View style={styles.statsCardContainer}>
        <LinearGradient colors={['#10b981', '#047857']} style={styles.statsGradient}>
          <View style={styles.statsRow}>
            <View>
              <Text style={styles.statsLabel}>TOTAL SALES REVENUE</Text>
              <Text style={styles.statsValue}>₹{totalRevenue.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.dealsBadge}>
              <Text style={styles.dealsBadgeText}>{sales.length} Deals</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchSales(); }} />
          }
        >
          {sales.length === 0 ? (
            <View style={styles.emptyContainer}>
              <ShoppingBag size={48} color="#cbd5e1" />
              <Text style={styles.emptyText}>No sales logged yet.</Text>
            </View>
          ) : (
            sales.map(item => (
              <View key={item._id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.clientInfo}>
                    <User size={16} color="#059669" />
                    <Text style={styles.clientName}>{item.clientName}</Text>
                  </View>
                  <Text style={styles.amountText}>₹{(parseFloat(item.saleAmount) || 0).toLocaleString('en-IN')}</Text>
                </View>

                <View style={styles.productRow}>
                  <Package size={14} color="#64748b" />
                  <Text style={styles.productName}>{item.productName}</Text>
                </View>

                {item.notes ? (
                  <Text style={styles.notesText}>"{item.notes}"</Text>
                ) : null}

                <View style={styles.cardFooter}>
                  <View style={styles.dateRow}>
                    <Calendar size={12} color="#94a3b8" />
                    <Text style={styles.dateText}>
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                    </Text>
                  </View>

                  <View style={styles.actionsRow}>
                    <TouchableOpacity onPress={() => handleOpenEditModal(item)} style={styles.actionBtn}>
                      <Edit3 size={14} color="#059669" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.actionBtn}>
                      <Trash2 size={14} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* Modal Sheet */}
      <Modal visible={isModalOpen} animationType="slide" transparent onRequestClose={() => setIsModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingSale ? 'Edit Sale Entry' : 'Log New Sale'}</Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScroll}>
              <Text style={styles.label}>Client Name *</Text>
              <TextInput
                value={formData.clientName}
                onChangeText={text => setFormData({ ...formData, clientName: text })}
                placeholder="e.g. Acme Corp / John Doe"
                style={styles.input}
              />

              <Text style={styles.label}>Product / Service Name *</Text>
              <TextInput
                value={formData.productName}
                onChangeText={text => setFormData({ ...formData, productName: text })}
                placeholder="e.g. Premium Web Package"
                style={styles.input}
              />

              <Text style={styles.label}>Sale Amount (₹) *</Text>
              <TextInput
                value={formData.saleAmount}
                onChangeText={text => setFormData({ ...formData, saleAmount: text })}
                placeholder="e.g. 45000"
                keyboardType="numeric"
                style={styles.input}
              />

              <Text style={styles.label}>Notes</Text>
              <TextInput
                value={formData.notes}
                onChangeText={text => setFormData({ ...formData, notes: text })}
                placeholder="Additional sale details..."
                multiline
                style={[styles.input, styles.multilineInput]}
              />

              <TouchableOpacity onPress={handleSubmit} disabled={submitting} style={styles.saveBtn}>
                <LinearGradient colors={['#10b981', '#059669']} style={styles.saveGradient}>
                  {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>SAVE SALE</Text>}
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
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
  addButton: { borderRadius: 12, overflow: 'hidden' },
  addGradient: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  statsCardContainer: { paddingHorizontal: 16, paddingTop: 16 },
  statsGradient: { borderRadius: 20, padding: 18 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statsLabel: { fontSize: 10, fontWeight: '900', color: 'rgba(255, 255, 255, 0.8)', letterSpacing: 1 },
  statsValue: { fontSize: 24, fontWeight: '900', color: '#fff', marginTop: 2 },
  dealsBadge: { backgroundColor: 'rgba(255, 255, 255, 0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  dealsBadgeText: { fontSize: 12, fontWeight: '800', color: '#fff' },
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
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  clientInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  clientName: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  amountText: { fontSize: 16, fontWeight: '900', color: '#059669' },
  productRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  productName: { fontSize: 13, color: '#475569', fontWeight: '600' },
  notesText: { fontSize: 12, color: '#64748b', fontStyle: 'italic', marginBottom: 10 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10
  },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dateText: { fontSize: 11, color: '#94a3b8', fontWeight: '600' },
  actionsRow: { flexDirection: 'row', gap: 12 },
  actionBtn: { padding: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '90%', padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
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
  multilineInput: { height: 75, textAlignVertical: 'top' },
  saveBtn: { marginTop: 20, borderRadius: 14, overflow: 'hidden' },
  saveGradient: { paddingVertical: 14, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '900', fontSize: 14, letterSpacing: 1 }
});

export default SalesScreen;
