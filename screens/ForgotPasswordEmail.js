import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const ForgotPasswordEmail = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const generateCode = () => Math.floor(1000 + Math.random() * 9000).toString();

  const handleSendCode = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    try {
      // Check if email exists in Firestore Users collection
      const userSnapshot = await firestore()
        .collection('Users')
        .where('Email', '==', cleanEmail)
        .get();

      if (userSnapshot.empty) {
        Alert.alert('Error', 'No user found with this email in Firestore.');
        return;
      }

      const code = generateCode();

      // Save code to PasswordResetCodes collection
      firestore().collection('PasswordResetCodes').doc(email).set({
        
        code,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert(
        'Code Sent',
        `A 4-digit verification code has been sent to ${cleanEmail} (simulated).`
      );

      navigation.navigate('Verification', { email: cleanEmail });

    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Did you forget your password?</Text>
      <Text style={styles.subtitle}>Enter your email to verify your account.</Text>

      <TextInput
        style={styles.input}
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.button} onPress={handleSendCode}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#0b0b38', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#333', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#5c4dd2',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default ForgotPasswordEmail;

