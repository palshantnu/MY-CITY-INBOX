import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const HelpFeedbackScreen: React.FC = () => {
  const navigation = useNavigation();
  const user = useSelector(state => state.user);
  const [form, setForm] = useState({
    user_id:user.id,
    name: user.name,
    email: user.email,
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.subject || !form.message) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    setLoading(true);
    try {
      // Replace with your API endpoint
      const res = await fetch('http://192.168.29.53:5050/api/help-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const json = await res.json();

      if (json.success) {
        Alert.alert('Success', 'Your feedback has been sent!');
        setForm({ name: '', email: '', subject: '', message: '' });
        navigation.goBack();
      } else {
        Alert.alert('Error', json.message || 'Something went wrong');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to send feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="#2c3e50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help & Feedback</Text>
          <View style={{ width: 24 }} /> 
        </View>

        <CustomInput
          icon="account-outline"
          placeholder="Your Name"
          value={form.name}
          onChangeText={(text) => handleChange('name', text)}
        />
        <CustomInput
          icon="email-outline"
          placeholder="Email Address"
          value={form.email}
          onChangeText={(text) => handleChange('email', text)}
          keyboardType="email-address"
        />
        <CustomInput
          icon="text-box-outline"
          placeholder="Subject"
          value={form.subject}
          onChangeText={(text) => handleChange('subject', text)}
        />
        <CustomInput
          icon="message-text-outline"
          placeholder="Your Message"
          value={form.message}
          onChangeText={(text) => handleChange('message', text)}
          multiline
          numberOfLines={5}
          style={{ height: 120, textAlignVertical: 'top' }}
        />

        {/* Submit Button */}
        <TouchableOpacity onPress={handleSubmit} style={{ width: '100%' }} disabled={loading}>
          <View style={styles.submitBtn}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>Send Feedback</Text>
            )}
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const CustomInput = ({ icon, ...props }) => (
  <View style={styles.inputWrapper}>
    <Icon name={icon} size={20} color="#7f8c8d" style={styles.icon} />
    <TextInput style={[styles.input, props.style]} placeholderTextColor="#aaa" {...props} />
  </View>
);

export default HelpFeedbackScreen;

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
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
  submitBtn: {
    backgroundColor: '#2980b9',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});
