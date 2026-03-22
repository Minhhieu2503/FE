import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {
  ShieldCheck,
  Bell,
  Users,
  BarChart3,
  Store,
  Flag,
  LogOut,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react-native';
import { authService } from '../../services/auth.service';

const STAT_CARDS = [
  { label: 'Total Users', value: '1,284', icon: Users, color: '#E74C3C' },
  { label: 'Studios', value: '67', icon: Store, color: '#3498DB' },
  { label: 'Revenue', value: '$18.2k', icon: TrendingUp, color: '#2ECC71' },
  { label: 'Reports', value: '5', icon: Flag, color: '#F39C12' },
];

const RECENT_ACTIVITIES = [
  { icon: CheckCircle, color: '#2ECC71', text: 'New studio "GreenLens" approved', time: '2m ago' },
  { icon: Flag, color: '#F39C12', text: 'Report #42 pending review', time: '15m ago' },
  { icon: Users, color: '#3498DB', text: '12 new users registered today', time: '1h ago' },
  { icon: AlertTriangle, color: '#E74C3C', text: 'Studio "BlurFX" flagged', time: '3h ago' },
];

export default function AdminHomeScreen({ navigation }: any) {
  const handleLogout = () => {
    Alert.alert('Logout', 'Do you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await authService.logout();
          navigation.replace('Login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* APP BAR */}
      <View style={styles.appBar}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <ShieldCheck size={18} color="#E74C3C" />
          </View>
          <View>
            <Text style={styles.logoText}>SnapBook</Text>
            <Text style={styles.roleTag}>Admin Panel</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Bell size={22} color="#2D2D3A" />
            <View style={styles.dot} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
            <LogOut size={22} color="#2D2D3A" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* WELCOME BANNER */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Admin Dashboard 🛡️</Text>
          <Text style={styles.bannerSub}>System overview & management</Text>
        </View>

        {/* STAT CARDS */}
        <Text style={styles.sectionTitle}>Platform Overview</Text>
        <View style={styles.statsGrid}>
          {STAT_CARDS.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <View style={[styles.statIconBox, { backgroundColor: stat.color + '20' }]}>
                <stat.icon size={20} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* QUICK MANAGEMENT */}
        <Text style={styles.sectionTitle}>Management</Text>
        <View style={styles.mgmtRow}>
          {[
            { label: 'Manage Users', icon: Users, color: '#3498DB' },
            { label: 'Manage Studios', icon: Store, color: '#2ECC71' },
            { label: 'Reports', icon: Flag, color: '#F39C12' },
            { label: 'Analytics', icon: BarChart3, color: '#E74C3C' },
          ].map((item) => (
            <TouchableOpacity key={item.label} style={styles.mgmtCard} activeOpacity={0.8}>
              <View style={[styles.mgmtIconBox, { backgroundColor: item.color + '15' }]}>
                <item.icon size={24} color={item.color} />
              </View>
              <Text style={styles.mgmtLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* RECENT ACTIVITY */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {RECENT_ACTIVITIES.map((activity, i) => (
          <View key={i} style={styles.activityCard}>
            <View style={[styles.activityIcon, { backgroundColor: activity.color + '20' }]}>
              <activity.icon size={18} color={activity.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.activityText}>{activity.text}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7FB' },
  scroll: { paddingBottom: 32 },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FDECEA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoText: { fontSize: 18, fontWeight: '700', color: '#2D2D3A' },
  roleTag: { fontSize: 11, color: '#E74C3C', fontWeight: '600' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F3F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E74C3C',
    borderWidth: 2,
    borderColor: '#F3F3F8',
  },
  banner: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#2D2D3A',
  },
  bannerTitle: { fontSize: 20, fontWeight: '700', color: '#FFF', marginBottom: 4 },
  bannerSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D2D3A',
    marginHorizontal: 20,
    marginBottom: 12,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  statCard: {
    width: '46%',
    margin: '2%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'flex-start',
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: { fontSize: 22, fontWeight: '800', color: '#2D2D3A' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 2 },
  mgmtRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  mgmtCard: {
    width: '46%',
    margin: '2%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  mgmtIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  mgmtLabel: { fontSize: 12, fontWeight: '600', color: '#2D2D3A', textAlign: 'center' },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 12,
    padding: 14,
  },
  activityIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityText: { fontSize: 13, fontWeight: '500', color: '#2D2D3A' },
  activityTime: { fontSize: 11, color: '#AAA', marginTop: 2 },
});
