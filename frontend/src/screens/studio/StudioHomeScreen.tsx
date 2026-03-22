import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import {
  Camera,
  Bell,
  CalendarDays,
  BarChart3,
  ImagePlus,
  Settings,
  LogOut,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react-native';
import { authService } from '../../services/auth.service';

const STAT_CARDS = [
  { label: 'Bookings', value: '24', icon: CalendarDays, color: '#7C6AF7' },
  { label: 'Reviews', value: '4.8★', icon: Star, color: '#F7A26A' },
  { label: 'Clients', value: '138', icon: Users, color: '#4ECDC4' },
  { label: 'Revenue', value: '$2.4k', icon: TrendingUp, color: '#6BAF7A' },
];

const QUICK_ACTIONS = [
  { label: 'Upload Photo', icon: ImagePlus, color: '#7C6AF7' },
  { label: 'Schedule', icon: CalendarDays, color: '#F7A26A' },
  { label: 'Analytics', icon: BarChart3, color: '#4ECDC4' },
  { label: 'Settings', icon: Settings, color: '#6BAF7A' },
];

export default function StudioHomeScreen({ navigation }: any) {
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
            <Camera size={18} color="#7C6AF7" />
          </View>
          <View>
            <Text style={styles.logoText}>SnapBook</Text>
            <Text style={styles.roleTag}>Studio Dashboard</Text>
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
          <Text style={styles.bannerTitle}>Welcome back, Studio! 🎞️</Text>
          <Text style={styles.bannerSub}>Here's your performance overview</Text>
        </View>

        {/* STAT CARDS */}
        <Text style={styles.sectionTitle}>Overview</Text>
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

        {/* QUICK ACTIONS */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity key={action.label} style={styles.actionCard} activeOpacity={0.8}>
              <View style={[styles.actionIconBox, { backgroundColor: action.color + '15' }]}>
                <action.icon size={26} color={action.color} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* RECENT BOOKINGS */}
        <Text style={styles.sectionTitle}>Recent Bookings</Text>
        {[1, 2, 3].map((i) => (
          <View key={i} style={styles.bookingCard}>
            <View style={styles.bookingAvatar}>
              <Users size={18} color="#7C6AF7" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bookingName}>Client {i}</Text>
              <Text style={styles.bookingDate}>March {20 + i}, 2026 · 10:00 AM</Text>
            </View>
            <View style={styles.bookingBadge}>
              <Text style={styles.bookingBadgeText}>Confirmed</Text>
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
    backgroundColor: '#EDE9FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoText: { fontSize: 18, fontWeight: '700', color: '#2D2D3A' },
  roleTag: { fontSize: 11, color: '#7C6AF7', fontWeight: '600' },
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
    backgroundColor: '#7C6AF7',
    borderWidth: 2,
    borderColor: '#F3F3F8',
  },
  banner: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#7C6AF7',
  },
  bannerTitle: { fontSize: 20, fontWeight: '700', color: '#FFF', marginBottom: 4 },
  bannerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
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
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  actionCard: {
    width: '46%',
    margin: '2%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  actionIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: { fontSize: 13, fontWeight: '600', color: '#2D2D3A' },
  bookingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 12,
    padding: 14,
  },
  bookingAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EDE9FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bookingName: { fontSize: 14, fontWeight: '600', color: '#2D2D3A' },
  bookingDate: { fontSize: 12, color: '#888', marginTop: 2 },
  bookingBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  bookingBadgeText: { fontSize: 11, fontWeight: '700', color: '#4CAF50' },
});
