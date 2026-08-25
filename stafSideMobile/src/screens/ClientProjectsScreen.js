import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Briefcase,
  CheckCircle,
  Clock,
  DollarSign,
  User,
  Building,
  Mail,
  Phone,
  Calendar,
  Layers,
  CreditCard
} from 'lucide-react-native';

const ClientProjectsScreen = ({ client, onBack }) => {
  if (!client) return null;

  const totalAmount = parseFloat(client.totalAmount || client.projectCost || 0);
  const paidAmount = parseFloat(client.paidAmount || 0);
  const balanceAmount = Math.max(0, totalAmount - paidAmount);
  const progress = totalAmount > 0 ? Math.min(100, Math.round((paidAmount / totalAmount) * 100)) : 0;

  const payments = client.payments || [];
  const milestones = client.milestones || client.projects || [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={20} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {client.name || 'Client Details'}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Client Profile Banner */}
        <View style={styles.profileCard}>
          <Text style={styles.clientName}>{client.name}</Text>
          {client.company ? (
            <View style={styles.iconRow}>
              <Building size={14} color="#8b5cf6" />
              <Text style={styles.companyText}>{client.company}</Text>
            </View>
          ) : null}

          <View style={styles.contactContainer}>
            {client.email ? (
              <View style={styles.iconRow}>
                <Mail size={12} color="#64748b" />
                <Text style={styles.contactText}>{client.email}</Text>
              </View>
            ) : null}
            {client.phone ? (
              <View style={styles.iconRow}>
                <Phone size={12} color="#64748b" />
                <Text style={styles.contactText}>{client.phone}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Financial Progress Card */}
        <View style={styles.financeCard}>
          <Text style={styles.sectionTitle}>Project Billing Overview</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Total Budget</Text>
              <Text style={styles.statValue}>₹{totalAmount.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Total Paid</Text>
              <Text style={[styles.statValue, { color: '#16a34a' }]}>₹{paidAmount.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Remaining</Text>
              <Text style={[styles.statValue, { color: balanceAmount > 0 ? '#dc2626' : '#64748b' }]}>
                ₹{balanceAmount.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Payment Received</Text>
              <Text style={styles.progressValue}>{progress}%</Text>
            </View>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${progress}%` }]} />
            </View>
          </View>
        </View>

        {/* Milestones / Projects Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Layers size={16} color="#8b5cf6" />
            <Text style={styles.sectionTitleText}>Project Deliverables</Text>
          </View>

          {milestones.length === 0 ? (
            <Text style={styles.emptySectionText}>No milestone records added.</Text>
          ) : (
            milestones.map((m, idx) => (
              <View key={m._id || idx} style={styles.milestoneItem}>
                <View style={styles.milestoneHeader}>
                  <Text style={styles.milestoneTitle}>{m.title || m.name || `Milestone #${idx + 1}`}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>{m.status || 'In Progress'}</Text>
                  </View>
                </View>
                {m.description ? (
                  <Text style={styles.milestoneDesc}>{m.description}</Text>
                ) : null}
              </View>
            ))
          )}
        </View>

        {/* Payment History Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <CreditCard size={16} color="#16a34a" />
            <Text style={styles.sectionTitleText}>Payment Transactions</Text>
          </View>

          {payments.length === 0 ? (
            <Text style={styles.emptySectionText}>No payment transactions logged.</Text>
          ) : (
            payments.map((p, idx) => (
              <View key={p._id || idx} style={styles.paymentItem}>
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentAmount}>+ ₹{(parseFloat(p.amount) || 0).toLocaleString('en-IN')}</Text>
                  <Text style={styles.paymentMode}>{p.mode || 'Online'}</Text>
                </View>
                {p.utr ? <Text style={styles.paymentUtr}>UTR: {p.utr}</Text> : null}
                <Text style={styles.paymentDate}>
                  {p.date ? new Date(p.date).toLocaleDateString() : 'N/A'}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
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
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a', flex: 1, textAlign: 'center' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2
  },
  clientName: { fontSize: 20, fontWeight: '900', color: '#0f172a' },
  companyText: { fontSize: 14, fontWeight: '700', color: '#8b5cf6' },
  iconRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  contactContainer: { marginTop: 10, borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 10 },
  contactText: { fontSize: 13, color: '#475569', fontWeight: '600' },
  financeCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2
  },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#0f172a', marginBottom: 12 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statBox: { backgroundColor: '#f8fafc', padding: 10, borderRadius: 12, width: '31%', alignItems: 'center' },
  statLabel: { fontSize: 10, fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' },
  statValue: { fontSize: 14, fontWeight: '900', color: '#0f172a', marginTop: 4 },
  progressBarContainer: {},
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: 12, fontWeight: '700', color: '#475569' },
  progressValue: { fontSize: 12, fontWeight: '900', color: '#8b5cf6' },
  track: { height: 8, backgroundColor: '#e2e8f0', borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: '#8b5cf6', borderRadius: 4 },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitleText: { fontSize: 15, fontWeight: '800', color: '#0f172a' },
  emptySectionText: { fontSize: 13, color: '#94a3b8', fontStyle: 'italic' },
  milestoneItem: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 12, marginBottom: 8 },
  milestoneHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  milestoneTitle: { fontSize: 14, fontWeight: '800', color: '#1e293b' },
  statusBadge: { backgroundColor: '#dbeafe', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusBadgeText: { fontSize: 10, fontWeight: '800', color: '#1d4ed8' },
  milestoneDesc: { fontSize: 12, color: '#64748b', marginTop: 4 },
  paymentItem: { borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingVertical: 10 },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  paymentAmount: { fontSize: 15, fontWeight: '900', color: '#16a34a' },
  paymentMode: { fontSize: 12, fontWeight: '700', color: '#8b5cf6', backgroundColor: '#f3e8ff', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  paymentUtr: { fontSize: 11, color: '#64748b', marginTop: 2 },
  paymentDate: { fontSize: 11, color: '#94a3b8', marginTop: 2 }
});

export default ClientProjectsScreen;
