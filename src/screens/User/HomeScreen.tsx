import React, { useEffect, useState, useCallback } from 'react';
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
  FlatList,
  RefreshControl,
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
  const [refreshing, setRefreshing] = useState(false);
  const [banner, setBanner] = useState('');
  const user = useSelector(state => state.user);

  // Fetch data function
  const fetchData = async () => {
    try {
      const categoryRes = await getData('categories');
      const storeRes = await postData('vendors', {
        city: user.city,
        state: user.state,
      });
      const sliderRes = await getData('app_sliders');
      const bannerRes = await getData('banner');

      const categoryData = categoryRes.categories || [];
      const vendorData = storeRes.data || [];
      const sliderData = sliderRes.data || [];
      const bannerData = bannerRes.data || [];
      console.log('categoryData', categoryData);

      setBanner(bannerData.image);
      setCategories(categoryData);
      setStores(vendorData);
      setSliders(sliderData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Refresh function
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  // Calculate number of columns based on screen width
  const numColumns = 4;
  
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('SubCategory', {
          categoryId: item.id,
          categoryName: item.name,
        })
      }
      style={styles.categoryItem}
    >
      <View style={styles.categoryIcon}>
        {item.image ? (
          <Image
            source={{ uri: `${baseURL}/uploads/categories/${item.image}` }}
            style={styles.categoryImage}
            resizeMode="cover"
          />
        ) : (
          <Icon
            name={item.icon || 'shopping-outline'}
            size={26}
            color="#2980b9"
          />
        )}
      </View>
      <Text style={styles.categoryText} numberOfLines={1}>
        {item.name || item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView edges={['left', 'right', 'top']} style={{ flex: 1 }}>
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2980b9']}
            tintColor="#2980b9"
            title="Pull to refresh"
            titleColor="#2980b9"
          />
        }
      >
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: `${baseURL}/uploads/banner/${banner}` }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.overlay} />
          <View style={styles.bannerContent}>
            <Text style={styles.bannerWelcome}>Welcome</Text>
            <Text style={styles.bannerName}>{user.name}</Text>
            <View style={styles.bannerLocation}>
              <Icon name="map-marker" size={16} color="#fff" />
              <Text style={styles.bannerLocationText}>{user.city}{' , '}{user.state}</Text>
            </View>
          </View>
        </View>

        <View style={{ padding: 18 }}>
          {/* Search Bar */}
          <TouchableOpacity
            onPress={() => navigation.navigate('SearchScreen')}
            style={styles.searchContainer}
            activeOpacity={0.8}
          >
            <Icon name="magnify" size={22} color="#aaa" style={{ marginLeft: 10 }} />
            <TextInput
              editable={false}
              placeholder="Search for food/stores etc..."
              placeholderTextColor="#999"
              style={styles.searchInput}
            />
          </TouchableOpacity>

          {/* Category Section */}
          <View style={[styles.rowBetween, { marginBottom: 15 }]}>
            <Text style={styles.sectionTitle}>Explore by Category</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AllCategory')}>
              <Text style={styles.seeAll}>see all</Text>
            </TouchableOpacity>
          </View>

          {/* Categories Grid - No Scrolling */}
          <View style={styles.categoryGridContainer}>
            {loading && !refreshing ? (
              <ActivityIndicator size="small" color="#2980b9" />
            ) : (
              <FlatList
                data={categories}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={numColumns}
                scrollEnabled={false}
                columnWrapperStyle={styles.categoryRow}
                contentContainerStyle={styles.categoryGrid}
              />
            )}
          </View>

          {/* Slider Section - Fixed */}
          {!loading && sliders.length > 0 && (
            <View style={styles.sliderContainer}>
              <SwiperFlatList
                autoplay
                autoplayDelay={3}
                autoplayLoop
                index={0}
                showPagination
                paginationStyleItem={styles.paginationDot}
                paginationActiveColor="#2980b9"
                paginationDefaultColor="#90A4AE"
              >
                {sliders.map((item) => (
                  <View key={item.id.toString()} style={styles.sliderItemContainer}>
                    <FastImage
                      source={{ uri: `${baseURL}/uploads/sliders/${item.image_path}` }}
                      style={styles.sliderImage}
                      resizeMode={FastImage.resizeMode.stretch}
                    />
                  </View>
                ))}
              </SwiperFlatList>
            </View>
          )}

          {/* Store Section */}
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Nearby Stores</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Nearby')}>
              <Text style={styles.seeAll}>see all</Text>
            </TouchableOpacity>
          </View>

          {loading && !refreshing ? (
            <ActivityIndicator size="small" color="#2980b9" style={styles.storeLoader} />
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.storeList}
            >
              {stores.map((item) => (
                <TouchableOpacity 
                  onPress={() => navigation.navigate('StoreDetails', { store: item })} 
                  key={item.id.toString()} 
                  style={styles.storeCard}
                >
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
                  <Text style={styles.storeDesc} numberOfLines={1}>{item.address}</Text>
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
  bannerContainer: { position: 'relative', width: '100%', height: 170, overflow: 'hidden', marginBottom: 20 },
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
  sectionTitle: { fontSize: 17, fontWeight: '600', color: '#111', marginBottom: 0 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 },
  seeAll: { color: '#2980b9', fontSize: 14 },
  
  // Category Grid Styles
  categoryGridContainer: {
    marginBottom: 10,
  },
  categoryGrid: {
    paddingVertical: 10,
  },
  categoryRow: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  categoryItem: {
    alignItems: 'center',
    width: (width - 60) / 4,
    marginHorizontal: 2,
  },
  categoryIcon: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 10,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#444',
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // Fixed Slider Styles
  sliderContainer: {
    height: 200,
    marginBottom: 20,
    marginTop: 10,
    width: width,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  sliderItemContainer: {
    width: width,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderImage: {
    width: width - 36,
    height: 190,
    borderRadius: 12,
  },
  paginationDot: {
    width: 8,
    height: 8,
    marginHorizontal: 4,
  },
  
  // Store Styles
  storeList: { 
    gap: 16, 
    paddingBottom: 40,
    paddingTop: 10,
  },
  storeCard: { 
    width: 140, 
    marginRight: 14 
  },
  storeImage: { 
    width: '100%', 
    height: 100, 
    borderRadius: 12, 
    marginBottom: 6 
  },
  storeName: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#222' 
  },
  storeDesc: { 
    fontSize: 12, 
    color: '#666' 
  },
  storeLoader: {
    marginTop: 20,
  },
});