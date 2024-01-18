import React from 'react'
import { Slot, router } from 'expo-router';
import { auth } from 'firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

export default function AppLayout() {

    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log('User signed in: ', user.email)
        } else {
            console.log('User not signed in, redirecting...')
            router.replace('/login')
        }
    });
    return <Slot />;
}