import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Image,
    ScrollView,
    ToastAndroid,
    PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { postData } from '../API';
import { useDispatch } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import { getSyncData, storeDatasync } from '../storage/AsyncStorage';

const { width } = Dimensions.get('window');

type Role = 'User' | 'Vendor' | 'Sales';

type RootStackParamList = {
    Login: { role: Role };
    UserHome: undefined;
    VendorDashboard: undefined;
    SalesDashboard: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const roleIcons: Record<Role, string> = {
    User: 'account',
    Vendor: 'store',
    Sales: 'briefcase-account',
};

const LoginScreen: React.FC<Props> = ({ route, navigation }) => {
    const { role = 'User' } = route.params || {};
    const dispatch = useDispatch();
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [secure, setSecure] = useState(true);
    const getFcmToken = async () => {
        let fcmToken = await getSyncData('fcmToken');
        console.log('the old token', fcmToken);
        if (!fcmToken) {
            try {
                const fcmToken = await messaging().getToken();
                if (fcmToken) {
                    // user has a device token
                    console.log('the new token', fcmToken);
                    await storeDatasync('fcmToken', fcmToken);
                }
            } catch (error) {
                console.log('error getting token', error);
            }
        }
    };
    const checkApplicationPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                );
            } catch (error) { }
        }
    };

    useEffect(() => {
        requestNotificationPermission();
        checkApplicationPermission();
    }, []);
    const requestNotificationPermission = async () => {
        try {
            await messaging().requestPermission();
            await messaging().hasPermission();
            console.log('Notification permission granted');
            getFcmToken();
        } catch (error) {
            console.log('Notification permission denied', error);
        }
    };
    const handleLogin = async () => {
        // if (!mobile || !password) return alert('Please fill in all fields.');
     
        // TODO: Handle actual login
        let fcmToken = await getSyncData('fcmToken');
        // TODO: API call or validation
        const body = { password, mobile, device_token: fcmToken }
        console.log('Login:', body);
        const res = await postData(role == 'User' ? 'users-login' : null, body);
        console.log('res', res);
        ToastAndroid.show(res.message, ToastAndroid.SHORT);
        if (res.message == 'Login successful') {
            if (role == 'User') {
                dispatch({
                    type: 'SET_USER',
                    payload: res.user,
                });

                navigation.dispatch(
                    CommonActions.reset({
                        index: 1,
                        routes: [{ name: 'UserStack' }],
                    }),
                );
            }

        }

        // switch (role) {
        //     case 'User':
        //         navigation.replace('UserStack');
        //         break;
        //     case 'Vendor':
        //         navigation.replace('VendorDashboard');
        //         break;
        //     case 'Sales':
        //         navigation.replace('SalesDashboard');
        //         break;
        //     default:
        //         alert('Invalid role');
        // }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20} // You can tweak this offset
        >
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                <Image
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/256/5175/5175213.png' }}
                    style={styles.image}
                    resizeMode="contain"
                />

                <Text style={styles.title}>Login as {role}</Text>
                <Text style={styles.subtitle}>Welcome back! Login to continue</Text>

                <View style={styles.inputWrapper}>
                    <Icon name="cellphone" size={20} color="#888" style={styles.icon} />
                    <TextInput
                        placeholder="Mobile Number"
                        placeholderTextColor="#999"
                        value={mobile}
                        onChangeText={setMobile}
                        style={styles.input}
                        keyboardType="phone-pad"
                        maxLength={10}
                    />
                </View>


                <View style={styles.inputWrapper}>
                    <Icon name="lock-outline" size={20} color="#888" style={styles.icon} />
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#999"
                        value={password}
                        onChangeText={setPassword}
                        style={styles.input}
                        secureTextEntry={secure}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={() => setSecure(!secure)}>
                        <Icon name={secure ? 'eye-off-outline' : 'eye-outline'} size={20} color="#888" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={{ width: '95%' }} onPress={handleLogin}>
                    <LinearGradient
                        colors={['#3498db', '#2980b9']}
                        style={styles.button}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.forgot}>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ marginTop: 24 }}
                    onPress={() => role == 'User' ? navigation.navigate('RegisterUser') : role == 'Vendor' ? navigation.navigate('RegisterVendor') : navigation.navigate('RegisterSales')}
                >
                    <Text style={{ color: '#2980b9', fontWeight: '600' }}>Don't have an account? Register</Text>
                </TouchableOpacity>

            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafd',
    },
    scroll: {
        padding: 24,
        alignItems: 'center',
    },
    image: {
        width: width * 0.7,
        height: width * 0.45,
        marginBottom: 16,
    },
    iconWrapper: {
        backgroundColor: '#ecf0f1',
        padding: 14,
        borderRadius: 100,
        marginBottom: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#7f8c8d',
        marginBottom: 28,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: '#dfe6e9',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 14,
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
        color: '#2d3436',
    },
    button: {
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 20,
        width: '100%',
        alignItems: 'center',
        marginTop: 12,
        elevation: 2,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    forgot: {
        marginTop: 18,
    },
    forgotText: {
        fontSize: 14,
        color: '#636e72',
    },
});
