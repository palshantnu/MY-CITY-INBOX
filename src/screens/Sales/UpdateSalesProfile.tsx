import React, { useEffect, useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    ScrollView, Image, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-crop-picker';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { baseURL } from '../../API';

const UpdateSalesProfile = ({ navigation }) => {
    const user = useSelector((state: any) => state.user);

    const [contact, setContact] = useState('');
    const [name, setName] = useState('');
    const [documentImage, setDocumentImage] = useState(null);
    const [passbookImage, setPassbookImage] = useState(null);
    const [accountName, setAccountName] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [ifsc, setIfsc] = useState('');
    const [password, setPassword] = useState('');
    const [secure, setSecure] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${baseURL}/api/sales/profile?id=${user.id}`);
                const json = await res.json();

                if (res.ok) {
                    const data = json.data;
                    console.log('====================================');
                    console.log(data);
                    console.log('====================================');
                    setContact(data.contact_number || '');
                    setName(data.name || '');
                    setAccountName(data.bank_account_name || '');
                    setBankName(data.bank_name || '');
                    setAccountNumber(data.bank_account_number || '');
                    setIfsc(data.bank_ifsc || '');

                    if (data.document_file)
                        setDocumentImage({ path: `${baseURL}/uploads/sales/${data.document_file}` });
                    if (data.bank_passbook_img)
                        setPassbookImage({ path: `${baseURL}/uploads/sales/${data.bank_passbook_img}` });
                } else {
                    Alert.alert('Error', json.message || 'Failed to load profile');
                }
            } catch (err) {
                console.error('Profile Fetch Error:', err);
                Alert.alert('Error', 'Unable to load profile');
            }
        };

        fetchProfile();
    }, []);


    const pickImage = (setter) => {
        ImagePicker.openPicker({
            width: 400,
            height: 400,
            cropping: false,
            mediaType: 'photo'
        }).then(image => {
            setter(image);
        }).catch(err => {
            if (err.code !== 'E_PICKER_CANCELLED') {
                console.error('ImagePicker Error:', err);
            }
        });
    };

    const handleUpdate = async () => {
        if (!contact || !name || !accountName || !bankName || !accountNumber || !ifsc) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }
        if (!documentImage) {
            Alert.alert('Error', 'Please upload ID document image');
            return;
        }

        if (!passbookImage) {
            Alert.alert('Error', 'Please upload passbook image');
            return;
        }
        const formData = new FormData();
        formData.append('id', user.id); // assuming sales id
        formData.append('contact_number', contact);
        formData.append('name', name);
        formData.append('bank_name', bankName);
        formData.append('bank_account_name', accountName);
        formData.append('bank_account_number', accountNumber);
        formData.append('bank_ifsc', ifsc);

        if (password) {
            formData.append('password', password);
        }

        if (documentImage && !documentImage.path.startsWith('http')) {
            formData.append('document_file', {
                uri: documentImage.path,
                name: 'document.jpg',
                type: 'image/jpeg'
            });
        }

        if (passbookImage && !passbookImage.path.startsWith('http')) {
            formData.append('bank_passbook_img', {
                uri: passbookImage.path,
                name: 'passbook.jpg',
                type: 'image/jpeg'
            });
        }

        try {
            const res = await fetch(`${baseURL}/api/sales/update-profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            const json = await res.json();
            if (res.ok) {
                Alert.alert('Success', 'Profile updated!');
            } else {
                Alert.alert('Error', json.message || 'Something went wrong');
            }
        } catch (err) {
            console.error('Update Error:', err);
            Alert.alert('Error', 'Profile update failed.');
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={100}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-left" size={24} color="#2c3e50" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Update Profile</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView contentContainerStyle={styles.container}>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Name</Text>
                        <CustomInput icon="account-outline" placeholder="Enter Name" value={name} onChangeText={setName} />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Contact Number</Text>
                        <CustomInput icon="phone-outline" placeholder="Enter Contact Number" value={contact} onChangeText={setContact} keyboardType="phone-pad" />
                    </View>

                    <Text style={styles.sectionTitle}>Upload ID Document</Text>
                    <TouchableOpacity style={styles.imageBox} onPress={() => pickImage(setDocumentImage)}>
             
                        {documentImage ? (
                            <Image source={{ uri: documentImage?.path }} style={styles.image} />
                        ) : <Text style={styles.imageText}>Choose Document</Text>}
                    </TouchableOpacity>

                    <Text style={styles.sectionTitle}>Upload Passbook Image</Text>
                    <TouchableOpacity style={styles.imageBox} onPress={() => pickImage(setPassbookImage)}>
                        {passbookImage ? (
                            <Image source={{ uri: passbookImage?.path }} style={styles.image} />
                        ) : <Text style={styles.imageText}>Choose Passbook</Text>}
                    </TouchableOpacity>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Account Holder Name</Text>
                        <CustomInput icon="account-outline" placeholder="Enter Account Holder Name" value={accountName} onChangeText={setAccountName} />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Bank Name</Text>
                        <CustomInput icon="bank-outline" placeholder="Enter Bank Name" value={bankName} onChangeText={setBankName} />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Account Number</Text>
                        <CustomInput icon="credit-card-outline" placeholder="Enter Account Number" value={accountNumber} onChangeText={setAccountNumber} keyboardType="number-pad" />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>IFSC Code</Text>
                        <CustomInput icon="form-textbox" placeholder="Enter IFSC Code" value={ifsc} onChangeText={setIfsc} autoCapitalize="characters" />
                    </View>

                    <TouchableOpacity onPress={handleUpdate} style={{ width: '100%' }}>
                        <LinearGradient colors={['#2980b9', '#2c3e50']} style={styles.button}>
                            <Text style={styles.buttonText}>Update Profile</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const CustomInput = ({ icon, ...props }) => (
    <View style={styles.inputWrapper}>
        <Icon name={icon} size={20} color="#7f8c8d" style={styles.icon} />
        <TextInput style={styles.input} placeholderTextColor="#aaa" {...props} />
    </View>
);

export default UpdateSalesProfile;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        backgroundColor: '#fff'
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2c3e50',
        textAlign: 'center',
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 16,
        color: '#2c3e50',
        textAlign: 'center',
    },
    sectionTitle: {
        fontWeight: '600',
        fontSize: 14,
        marginBottom: 8,
        marginTop: 12,
        color: '#34495e',
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
        marginBottom: 16,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#2c3e50',
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
    imageBox: {
        borderWidth: 1,
        borderColor: '#bdc3c7',
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginBottom: 16,
    },
    imageText: {
        color: '#7f8c8d',
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#34495e',
        marginBottom: 6,
        fontWeight: '500',
    },

});
