import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { baseURL, postData } from '../../API';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 16 padding on both sides + 16 gap between cards


const NearbyScreen = ({navigation}) => {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector(state => state.user);
  
  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };
  useEffect(() => {
    const fetchData = async () => {
      try {

        const storeRes = await postData('vendors', {
          city: user.city,
          state: user.state,
        });
        const vendorData = storeRes.data || [];
        setStores(vendorData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const renderItem = ({ item }) => {
    const isBookmarked = bookmarkedIds.includes(item.id);

    return (
      <SafeAreaView
        edges={['left', 'right', 'top']}
        style={{
          flex: 1,
        }}>
        <TouchableOpacity onPress={() => navigation.navigate('StoreDetails', { store: item })} style={styles.card}>
          <FastImage
            source={{
              uri: item.images?.[0]
                ? `${baseURL}/uploads/vendors/${item.images[0]}`
                : 'https://cdn-icons-png.flaticon.com/128/18679/18679213.png',
            }}
            resizeMode={FastImage.resizeMode.contain}
            style={styles.image}
          />
          <Text style={styles.title} numberOfLines={1}>
            {item.shop_name}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {item.address}
          </Text>
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
      </SafeAreaView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.screenTitle}>Nearby Stores</Text>

      {stores.length === 0 ? (
        <View style={styles.emptyBox}>
          <Icon name="map-search-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No nearby stores found</Text>
        </View>
      ) : (
        <FlatList
          key={2}
          data={stores}
          keyExtractor={(item) => item.id}
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
    paddingHorizontal: 16,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2c3e50',
    marginVertical: 20,
    marginTop: 30
  },
  list: {
    paddingBottom: 20,
  },
  rowBetween: {
    justifyContent: 'space-between',
    marginBottom: 16,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  distance: {
    marginLeft: 4,
    fontSize: 12,
    color: '#95a5a6',
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
