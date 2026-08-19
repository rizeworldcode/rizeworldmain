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
  Linking,
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
  Phone,
  Mail,
  GraduationCap,
  X,
  Search,
  User,
  BookOpen
} from 'lucide-react-native';

const AdmissionsScreen = ({ staffInfo, token, onBack, getApiUrl }) => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmission, setEditingAdmission] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    studentName: '',
    phoneNumber: '',
    email: '',
    courseInterested: '',
    status: 'Lead',
    notes: ''
  });

  const fetchAdmissions = async () => {
    try {
      const url = `${getApiUrl('/staff/admissions')}?counselorId=${staffInfo._id || staffInfo.id}`;
      const response = await fetch(url);
      const result = await response.json();
      if (result.success) {
        setAdmissions(result.data || []);
      } else {
        Alert.alert('Error', result.message || 'Failed to fetch admissions');
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
    fetchAdmissions();
  }, []);

  const resetForm = () => {
    setFormData({
      studentName: '',
      phoneNumber: '',
      email: '',
      courseInterested: '',
      status: 'Lead',
      notes: ''
    });
    setEditingAdmission(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingAdmission(item);
    setFormData({
      studentName: item.studentName || '',
      phoneNumber: item.phoneNumber || '',
      email: item.email || '',
      courseInterested: item.courseInterested || '',
      status: item.status || 'Lead',
      notes: item.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.studentName.trim() || !formData.phoneNumber.trim()) {
      Alert.alert('Validation Error', 'Student Name and Phone Number are required.');
      return;
    }

    setSubmitting(true);
    const body = {
      ...formData,
      counselorId: staffInfo._id || staffInfo.id,
      counselorName: staffInfo.name || ''
    };

    try {
      let response;
      if (editingAdmission) {
        response = await fetch(`${getApiUrl('/staff/admissions')}/${editingAdmission._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
      } else {
        response = await fetch(getApiUrl('/staff/admissions'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
      }

      const result = await response.json();
      if (result.success) {
        Alert.alert('Success', editingAdmission ? 'Lead updated!' : 'Lead added!');
        setIsModalOpen(false);
        resetForm();
        fetchAdmissions();
      } else {
        Alert.alert('Error', result.message || 'Failed to save admission.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Server connection error.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Confirm Delete',
      'Delete this admission lead?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${getApiUrl('/staff/admissions')}/${id}`, {
                method: 'DELETE'
              });
              const result = await response.json();
              if (result.success) {
                fetchAdmissions();
              }
            } catch (err) {
              console.error(err);
            }
          }
        }
      ]
    );
  };

  const filteredAdmissions = admissions.filter(item => {
    const matchesFilter = activeFilter === 'All' || item.status === activeFilter;
    const matchesSearch = (item.studentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.courseInterested || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.phoneNumber || '').includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Admitted': return { bg: '#dcfce7', text: '#15803d' };
      case 'Follow-up': return { bg: '#fef9c3', text: '#a16207' };
      case 'Rejected': return { bg: '#fee2e2', text: '#b91c1c' };
      default: return { bg: '#dbeafe', text: '#1d4ed8' };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={20} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Student Admissions</Text>
        <TouchableOpacity onPress={handleOpenCreateModal} style={styles.addButton}>
          <LinearGradient colors={['#8b5cf6', '#a855f7']} style={styles.addGradient}>
            <Plus size={18} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Search size={16} color="#94a3b8" style={styles.searchIcon} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search student, course, phone..."
          placeholderTextColor="#94a3b8"
          style={styles.searchInput}
        />
      </View>

      {/* Status Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {['All', 'Lead', 'Follow-up', 'Admitted', 'Rejected'].map(filter => (
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
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchAdmissions(); }} />
          }
        >
          {filteredAdmissions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <GraduationCap size={48} color="#cbd5e1" />
              <Text style={styles.emptyText}>No student admission records found.</Text>
            </View>
          ) : (
            filteredAdmissions.map(item => {
              const statusStyle = getStatusColor(item.status);
              return (
                <View key={item._id} style={styles.card}>
                  <View style={styles.cardTop}>
                    <Text style={styles.studentName}>{item.studentName}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                      <Text style={[styles.statusText, { color: statusStyle.text }]}>
                        {item.status || 'Lead'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <BookOpen size={14} color="#8b5cf6" />
                    <Text style={styles.infoText}>{item.courseInterested || 'Course not specified'}</Text>
                  </View>

                  {item.notes ? (
                    <Text style={styles.notesText} numberOfLines={2}>
                      "{item.notes}"
                    </Text>
                  ) : null}

                  {/* Actions */}
                  <View style={styles.cardFooter}>
                    <View style={styles.contactActions}>
                      {item.phoneNumber ? (
                        <TouchableOpacity
                          onPress={() => Linking.openURL(`tel:${item.phoneNumber}`)}
                          style={styles.contactIconBtn}
                        >
                          <Phone size={14} color="#16a34a" />
                        </TouchableOpacity>
                      ) : null}
                      {item.email ? (
                        <TouchableOpacity
                          onPress={() => Linking.openURL(`mailto:${item.email}`)}
                          style={styles.contactIconBtn}
                        >
                          <Mail size={14} color="#2563eb" />
                        </TouchableOpacity>
                      ) : null}
                    </View>

                    <View style={styles.btnRow}>
                      <TouchableOpacity onPress={() => handleOpenEditModal(item)} style={styles.editBtn}>
                        <Edit3 size={14} color="#8b5cf6" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteBtn}>
                        <Trash2 size={14} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}

      {/* Modal */}
      <Modal visible={isModalOpen} animationType="slide" transparent onRequestClose={() => setIsModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingAdmission ? 'Edit Lead' : 'New Admission Lead'}</Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScroll}>
              <Text style={styles.label}>Student Name *</Text>
              <TextInput
                value={formData.studentName}
                onChangeText={text => setFormData({ ...formData, studentName: text })}
                placeholder="Full Name"
                style={styles.input}
              />

              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                value={formData.phoneNumber}
                onChangeText={text => setFormData({ ...formData, phoneNumber: text })}
                placeholder="+91 9876543210"
                keyboardType="phone-pad"
                style={styles.input}
              />

              <Text style={styles.label}>Email Address</Text>
              <TextInput
                value={formData.email}
                onChangeText={text => setFormData({ ...formData, email: text })}
                placeholder="student@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />

              <Text style={styles.label}>Course Interested</Text>
              <TextInput
                value={formData.courseInterested}
                onChangeText={text => setFormData({ ...formData, courseInterested: text })}
                placeholder="e.g. Web Development / Data Science"
                style={styles.input}
              />

              <Text style={styles.label}>Lead Status</Text>
              <View style={styles.statusSelectRow}>
                {['Lead', 'Follow-up', 'Admitted', 'Rejected'].map(st => (
                  <TouchableOpacity
                    key={st}
                    onPress={() => setFormData({ ...formData, status: st })}
                    style={[
                      styles.statusOption,
                      formData.status === st && styles.statusOptionActive
                    ]}
                  >
                    <Text style={[styles.statusOptionText, formData.status === st && styles.statusOptionTextActive]}>
                      {st}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Counseling Notes</Text>
              <TextInput
                value={formData.notes}
                onChangeText={text => setFormData({ ...formData, notes: text })}
                placeholder="Add notes from discussion..."
                multiline
                style={[styles.input, styles.multilineInput]}
              />

              <TouchableOpacity onPress={handleSubmit} disabled={submitting} style={styles.saveBtn}>
                <LinearGradient colors={['#8b5cf6', '#a855f7']} style={styles.saveGradient}>
                  {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>SAVE LEAD</Text>}
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
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  studentName: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '800' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  infoText: { fontSize: 13, color: '#475569', fontWeight: '600' },
  notesText: { fontSize: 12, color: '#64748b', fontStyle: 'italic', marginBottom: 10 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
    marginTop: 4
  },
  contactActions: { flexDirection: 'row', gap: 8 },
  contactIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnRow: { flexDirection: 'row', gap: 12 },
  editBtn: { padding: 6 },
  deleteBtn: { padding: 6 },
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
  statusSelectRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 6 },
  statusOption: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: '#f1f5f9' },
  statusOptionActive: { backgroundColor: '#8b5cf6' },
  statusOptionText: { fontSize: 12, fontWeight: '700', color: '#64748b' },
  statusOptionTextActive: { color: '#fff' },
  saveBtn: { marginTop: 20, borderRadius: 14, overflow: 'hidden' },
  saveGradient: { paddingVertical: 14, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '900', fontSize: 14, letterSpacing: 1 }
});

export default AdmissionsScreen;
