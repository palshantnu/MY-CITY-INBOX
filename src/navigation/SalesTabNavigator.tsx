// navigation/VendorTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import UserHomeScreen from '../screens/User/HomeScreen'; // Dashboard screen
import Settings from '../screens/Sales/Settings';
import IndexScreen from '../screens/Sales/IndexScreen';

const Tab = createBottomTabNavigator();

const SalesTabNavigator = () => {
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
            <Tab.Screen name="Dashboard" component={IndexScreen} />
            <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
    );
};

export default SalesTabNavigator;
