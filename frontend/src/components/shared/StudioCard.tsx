import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { MapPin, Star, Tag } from 'lucide-react-native';
import { Studio } from '../../mocks/studios';

interface StudioCardProps {
  studio: Studio;
  onPress?: () => void;
}

const StudioCard: React.FC<StudioCardProps> = ({ studio, onPress }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  const onImageLoad = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.imageContainer}>
        <Animated.Image
          source={{ uri: studio.image }}
          style={[styles.image, { opacity: fadeAnim }]}
          onLoad={onImageLoad}
        />
      </View>

      <View style={styles.details}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{studio.name}</Text>
          <Text style={styles.price}>{'$'.repeat(studio.priceLevel)}</Text>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <MapPin size={14} color="#8A9A5B" />
            <Text style={styles.infoText}>{studio.location}</Text>
          </View>

          <View style={styles.infoItem}>
            <Star size={14} color="#FFB02E" fill="#FFB02E" />
            <Text style={styles.infoText}>{studio.rating.toFixed(1)}</Text>
          </View>

          <View style={styles.infoItem}>
            <Tag size={14} color="#8A9A5B" />
            <Text style={styles.infoText}>{studio.tags[0]}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 12,
    flexDirection: 'row',
    marginBottom: 16,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    // Android shadow
    elevation: 3,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  details: {
    flex: 1,
    paddingLeft: 16,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    // Using serif for name as per requirement
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  price: {
    fontSize: 16,
    color: '#8A9A5B',
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
});

export default StudioCard;
