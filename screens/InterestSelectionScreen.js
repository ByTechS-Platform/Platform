import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList, Alert
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const InterestSelectionScreen = ({ navigation }) => {
  const [interests, setInterests] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const snapshot = await firestore().collection('Interests').get();
        const list = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.NameOfInterests, // make sure this field name matches Firestore exactly
          };
        });

        console.log('✅ Fetched interests:', list); // debug
        setInterests(list);
      } catch (error) {
        Alert.alert('Error', error.message);
        console.log('❌ Firestore error:', error);
      }
    };
    fetchInterests();
  }, []);

  const toggleInterest = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (selected.length === 0) {
      Alert.alert('Please select at least one interest');
      return;
    }
    navigation.navigate('SignUp', { selectedInterests: selected });
  };

  const renderBox = ({ item }) => {
    const isActive = selected.includes(item.id);
    return (
      <TouchableOpacity
        style={[styles.box, isActive && styles.activeBox]}
        onPress={() => toggleInterest(item.id)}
      >
        <Text style={[styles.boxText, isActive && styles.activeText]}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select your interest</Text>
      <Text style={styles.subtitle}>Choose what events and activity you would like to see</Text>

      {interests.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20, color: 'gray' }}>
          Loading interests...
        </Text>
      ) : (
        <FlatList
          data={interests}
          renderItem={renderBox}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>NEXT →</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0b0b38',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#444',
    marginBottom: 20,
  },
  grid: {
    paddingBottom: 20,
  },
  box: {
    flex: 1,
    margin: 6,
    borderWidth: 1.5,
    borderColor: '#ccc',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeBox: {
    backgroundColor: '#5c4dd2',
    borderColor: '#5c4dd2',
  },
  boxText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  activeText: {
    color: '#fff',
  },
  button: {
    marginTop: 'auto',
    backgroundColor: '#5c4dd2',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default InterestSelectionScreen;

