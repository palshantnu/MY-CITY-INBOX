import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { baseURL, postData, getData, deleteData } from '../../API';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const NearbyScreen = ({ navigation }) => {
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector(state => state.user);

  const fetchData = async () => {
    setLoading(true);
    try {
      // fetch stores
      const storeRes = await postData('vendors', {
        city: user.city,
        state: user.state,
      });
      const vendorData = storeRes.data || [];
      setStores(vendorData);

      // fetch bookmarks for user
      if (user?.id) {
        const bmRes = await getData(`bookmark/list?user_id=${user.id}`);
        const ids = (bmRes.data || []).map(b => String(b.vendor_id ?? b.vendor?.id ?? b.id));
        setBookmarkedIds(ids);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load stores or bookmarks');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [user?.id])
  );

  const toggleBookmark = async (id) => {
    if (!user?.id) {
      Alert.alert('Login required', 'Please login to bookmark stores.');
      return;
    }

    const strId = String(id);
    const currentlyBookmarked = bookmarkedIds.includes(strId);

    setBookmarkedIds(prev => currentlyBookmarked ? prev.filter(x => x !== strId) : [...prev, strId]);

    try {
      if (currentlyBookmarked) {
        await deleteData('bookmark/remove', { user_id: user.id, vendor_id: id });
      } else {
        await postData('bookmark/add', { user_id: user.id, vendor_id: id });
      }
    } catch (err) {
      console.error('Bookmark API error:', err);
      // rollback on error
      setBookmarkedIds(prev => currentlyBookmarked ? [...prev, strId] : prev.filter(x => x !== strId));
      Alert.alert('Error', 'Could not update bookmark. Please try again.');
    }
  };

  const renderItem = ({ item }) => {
    const strId = String(item.id);
    const isBookmarked = bookmarkedIds.includes(strId);

    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={() => navigation.navigate('StoreDetails', { store: item })} style={styles.card}>
          <FastImage
            source={{
              uri: item.images?.[0] ? `${baseURL}/uploads/vendors/${item.images[0]}` : 'https://cdn-icons-png.flaticon.com/128/18679/18679213.png',
            }}
            resizeMode={FastImage.resizeMode.contain}
            style={styles.image}
          />
          <Text style={styles.title} numberOfLines={1}>{item.shop_name}</Text>
          <Text style={styles.subtitle} numberOfLines={1}>{item.address}</Text>

          <TouchableOpacity
            onPress={() => toggleBookmark(item.id)}
            style={styles.bookmarkButton}
          >
            <Icon
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={isBookmarked ? '#2980b9' : '#bdc3c7'}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.screenTitle}>Nearby Stores</Text>

      {loading && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
      )}

      {!loading && stores.length === 0 && (
        <View style={styles.emptyBox}>
          <Icon name="map-search-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No nearby stores found</Text>
        </View>
      )}

      {!loading && stores.length > 0 && (
        <FlatList
          data={stores}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.rowBetween}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default NearbyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    paddingHorizontal: 16
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2c3e50',
    marginVertical: 20, marginTop: 30
  },
  list: {
    paddingBottom: 20,
  },
  rowBetween: {
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 0
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2d3436',
  },
  subtitle: {
    fontSize: 12,
    color: '#7f8c8d',
    marginVertical: 2,
  },
  bookmarkButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 4,
    backgroundColor: '#ecf0f1',
    borderRadius: 50,
  },
  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 10,
  },
});
