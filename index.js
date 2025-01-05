/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Import Firebase libraries
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';

// Your Firebase config (from Firebase Console)
const firebaseConfig = {
  apiKey: 'AIzaSyCjm6GrYFlaDBy-ihGUN2grdDTj8PoD3uk',
  authDomain: 'bytechs-dd286.firebaseapp.com',
  projectId: 'bytechs-dd286',
  storageBucket: 'bytechs-dd286.appspot.com',
  messagingSenderId: '592086117202',
  appId: '1:592086117202:android:0d336c527d5feb5a99688b',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);

// Optionally, log an event to Firebase Analytics (for testing)
logEvent(analytics, 'app_opened');

// Register the app component
AppRegistry.registerComponent(appName, () => App);
