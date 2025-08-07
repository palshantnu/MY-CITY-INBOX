import React, { useEffect, useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform, ScrollView,
    ToastAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { postData } from '../API';
import { Picker } from '@react-native-picker/picker';

const RegisterUser = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mobile, setMobile] = useState('');
    // City and State picker states
    const [states, setStates] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');


    const fetchStates = async () => {
        try {
            const res = await fetch('http://192.168.29.53:5050/api/states');
            const data = await res.json();
            setStates(data.states || []);
        } catch (err) {
            console.log('Error fetching states:', err);
        }
    };

    const fetchCities = async (state: string) => {
        try {
            const res = await fetch(`http://192.168.29.53:5050/api/cities?state=${encodeURIComponent(state)}`);
            const data = await res.json();
            setCities(data.cities || []);
        } catch (err) {
            console.log('Error fetching cities:', err);
        }
    };

    const handleRegister = async () => {
        console.log({ name, email, password, mobile });
        // TODO: API call or validation
        const body = {
            name, email, password, mobile, state: selectedState,
            city: selectedCity
        }
        const res = await postData('users-register', body);
        console.log('res', res);
        ToastAndroid.show(res.message, ToastAndroid.SHORT);
        if (res.message == 'User registered successfully') {

        }

    };
    useEffect(() => {
        fetchStates();
    }, []);

    useEffect(() => {
        if (selectedState) {
            fetchCities(selectedState);
        } else {
            setCities([]);
            setSelectedCity('');
        }
    }, [selectedState]);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20} // You can tweak this offset
        >
            <ScrollView contentContainerStyle={styles.container}>
                {/* <Text style={styles.title}>User Registration</Text> */}

                <CustomInput icon="account-outline" placeholder="Full Name" value={name} onChangeText={setName} />
                <CustomInput icon="email-outline" placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
                <CustomInput icon="phone-outline" placeholder="Mobile Number" value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />
                <CustomInput icon="lock-outline" placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
                <View style={[styles.inputWrapper, { height: 60 }]}>
                    <Icon name="map-marker-radius" size={22} color="#7f8c8d" style={styles.icon} />
                    <Picker
                        selectedValue={selectedState}
                        onValueChange={setSelectedState}
                        style={{ flex: 1, color: selectedState ? '#000' : '#aaa' }}
                        prompt="Select State"
                    >
                        <Picker.Item label="Select State" value="" />
                        {states.map((state, i) => (
                            <Picker.Item label={state} value={state} key={i} />
                        ))}
                    </Picker>
                </View>
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
                        {cities.map((city, i) => (
                            <Picker.Item label={city} value={city} key={i} />
                        ))}
                    </Picker>
                </View>
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

export default RegisterUser;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#f4f6f8',
        flexGrow: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: 24,
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
        width: '100%',
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
});
