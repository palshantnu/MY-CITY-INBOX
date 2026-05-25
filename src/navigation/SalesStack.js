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
import SalesTabNavigator from './SalesTabNavigator';
import UpdateSalesProfile from '../screens/Sales/UpdateSalesProfile';
import AddVendor from '../screens/Sales/AddVendor';
import WalletScreen from '../screens/Sales/WalletScreen';

const Stack = createNativeStackNavigator();

const SalesStack = () => (
    <Stack.Navigator initialRouteName="SalesTabNavigator">
        <Stack.Screen options={{
            headerShown: false
        }} name="SalesTabNavigator" component={SalesTabNavigator} />
        <Stack.Screen options={{
            headerShown: false
        }} name="UpdateSalesProfile" component={UpdateSalesProfile} />
        <Stack.Screen options={{
            headerShown: false
        }} name="AddVendor" component={AddVendor} />
       <Stack.Screen name="WalletScreen" component={WalletScreen} options={{ title: 'My Wallet' }} />
    </Stack.Navigator>
);

export default SalesStack;
