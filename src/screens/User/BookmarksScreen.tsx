import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 16 padding both sides + 16 gap between cards

const initialBookmarks = [
  {
    id: '1',
    title: 'Green Basket Grocery',
    subtitle: 'Near Central Park',
    image: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png',
    tag: 'Grocery Store',
  },
  {
    id: '2',
    title: 'Sapphire Salon',
    subtitle: '12th Street, Downtown',
    image: 'https://cdn-icons-png.flaticon.com/512/2920/2920068.png',
    tag: 'Beauty & Spa',
  },
  {
    id: '3',
    title: 'Urban Cafe',
    subtitle: 'Near City Center Mall',
    image: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png',
    tag: 'Restaurant',
  },
];

const BookmarksScreen = () => {
  const [bookmarks, setBookmarks] = useState(initialBookmarks);

  const handleRemove = (id: string) => {
    Alert.alert(
      'Remove Bookmark',
      'Are you sure you want to remove this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          onPress: () => {
            setBookmarks((prev) => prev.filter((item) => item.id !== id));
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>{item.subtitle}</Text>
        <View style={styles.row}>
          <Icon name="bookmark-outline" size={16} color="#2980b9" />
          <Text style={styles.tag}>{item.tag}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => handleRemove(item.id)} style={styles.removeButton}>
        <Icon name="close-circle-outline" size={24} color="#e74c3c" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.screenTitle}>Bookmarked Places</Text>
      {bookmarks.length === 0 ? (
        <View style={styles.emptyBox}>
          <Icon name="bookmark-off-outline" size={60} color="#bdc3c7" />
          <Text style={styles.emptyText}>No bookmarks yet</Text>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          numColumns={2}  // Two columns
          columnWrapperStyle={styles.rowBetween} // space between columns
          key={2} // important for numColumns dynamic handling if needed
        />
      )}
    </SafeAreaView>
  );
};

export default BookmarksScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    paddingHorizontal: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    marginVertical: 20,
    marginTop:30
  },
  list: {
    paddingBottom: 20,
  },
  rowBetween: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: CARD_WIDTH,
    // vertical layout
    flexDirection: 'column',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    marginBottom: 12,
    resizeMode: 'contain',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
  },
  subtitle: {
    fontSize: 13,
    color: '#7f8c8d',
    marginVertical: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    marginLeft: 6,
    fontSize: 13,
    color: '#2980b9',
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 4,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  emptyText: {
    fontSize: 16,
    color: '#95a5a6',
    marginTop: 12,
  },
});
