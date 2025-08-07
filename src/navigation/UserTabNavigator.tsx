// navigation/UserTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Profile from '../screens/User/UserProfileScreen';
import BookmarksScreen from '../screens/User/BookmarksScreen';
import NearbyScreen from '../screens/User/NearbyScreen';
import UserHomeScreen from '../screens/User/HomeScreen';
import Settings from '../screens/User/Settings';


const Tab = createBottomTabNavigator();

const UserTabNavigator = () => {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size, focused }) => {
        let iconName = '';
  
        if (route.name === 'Home') iconName = 'storefront-outline';
        else if (route.name === 'Nearby') iconName = 'map-marker-radius-outline';
        else if (route.name === 'Bookmarks') iconName = 'bookmark-outline';
        else if (route.name === 'Settings') iconName = 'cog-outline';
  
        return (
          <Icon
            name={iconName}
            size={focused ? 30 : 26} // 🔺 Make icon slightly bigger when focused
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
        height: 75, // 🔺 Increased height
        paddingBottom: 10,
        paddingTop: 6,
      },
      tabBarLabelStyle: {
        fontSize: 14, // 🔺 Increased font size
        fontWeight: '600',
      },
    })}
  >
    <Tab.Screen name="Home" component={UserHomeScreen} />
    <Tab.Screen name="Nearby" component={NearbyScreen} />
    <Tab.Screen name="Bookmarks" component={BookmarksScreen} />
    <Tab.Screen name="Settings" component={Settings} />
  </Tab.Navigator>
  
  );
};

export default UserTabNavigator;
