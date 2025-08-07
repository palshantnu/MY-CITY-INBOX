import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { baseURL, getData } from '../../API';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // padding + gap

// Base URL of your API
const BASE_URL = 'http://192.168.29.53:5050/api'; // <-- change this to your actual backend URL

// Helper: GET request

// Helper: DELETE request with body
const deleteData = async (endpoint, body) => {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return await response.json();
  } catch (error) {
    console.error('DELETE error:', error);
    throw error;
  }
};

const BookmarksScreen = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const user = useSelector(state => state.user);
  const isFocused = useIsFocused();
  // Fetch bookmarks list from backend
  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const res = await getData(`bookmark/list?user_id=${user.id}`);
     
      console.log('res',res);
      if (res && res.success && Array.isArray(res.data)) {
        setBookmarks(res.data);
      } else {
        setBookmarks([]);
      }
    } catch (error) {
      console.log('error',error);
      Alert.alert('Error', 'Failed to load bookmarks');
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);
  useFocusEffect(
    useCallback(() => {
      fetchBookmarks();
    }, [])
  );
  // Remove bookmark handler
  const handleRemove = (vendorId) => {
    Alert.alert(
      'Remove Bookmark',
      'Are you sure you want to remove this bookmark?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          onPress: async () => {
            try {
              setDeletingId(vendorId);
              const res = await deleteData('bookmark/remove', {
                user_id: user.id,
                vendor_id: vendorId,
              });
              if (res && res.success) {
                setBookmarks((prev) => prev.filter((item) => item.vendor_id !== vendorId));
                Alert.alert('Removed', 'Bookmark removed successfully');
              } else {
                Alert.alert('Error', res.message || 'Failed to remove bookmark');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to remove bookmark');
            } finally {
              setDeletingId(null);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    
    
    <View style={styles.card}>
      <Image
        source={{ uri:  `${baseURL}/uploads/vendors/${item.Vendor.images[0]}` || 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png' }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {item.Vendor.shop_name || 'Vendor'}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {item.Vendor.address || 'Address not available'}
        </Text>
        <View style={styles.row}>
          {/* <Icon name="bookmark-outline" size={16} color="#2980b9" /> */}
          {/* <Text style={styles.tag}>{item.vendor_category || 'Category'}</Text> */}
        </View>
      </View>
      <TouchableOpacity
        onPress={() => handleRemove(item.vendor_id)}
        style={styles.removeButton}
        disabled={deletingId === item.vendor_id}
      >
        {deletingId === item.vendor_id ? (
          <ActivityIndicator size="small" color="#e74c3c" />
        ) : (
          <Icon name="close-circle-outline" size={24} color="#e74c3c" />
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.screenTitle}>Bookmarked Places</Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      ) : bookmarks.length === 0 ? (
        <View style={styles.emptyBox}>
          <Icon name="bookmark-off-outline" size={60} color="#bdc3c7" />
          <Text style={styles.emptyText}>No bookmarks yet</Text>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => String(item.vendor_id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={styles.rowBetween}
          key={2}
        />
      )}
    </SafeAreaView>
  );
};

export default BookmarksScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8', paddingHorizontal: 16 },
  screenTitle: { fontSize: 24, fontWeight: '700', color: '#2c3e50', marginVertical: 20, marginTop: 30 },
  list: { paddingBottom: 20 },
  rowBetween: { justifyContent: 'space-between', marginBottom: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: CARD_WIDTH,
    flexDirection: 'column',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    position: 'relative',
  },
  image: { width: '100%', height: 100, borderRadius: 12, marginBottom: 12, resizeMode: 'contain' },
  info: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '600', color: '#34495e' },
  subtitle: { fontSize: 13, color: '#7f8c8d', marginVertical: 4 },
  row: { flexDirection: 'row', alignItems: 'center' },
  tag: { marginLeft: 6, fontSize: 13, color: '#2980b9' },
  removeButton: { position: 'absolute', top: 10, right: 10, padding: 4 },
  emptyBox: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  emptyText: { fontSize: 16, color: '#95a5a6', marginTop: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
