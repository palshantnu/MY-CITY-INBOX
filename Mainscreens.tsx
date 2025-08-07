import React, { useEffect } from 'react';
import {
  Alert,
  Linking,
  LogBox,
  StatusBar,
  StyleSheet,
  Text,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

const MainContent = () => {
  const insets = useSafeAreaInsets();



  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#2980b9' }}>
      <NavigationContainer>
        <SafeAreaView
          edges={['left', 'right', 'bottom']}
          style={{
            flex: 1,
            backgroundColor: '#2980b9',
          }}
        >
          {/* <StatusBar
            animated={true}
            backgroundColor={'#2980b9'}
            barStyle="dark-content"
          /> */}
          <AppNavigator />
        </SafeAreaView>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default MainContent;

const styles = StyleSheet.create({});
