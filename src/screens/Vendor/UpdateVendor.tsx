import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform, ScrollView, Image, Alert,
    ActivityIndicator, Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

type Vendor = {
    id: number;
    shop_name: string;
    address: string;
    city: string;
    state: string;
    contact_number: string;
    facilities?: string;
    images?: string[];
    category_id?: number;
    subcategory_id?: number;
};

const UpdateVendor: React.FC = () => {
    const navigation = useNavigation();
    const user = useSelector((state: any) => state.user);
    const vendorId = user.id;

    const [shopName, setShopName] = useState('');
    const [address, setAddress] = useState('');
    const [addressLink, setAddressLink] = useState('');
    const [city, setCity] = useState('');
    const [stateName, setStateName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [facilities, setFacilities] = useState('');
    const [password, setPassword] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<ImageOrVideo[]>([]);

    const [states, setStates] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [subcategories, setSubcategories] = useState<{ id: number; name: string }[]>([]);

    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [subcategoryId, setSubcategoryId] = useState<number | null>(null);

    // Loading states
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [initialDataLoading, setInitialDataLoading] = useState(true);

    useEffect(() => {
        fetchInitialData();
    }, [vendorId]);

    const fetchInitialData = async () => {
        setInitialDataLoading(true);
        try {
            // Fetch states
            const statesRes = await fetch('https://mycityinbox.com/api/states');
            const statesJson = await statesRes.json();
            if (statesJson.states) setStates(statesJson.states);

            // Fetch categories
            const categoriesRes = await fetch('https://mycityinbox.com/api/categories');
            const categoriesJson = await categoriesRes.json();
            if (categoriesJson.categories) setCategories(categoriesJson.categories);

            // Fetch vendor data
            const vendorRes = await fetch(`https://mycityinbox.com/api/vendor/${vendorId}`);
            const vendorJson = await vendorRes.json();

            if (vendorJson.success && vendorJson.vendor) {
                const v = vendorJson.vendor;
                setShopName(v.shop_name);
                setAddress(v.address);
                setAddressLink(v.address_link || '');
                setCity(v.city);
                setStateName(v.state);
                setContactNumber(v.contact_number);
                setFacilities(v.facilities || '');
                setImages(v.images || []);
                setCategoryId(v.category_id || null);
                setSubcategoryId(v.subcategory_id || null);

                if (v.state) {
                    const cityRes = await fetch(`https://mycityinbox.com/api/cities?state=${encodeURIComponent(v.state)}`);
                    const cityData = await cityRes.json();
                    setCities(cityData.cities);
                }

                if (v.category_id) {
                    const subRes = await fetch(`https://mycityinbox.com/api/subcategories/${v.category_id}`);
                    const subData = await subRes.json();
                    setSubcategories(subData.subcategories);
                }
            }
        } catch (error) {
            console.error('Error fetching initial data:', error);
            Alert.alert('Error', 'Failed to load vendor data');
        } finally {
            setInitialDataLoading(false);
        }
    };

    const pickImage = () => {
        ImagePicker.openPicker({
            multiple: true,
            mediaType: 'photo',
            cropping: false,
            compressImageQuality: 0.8,
            maxFiles: 10
        })
            .then((selected) => {
                if (Array.isArray(selected)) {
                    setNewImages(prev => [...prev, ...selected]);
                } else {
                    setNewImages(prev => [...prev, selected]);
                }
            })
            .catch(err => {
                if (err.code !== 'E_PICKER_CANCELLED') {
                    console.error('ImagePicker Error:', err);
                }
            });
    };

    const handleUpdate = async () => {
        if (!shopName || !address || !contactNumber || !stateName || !city || !categoryId) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        setIsUpdating(true);

        try {
            const formData = new FormData();
            formData.append('shop_name', shopName);
            formData.append('address', address);
            formData.append('address_link', addressLink);
            formData.append('city', city);
            formData.append('state', stateName);
            formData.append('contact_number', contactNumber);
            formData.append('facilities', facilities);
            formData.append('category_id', String(categoryId));
            if (subcategoryId) formData.append('subcategory_id', String(subcategoryId));
            if (password) formData.append('password', password);

            newImages.forEach((img, index) => {
                if ('path' in img && img.path) {
                    formData.append('images', {
                        uri: img.path,
                        name: `vendor-${index}.jpg`,
                        type: img.mime || 'image/jpeg'
                    } as any);
                }
            });

            const res = await fetch(`https://mycityinbox.com/api/vendor-update/${vendorId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'multipart/form-data' },
                body: formData
            });

            const json = await res.json();

            if (res.ok) {
                Alert.alert('Success', 'Shop Details updated successfully');
                navigation.goBack();
            } else {
                Alert.alert('Error', json.message || 'Update failed');
            }
        } catch (error) {
            console.error('Update error:', error);
            Alert.alert('Error', 'Network error. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    if (initialDataLoading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#2980b9' }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-left" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Update Shop Details</Text>
                    <View style={{ width: 40 }} />
                </View>
                <View style={[styles.container, styles.loadingContainer]}>
                    <ActivityIndicator size="large" color="#2980b9" />
                    <Text style={styles.loadingText}>Loading vendor data...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#2980b9' }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-left" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Update Shop Details</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView
                    contentContainerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                >
                    <CustomInput icon="store-outline" placeholder="Shop Name" value={shopName} onChangeText={setShopName} />
                    <CustomInput icon="map-marker-outline" placeholder="Address" value={address} onChangeText={setAddress} />
<CustomInput
 icon="google-maps"
 placeholder="Google Map Link"
 value={addressLink}
 onChangeText={setAddressLink}
/>
                    <Text style={styles.sectionTitle}>State</Text>
                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={stateName}
                            onValueChange={async (value) => {
                                setStateName(value);
                                if (value) {
                                    setIsLoading(true);
                                    try {
                                        const res = await fetch(`https://mycityinbox.com/api/cities?state=${encodeURIComponent(value)}`);
                                        const cityData = await res.json();
                                        setCities(cityData.cities);
                                        setCity('');
                                    } catch (error) {
                                        console.error('Error fetching cities:', error);
                                    } finally {
                                        setIsLoading(false);
                                    }
                                }
                            }}
                            style={styles.picker}
                            enabled={!isLoading}
                        >
                            <Picker.Item label="Select State" value="" />
                            {states.map((s, idx) => <Picker.Item key={idx} label={s} value={s} />)}
                        </Picker>
                        {isLoading && (
                            <ActivityIndicator size="small" color="#2980b9" style={styles.pickerLoader} />
                        )}
                    </View>

                    <Text style={styles.sectionTitle}>City</Text>
                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={city}
                            onValueChange={setCity}
                            style={styles.picker}
                            enabled={!isLoading}
                        >
                            <Picker.Item label="Select City" value="" />
                            {cities.map((c, idx) => <Picker.Item key={idx} label={c} value={c} />)}
                        </Picker>
                    </View>

                    <CustomInput icon="phone-outline" placeholder="Contact Number" value={contactNumber} onChangeText={setContactNumber} keyboardType="phone-pad" />
                    <CustomInput icon="note-text-outline" placeholder="Facilities" value={facilities} onChangeText={setFacilities} />

                    <Text style={styles.sectionTitle}>Category</Text>
                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={categoryId}
                            onValueChange={async (value) => {
                                setCategoryId(value);
                                if (value) {
                                    setIsLoading(true);
                                    try {
                                        const res = await fetch(`https://mycityinbox.com/api/subcategories/${value}`);
                                        const subData = await res.json();
                                        setSubcategories(subData.subcategories);
                                        setSubcategoryId(null);
                                    } catch (error) {
                                        console.error('Error fetching subcategories:', error);
                                    } finally {
                                        setIsLoading(false);
                                    }
                                }
                            }}
                            style={styles.picker}
                            enabled={!isLoading}
                        >
                            <Picker.Item label="Select Category" value={null} />
                            {categories.map((c) => <Picker.Item key={c.id} label={c.name} value={c.id} />)}
                        </Picker>
                        {isLoading && (
                            <ActivityIndicator size="small" color="#2980b9" style={styles.pickerLoader} />
                        )}
                    </View>

                    <Text style={styles.sectionTitle}>Subcategory</Text>
                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={subcategoryId}
                            onValueChange={setSubcategoryId}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select Subcategory" value={null} />
                            {subcategories.map((sc) => <Picker.Item key={sc.id} label={sc.name} value={sc.id} />)}
                        </Picker>
                    </View>

                    <Text style={styles.sectionTitle}>Existing Images</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {images.map((img, idx) => (
                            <Image
                                key={idx}
                                source={{ uri: `https://mycityinbox.com/uploads/vendors/${img}` }}
                                style={styles.image}
                            />
                        ))}
                    </ScrollView>

                    <Text style={styles.sectionTitle}>Add New Images</Text>
                    <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
                        <Icon name="image-plus" size={20} color="#7f8c8d" />
                        <Text style={styles.imageText}>Choose Images</Text>
                    </TouchableOpacity>

                    {newImages.length > 0 && (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {newImages.map((img, idx) => (
                                <View key={idx} style={{ position: 'relative', marginRight: 8 }}>
                                    <Image source={{ uri: 'path' in img ? img.path : '' }} style={styles.image} />
                                    <TouchableOpacity
                                        style={styles.removeBtn}
                                        onPress={() => setNewImages(newImages.filter((_, i) => i !== idx))}
                                    >
                                        <Text style={{ color: '#fff', fontSize: 12 }}>✕</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    )}

                    <TouchableOpacity
                        onPress={handleUpdate}
                        disabled={isUpdating}
                    >
                        <LinearGradient
                            colors={isUpdating ? ['#95a5a6', '#7f8c8d'] : ['#2980b9', '#2c3e50']}
                            style={[styles.button, isUpdating && styles.disabledButton]}
                        >
                            {isUpdating ? (
                                <View style={styles.buttonContent}>
                                    <ActivityIndicator size="small" color="#fff" />
                                    <Text style={[styles.buttonText, { marginLeft: 10 }]}>Updating...</Text>
                                </View>
                            ) : (
                                <Text style={styles.buttonText}>Update Vendor</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>

                {/* Optional: Full screen loading modal for update */}
                <Modal
                    transparent={true}
                    visible={isUpdating}
                    animationType="fade"
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <ActivityIndicator size="large" color="#2980b9" />
                            <Text style={styles.modalText}>Updating vendor details...</Text>
                            <Text style={styles.modalSubText}>Please wait</Text>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

const CustomInput = ({ icon, ...props }: any) => (
    <View style={styles.inputWrapper}>
        <Icon name={icon} size={20} color="#7f8c8d" style={styles.icon} />
        <TextInput style={styles.input} placeholderTextColor="#aaa" {...props} />
    </View>
);

export default UpdateVendor;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2980b9',
        paddingVertical: 12,
        paddingHorizontal: 15,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    container: {
        padding: 20,
        backgroundColor: '#f4f6f8',
        flexGrow: 1
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 400,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#34495e',
    },
    sectionTitle: {
        fontWeight: '600',
        fontSize: 14,
        marginBottom: 8,
        marginTop: 12,
        color: '#34495e'
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        borderColor: '#dcdde1',
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginBottom: 16
    },
    icon: {
        marginRight: 10
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#2c3e50'
    },
    pickerWrapper: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderColor: '#dcdde1',
        borderWidth: 1,
        marginBottom: 16,
        position: 'relative',
    },
    picker: {
        color: '#000',
        height: 50,
    },
    pickerLoader: {
        position: 'absolute',
        right: 10,
        top: 15,
    },
    button: {
        marginTop: 20,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center'
    },
    disabledButton: {
        opacity: 0.7,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    },
    imageBox: {
        borderWidth: 1,
        borderColor: '#bdc3c7',
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginBottom: 16,
        flexDirection: 'row',
        gap: 8
    },
    imageText: {
        color: '#7f8c8d',
        marginLeft: 8
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginRight: 8,
        borderRadius: 8
    },
    removeBtn: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: 'red',
        borderRadius: 10,
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalText: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: '600',
        color: '#2c3e50',
    },
    modalSubText: {
        marginTop: 4,
        fontSize: 14,
        color: '#7f8c8d',
    },
});