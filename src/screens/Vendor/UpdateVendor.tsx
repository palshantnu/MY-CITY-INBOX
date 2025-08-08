import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform, ScrollView, Image, Alert
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

    useEffect(() => {
        fetch('http://192.168.29.53:5050/api/states')
            .then(res => res.json())
            .then(json => json.states && setStates(json.states));

        fetch('http://192.168.29.53:5050/api/categories')
            .then(res => res.json())
            .then(json => json.categories && setCategories(json.categories));

        fetch(`http://192.168.29.53:5050/api/vendor/${vendorId}`)
            .then(res => res.json())
            .then((json: { success: boolean; vendor: Vendor }) => {
                if (json.success && json.vendor) {
                    const v = json.vendor;
                    setShopName(v.shop_name);
                    setAddress(v.address);
                    setCity(v.city);
                    setStateName(v.state);
                    setContactNumber(v.contact_number);
                    setFacilities(v.facilities || '');
                    setImages(v.images || []);
                    setCategoryId(v.category_id || null);
                    setSubcategoryId(v.subcategory_id || null);

                    if (v.state) {
                        fetch(`http://192.168.29.53:5050/api/cities?state=${encodeURIComponent(v.state)}`)
                            .then(res => res.json())
                            .then(cityData => setCities(cityData.cities));
                    }

                    if (v.category_id) {
                        fetch(`http://192.168.29.53:5050/api/subcategories/${v.category_id}`)
                            .then(res => res.json())
                            .then(subData => setSubcategories(subData.subcategories));
                    }
                }
            });
    }, [vendorId]);

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

        const formData = new FormData();
        formData.append('shop_name', shopName);
        formData.append('address', address);
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

        const res = await fetch(`http://192.168.29.53:5050/api/vendor-update/${vendorId}`, {
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
    };

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

                <ScrollView contentContainerStyle={styles.container}>
                    <CustomInput icon="store-outline" placeholder="Shop Name" value={shopName} onChangeText={setShopName} />
                    <CustomInput icon="map-marker-outline" placeholder="Address" value={address} onChangeText={setAddress} />

                    <Text style={styles.sectionTitle}>State</Text>
                    <Picker
                        selectedValue={stateName}
                        onValueChange={(value) => {
                            setStateName(value);
                            fetch(`http://192.168.29.53:5050/api/cities?state=${encodeURIComponent(value)}`)
                                .then(res => res.json())
                                .then(cityData => {
                                    setCities(cityData.cities);
                                    setCity('');
                                });
                        }}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select State" value="" />
                        {states.map((s, idx) => <Picker.Item key={idx} label={s} value={s} />)}
                    </Picker>

                    <Text style={styles.sectionTitle}>City</Text>
                    <Picker
                        selectedValue={city}
                        onValueChange={setCity}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select City" value="" />
                        {cities.map((c, idx) => <Picker.Item key={idx} label={c} value={c} />)}
                    </Picker>

                    <CustomInput icon="phone-outline" placeholder="Contact Number" value={contactNumber} onChangeText={setContactNumber} keyboardType="phone-pad" />
                    <CustomInput icon="note-text-outline" placeholder="Facilities" value={facilities} onChangeText={setFacilities} />

                    <Text style={styles.sectionTitle}>Category</Text>
                    <Picker
                        selectedValue={categoryId}
                        onValueChange={(value) => {
                            setCategoryId(value);
                            fetch(`http://192.168.29.53:5050/api/subcategories/${value}`)
                                .then(res => res.json())
                                .then(subData => {
                                    setSubcategories(subData.subcategories);
                                    setSubcategoryId(null);
                                });
                        }}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select Category" value={null} />
                        {categories.map((c) => <Picker.Item key={c.id} label={c.name} value={c.id} />)}
                    </Picker>

                    <Text style={styles.sectionTitle}>Subcategory</Text>
                    <Picker
                        selectedValue={subcategoryId}
                        onValueChange={setSubcategoryId}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select Subcategory" value={null} />
                        {subcategories.map((sc) => <Picker.Item key={sc.id} label={sc.name} value={sc.id} />)}
                    </Picker>

                    <Text style={styles.sectionTitle}>Existing Images</Text>
                    <ScrollView horizontal>
                        {images.map((img, idx) => (
                            <Image key={idx} source={{ uri: `http://192.168.29.53:5050/uploads/vendors/${img}` }} style={styles.image} />
                        ))}
                    </ScrollView>

                    <Text style={styles.sectionTitle}>Add New Images</Text>
                    <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
                        <Icon name="image-plus" size={20} color="#7f8c8d" />
                        <Text style={styles.imageText}>Choose Images</Text>
                    </TouchableOpacity>

                    {newImages.length > 0 && (
                        <ScrollView horizontal>
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

                    <TouchableOpacity onPress={handleUpdate}>
                        <LinearGradient colors={['#2980b9', '#2c3e50']} style={styles.button}>
                            <Text style={styles.buttonText}>Update Vendor</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
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
    container: { padding: 20, backgroundColor: '#f4f6f8', flexGrow: 1 },
    sectionTitle: { fontWeight: '600', fontSize: 14, marginBottom: 8, marginTop: 12, color: '#34495e' },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, borderColor: '#dcdde1', borderWidth: 1, paddingHorizontal: 12, paddingVertical: 12, marginBottom: 16 },
    icon: { marginRight: 10 },
    input: { flex: 1, fontSize: 16, color: '#2c3e50' },
    picker: { backgroundColor: '#fff', borderRadius: 12, borderColor: '#dcdde1', borderWidth: 1, marginBottom: 16 },
    button: { marginTop: 20, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    imageBox: { borderWidth: 1, borderColor: '#bdc3c7', borderRadius: 10, padding: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', marginBottom: 16, flexDirection: 'row', gap: 8 },
    imageText: { color: '#7f8c8d', marginLeft: 8 },
    image: { width: 100, height: 100, resizeMode: 'contain', marginRight: 8, borderRadius: 8 },
    removeBtn: { position: 'absolute', top: -6, right: -6, backgroundColor: 'red', borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }
});
