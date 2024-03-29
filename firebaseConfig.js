import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getAnalytics, isSupported, logEvent } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { browserSessionPersistence, connectAuthEmulator, getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCmFaAZWUE0nU7_np5gIkIs-Ak4WitGju0",
    authDomain: "dogs-helper-firebase.firebaseapp.com",
    projectId: "dogs-helper-firebase",
    storageBucket: "dogs-helper-firebase.appspot.com",
    messagingSenderId: "707072723466",
    appId: "1:707072723466:web:d710259af7e920f2e16df3",
    measurementId: "G-BNK8S8HE79"
};

const baseEmulatorAddress = Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics
isSupported().then(supported => {
    if (supported) {
        const analytics = getAnalytics(app);
        logEvent(analytics, 'analytics_initialized');
    }
});

// Initialize Firebase Authentication
const persistence = process.env.NODE_ENV === 'test'
    ? null
    : Platform.OS === 'web'
        ? browserSessionPersistence
        : getReactNativePersistence(ReactNativeAsyncStorage);
initializeAuth(app, { persistence });
const auth = getAuth(app);
if (process.env.EXPO_PUBLIC_EMULATE_AUTH === 'emulate') {
    console.log('Emulating auth service')
    connectAuthEmulator(auth, 'http://' + baseEmulatorAddress + ':9099');
}

// Initialize Firestore
const db = getFirestore(app);
if (process.env.EXPO_PUBLIC_EMULATE_FIRESTORE === 'emulate') {
    console.log('Emulating firestore service')
    connectFirestoreEmulator(db, baseEmulatorAddress, 8080);
}

export { app, auth, db };
