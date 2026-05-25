import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Dimensions,
    Platform,
    KeyboardAvoidingView,
    Image,
    Alert,
    ToastAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-crop-picker';
import { Picker } from '@react-native-picker/picker';
import { CommonActions } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { postDataAndImage } from '../API';

const { width } = Dimensions.get('window');

const RegisterVendor = ({ navigation }) => {
    // Form fields
    const dispatch = useDispatch();
    const [shopName, setShopName] = useState('');
    const [address, setAddress] = useState('');
    const [addressLink, setAddressLink] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [facilities, setFacilities] = useState('');
    const [description, setDescription] = useState('');
    const [password, setPassword] = useState('');
    const [secure, setSecure] = useState(true); // toggle password visibility
    const [images, setImages] = useState<Array<{ path: string; mime?: string }>>([]);
    const [referralCode, setReferralCode] = useState('');


    // State & City
    const [states, setStates] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    // Category & Subcategory
    const [categories, setCategories] = useState<Array<{ id: number, name: string }>>([]);
    const [subcategories, setSubcategories] = useState<Array<{ id: number, name: string }>>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null);

    // Fetch states & categories on mount
    useEffect(() => {
        fetchStates();
        fetchCategories();
    }, []);

    const fetchStates = async () => {
        try {
            const res = await fetch('https://mycityinbox.com/api/states');
            const data = await res.json();
            setStates(data.states || []);
        } catch (error) {
            console.log('Error fetching states:', error);
        }
    };

    const fetchCities = async (state: string) => {
        try {
            const res = await fetch(`https://mycityinbox.com/api/cities?state=${encodeURIComponent(state)}`);
            const data = await res.json();
            setCities(data.cities || []);
        } catch (error) {
            console.log('Error fetching cities:', error);
        }
    };

    const onStateChange = (state: string) => {
        setSelectedState(state);
        setSelectedCity('');
        if (state) fetchCities(state);
        else setCities([]);
    };

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const res = await fetch('https://mycityinbox.com/api/categories');
            const data = await res.json();
            setCategories(data.categories || []);
        } catch (error) {
            console.log('Error fetching categories:', error);
        }
    };

    // Fetch subcategories on category change
    const fetchSubcategories = async (categoryId: number) => {
        try {
            const res = await fetch(`https://mycityinbox.com/api/subcategories/${categoryId}`);
            const data = await res.json();
            console.log('====================================');
            console.log(data);
            console.log('====================================');
            setSubcategories(data.subcategories || []);
        } catch (error) {
            console.log('Error fetching subcategories:', error);
        }
    };

    const onCategoryChange = (categoryId: number) => {
        setSelectedCategory(categoryId);
        setSelectedSubcategory(null);
        console.log('====================================');
        console.log(categoryId);
        console.log('====================================');
        if (categoryId) fetchSubcategories(categoryId);
        else setSubcategories([]);
    };

    const handleAddImages = () => {
        ImagePicker.openPicker({
            multiple: true,
            mediaType: 'photo',
        }).then(selectedImages => {
            setImages(prev => [...prev, ...selectedImages]);
        }).catch(err => {
            if (err.code !== 'E_PICKER_CANCELLED') console.log('Image error:', err);
        });
    };
    const handleRemoveImage = (indexToRemove) => {
        setImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
    };

    const handleRegister = async () => {
        console.log('====================================');
        console.log('Vendor Registration Data:', { shopName, address, contactNumber, selectedState, selectedCity, password });
        console.log('====================================');
        try {
            if (!shopName || !address || !contactNumber || !selectedState || !selectedCity) {
                Alert.alert('Please fill all required fields.');
                return;
            }

            if (!selectedCategory) {
                Alert.alert('Please select a category.');
                return;
            }

            if (!selectedSubcategory) {
                Alert.alert('Please select a subcategory.');
                return;
            }

            const formData = new FormData();

            formData.append('shop_name', shopName);
            formData.append('address', address);
            formData.append('address_link', addressLink);
            formData.append('city', selectedCity);
            formData.append('state', selectedState);
            formData.append('contact_number', contactNumber);
            formData.append('facilities', facilities);
            formData.append('category_id', selectedCategory.toString());
            formData.append('subcategory_id', selectedSubcategory.toString());
            formData.append('password', 12345678);
            formData.append('created_by', 'self');
            formData.append('sales_executive_id', '');
            if (referralCode) {
                formData.append('referral_code', referralCode);
            }
            images.forEach((img, index) => {
                const uri =
                    Platform.OS === 'android'
                        ? img.path
                        : img.path.replace('file://', '');

                formData.append('images', {
                    uri,
                    type: img.mime || 'image/jpeg',
                    name: `image_${index}.jpg`,
                });
            });

            console.log('formData==>', formData);

            const result = await postDataAndImage('vendors/register', formData);

            // const result = await response.json();
            console.log(result);


            ToastAndroid.show(result.message, ToastAndroid.SHORT);
            if (result.message == 'Vendor registered successfully') {
                const vendorWithRole = { ...result.vendor, role: 'Vendor' };
                dispatch({
                    type: 'SET_USER',
                    payload: vendorWithRole,
                });

                navigation.dispatch(
                    CommonActions.reset({
                        index: 1,
                        routes: [{ name: 'VendorStack' }],
                    }),
                );
            }


        } catch (error) {
            console.error('Registration error:', error);
            Alert.alert('An error occurred. Please try again.');
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20}
        >
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

                {/* Other Inputs */}
                <CustomInput icon="store-outline" placeholder="Shop Name" value={shopName} onChangeText={setShopName} />
                <CustomInput icon="map-marker-outline" placeholder="Address" value={address} onChangeText={setAddress} />
                <CustomInput
                    icon="google-maps"
                    placeholder="Google Map Link"
                    value={addressLink}
                    onChangeText={setAddressLink}
                />
                <CustomInput icon="phone-outline" placeholder="Contact Number" value={contactNumber} onChangeText={setContactNumber} keyboardType="phone-pad" />
                <CustomInput icon="toolbox-outline" placeholder="Facilities" value={facilities} onChangeText={setFacilities} />

                {/* State Picker */}
                <View style={[styles.inputWrapper, { height: 60 }]}>
                    <Icon name="map-marker-radius" size={22} color="#7f8c8d" style={styles.icon} />
                    <Picker
                        selectedValue={selectedState}
                        onValueChange={onStateChange}
                        style={{ flex: 1, color: selectedState ? '#000' : '#aaa' }}
                        prompt="Select State"
                    >
                        <Picker.Item label="Select State" value="" />
                        {states.map((state, idx) => (
                            <Picker.Item label={state} value={state} key={idx} />
                        ))}
                    </Picker>
                </View>

                {/* City Picker */}
                <View style={[styles.inputWrapper, { height: 60 }]}>
                    <Icon name="city" size={22} color="#7f8c8d" style={styles.icon} />
                    <Picker
                        selectedValue={selectedCity}
                        onValueChange={setSelectedCity}
                        enabled={cities.length > 0}
                        style={{ flex: 1, color: selectedCity ? '#000' : '#aaa' }}
                        prompt="Select City"
                    >
                        <Picker.Item label="Select City" value="" />
                        {cities.map((city, idx) => (
                            <Picker.Item label={city} value={city} key={idx} />
                        ))}
                    </Picker>
                </View>

                {/* Category Picker */}
                <View style={[styles.inputWrapper, { height: 60 }]}>
                    <Icon name="shape-outline" size={22} color="#7f8c8d" style={styles.icon} />
                    <Picker
                        selectedValue={selectedCategory}
                        onValueChange={onCategoryChange}
                        style={{ flex: 1, color: selectedCategory ? '#000' : '#aaa' }}
                        prompt="Select Category"
                    >
                        <Picker.Item label="Select Category" value={null} />
                        {categories.map(cat => (
                            <Picker.Item label={cat.name} value={cat.id} key={cat.id} />
                        ))}
                    </Picker>
                </View>

                {/* Subcategory Picker */}
                <View style={[styles.inputWrapper, { height: 60 }]}>
                    <Icon name="shape" size={22} color="#7f8c8d" style={styles.icon} />
                    <Picker
                        selectedValue={selectedSubcategory}
                        onValueChange={setSelectedSubcategory}
                        enabled={subcategories.length > 0}
                        style={{ flex: 1, color: selectedSubcategory ? '#000' : '#aaa' }}
                        prompt="Select Subcategory"
                    >
                        <Picker.Item label="Select Subcategory" value={null} />
                        {subcategories.map(subcat => (
                            <Picker.Item label={subcat.name} value={subcat.id} key={subcat.id} />
                        ))}
                    </Picker>
                </View>

                {/* Password Input */}
                {/* <View style={[styles.inputWrapper, { height: 70 }]}>
                    <Icon name="lock-outline" size={22} color="#7f8c8d" style={styles.icon} />
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#aaa"
                        value={password}
                        onChangeText={setPassword}
                        style={[styles.input, { height: 50 }]}
                        secureTextEntry={secure}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={() => setSecure(!secure)}>
                        <Icon name={secure ? 'eye-off-outline' : 'eye-outline'} size={22} color="#7f8c8d" />
                    </TouchableOpacity>
                </View> */}
                <CustomInput
                    icon="account-plus-outline"
                    placeholder="Referral Code (Optional)"
                    value={referralCode}
                    onChangeText={setReferralCode}
                    autoCapitalize="words"
                />

                {/* Images */}
                <View style={{ width: '100%', marginBottom: 16 }}>
                    <Text style={{ fontWeight: '600', marginBottom: 8, color: '#2c3e50' }}>Shop Images</Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                        {images.map((img, index) => (
                            <View key={index} style={{ marginRight: 10 }}>
                                <Image
                                    source={{ uri: img.path }}
                                    style={{ width: 80, height: 80, borderRadius: 8 }}
                                />

                                {/* Remove Button */}
                                <TouchableOpacity
                                    onPress={() => Alert.alert(
                                        "Remove Image",
                                        "Are you sure?",
                                        [
                                            { text: "Cancel" },
                                            { text: "Remove", onPress: () => handleRemoveImage(index) }
                                        ]
                                    )}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        right: -6,
                                        backgroundColor: '#e74c3c',
                                        borderRadius: 12,
                                        width: 22,
                                        height: 22,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{ color: '#fff', fontSize: 12 }}>✕</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>

                    <TouchableOpacity onPress={handleAddImages} style={styles.imageButton}>
                        <Text style={styles.imageButtonText}>+ Add Images</Text>
                    </TouchableOpacity>
                </View>

                {/* Register Button */}
                <TouchableOpacity onPress={handleRegister} style={{ width: '100%', marginBottom: 40 }}>
                    <LinearGradient colors={['#2980b9', '#2c3e50']} style={styles.button}>
                        <Text style={styles.buttonText}>Register</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView >
        </KeyboardAvoidingView >
    );
};

const CustomInput = ({
    icon,
    height = 50,
    ...props
}: {
    icon: string;
    height?: number;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    keyboardType?: any;
    multiline?: boolean;
    numberOfLines?: number;
}) => (
    <View style={[styles.inputWrapper, { height: height + 20 }]}>
        <Icon name={icon} size={22} color="#7f8c8d" style={styles.icon} />
        <TextInput
            {...props}
            placeholderTextColor="#aaa"
            style={[styles.input, { height }]}
            underlineColorAndroid="transparent"
        />
    </View>
);

export default RegisterVendor;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#f4f6f8',
        flexGrow: 1,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        borderColor: '#dcdde1',
        borderWidth: 1,
        paddingHorizontal: 12,
        marginBottom: 16,
        width: '100%',
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#2c3e50',
        paddingVertical: 12,
        alignItems: 'center'
    },
    button: {
        marginTop: 12,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    imageButton: {
        borderWidth: 1,
        borderColor: '#2980b9',
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    imageButtonText: {
        color: '#2980b9',
        fontWeight: '600',
    },
});
