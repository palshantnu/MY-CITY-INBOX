import { CommonActions, useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { postData } from '../../API';

const Settings = ({ navigation }) => {
    const user = useSelector(state => state.user);
    const settingsOptions = [
        { label: 'About Us', icon: 'information-outline' },
        { label: 'Terms & Conditions', icon: 'file-document-outline' },
        { label: 'Privacy Policy', icon: 'shield-lock-outline' },
    ];



    const handlePress = async (label: string) => {
        console.log(`Pressed: ${label}`);
        if (label == 'About Us') {
            navigation.navigate('AboutScreen')
        } else if (label == 'Privacy Policy') {
            navigation.navigate('PrivacyPolicyScreen')
        } else if (label == 'Terms & Conditions') {
            navigation.navigate('TermsAndConditionsScreen')
        } else if (label == 'Profile') {
            navigation.navigate('UpdateVendor')
        } else if (label == 'Help & Feedback') {
            navigation.navigate('HelpFeedbackScreen')
        }
        // Add navigation logic here
    };

    const dispatch = useDispatch();
    const logoutUser = () => {
        dispatch({ type: 'LOGOUT' });

        navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [{ name: 'RoleSelector' }],
            }),
        );
    };
    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                onPress: () => logoutUser(),
                style: 'destructive',
            },
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Settings</Text>

            {/* Profile Card at Top */}
            <TouchableOpacity style={styles.profileCard} onPress={() => handlePress('Profile')}>
                <View style={styles.iconBox}>
                    <Icon name="account-outline" size={30} color="#2980b9" />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.profileName}>{'Update Shop Details'}</Text>
                </View>
                <Icon name="chevron-right" size={22} color="#ccc" />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {settingsOptions.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.item}
                        onPress={() => handlePress(item.label)}
                    >
                        <View style={styles.iconBox}>
                            <Icon name={item.icon} size={24} color="#2980b9" />
                        </View>

                        <Text style={styles.label}>{item.label}</Text>



                        <Icon name="chevron-right" size={22} color="#ccc" />
                    </TouchableOpacity>
                ))}

                {/* Logout Option at Bottom */}
                <TouchableOpacity style={styles.logoutItem} onPress={handleLogout}>
                    <View style={styles.iconBox}>
                        <Icon name="logout" size={24} color="#e74c3c" />
                    </View>
                    <Text style={[styles.label, { color: '#e74c3c' }]}>Log Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6f8',
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: 20,
        marginTop: 10
    },
    scrollContainer: {
        paddingBottom: 30,
    },
    profileCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    profileName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c3e50',
    },
    profileEmail: {
        fontSize: 13,
        color: '#7f8c8d',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        position: 'relative',
    },
    logoutItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginTop: 10,
        elevation: 1,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    iconBox: {
        width: 30,
        alignItems: 'center',
        marginRight: 12,
    },
    label: {
        flex: 1,
        fontSize: 16,
        color: '#2d3436',
        fontWeight: '500',
    },
    badge: {
        backgroundColor: '#e74c3c',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginRight: 8,
        minWidth: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
