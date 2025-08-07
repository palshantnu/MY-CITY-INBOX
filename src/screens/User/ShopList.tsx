// ShopList.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
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

  const fetchShops = async () => {
    setLoading(true);
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
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const renderShop = ({ item }) => (
    <TouchableOpacity  onPress={() => navigation.navigate('StoreDetails', { store: item })} style={styles.card}>
      <Image
        source={{
          uri: `${baseURL}/uploads/vendors/${item.images?.[0]}`,
        }}
        style={styles.shopImage}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.shop_name}</Text>
        <Text style={styles.details}>{item.address}</Text>
        <Text style={styles.phone}>{item.contact_number}</Text>
        <Text style={styles.tag}>
          {item.category?.name} / {item.subcategory?.name}
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
      {loading ? (
        <ActivityIndicator size="large" color="#2980b9" style={{ marginTop: 40 }} />
      ) : shops.length === 0 ? (
        <Text style={styles.empty}>No shops found</Text>
      ) : (
        <FlatList
          data={shops}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderShop}
          contentContainerStyle={{ padding: 16 }}
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
    width: 40, // For centering title by balancing the layout
  },
  card: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
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
  },
  details: {
    color: '#666',
    marginTop: 4,
  },
  phone: {
    marginTop: 4,
    fontSize: 13,
    color: '#2980b9',
  },
  tag: {
    marginTop: 4,
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#555',
  },
});
