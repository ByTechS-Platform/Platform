import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const Verification = ({ navigation, route }) => {
  const [code, setCode] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(300); // 5 minutes
  const email = route.params.email;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 4) {
      Alert.alert('Error', 'Enter the full 4-digit code.');
      return;
    }

    try {
      const doc = await firestore().collection('PasswordResetCodes').doc(email).get();
      if (!doc.exists || doc.data().code !== fullCode) {
        Alert.alert('Invalid Code', 'Incorrect or expired code.');
        return;
      }

      await firestore().collection('PasswordResetCodes').doc(email).delete();
      navigation.navigate('ResetPassword', { email });
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleChange = (val, index) => {
    const newCode = [...code];
    newCode[index] = val;
    setCode(newCode);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify your account</Text>
      <Text style={styles.subtitle}>We've sent a 4-digit code to {email}</Text>

      <View style={styles.codeRow}>
        {code.map((char, i) => (
          <TextInput
            key={i}
            style={styles.codeInput}
            maxLength={1}
            keyboardType="number-pad"
            value={char}
            onChangeText={(val) => handleChange(val, i)}
          />
        ))}
      </View>

      <Text style={styles.timer}>{`0${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}`}</Text>

      <TouchableOpacity onPress={() => setTimer(300)}>
        <Text style={styles.resend}>Resend Code</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 14, marginBottom: 20 },
  codeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  codeInput: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 12, textAlign: 'center', width: 50,
  },
  timer: { textAlign: 'center', fontSize: 16, marginBottom: 10 },
  resend: { color: '#5c4dd2', textAlign: 'center', marginBottom: 20 },
  button: {
    backgroundColor: '#5c4dd2', padding: 14, borderRadius: 8, alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default Verification;
