// src/navigation/AppNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RoleSelector from '../auth/RoleSelector';
import LoginScreen from '../auth/LoginScreen';
import UserStack from './UserStack';
import VendorStack from './VendorStack';
import SalesStack from './SalesStack';
import RegisterUser from '../auth/RegisterUser';
import RegisterVendor from '../auth/RegisterVendor';
import RegisterSales from '../auth/RegisterSales';
import SplashScreen from '../screens/Splashscreen';
import AboutScreen from '../screens/Common/AboutScreen';
import PrivacyPolicyScreen from '../screens/Common/PrivacyPolicyScreen';
import TermsAndConditionsScreen from '../screens/Common/TermsAndConditionsScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator initialRouteName="SplashScreen">
    <Stack.Screen options={{
      headerShown: false
    }} name="RoleSelector" component={RoleSelector} />
    <Stack.Screen options={({ route }) => ({
      title: 'Login',
      headerBackTitleVisible: false,
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: '#2980b9',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
    })} name="Login" component={LoginScreen} />
    <Stack.Screen options={{
      headerShown: false
    }} name="UserStack" component={UserStack} />
    <Stack.Screen options={{
      headerShown: false
    }} name="AboutScreen" component={AboutScreen} />
    <Stack.Screen options={{
      headerShown: false
    }} name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
    <Stack.Screen options={{
      headerShown: false
    }} name="TermsAndConditionsScreen" component={TermsAndConditionsScreen} />
    <Stack.Screen options={{
      headerShown: false
    }} name="SplashScreen" component={SplashScreen} />
    <Stack.Screen options={({ route }) => ({
      title: 'User Registration',
      headerBackTitleVisible: false,
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: '#2980b9',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
    })} name="RegisterUser" component={RegisterUser} />
    <Stack.Screen options={({ route }) => ({
      title: 'Vendor Registration',
      headerBackTitleVisible: false,
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: '#2980b9',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
    })} name="RegisterVendor" component={RegisterVendor} />
    <Stack.Screen options={({ route }) => ({
      title: 'Sales Registration',
      headerBackTitleVisible: false,
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: '#2980b9',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
    })} name="RegisterSales" component={RegisterSales} />
    {/* <Stack.Screen name="VendorStack" component={VendorStack} />
    <Stack.Screen name="SalesStack" component={SalesStack} /> */}
  </Stack.Navigator>
);

export default AppNavigator;
