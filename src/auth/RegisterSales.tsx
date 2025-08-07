import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform, ScrollView, Image, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-crop-picker';

const RegisterSales = () => {
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

    const handleRegister = async () => {
        if (!contact || !name || !documentImage || !accountName || !bankName || !accountNumber || !ifsc) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        const formData = new FormData();
        formData.append('contact_number', contact);
        formData.append('name', name);
        formData.append('document_title', 'ID Proof');
        formData.append('bank_name', bankName);
        formData.append('bank_account_name', accountName);
        formData.append('bank_account_number', accountNumber);
        formData.append('bank_ifsc', ifsc);
        formData.append('password', password);
        formData.append('document_file', {
            uri: documentImage.path,
            name: 'document.jpg',
            type: documentImage.mime
        });

        if (passbookImage) {
            formData.append('bank_passbook_img', {
                uri: passbookImage.path,
                name: 'passbook.jpg',
                type: passbookImage.mime
            });
        }

        try {
            const res = await fetch('http://192.168.29.53:5050/api/sales/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            const json = await res.json();
            if (res.ok) {
                Alert.alert('Success', 'Sales executive registered!');
            } else {
                Alert.alert('Error', json.message || 'Something went wrong');
            }
        } catch (err) {
            console.error('Register Error:', err);
            Alert.alert('Error', 'Registration failed.');
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={100}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <CustomInput icon="account-outline" placeholder="Name" value={name} onChangeText={setName} />
                <CustomInput icon="phone-outline" placeholder="Contact Number" value={contact} onChangeText={setContact} keyboardType="phone-pad" />
                <CustomInput
                    icon="lock-outline"
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={secure}
                />
                <TouchableOpacity onPress={() => setSecure(!secure)} style={{ marginBottom: 16 }}>
                    <Text style={{ color: '#2980b9' }}>{secure ? 'Show' : 'Hide'} Password</Text>
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>Upload ID Document</Text>
                <TouchableOpacity style={styles.imageBox} onPress={() => pickImage(setDocumentImage)}>
                    {documentImage ? (
                        <Image source={{ uri: documentImage.path }} style={styles.image} />
                    ) : <Text style={styles.imageText}>Choose Document</Text>}
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>Upload Passbook Image</Text>
                <TouchableOpacity style={styles.imageBox} onPress={() => pickImage(setPassbookImage)}>
                    {passbookImage ? (
                        <Image source={{ uri: passbookImage.path }} style={styles.image} />
                    ) : <Text style={styles.imageText}>Choose Passbook</Text>}
                </TouchableOpacity>

                <CustomInput icon="account-outline" placeholder="Account Holder Name" value={accountName} onChangeText={setAccountName} />
                <CustomInput icon="bank-outline" placeholder="Bank Name" value={bankName} onChangeText={setBankName} />
                <CustomInput icon="credit-card-outline" placeholder="Account Number" value={accountNumber} onChangeText={setAccountNumber} keyboardType="number-pad" />
                <CustomInput icon="form-textbox" placeholder="IFSC Code" value={ifsc} onChangeText={setIfsc} autoCapitalize="characters" />

                <TouchableOpacity onPress={handleRegister} style={{ width: '100%' }}>
                    <LinearGradient colors={['#2980b9', '#2c3e50']} style={styles.button}>
                        <Text style={styles.buttonText}>Register</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const CustomInput = ({ icon, ...props }) => (
    <View style={styles.inputWrapper}>
        <Icon name={icon} size={20} color="#7f8c8d" style={styles.icon} />
        <TextInput style={styles.input} placeholderTextColor="#aaa" {...props} />
    </View>
);

export default RegisterSales;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f4f6f8',
        flexGrow: 1,
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
});
