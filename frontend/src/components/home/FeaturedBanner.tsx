import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';

const FeaturedBanner = () => {
  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <View style={styles.leftContent}>
          <Text style={styles.title}>Top Studios</Text>
          <Text style={styles.subtitle}>Discover elite creators</Text>
          
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.rightContent}>
          <View style={styles.imageWrapper}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=500&auto=format&fit=crop' }} 
              style={styles.featuredImage}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  banner: {
    backgroundColor: '#8A9A5B',
    borderRadius: 30,
    height: 200,
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
  },
  leftContent: {
    flex: 1.2,
    padding: 24,
    justifyContent: 'center',
    zIndex: 2,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 4,
  },
  subtitle: {
    color: '#E0E5D8',
    fontSize: 14,
    marginBottom: 20,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#8A9A5B',
    fontWeight: '700',
    fontSize: 14,
  },
  rightContent: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  imageWrapper: {
    width: '100%',
    height: '90%',
    backgroundColor: '#9BA876', // Slightly lighter/darker green
    borderTopLeftRadius: 40,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  featuredImage: {
    width: '85%',
    height: '90%',
    borderTopLeftRadius: 20,
  },
});

export default FeaturedBanner;
