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
  Platform,
  RefreshControl,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  Briefcase,
  Calendar,
  DollarSign,
  Users,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  X,
  Check
} from 'lucide-react-native';

const HearingScreen = ({ staffInfo, token, onBack, getApiUrl }) => {
  const [hearings, setHearings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'active' | 'inactive'
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    post: '',
    overview: '',
    description: '',
    lastDate: '',
    salary: '',
    vacancy: '',
    experience: '',
    gender: 'both',
    status: 'active'
  });

  const [responsibilities, setResponsibilities] = useState(['']);
  const [qualifications, setQualifications] = useState(['']);
  const [offers, setOffers] = useState(['']);

  const fetchHearings = async () => {
    try {
      const response = await fetch(getApiUrl('/getHearing'));
      const result = await response.json();
      if (result.success) {
        setHearings(result.data || []);
      } else {
        Alert.alert('Error', result.message || 'Failed to fetch hearings');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Network Error', 'Could not fetch hearing records.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHearings();
  }, []);

  const resetForm = () => {
    setFormData({
      post: '',
      overview: '',
      description: '',
      lastDate: '',
      salary: '',
      vacancy: '',
      experience: '',
      gender: 'both',
      status: 'active'
    });
    setResponsibilities(['']);
    setQualifications(['']);
    setOffers(['']);
    setIsEditing(false);
    setEditId(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setIsEditing(true);
    setEditId(item._id);
    setFormData({
      post: item.post || '',
      overview: item.overview || '',
      description: item.description || '',
      lastDate: item.lastDate ? item.lastDate.split('T')[0] : '',
      salary: item.salary || '',
      vacancy: item.vacancy ? String(item.vacancy) : '',
      experience: item.experience || '',
      gender: item.gender || 'both',
      status: item.status || 'active'
    });
    setResponsibilities(item.keyResponsibilities && item.keyResponsibilities.length > 0 ? item.keyResponsibilities : ['']);
    setQualifications(item.qulification && item.qulification.length > 0 ? item.qulification : ['']);
    setOffers(item.whatWeOffer && item.whatWeOffer.length > 0 ? item.whatWeOffer : ['']);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.post.trim() || !formData.overview.trim() || !formData.salary.trim()) {
      Alert.alert('Validation Error', 'Please fill in required fields (Post, Overview, Salary).');
      return;
    }

    setSubmitting(true);
    const cleanResponsibilities = responsibilities.filter(r => r.trim() !== '');
    const cleanQualifications = qualifications.filter(q => q.trim() !== '');
    const cleanOffers = offers.filter(o => o.trim() !== '');

    const body = {
      ...formData,
      keyResponsibilities: cleanResponsibilities,
      qulification: cleanQualifications,
      whatWeOffer: cleanOffers
    };

    try {
      const endpoint = isEditing ? `/updateHearing/${editId}` : '/addHearing';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(getApiUrl(endpoint), {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const result = await response.json();
      if (result.success) {
        Alert.alert('Success', isEditing ? 'Hearing updated successfully!' : 'Hearing created successfully!');
        setIsModalOpen(false);
        resetForm();
        fetchHearings();
      } else {
        Alert.alert('Error', result.message || 'Failed to save hearing.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Server Error', 'Failed to save hearing record.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this hearing?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(getApiUrl(`/deleteHearing/${id}`), {
                method: 'DELETE'
              });
              const result = await response.json();
              if (result.success) {
                Alert.alert('Deleted', 'Hearing post deleted.');
                fetchHearings();
              } else {
                Alert.alert('Error', result.message || 'Failed to delete.');
              }
            } catch (err) {
              console.error(err);
              Alert.alert('Error', 'Failed to communicate with server.');
            }
          }
        }
      ]
    );
  };

  const handleToggleStatus = async (item) => {
    const newStatus = item.status === 'active' ? 'inactive' : 'active';
    try {
      const response = await fetch(getApiUrl(`/updateHearing/${item._id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const result = await response.json();
      if (result.success) {
        fetchHearings();
      } else {
        Alert.alert('Error', result.message || 'Failed to toggle status');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredHearings = hearings.filter(h => {
    if (activeFilter === 'all') return true;
    return h.status === activeFilter;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={20} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hearing Management</Text>
        <TouchableOpacity onPress={handleOpenCreateModal} style={styles.addButton}>
          <LinearGradient
            colors={['#8b5cf6', '#a855f7']}
            style={styles.addGradient}
          >
            <Plus size={18} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {['all', 'active', 'inactive'].map(filter => (
          <TouchableOpacity
            key={filter}
            onPress={() => setActiveFilter(filter)}
            style={[
              styles.filterTab,
              activeFilter === filter && styles.activeFilterTab
            ]}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === filter && styles.activeFilterText
              ]}
            >
              {filter.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#8b5cf6" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); fetchHearings(); }}
            />
          }
        >
          {filteredHearings.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Briefcase size={48} color="#cbd5e1" />
              <Text style={styles.emptyText}>No hearing postings found.</Text>
            </View>
          ) : (
            filteredHearings.map(item => (
              <View key={item._id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.postTitleContainer}>
                    <Text style={styles.postTitle}>{item.post}</Text>
                    <TouchableOpacity
                      onPress={() => handleToggleStatus(item)}
                      style={[
                        styles.statusBadge,
                        item.status === 'active' ? styles.statusActive : styles.statusInactive
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {item.status ? item.status.toUpperCase() : 'ACTIVE'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.overviewText}>{item.overview}</Text>

                {/* Details Grid */}
                <View style={styles.detailsGrid}>
                  <View style={styles.detailItem}>
                    <DollarSign size={14} color="#8b5cf6" />
                    <Text style={styles.detailText}>{item.salary || 'N/A'}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Users size={14} color="#8b5cf6" />
                    <Text style={styles.detailText}>{item.vacancy ? `${item.vacancy} Vacancies` : 'N/A'}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Award size={14} color="#8b5cf6" />
                    <Text style={styles.detailText}>{item.experience || 'Freshers/Exp'}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Calendar size={14} color="#8b5cf6" />
                    <Text style={styles.detailText}>{item.lastDate ? new Date(item.lastDate).toLocaleDateString() : 'No Deadline'}</Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    onPress={() => handleOpenEditModal(item)}
                    style={styles.actionBtnEdit}
                  >
                    <Edit2 size={14} color="#8b5cf6" />
                    <Text style={styles.actionTextEdit}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(item._id)}
                    style={styles.actionBtnDelete}
                  >
                    <Trash2 size={14} color="#ef4444" />
                    <Text style={styles.actionTextDelete}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* Form Modal Sheet */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isEditing ? 'Edit Hearing Post' : 'New Hearing Post'}
              </Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScroll}>
              <Text style={styles.label}>Post Title *</Text>
              <TextInput
                value={formData.post}
                onChangeText={text => setFormData({ ...formData, post: text })}
                placeholder="e.g. Senior Software Engineer"
                style={styles.input}
              />

              <Text style={styles.label}>Salary *</Text>
              <TextInput
                value={formData.salary}
                onChangeText={text => setFormData({ ...formData, salary: text })}
                placeholder="e.g. ₹4,00,000 - ₹6,00,000 P.A."
                style={styles.input}
              />

              <Text style={styles.label}>Overview *</Text>
              <TextInput
                value={formData.overview}
                onChangeText={text => setFormData({ ...formData, overview: text })}
                placeholder="Brief overview of the role"
                multiline
                style={[styles.input, styles.multilineInput]}
              />

              <Text style={styles.label}>Description</Text>
              <TextInput
                value={formData.description}
                onChangeText={text => setFormData({ ...formData, description: text })}
                placeholder="Full job description"
                multiline
                style={[styles.input, styles.multilineInput]}
              />

              <View style={styles.rowInputs}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.label}>Vacancies</Text>
                  <TextInput
                    value={formData.vacancy}
                    onChangeText={text => setFormData({ ...formData, vacancy: text })}
                    placeholder="e.g. 5"
                    keyboardType="numeric"
                    style={styles.input}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.label}>Experience</Text>
                  <TextInput
                    value={formData.experience}
                    onChangeText={text => setFormData({ ...formData, experience: text })}
                    placeholder="e.g. 2-4 Years"
                    style={styles.input}
                  />
                </View>
              </View>

              <Text style={styles.label}>Last Date to Apply</Text>
              <TextInput
                value={formData.lastDate}
                onChangeText={text => setFormData({ ...formData, lastDate: text })}
                placeholder="YYYY-MM-DD"
                style={styles.input}
              />

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={submitting}
                style={styles.saveButton}
              >
                <LinearGradient
                  colors={['#8b5cf6', '#a855f7']}
                  style={styles.saveGradient}
                >
                  {submitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.saveText}>
                      {isEditing ? 'UPDATE POSTING' : 'CREATE POSTING'}
                    </Text>
                  )}
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
  container: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
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
  backButton: {
    padding: 8
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a'
  },
  addButton: {
    borderRadius: 12,
    overflow: 'hidden'
  },
  addGradient: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center'
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 3
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10
  },
  activeFilterTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  filterText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b'
  },
  activeFilterText: {
    color: '#8b5cf6'
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2
  },
  cardHeader: {
    marginBottom: 8
  },
  postTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
    flex: 1,
    marginRight: 8
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  statusActive: {
    backgroundColor: '#dcfce7'
  },
  statusInactive: {
    backgroundColor: '#fee2e2'
  },
  statusText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#15803d'
  },
  overviewText: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 12,
    lineHeight: 18
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 10,
    gap: 8,
    marginBottom: 12
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    gap: 6
  },
  detailText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600'
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12
  },
  actionBtnEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  actionTextEdit: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8b5cf6'
  },
  actionBtnDelete: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  actionTextDelete: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ef4444'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    padding: 20
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a'
  },
  modalScroll: {
    paddingBottom: 24
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
    marginBottom: 4,
    marginTop: 10
  },
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
  multilineInput: {
    height: 80,
    textAlignVertical: 'top'
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  saveButton: {
    marginTop: 20,
    borderRadius: 14,
    overflow: 'hidden'
  },
  saveGradient: {
    paddingVertical: 14,
    alignItems: 'center'
  },
  saveText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1
  }
});

export default HearingScreen;
