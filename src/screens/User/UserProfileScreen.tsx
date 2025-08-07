import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  ToastAndroid
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const UserProfileScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const user = useSelector(state => state.user);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    mobile: '',
    state: '',
    city: ''
  });

  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const fetchProfile = async () => {
    try {
      const res = await fetch(`http://192.168.29.53:5050/api/profile?id=${user.id}`);
      const json = await res.json();

      if (json.success) {
        setProfile(json.user);
        dispatch({
          type: 'SET_USER',
          payload: json.user,
        });
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  // Fetch profile
  useEffect(() => {

    fetchProfile();
    fetchStates();
  }, []);

  // Fetch states
  const fetchStates = async () => {
    try {
      const res = await fetch('http://192.168.29.53:5050/api/states');
      const json = await res.json();
      setStates(json.states || []);
    } catch (err) {
      console.log('Error fetching states:', err);
    }
  };

  // Fetch cities when state changes
  useEffect(() => {
    if (profile.state) {
      fetchCities(profile.state);
    } else {
      setCities([]);
      setProfile((prev) => ({ ...prev, city: '' }));
    }
  }, [profile.state]);

  const fetchCities = async (state: string) => {
    try {
      const res = await fetch(`http://192.168.29.53:5050/api/cities?state=${encodeURIComponent(state)}`);
      const json = await res.json();
      setCities(json.cities || []);
    } catch (err) {
      console.log('Error fetching cities:', err);
    }
  };

  const handleChange = (key: keyof typeof profile, value: string) => {
    setProfile({ ...profile, [key]: value });
  };

  const handleSave = async () => {
    if (!profile.name || !profile.email || !profile.mobile || !profile.city || !profile.state) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    try {
      setSaving(true);
      const res = await fetch('http://192.168.29.53:5050/api/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });

      const json = await res.json();
      ToastAndroid.show(json.message || 'Updated!', ToastAndroid.SHORT);
      fetchProfile();
    } catch (err) {
      console.log(err);

      Alert.alert('Error', 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="#2c3e50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 24 }} />
        </View>


        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <>
            <CustomInput
              icon="account-outline"
              placeholder="Full Name"
              value={profile.name}
              onChangeText={(text) => handleChange('name', text)}
            />
            <CustomInput
              icon="email-outline"
              placeholder="Email"
              value={profile.email}
              onChangeText={(text) => handleChange('email', text)}
              keyboardType="email-address"
            />
            <CustomInput
              icon="phone-outline"
              placeholder="Mobile Number"
              value={profile.mobile}
              onChangeText={(text) => handleChange('mobile', text)}
              keyboardType="phone-pad"
            />
            <View style={[styles.inputWrapper, { height: 60 }]}>
              <Icon name="map-marker-radius" size={22} color="#7f8c8d" style={styles.icon} />
              <Picker
                selectedValue={profile.state}
                onValueChange={(value) => handleChange('state', value)}
                style={{ flex: 1, color: profile.state ? '#000' : '#aaa' }}
              >
                <Picker.Item label="Select State" value="" />
                {states.map((state, i) => (
                  <Picker.Item label={state} value={state} key={i} />
                ))}
              </Picker>
            </View>

            <View style={[styles.inputWrapper, { height: 60 }]}>
              <Icon name="city" size={22} color="#7f8c8d" style={styles.icon} />
              <Picker
                selectedValue={profile.city}
                onValueChange={(value) => handleChange('city', value)}
                enabled={cities.length > 0}
                style={{ flex: 1, color: profile.city ? '#000' : '#aaa' }}
              >
                <Picker.Item label="Select City" value="" />
                {cities.map((city, i) => (
                  <Picker.Item label={city} value={city} key={i} />
                ))}
              </Picker>
            </View>

            <TouchableOpacity onPress={handleSave} style={{ width: '100%' }}>
              <View style={styles.saveBtn}>
                <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Update Profile'}</Text>
              </View>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const CustomInput = ({ icon, ...props }) => (
  <View style={styles.inputWrapper}>
    <Icon name={icon} size={20} color="#7f8c8d" style={styles.icon} />
    <TextInput style={styles.input} placeholderTextColor="#aaa" {...props} />
  </View>
);

export default UserProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    padding: 20,
    backgroundColor: '#f4f6f8',
    flexGrow: 1
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 24,
    textAlign: 'center'
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: '#dcdde1',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    width: '100%'
  },
  icon: {
    marginRight: 10
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50'
  },
  saveBtn: {
    backgroundColor: '#2980b9',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    textAlign: 'center',
  },

});
