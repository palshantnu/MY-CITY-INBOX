import React from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image'
// Local import


const SplashScreen = ({ navigation }) => {
    const isLoggedIn = useSelector(state => state.isLoggedIn);
    const user = useSelector(state => state.user);
    console.log('isLoggedIn', user);

    setTimeout(() => {
        if (isLoggedIn) {
            if (user.role == 'user') {
                navigation.replace('UserStack')
            } else if (user.role == 'Vendor') {
                navigation.replace('VendorStack')
            } else if (user.role == 'sales') {
            }
        } else {
            navigation.replace('RoleSelector')
        }

    }, 2000);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#fff' }]}>
            <View style={styles.logoContainer}>
                <FastImage
                    source={{
                        uri: 'https://cdn-icons-png.flaticon.com/128/3514/3514218.png',
                        headers: { Authorization: '762628hbs' },
                        priority: FastImage.priority.normal,
                    }}
                    style={styles.imageStyle}
                    resizeMode={FastImage.resizeMode.contain}
                />
                {/* <Image
                    source={Assets.SPLASH_SCREEN}
                    style={styles.imageStyle}
                    resizeMode="contain"
                /> */}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        height: '90%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageStyle: {
        width: 200,
        height: 200,
    },
});

export default SplashScreen;
