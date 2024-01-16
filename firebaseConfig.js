import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
// const analytics = getAnalytics(app);