import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { CATEGORIES } from '../../mocks/studios';

const CategoryFilter = () => {
  const [activeCategoryId, setActiveCategoryId] = useState('1');

  const renderItem = ({ item }: { item: typeof CATEGORIES[0] }) => {
    const isActive = item.id === activeCategoryId;
    
    return (
      <TouchableOpacity
        onPress={() => setActiveCategoryId(item.id)}
        style={[
          styles.pill,
          isActive ? styles.pillActive : styles.pillInactive
        ]}
      >
        <Text style={[
          styles.pillText,
          isActive ? styles.pillTextActive : styles.pillTextInactive
        ]}>
          {item.name}
        </Text>
        <View style={[
          styles.countBadge,
          isActive ? styles.countBadgeActive : styles.countBadgeInactive
        ]}>
          <Text style={[
            styles.countText,
            isActive ? styles.countTextActive : styles.countTextInactive
          ]}>
            {item.count}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={CATEGORIES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    marginRight: 10,
    borderWidth: 1,
  },
  pillActive: {
    backgroundColor: '#2D3325',
    borderColor: '#2D3325',
  },
  pillInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EEE',
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
  pillTextInactive: {
    color: '#666',
  },
  countBadge: {
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 20,
  },
  countBadgeActive: {
    backgroundColor: '#3D4435',
  },
  countBadgeInactive: {
    backgroundColor: '#2D3325',
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
  },
  countTextActive: {
    color: '#FFFFFF',
  },
  countTextInactive: {
    color: '#FFFFFF',
  },
});

export default CategoryFilter;
