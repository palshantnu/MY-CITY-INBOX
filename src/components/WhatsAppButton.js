// components/WhatsAppButton.js
import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const WhatsAppButton = ({ 
  phoneNumber = '911234567890', // Default number (change this)
  message = 'Hello, I need help with your app!',
  size = 60,
  backgroundColor = '#25D366',
  iconSize = 30,
  iconColor = '#fff',
  position = 'right',
  bottomOffset = 20,
}) => {
  
  const openWhatsApp = () => {
    // Remove any non-numeric characters
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create URL based on platform
    let url = '';
    if (Platform.OS === 'android') {
      url = `whatsapp://send?phone=${cleanPhone}&text=${encodedMessage}`;
    } else {
      url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;
    }

    // Open WhatsApp
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert(
          'WhatsApp Not Installed',
          'Please install WhatsApp to contact us.',
          [
            { 
              text: 'Install', 
              onPress: () => {
                const storeUrl = Platform.OS === 'android'
                  ? 'market://details?id=com.whatsapp'
                  : 'https://apps.apple.com/app/whatsapp-messenger/id310633997';
                Linking.openURL(storeUrl);
              }
            },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
      }
    }).catch(err => {
      Alert.alert('Error', 'Could not open WhatsApp');
    });
  };

  // Set position style
  const positionStyle = {
    [position]: 20,
    bottom: bottomOffset,
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        positionStyle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        }
      ]}
      onPress={openWhatsApp}
      activeOpacity={0.8}
    >
      <Icon name="whatsapp" size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 999,
  },
});

export default WhatsAppButton;