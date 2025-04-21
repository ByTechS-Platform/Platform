import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import CountryPicker from 'react-native-country-picker-modal';
import Icon from 'react-native-vector-icons/Ionicons';

const SignUpScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode] = useState('SA');
  const [callingCode] = useState('966');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validation, setValidation] = useState({
    length: false,
    digit: false,
    capital: false,
    special: false,
    match: false,
  });

  const validatePassword = (pwd, confirmPwd) => {
    const validations = {
      length: pwd.length > 8,
      digit: /\d/.test(pwd),
      capital: /[A-Z]/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd),
      match: pwd === confirmPwd,
    };
    setValidation(validations);
    return Object.values(validations).every(Boolean);
  };

  const handleSignUp = async () => {
    if (!fullName || !email || !phoneNumber || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid Gmail address.');
      return;
    }

    const saPhoneRegex = /^[5][0-9]{8}$/;
    if (!saPhoneRegex.test(phoneNumber)) {
      Alert.alert('Invalid Phone Number', 'Enter a valid Saudi number (e.g., 512345678).');
      return;
    }

    const isValid = validatePassword(password, confirmPassword);
    if (!isValid) {
      Alert.alert('Invalid Password', 'Please meet all password requirements.');
      return;
    }

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      await firestore().collection('Users').doc(user.uid).set({
        FullName: fullName,
        Email: user.email,
        Phone: `+${callingCode}${phoneNumber}`,
        CreatedAt: firestore.FieldValue.serverTimestamp(),
      });

      await user.sendEmailVerification();
      await auth().signOut();

      navigation.navigate('EmailVerification');
    } catch (error) {
      Alert.alert('Sign Up Error', error.message);
    }
  };

  const getIndicator = (condition, text) => (
    <Text style={{ color: condition ? 'green' : 'red' }}>
      {condition ? '✅' : '❌'} {text}
    </Text>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome to ByTechs</Text>

      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabButton, styles.inactiveTab]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.inactiveText}>Login</Text>
        </TouchableOpacity>
        <View style={[styles.tabButton, styles.activeTab]}>
          <Text style={styles.activeText}>Sign up</Text>
        </View>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Full name"
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        style={styles.input}
        placeholder="Gmail Address"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.phoneWrapper}>
        <CountryPicker
          countryCode="SA"
          withFilter={false}
          withFlag
          withCallingCode
          withEmoji
          onSelect={() => {}}
          containerButtonStyle={styles.countryPicker}
        />
        <Text style={styles.plus}>+966</Text>
        <TextInput
          style={styles.phoneInput}
          placeholder="Phone number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1, borderWidth: 0 }]}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            validatePassword(text, confirmPassword);
          }}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          validatePassword(password, text);
        }}
      />

      <View style={styles.validationContainer}>
        {getIndicator(validation.length, 'Password Length > 8')}
        {getIndicator(validation.digit, 'At least 1 digit')}
        {getIndicator(validation.capital, 'At least 1 capital letter')}
        {getIndicator(validation.special, 'At least 1 special character')}
        {getIndicator(validation.match, 'Password matches confirm password')}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    color: '#0b0b38',
    marginBottom: 20,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#5c4dd2',
  },
  inactiveTab: {
    backgroundColor: '#eee',
    marginRight: 10,
  },
  activeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inactiveText: {
    color: '#5c4dd2',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
  },
  phoneWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  countryPicker: {
    marginRight: 5,
  },
  plus: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  phoneInput: {
    flex: 1,
    height: 40,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  validationContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#5c4dd2',
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default SignUpScreen;

