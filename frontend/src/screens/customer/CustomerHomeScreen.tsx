import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { 
  Bell, 
  Search, 
  Heart, 
  Calendar, 
  User, 
  Leaf, 
  Plus,
  LogOut,
} from 'lucide-react-native';
import FeaturedBanner from '../../components/home/FeaturedBanner';
import CategoryFilter from '../../components/home/CategoryFilter';
import StudioCard from '../../components/shared/StudioCard';
import { MOCK_STUDIOS } from '../../mocks/studios';
import { authService } from '../../services/auth.service';

const CustomerHomeScreen = ({ navigation }: any) => {
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
  
  const renderHeader = () => (
    <View>
      {/* APP BAR */}
      <View style={styles.appBar}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Leaf size={18} color="#8A9A5B" fill="#8A9A5B" />
          </View>
          <Text style={styles.logoText}>SnapBook</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
            <LogOut size={20} color="#2D3325" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Bell size={24} color="#2D3325" />
            <View style={styles.dot} />
          </TouchableOpacity>
           <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Login')}
           >
             <View style={styles.avatarPlaceholder}>
                <User size={20} color="#8A9A5B" />
             </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* FEATURED BANNER */}
      <FeaturedBanner />

      {/* CATEGORY FILTER */}
      <CategoryFilter />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={MOCK_STUDIOS}
        renderItem={({ item }) => <StudioCard studio={item} />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listPadding}
      />

      {/* FLOATING ACTION BUTTON */}
      <TouchableOpacity style={styles.fab}>
        <Plus size={32} color="#FFFFFF" strokeWidth={2.5} />
      </TouchableOpacity>

      {/* BOTTOM TAB BAR (MOCK) */}
      <View style={styles.bottomTab}>
        <TouchableOpacity style={styles.tabItem}>
          <Leaf size={24} color="#8A9A5B" fill="#8A9A5B" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Search size={24} color="#AAB2A3" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Heart size={24} color="#AAB2A3" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Calendar size={24} color="#AAB2A3" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate('Login')}
        >
          <User size={24} color="#AAB2A3" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6', // Cream
  },
  listPadding: {
    paddingBottom: 100,
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#E8EBDD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D3325',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F3EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8A9A5B',
    borderWidth: 2,
    borderColor: '#F1F3EB',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#8A9A5B',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: '#E8EBDD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#8A9A5B',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#8A9A5B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  bottomTab: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  tabItem: {
    padding: 10,
  },
});

export default CustomerHomeScreen;
