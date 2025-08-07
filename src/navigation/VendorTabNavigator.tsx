// navigation/VendorTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import UserHomeScreen from '../screens/User/HomeScreen'; // Dashboard screen
import VendorDashboardScreen from '../screens/Vendor/VendorDashboardScreen';
import Settings from '../screens/Vendor/Settings';

const Tab = createBottomTabNavigator();

const VendorTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size, focused }) => {
                    let iconName = '';

                    if (route.name === 'Dashboard') iconName = 'view-dashboard-outline';
                    else if (route.name === 'Settings') iconName = 'cog-outline';

                    return (
                        <Icon
                            name={iconName}
                            size={focused ? 30 : 26}
                            color={color}
                        />
                    );
                },
                tabBarActiveTintColor: '#2980b9',
                tabBarInactiveTintColor: '#777',
                headerShown: false,
                tabBarStyle: {
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    height: 75,
                    paddingBottom: 10,
                    paddingTop: 6,
                },
                tabBarLabelStyle: {
                    fontSize: 14,
                    fontWeight: '600',
                },
            })}
        >
            <Tab.Screen name="Dashboard" component={VendorDashboardScreen} />
            <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
    );
};

export default VendorTabNavigator;
