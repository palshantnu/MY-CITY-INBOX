import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Dimensions,
    Alert,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { baseURL, getData } from '../../API';
import { useSelector } from 'react-redux';

const screenWidth = Dimensions.get('window').width;

const VendorDashboardScreen: React.FC = () => {
    const [vendor, setVendor] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const user = useSelector(state => state.user);
    const vendorId = user.id; 
    useEffect(() => {
        fetchVendorData();
    }, []);

    const fetchVendorData = async () => {
        try {
            const response = await getData(`vendor/${vendorId}`);
            console.log(response);
            
            if (response.success) {
                const v = response.vendor;
                setVendor({
                    shop_name: v.shop_name,
                    address: v.address,
                    city: v.city,
                    state: v.state,
                    contact_number: v.contact_number,
                    verified: v.verified,
                    category_name: v.category?.name || 'N/A',
                    subcategory_name: v.subcategory?.name || 'N/A',
                    facilities: v.facilities || '',
                    images: v.images?.map((img: string) => `${baseURL}/uploads/vendors/${img}`) || [],
                    created_by: v.created_by,
                    created_at: v.created_at,
                });
            }
        } catch (error) {
            console.error('Failed to fetch vendor:', error);
            Alert.alert('Error', 'Unable to load vendor profile.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogoutPress = () => {
        Alert.alert('Logout', 'Vendor has been logged out.');
    };

    const handleUpdatePress = () => {
        Alert.alert('Navigate', 'Navigate to Update Shop Details screen.');
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#2980b9" />
            </View>
        );
    }

    if (!vendor) return null;

    const {
        shop_name,
        address,
        city,
        state,
        contact_number,
        verified,
        category_name,
        subcategory_name,
        facilities,
        images,
        created_by,
        created_at,
    } = vendor;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#2980b9' }} edges={['left', 'right', 'top']}>
            <StatusBar backgroundColor="#3b82f6" barStyle="light-content" />

            <View style={styles.topBar}>
                <Text style={styles.topBarTitle}>My City Inbox</Text>
            </View>

            <ScrollView style={styles.container}>
                {/* IMAGE SLIDER */}
                <View style={styles.imageSliderWrapper}>
                    <SwiperFlatList
                        autoplay
                        autoplayDelay={3}
                        autoplayLoop
                        showPagination
                        paginationDefaultColor="#ccc"
                        paginationActiveColor="#333"
                        paginationStyleItem={styles.paginationItem}
                        data={images}
                        renderItem={({ item }) => (
                            <Image source={{ uri: item }} style={styles.image} />
                        )}
                    />
                </View>

                {/* SHOP NAME */}
                <Text style={styles.header}>{shop_name}</Text>

                {/* DETAILS */}
                <View style={styles.sectionCard}>
                    <Text style={styles.subText}>
                        <Icon name="location-on" size={18} /> {address}, {city}, {state}
                    </Text>
                    <Text style={styles.subText}>
                        <Icon name="call" size={18} /> {contact_number}
                    </Text>
                    <Text style={[styles.status, verified ? styles.verified : styles.notVerified]}>
                        {verified ? '✅ Verified' : '❌ Not Verified'}
                    </Text>
                </View>

                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Category</Text>
                    <Text style={styles.sectionText}>🗂️ {category_name}</Text>
                    <Text style={styles.sectionText}>🔖 {subcategory_name}</Text>
                </View>

                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Facilities</Text>
                    {facilities.split(',').map((item: string, idx: number) => (
                        <Text key={idx} style={styles.facilityText}>• {item.trim()}</Text>
                    ))}
                </View>

                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Created Info</Text>
                    <Text style={styles.sectionText}>
                        👤 {created_by.charAt(0).toUpperCase() + created_by.slice(1)}
                    </Text>
                    <Text style={styles.sectionText}>
                        🕒 {new Date(created_at).toLocaleString()}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default VendorDashboardScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f6fa',
        paddingHorizontal: 16,
    },
    topBar: {
        height: 56,
        backgroundColor: '#2980b9',
        justifyContent: 'center',
        alignItems: 'center',
        // elevation: 4,
        // shadowColor: '#000',
        // shadowOpacity: 0.3,
        // shadowOffset: { width: 0, height: 2 },
        // shadowRadius: 3,
    },
    topBarTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
    },
    imageSliderWrapper: {
        marginTop: 16,
        marginBottom: 16,
        borderRadius: 10,
        overflow: 'hidden',
        height: 220,
    },
    image: {
        width: screenWidth - 32,
        height: 220,
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
        color: '#222',
    },
    sectionCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 14,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    subText: {
        fontSize: 16,
        color: '#444',
        marginBottom: 4,
    },
    status: {
        marginTop: 6,
        fontSize: 16,
        fontWeight: '600',
    },
    verified: {
        color: 'green',
    },
    notVerified: {
        color: 'red',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 6,
        color: '#333',
    },
    sectionText: {
        fontSize: 16,
        marginBottom: 2,
        color: '#444',
    },
    facilityText: {
        fontSize: 15,
        marginLeft: 10,
        marginBottom: 2,
        color: '#555',
    },
    paginationItem: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
});
