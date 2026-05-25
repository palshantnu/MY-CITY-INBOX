import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform, ScrollView, Image, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const AddVendor: React.FC = () => {
    const navigation = useNavigation();
    const user = useSelector((state: any) => state.user);
    const salesExecutiveId = user?.id;
const [addressLink, setAddressLink] = useState('');
    const [shopName, setShopName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [stateName, setStateName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [facilities, setFacilities] = useState('');
    const [password, setPassword] = useState('');
    const [images, setImages] = useState<ImageOrVideo[]>([]);

    const [states, setStates] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [subcategories, setSubcategories] = useState<{ id: number; name: string }[]>([]);

    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [subcategoryId, setSubcategoryId] = useState<number | null>(null);

    useEffect(() => {
        fetch('https://mycityinbox.com/api/states')
            .then(res => res.json())
            .then(json => json.states && setStates(json.states));

        fetch('https://mycityinbox.com/api/categories')
            .then(res => res.json())
            .then(json => json.categories && setCategories(json.categories));
    }, []);

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
                    setImages(prev => [...prev, ...selected]);
                } else {
                    setImages(prev => [...prev, selected]);
                }
            })
            .catch(err => {
                if (err.code !== 'E_PICKER_CANCELLED') {
                    console.error('ImagePicker Error:', err);
                }
            });
    };

    const handleAddVendor = async () => {
        if (!shopName || !address || !contactNumber || !stateName || !city || !categoryId || !password) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        const formData = new FormData();
        formData.append('shop_name', shopName);
        formData.append('address', address);
        formData.append('address_link', addressLink);
        formData.append('city', city);
        formData.append('state', stateName);
        formData.append('contact_number', contactNumber);
        formData.append('facilities', facilities);
        formData.append('category_id', String(categoryId));
        formData.append('password', password);
        formData.append('sales_executive_id', String(user?.id)); 
        if (subcategoryId) formData.append('subcategory_id', String(subcategoryId));

        images.forEach((img, index) => {
            if ('path' in img && img.path) {
                formData.append('images', {
                    uri: img.path,
                    name: `vendor-${index}.jpg`,
                    type: img.mime || 'image/jpeg'
                } as any);
            }
        });

        const res = await fetch(`https://mycityinbox.com/api/vendor/register-by-sales`, {
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            body: formData
        });

        const json = await res.json();
        if (res.ok) {
            Alert.alert('Success', 'Vendor registered successfully');
            navigation.goBack();
        } else {
            Alert.alert('Error', json.message || 'Registration failed');
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#2980b9' }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-left" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Add New Vendor</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.container}>
                    <CustomInput icon="store-outline" placeholder="Shop Name" value={shopName} onChangeText={setShopName} />
                    <CustomInput icon="map-marker-outline" placeholder="Address" value={address} onChangeText={setAddress} />
<CustomInput
    icon="google-maps"
    placeholder="Google Map Location Link"
    value={addressLink}
    onChangeText={setAddressLink}
/>
                    <Text style={styles.sectionTitle}>State</Text>
                    <Picker
                        selectedValue={stateName}
                        onValueChange={(value) => {
                            setStateName(value);
                            fetch(`https://mycityinbox.com/api/cities?state=${encodeURIComponent(value)}`)
                                .then(res => res.json())
                                .then(cityData => {
                                    setCities(cityData.cities);
                                    setCity('');
                                });
                        }}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select State" value="" />
                        {states.map((s, idx) => <Picker.Item color="#000" key={idx} label={s} value={s} />)}
                    </Picker>

                    <Text style={styles.sectionTitle}>City</Text>
                    <Picker
                        selectedValue={city}
                        onValueChange={setCity}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select City" value="" />
                        {cities.map((c, idx) => <Picker.Item color='#000' key={idx} label={c} value={c} />)}
                    </Picker>

                    <CustomInput icon="phone-outline" placeholder="Contact Number" value={contactNumber} onChangeText={setContactNumber} keyboardType="phone-pad" />
                    <CustomInput icon="note-text-outline" placeholder="Facilities" value={facilities} onChangeText={setFacilities} />
                    <CustomInput icon="lock-outline" placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

                    <Text style={styles.sectionTitle}>Category</Text>
                    <Picker
                        selectedValue={categoryId}
                        onValueChange={(value) => {
                            setCategoryId(value);
                            fetch(`https://mycityinbox.com/api/subcategories/${value}`)
                                .then(res => res.json())
                                .then(subData => {
                                    setSubcategories(subData.subcategories);
                                    setSubcategoryId(null);
                                });
                        }}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select Category" value={null} />
                        {categories.map((c) => <Picker.Item color='#000' key={c.id} label={c.name} value={c.id} />)}
                    </Picker>

                    <Text style={styles.sectionTitle}>Subcategory</Text>
                    <Picker
                        selectedValue={subcategoryId}
                        onValueChange={setSubcategoryId}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select Subcategory" value={null} />
                        {subcategories.map((sc) => <Picker.Item color='#000' key={sc.id} label={sc.name} value={sc.id} />)}
                    </Picker>

                    <Text style={styles.sectionTitle}>Shop Images</Text>
                    <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
                        <Icon name="image-plus" size={20} color="#7f8c8d" />
                        <Text style={styles.imageText}>Choose Images</Text>
                    </TouchableOpacity>

                    {images.length > 0 && (
                        <ScrollView horizontal>
                            {images.map((img, idx) => (
                                <View key={idx} style={{ position: 'relative', marginRight: 8 }}>
                                    <Image source={{ uri: 'path' in img ? img.path : '' }} style={styles.image} />
                                    <TouchableOpacity
                                        style={styles.removeBtn}
                                        onPress={() => setImages(images.filter((_, i) => i !== idx))}
                                    >
                                        <Text style={{ color: '#fff', fontSize: 12 }}>✕</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    )}

                    <TouchableOpacity onPress={handleAddVendor}>
                        <LinearGradient colors={['#2980b9', '#2c3e50']} style={styles.button}>
                            <Text style={styles.buttonText}>Register Vendor</Text>
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

export default AddVendor;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2980b9',
        paddingVertical: 12,
        paddingHorizontal: 15,
    },
    backButton: { padding: 5 },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    container: { padding: 20, backgroundColor: '#f4f6f8', flexGrow: 1 },
    sectionTitle: { fontWeight: '600', fontSize: 14, marginBottom: 8, marginTop: 12, color: '#34495e' },
    inputWrapper: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
        borderRadius: 12, borderColor: '#dcdde1', borderWidth: 1,
        paddingHorizontal: 12, paddingVertical: 12, marginBottom: 16
    },
    icon: { marginRight: 10 },
    input: { flex: 1, fontSize: 16, color: '#2c3e50' },
    picker: {
        backgroundColor: '#fff', borderRadius: 12, borderColor: '#dcdde1',
        borderWidth: 1, marginBottom: 16
    },
    button: { marginTop: 20, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    imageBox: {
        borderWidth: 1, borderColor: '#bdc3c7', borderRadius: 10, padding: 16,
        alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff',
        marginBottom: 16, flexDirection: 'row'
    },
    imageText: { color: '#7f8c8d', marginLeft: 8 },
    image: { width: 100, height: 100, resizeMode: 'contain', marginRight: 8, borderRadius: 8 },
    removeBtn: {
        position: 'absolute', top: -6, right: -6, backgroundColor: 'red',
        borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center'
    }
});
