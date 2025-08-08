// src/navigation/AppNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserHomeScreen from '../screens/User/HomeScreen';
import UserTabNavigator from './UserTabNavigator';
import StoreDetailsScreen from '../screens/User/StoreDetailsScreen';
import AllCategory from '../screens/User/AllCategory';
import SubCategory from '../screens/User/SubCategory';
import ShopList from '../screens/User/ShopList';
import UserProfileScreen from '../screens/User/UserProfileScreen';
import HelpFeedbackScreen from '../screens/Common/HelpFeedbackScreen';
import NotificationsScreen from '../screens/User/NotificationsScreen';
import VendorDashboardScreen from '../screens/Vendor/VendorDashboardScreen';
import VendorTabNavigator from './VendorTabNavigator';
import UpdateVendor from '../screens/Vendor/UpdateVendor';

const Stack = createNativeStackNavigator();

const VendorStack = () => (
    <Stack.Navigator initialRouteName="VendorTabNavigator">
        <Stack.Screen options={{
            headerShown: false
        }} name="VendorTabNavigator" component={VendorTabNavigator} />
        <Stack.Screen options={{
            headerShown: false
        }} name="UpdateVendor" component={UpdateVendor} />
    </Stack.Navigator>
);

export default VendorStack;
