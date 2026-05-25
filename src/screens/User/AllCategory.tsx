import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, Image, RefreshControl } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { baseURL, getData } from '../../API';

const AllCategory = () => {
    const navigation = useNavigation();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Fetch data function
    const fetchData = async () => {
        try {
            const categoryRes = await getData('categories');
            const categoryData = categoryRes.categories || [];
            setCategories(categoryData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Refresh function
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
    }, []);

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
            <View style={styles.iconWrapper}>
                {item.image ? (
                    <Image
                        source={{ uri: `${baseURL}/uploads/categories/${item.image}` }}
                        style={styles.categoryImage}
                        resizeMode="cover"
                    />
                ) : (
                    <Icon name={item.icon || 'shopping-outline'} size={28} color="#2980b9" />
                )}
            </View>
            <Text style={styles.categoryText} numberOfLines={1}>
                {item.name || item.label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-left" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>All Category</Text>
                <View style={styles.rightPlaceholder} />
            </View>

            {/* Loader */}
            {loading && !refreshing ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#2980b9" />
                </View>
            ) : (
                <FlatList
                    data={categories}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderCategoryItem}
                    numColumns={3}
                    contentContainerStyle={styles.gridContainer}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    ListEmptyComponent={<Text style={styles.emptyText}>No categories found.</Text>}
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
                />
            )}
        </SafeAreaView>
    );
};

export default AllCategory;

const styles = StyleSheet.create({
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
    gridContainer: {
      padding: 16,
      paddingBottom: 30,
    },
    categoryItem: {
      width: '30%',               // Three items per row with space-between
      alignItems: 'center',
      marginBottom: 24,
    },
    iconWrapper: {
      backgroundColor: '#f5f5f5',   // light gray background
      padding: 6,
      borderRadius: 12,
      marginBottom: 8,
      elevation: 3,              // slight shadow on Android
      shadowColor: '#000',       // shadow for iOS
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      width: '100%',             // full width of item container
      aspectRatio: 1,            // keep square shape (height = width)
      justifyContent: 'center',
      alignItems: 'center',
    },
    categoryText: {
      fontSize: 14,
      fontWeight: '500',
      textAlign: 'center',
      color: '#333',
    },
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      textAlign: 'center',
      marginTop: 40,
      fontSize: 16,
      color: '#666',
    },
    categoryImage: {
      width: '80%',           // smaller than iconWrapper width so padding is visible
      height: '80%',
      borderRadius: 12,       // same radius as iconWrapper
    },
});