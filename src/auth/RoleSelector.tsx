import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Role = 'User' | 'Vendor' | 'Sales';

const RoleSelector = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handleRoleSelect = (role: Role) => {
    navigation.navigate('Login', { role });
  };

  return (
    <LinearGradient colors={['#e0f7fa', '#ffffff']} style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Welcome to Grocery Stores</Text>
        <Text style={styles.subtitle}>Select your role to get started</Text>

        <View style={styles.cardWrapper}>
          <TouchableOpacity style={styles.card} onPress={() => handleRoleSelect('User')}>
            <Icon name="account-circle-outline" size={36} color="#3498db" />
            <Text style={styles.cardText}>User</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => handleRoleSelect('Vendor')}>
            <Icon name="storefront-outline" size={36} color="#27ae60" />
            <Text style={styles.cardText}>Vendor</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => handleRoleSelect('Sales')}>
            <Icon name="account-tie" size={36} color="#8e44ad" />
            <Text style={styles.cardText}>Sales Executive</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default RoleSelector;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#222',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  cardWrapper: {
    gap: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
    borderLeftWidth: 5,
  },
  cardText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});
