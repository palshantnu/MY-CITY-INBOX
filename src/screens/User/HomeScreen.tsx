import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SwiperFlatList from 'react-native-swiper-flatlist';
import { baseURL, getData, postData } from '../../API';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

const UserHomeScreen: React.FC = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector(state => state.user);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryRes = await getData('categories');
        const storeRes = await postData('vendors', {
          city: user.city,
          state: user.state,
        });
        const sliderRes = await getData('app_sliders');

        const categoryData = categoryRes.categories || [];
        const vendorData = storeRes.data || [];
        const sliderData = sliderRes.data || [];

        setCategories(categoryData);
        setStores(vendorData);
        setSliders(sliderData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView edges={['left', 'right', 'top']} style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Image
            source={require('../../../assets/images/banner.jpg')}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.overlay} />
          <View style={styles.bannerContent}>
            <Text style={styles.bannerWelcome}>Welcome</Text>
            <Text style={styles.bannerName}>Soham N</Text>
            <View style={styles.bannerLocation}>
              <Icon name="map-marker" size={16} color="#fff" />
              <Text style={styles.bannerLocationText}>1124 Jupiter, Blackhole, Delhi</Text>
            </View>
          </View>
        </View>

        <View style={{ padding: 18 }}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Icon name="magnify" size={22} color="#aaa" />
            <TextInput
              placeholder="Search for food/stores etc..."
              placeholderTextColor="#999"
              style={styles.searchInput}
            />
          </View>

          {/* Category Section */}
          <View style={[styles.rowBetween, { marginBottom: 10 }]}>
            <Text style={styles.sectionTitle}>Explore by Category</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AllCategory')}>
              <Text style={styles.seeAll}>see all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
            {categories.map((item) => (
              <TouchableOpacity
                onPress={() => navigation.navigate('SubCategory', {
                  categoryId: item.id,
                  categoryName: item.name,
                })}
                key={item.id.toString()}
                style={styles.categoryItem}
              >
                <View style={styles.categoryIcon}>
                  {item.image ? (
                    <Image
                      source={{ uri: `${baseURL}/uploads/categories/${item.image}` }}
                      style={{ width: 26, height: 26, borderRadius: 4 }}
                      resizeMode="contain"
                    />
                  ) : (
                    <Icon name={item.icon || 'shopping-outline'} size={26} color="#fff" />
                  )}
                </View>
                <Text style={styles.categoryText}>{item.name || item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {loading ? (
            <ActivityIndicator size="small" color="#2980b9" />
          ) : (
            <>
              {/* SwiperFlatList Slider */}
              <View style={{ height: 180, marginBottom: 20 }}>
                <SwiperFlatList
                  autoplay
                  autoplayDelay={3}
                  autoplayLoop
                  index={0}
                  showPagination
                  paginationStyleItem={{ width: 10, height: 10, marginHorizontal: 4 }}
                  paginationActiveColor="#2980b9"
                  paginationDefaultColor="#90A4AE"
                >
                  {sliders.map((item) => (
                    <FastImage
                      key={item.id.toString()}
                      source={{ uri: `${baseURL}/uploads/sliders/${item.image_path}` }}
                      style={styles.sliderImage}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  ))}
                </SwiperFlatList>
              </View>

              {/* Categories Horizontal Scroll */}

            </>
          )}

          {/* Store Section */}
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Nearby Stores</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Nearby')}>
              <Text style={styles.seeAll}>see all</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="small" color="#2980b9" />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storeList}>
              {stores.map((item) => (
                <TouchableOpacity onPress={() => navigation.navigate('StoreDetails', { store: item })} key={item.id.toString()} style={styles.storeCard}>
                  <FastImage
                    source={{
                      uri: item.images?.[0]
                        ? `${baseURL}/uploads/vendors/${item.images[0]}`
                        : 'https://cdn-icons-png.flaticon.com/128/18679/18679213.png',
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                    style={styles.storeImage}
                  />
                  <Text style={styles.storeName}>{item.shop_name}</Text>
                  <Text style={styles.storeDesc}>{item.address}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserHomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  bannerContainer: { position: 'relative', width: '100%', height: 200, overflow: 'hidden', marginBottom: 20 },
  bannerImage: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  bannerContent: { position: 'absolute', bottom: 40, left: 20, right: 20 },
  bannerWelcome: { fontSize: 16, color: '#fff' },
  bannerName: { fontSize: 28, fontWeight: '700', color: '#fff', marginTop: 4 },
  bannerLocation: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  bannerLocationText: { color: '#fff', marginLeft: 4, fontSize: 13 },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    alignItems: 'center',
    paddingHorizontal: 14,
    marginVertical: 18,
    height: 50,
    shadowColor: '#ccc',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    position: 'absolute',
    top: -60,
    alignSelf: 'center',
    width: '90%',
  },
  searchInput: { flex: 1, fontSize: 15, marginLeft: 10, color: '#333' },
  sectionTitle: { fontSize: 17, fontWeight: '600', color: '#111', marginBottom: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 },
  seeAll: { color: '#2980b9', fontSize: 14 },
  categoryList: { gap: 12, paddingVertical: 5, marginBottom: 20 },
  categoryItem: { alignItems: 'center', marginRight: 14 },
  categoryIcon: { backgroundColor: '#fff', padding: 16, borderRadius: 50 },
  categoryText: { fontSize: 13, color: '#444', marginTop: 6 },
  sliderImage: { width: width - 36, height: 180, borderRadius: 12, marginRight: 10 },
  storeList: { gap: 16, paddingBottom: 40 },
  storeCard: { width: 140, marginRight: 14 },
  storeImage: { width: '100%', height: 100, borderRadius: 12, marginBottom: 6 },
  storeName: { fontSize: 14, fontWeight: '600', color: '#222' },
  storeDesc: { fontSize: 12, color: '#666' },
});
