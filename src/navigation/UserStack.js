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

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
    <Stack.Navigator initialRouteName="UserTabNavigator">
        <Stack.Screen options={{
            headerShown: false
        }} name="UserTabNavigator" component={UserTabNavigator} />
        <Stack.Screen options={{
            headerShown: false
        }} name="UserHomeScreen" component={UserHomeScreen} />
        <Stack.Screen options={{
            headerShown: false
        }} name="StoreDetails" component={StoreDetailsScreen} />
        <Stack.Screen options={{
            headerShown: false
        }} name="AllCategory" component={AllCategory} />
        <Stack.Screen options={{
            headerShown: false
        }} name="SubCategory" component={SubCategory} />
        <Stack.Screen options={{
            headerShown: false
        }} name="ShopList" component={ShopList} />
        <Stack.Screen options={{
            headerShown: false
        }} name="UserProfileScreen" component={UserProfileScreen} />
        <Stack.Screen options={{
            headerShown: false
        }} name="HelpFeedbackScreen" component={HelpFeedbackScreen} />
        <Stack.Screen options={{
            headerShown: false
        }} name="NotificationsScreen" component={NotificationsScreen} />

    </Stack.Navigator>
);

export default AppNavigator;
