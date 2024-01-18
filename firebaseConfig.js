import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { connectAuthEmulator, getAuth } from "firebase/auth";

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

/* if (process.env.EXPO_PUBLIC_EMULATE_FIRESTORE === 'emulate') {
    console.log('Emulating firestore service')
    config = {
        databaseURL: 'http://localhost:9000?ns=dogs-helper-firebase'
    }
} */

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics
const analytics = getAnalytics(app);
logEvent(analytics, 'analytics_initialized');

// Initialize Firebase Authentication
const auth = getAuth(app);
if (process.env.EXPO_PUBLIC_EMULATE_AUTH === 'emulate') {
    console.log('Emulating auth service')
    connectAuthEmulator(auth, "http://127.0.0.1:9099");
}

export {app, auth}