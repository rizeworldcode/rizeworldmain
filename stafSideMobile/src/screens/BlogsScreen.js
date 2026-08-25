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
  Image,
  RefreshControl,
  StatusBar,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit3,
  Search,
  BookOpen,
  X,
  Globe,
  Tag,
  Calendar,
  Eye
} from 'lucide-react-native';

const CATEGORIES = [
  'All', 'Digital Marketing', 'SEO', 'Content Strategy', 
  'Social Media', 'Branding', 'Web Development', 'News & Updates'
];

const BlogsScreen = ({ staffInfo, token, onBack, getApiUrl, onUpdateStaffInfo }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal Sheet State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subheading: '',
    category: 'Digital Marketing',
    tags: '',
    status: 'Published',
    coverImage: '',
    content: ''
  });

  const fetchBlogs = async () => {
    try {
      const response = await fetch(getApiUrl('/blogs'));
      const result = await response.json();
      if (result.success || Array.isArray(result.data)) {
        setBlogs(result.data || []);
      } else {
        Alert.alert('Error', result.message || 'Failed to fetch blogs');
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
    fetchBlogs();
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      subheading: '',
      category: 'Digital Marketing',
      tags: '',
      status: 'Published',
      coverImage: '',
      content: ''
    });
    setEditingBlog(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingBlog(item);
    setFormData({
      title: item.title || '',
      subheading: item.subheading || '',
      category: item.category || 'Digital Marketing',
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || ''),
      status: item.status || 'Published',
      coverImage: item.coverImage || item.image || '',
      content: item.content || item.contentHtml || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      Alert.alert('Validation Error', 'Title and Content body are required.');
      return;
    }

    setSubmitting(true);
    const body = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    try {
      let response;
      if (editingBlog) {
        response = await fetch(`${getApiUrl('/blogs')}/${editingBlog._id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(body)
        });
      } else {
        response = await fetch(getApiUrl('/blogs'), {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(body)
        });
      }

      const result = await response.json();
      if (result.success) {
        Alert.alert('Success', editingBlog ? 'Blog post updated!' : 'Blog post published!');
        setIsModalOpen(false);
        resetForm();
        fetchBlogs();
      } else {
        Alert.alert('Error', result.message || 'Failed to save blog.');
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
      'Delete this blog post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${getApiUrl('/blogs')}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
              });
              const result = await response.json();
              if (result.success) {
                fetchBlogs();
              }
            } catch (err) {
              console.error(err);
            }
          }
        }
      ]
    );
  };

  const filteredBlogs = blogs.filter(b => {
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesSearch = (b.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (b.subheading || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={20} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Blog Management</Text>
        <TouchableOpacity onPress={handleOpenCreateModal} style={styles.addButton}>
          <LinearGradient colors={['#ec4899', '#db2777']} style={styles.addGradient}>
            <Plus size={18} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={16} color="#94a3b8" style={styles.searchIcon} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search blog title..."
          placeholderTextColor="#94a3b8"
          style={styles.searchInput}
        />
      </View>

      {/* Category Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={[styles.filterChip, selectedCategory === cat && styles.activeFilterChip]}
          >
            <Text style={[styles.filterChipText, selectedCategory === cat && styles.activeFilterChipText]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#db2777" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchBlogs(); }} />
          }
        >
          {filteredBlogs.length === 0 ? (
            <View style={styles.emptyContainer}>
              <BookOpen size={48} color="#cbd5e1" />
              <Text style={styles.emptyText}>No blog posts found.</Text>
            </View>
          ) : (
            filteredBlogs.map(item => (
              <View key={item._id} style={styles.card}>
                {item.coverImage || item.image ? (
                  <Image source={{ uri: item.coverImage || item.image }} style={styles.coverImage} resizeMode="cover" />
                ) : null}

                <View style={styles.cardBody}>
                  <View style={styles.cardMetaRow}>
                    <View style={styles.categoryChip}>
                      <Text style={styles.categoryChipText}>{item.category || 'General'}</Text>
                    </View>
                    <View style={[styles.statusBadge, item.status === 'Published' ? styles.statusPub : styles.statusDraft]}>
                      <Text style={styles.statusBadgeText}>{item.status || 'Published'}</Text>
                    </View>
                  </View>

                  <Text style={styles.blogTitle}>{item.title}</Text>
                  {item.subheading ? (
                    <Text style={styles.blogSubheading} numberOfLines={2}>{item.subheading}</Text>
                  ) : null}

                  <View style={styles.cardFooter}>
                    <View style={styles.dateRow}>
                      <Calendar size={12} color="#94a3b8" />
                      <Text style={styles.dateText}>
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                      </Text>
                    </View>

                    <View style={styles.actionRow}>
                      <TouchableOpacity onPress={() => handleOpenEditModal(item)} style={styles.actionBtn}>
                        <Edit3 size={14} color="#db2777" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.actionBtn}>
                        <Trash2 size={14} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* Modal */}
      <Modal visible={isModalOpen} animationType="slide" transparent onRequestClose={() => setIsModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingBlog ? 'Edit Blog Article' : 'New Blog Article'}</Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScroll}>
              <Text style={styles.label}>Article Title *</Text>
              <TextInput
                value={formData.title}
                onChangeText={text => setFormData({ ...formData, title: text })}
                placeholder="Catchy headline..."
                style={styles.input}
              />

              <Text style={styles.label}>Subheading / Summary</Text>
              <TextInput
                value={formData.subheading}
                onChangeText={text => setFormData({ ...formData, subheading: text })}
                placeholder="Brief summary of article"
                style={styles.input}
              />

              <Text style={styles.label}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modalCategoryScroll}>
                {CATEGORIES.filter(c => c !== 'All').map(cat => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setFormData({ ...formData, category: cat })}
                    style={[styles.modalCatChip, formData.category === cat && styles.activeModalCatChip]}
                  >
                    <Text style={[styles.modalCatChipText, formData.category === cat && styles.activeModalCatChipText]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.label}>Cover Image URL</Text>
              <TextInput
                value={formData.coverImage}
                onChangeText={text => setFormData({ ...formData, coverImage: text })}
                placeholder="https://images.unsplash.com/..."
                style={styles.input}
              />

              <Text style={styles.label}>Tags (comma separated)</Text>
              <TextInput
                value={formData.tags}
                onChangeText={text => setFormData({ ...formData, tags: text })}
                placeholder="SEO, Marketing, Growth"
                style={styles.input}
              />

              <Text style={styles.label}>Status</Text>
              <View style={styles.statusSelectRow}>
                {['Published', 'Draft'].map(st => (
                  <TouchableOpacity
                    key={st}
                    onPress={() => setFormData({ ...formData, status: st })}
                    style={[styles.statusOption, formData.status === st && styles.statusOptionActive]}
                  >
                    <Text style={[styles.statusOptionText, formData.status === st && styles.statusOptionTextActive]}>
                      {st}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Content Body *</Text>
              <TextInput
                value={formData.content}
                onChangeText={text => setFormData({ ...formData, content: text })}
                placeholder="Write article content..."
                multiline
                style={[styles.input, styles.contentMultilineInput]}
              />

              <TouchableOpacity onPress={handleSubmit} disabled={submitting} style={styles.saveBtn}>
                <LinearGradient colors={['#ec4899', '#db2777']} style={styles.saveGradient}>
                  {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>PUBLISH BLOG</Text>}
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
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
  activeFilterChip: { backgroundColor: '#db2777' },
  filterChipText: { fontSize: 12, fontWeight: '700', color: '#64748b' },
  activeFilterChipText: { color: '#fff' },
  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { marginTop: 12, fontSize: 14, color: '#94a3b8', fontWeight: '600' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2
  },
  coverImage: { width: '100%', height: 160 },
  cardBody: { padding: 16 },
  cardMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  categoryChip: { backgroundColor: '#fce7f3', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  categoryChipText: { fontSize: 10, fontWeight: '800', color: '#db2777' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusPub: { backgroundColor: '#dcfce7' },
  statusDraft: { backgroundColor: '#f1f5f9' },
  statusBadgeText: { fontSize: 10, fontWeight: '800', color: '#15803d' },
  blogTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginBottom: 4 },
  blogSubheading: { fontSize: 12, color: '#64748b', marginBottom: 12, lineHeight: 17 },
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
  actionRow: { flexDirection: 'row', gap: 12 },
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
  contentMultilineInput: { height: 140, textAlignVertical: 'top' },
  modalCategoryScroll: { marginVertical: 4 },
  modalCatChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, backgroundColor: '#f1f5f9', marginRight: 6 },
  activeModalCatChip: { backgroundColor: '#db2777' },
  modalCatChipText: { fontSize: 11, fontWeight: '700', color: '#64748b' },
  activeModalCatChipText: { color: '#fff' },
  statusSelectRow: { flexDirection: 'row', gap: 8, marginVertical: 4 },
  statusOption: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8, backgroundColor: '#f1f5f9' },
  statusOptionActive: { backgroundColor: '#db2777' },
  statusOptionText: { fontSize: 12, fontWeight: '700', color: '#64748b' },
  statusOptionTextActive: { color: '#fff' },
  saveBtn: { marginTop: 20, borderRadius: 14, overflow: 'hidden' },
  saveGradient: { paddingVertical: 14, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '900', fontSize: 14, letterSpacing: 1 }
});

export default BlogsScreen;
