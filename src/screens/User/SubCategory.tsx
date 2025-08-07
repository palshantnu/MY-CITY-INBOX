import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { baseURL, getData } from '../../API';  // Make sure baseURL is imported

const SubCategory = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { categoryId, categoryName } = route.params as { categoryId: number; categoryName: string };

    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSubcategories = async () => {
        try {
            const res = await getData(`subcategories/${categoryId}`);
            setSubcategories(res.subcategories || []);
        } catch (error) {
            console.error('Failed to load subcategories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubcategories();
    }, []);

    const renderSubcategory = ({ item }) => (
        <TouchableOpacity
            onPress={() =>
                navigation.navigate('ShopList', {
                    category_id: categoryId,
                    subcategory_id: item.id,
                })
            }

            style={styles.subcategoryItem}
        >
            <View style={styles.iconWrapper}>
                {item.image ? (
                    <Image
                        source={{ uri: `${baseURL}/uploads/subcategories/${item.image}` }}
                        style={styles.subcategoryImage}
                        resizeMode="cover"
                    />
                ) : (
                    <Icon name={item.icon || 'apps'} size={28} color="#fff" />
                )}
            </View>
            <Text style={styles.subcategoryText} numberOfLines={1}>
                {item.name}
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
                <Text style={styles.title}>{categoryName || 'Subcategories'}</Text>
                <View style={styles.rightPlaceholder} />
            </View>

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#2980b9" />
                </View>
            ) : (
                <FlatList
                    data={subcategories}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderSubcategory}
                    numColumns={2}   // changed to 2 for cleaner layout, change to 3 if needed
                    contentContainerStyle={styles.gridContainer}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    ListEmptyComponent={<Text style={styles.emptyText}>No subcategories found.</Text>}
                />
            )}
        </SafeAreaView>
    );
};

export default SubCategory;

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
    },
    subcategoryItem: {
        width: '48%',        // 2 columns with space-between
        alignItems: 'center',
        marginBottom: 24,
    },
    iconWrapper: {
        backgroundColor: '#fff',
        width: '100%',
        aspectRatio: 1,       // square
        borderRadius: 12,
        marginBottom: 8,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    subcategoryImage: {
        width: '80%',
        height: '80%',
        borderRadius: 12,
    },
    subcategoryText: {
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
});
