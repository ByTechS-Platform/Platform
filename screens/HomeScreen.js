import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const HomeScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserName = async () => {
      const currentUser = auth().currentUser;
      if (currentUser) {
        console.log('✅ Current UID:', currentUser.uid); // 🔍 Log UID

        try {
          const userDoc = await firestore()
            .collection('Users')
            .doc(currentUser.uid)
            .get();

          if (userDoc.exists) {
            const data = userDoc.data();
            console.log('✅ Firestore Data:', data); // 🔍 Log full document

            setFullName(data?.FullName || 'FullName');
          } else {
            console.log('⚠️ User document not found');
          }
        } catch (error) {
          console.log('❌ Error fetching user data:', error.message);
        }
      }
      setLoading(false);
    };

    fetchUserName();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth().signOut();
      navigation.replace('Login'); // 🔁 Prevent going back
    } catch (error) {
      Alert.alert('Sign Out Error', error.message);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator color="#5c4dd2" size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Hi {fullName}, 👋</Text>
        <Text style={styles.subtitle}>Welcome Back!</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#5c4dd2',
    paddingHorizontal: 20,
    paddingTop: 60,
    justifyContent: 'space-between',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginTop: 40,
  },
  welcome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#f2f2f2',
    marginTop: 4,
  },
  footer: {
    marginTop: 'auto',
    marginBottom: 30,
    alignItems: 'center',
  },
  signOutButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  signOutText: {
    color: '#5c4dd2',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default HomeScreen;
