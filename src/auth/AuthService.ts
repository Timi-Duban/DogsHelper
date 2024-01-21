import { createUserWithEmailAndPassword, AuthError, signInWithEmailAndPassword, sendPasswordResetEmail, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "firebaseConfig";

export const registerWithPassword = async (email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        console.log('Service - User registered!', userCredential.user);
    } catch (error: any) {
        handleAuthError(error);
    }
}

export const signInWithPassword = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        console.log('Service - User signed in!', userCredential.user.email);
    } catch (error: any) {
        handleAuthError(error);
    }
}

export const sendResetPassword = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email)
        console.log('Service - Reset Password mail sent!');
    } catch (error: any) {
        handleAuthError(error);
    }
}

export const signOut = async () => {
    try {
        await firebaseSignOut(auth)
        console.log('Service - User signed out!');
    } catch (error: any) {
        handleAuthError(error);
    }
}

const handleAuthError = (error: AuthError) => {
    throw error;
}
