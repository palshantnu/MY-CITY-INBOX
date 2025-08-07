import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Dimensions,
  StatusBar,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import FastImage from 'react-native-fast-image';
import { baseURL, postData, getData } from '../../API';
import { useSelector } from 'react-redux';
import StarRating from 'react-native-star-rating-widget';

const { width } = Dimensions.get('window');

type Review = {
  id: number;
  user_id: number;
  vendor_id: number;
  rating: number;
  review: string;
  created_at: string;
  updated_at: string;
  User: {
    name: string;
  };
};

type StoreDetailsProps = {
  route: {
    params: {
      store: {
        id: number;
        shop_name: string;
        address: string;
        rating?: number;
        description?: string;
        phone?: string;
        images?: string[];
        facilities?: string;
        category?: { id: number; name: string };
        subcategory?: { id: number; name: string };
        city?: string;
        state?: string;
      };
    };
  };
  navigation: any;
};

const StoreDetailsScreen: React.FC<StoreDetailsProps> = ({ route, navigation }) => {
  const { store } = route.params;

  const [rating, setRating] = React.useState(0);
  const [review, setReview] = React.useState('');
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = React.useState(false);

  const user = useSelector((state: any) => state.user);
  const userId = user.id;

  const openPhone = () => {
    if (store.phone) {
      Linking.openURL(`tel:${store.phone}`);
    } else {
      Alert.alert('No phone number available');
    }
  };

  const submitRating = async () => {
    if (rating === 0) {
      Alert.alert('Please provide a rating');
      return;
    }

    const body = {
      user_id: userId,
      vendor_id: store.id,
      rating,
      review,
    };

    try {
      const result = await postData('rate-vendor', body);
      Alert.alert(result.message);
      setRating(0);
      setReview('');
      fetchReviews(); // Refresh reviews after submitting
    } catch (error) {
      console.error(error);
      Alert.alert('Error submitting rating');
    }
  };

  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const response = await getData(`vendor-rating/${store.id}`);
      if (response.success) {
        setReviews(response.reviews);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
    setLoadingReviews(false);
  };

  React.useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Store Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {store.images && store.images.length > 0 ? (
          <View style={styles.sliderWrapper}>
            <SwiperFlatList
              autoplay
              autoplayDelay={3}
              index={0}
              showPagination
              paginationStyleItem={{ width: 6, height: 6 }}
              data={store.images}
              renderItem={({ item }) => (
                <FastImage
                  source={{ uri: `${baseURL}/uploads/vendors/${item}` }}
                  style={styles.storeImage}
                  resizeMode={FastImage.resizeMode.cover}
                />
              )}
            />
          </View>
        ) : (
          <View style={[styles.storeImage, styles.imagePlaceholder]}>
            <Icon name="storefront-outline" size={60} color="#ccc" />
          </View>
        )}

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.storeName}>{store.shop_name}</Text>
            {store.rating !== undefined && (
              <View style={styles.ratingContainer}>
                <Icon name="star" size={18} color="#f1c40f" />
                <Text style={styles.ratingText}>{store.rating.toFixed(1)}</Text>
              </View>
            )}
          </View>

          <View style={styles.infoRow}>
            <Icon name="map-marker" size={20} color="#2980b9" />
            <Text style={styles.infoText}>{store.address}</Text>
          </View>

          {(store.city || store.state) && (
            <View style={styles.infoRow}>
              <Icon name="city" size={20} color="#2980b9" />
              <Text style={styles.infoText}>{`${store.city || ''}, ${store.state || ''}`}</Text>
            </View>
          )}

          {(store.category || store.subcategory) && (
            <View style={styles.tagWrapper}>
              {store.category?.name && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{store.category.name}</Text>
                </View>
              )}
              {store.subcategory?.name && (
                <View style={[styles.tag, { backgroundColor: '#dfe6e9' }]}>
                  <Text style={styles.tagText}>{store.subcategory.name}</Text>
                </View>
              )}
            </View>
          )}

          {store.description && (
            <View style={styles.section}>
              <Text style={styles.sectionText}>{store.description}</Text>
            </View>
          )}

          {store.facilities && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Facilities</Text>
              <Text style={styles.sectionText}>{store.facilities}</Text>
            </View>
          )}

          {store.phone && (
            <View style={styles.infoRow}>
              <Icon name="phone" size={20} color="#2980b9" />
              <Text style={styles.infoText}>{store.phone}</Text>
            </View>
          )}

          <TouchableOpacity style={styles.callButton} onPress={openPhone}>
            <Icon name="phone" size={20} color="#fff" />
            <Text style={styles.callButtonText}>Call Store</Text>
          </TouchableOpacity>

          {/* Rating Form */}
          <View style={styles.inlineRatingForm}>
            <Text style={styles.modalTitle}>Rate This Store</Text>
            <StarRating rating={rating} onChange={setRating} starSize={30} />
            <TextInput
              placeholder="Write a review..."
              value={review}
              onChangeText={setReview}
              multiline
              style={styles.modalInput}
            />
            <TouchableOpacity style={styles.submitButton} onPress={submitRating}>
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </View>

          {/* Reviews List */}
          <View style={{ marginTop: 20 }}>
            <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>User Reviews</Text>
            {loadingReviews ? (
              <ActivityIndicator size="large" color="#2980b9" />
            ) : reviews.length === 0 ? (
              <Text style={{ color: '#555', fontStyle: 'italic' }}>No reviews yet.</Text>
            ) : (
              reviews.map((item) => (
                <View key={item.id} style={styles.reviewContainer}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.avatarPlaceholder}>
                      <Icon name="account-circle" size={40} color="#bbb" />
                    </View>
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>{item.User.name}</Text>
                      <StarRating rating={item.rating} starSize={16} enableSwiping={false} enableHalfStar={true} />
                    </View>
                  </View>
                  {item.review ? (
                    <Text style={styles.reviewText}>{item.review}</Text>
                  ) : null}
                  <Text style={styles.dateText}>
                    {new Date(item.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </Text>
                  <View style={styles.divider} />
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StoreDetailsScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 40,
  },
  headerBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  sliderWrapper: {
    borderRadius: 0,
    overflow: 'hidden',
  },
  storeImage: {
    width,
    height: 240,
    backgroundColor: '#eee',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 240,
    backgroundColor: '#f0f0f0',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storeName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#222',
    flex: 1,
    paddingRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1c40f33',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  ratingText: {
    marginLeft: 6,
    fontWeight: '600',
    color: '#b38f00',
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: 14,
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#555',
    flex: 1,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  sectionText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
  },
  tagWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 8,
  },
  tag: {
    backgroundColor: '#d1d8e0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2d3436',
  },
  callButton: {
    marginTop: 30,
    backgroundColor: '#2980b9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 30,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600',
  },
  rateButton: {
    marginTop: 20,
    backgroundColor: '#f1c40f',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 30,
    marginHorizontal: 20,
  },
  inlineRatingForm: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    // elevation: 3,
    marginBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#2980b9',
    padding: 14,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  /* New review styles for professional look */
  reviewContainer: {
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontWeight: '600',
    fontSize: 16,
    color: '#111',
    marginBottom: 2,
  },
  reviewText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 6,
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    opacity: 0.4,
  },
});
