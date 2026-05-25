// ShopList.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getData, postData, baseURL } from '../../API';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

const ShopList = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { category_id, subcategory_id } = route.params;
  
  const user = useSelector(state => state.user);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchShops = async () => {
    try {
      const res = await postData('vendor-category-wise', {
        city: user.city,
        state: user.state,
        category_id,
        subcategory_id,
      });
      setShops(res?.data || []);
    } catch (err) {
      console.error('Error loading vendors:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh function
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchShops();
  }, []);

  useEffect(() => {
    fetchShops();
  }, []);

  const renderShop = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('StoreDetails', { store: item })} style={styles.card}>
      <Image
        source={{
          uri: item.images?.[0] 
            ? `${baseURL}/uploads/vendors/${item.images[0]}` 
            : 'https://cdn-icons-png.flaticon.com/128/18679/18679213.png',
        }}
        style={styles.shopImage}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.shop_name}</Text>
        <Text style={styles.details} numberOfLines={2}>{item.address}</Text>
        <Text style={styles.phone}>{item.contact_number}</Text>
        <Text style={styles.tag}>
          {item.category?.name} {item.subcategory?.name ? `/ ${item.subcategory.name}` : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{'Stores'}</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      {/* Body */}
      {loading && !refreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2980b9" />
        </View>
      ) : shops.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="store-off" size={60} color="#ccc" />
          <Text style={styles.empty}>No shops found</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={shops}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderShop}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#2980b9']} // Android
              tintColor="#2980b9" // iOS
              title="Pull to refresh" // iOS
              titleColor="#2980b9" // iOS
            />
          }
          showsVerticalScrollIndicator={false}
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      )}
    </SafeAreaView>
  );
};

export default ShopList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
  },
  backButton: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  rightPlaceholder: {
    width: 40,
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  shopImage: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  details: {
    color: '#666',
    marginTop: 4,
    fontSize: 13,
  },
  phone: {
    marginTop: 4,
    fontSize: 13,
    color: '#2980b9',
    fontWeight: '500',
  },
  tag: {
    marginTop: 4,
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  empty: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
    color: '#555',
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#2980b9',
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});