import { getAnalytics, isSupported, logEvent } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
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
initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const auth = getAuth(app);
if (process.env.EXPO_PUBLIC_EMULATE_AUTH === 'emulate') {
    console.log('Emulating auth service')
    if (Platform.OS === 'android') {
        connectAuthEmulator(auth, "http://10.0.2.2:9099");
    } else {
        connectAuthEmulator(auth, "http://127.0.0.1:9099");
    }
}

// Initialize Firestore
const db = getFirestore();
if (process.env.EXPO_PUBLIC_EMULATE_FIRESTORE === 'emulate') {
    console.log('Emulating firestore service')
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
}

export { app, auth };
