// App.tsx
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'react-native';
import MainContent from './Mainscreens';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import configureStore from './src/Redux/Store';

let { store, persistor } = configureStore();
const App = () => {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StatusBar animated={true}
          barStyle="dark-content"
          backgroundColor={'#2980b9'} />
        <SafeAreaProvider>
          <PaperProvider>
            <MainContent />
          </PaperProvider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
