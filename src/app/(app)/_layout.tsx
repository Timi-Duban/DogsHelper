import { theme } from '@/global/theme';
import { Stack, router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from 'firebaseConfig';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function AppLayout() {

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // console.log('User signed in: ', user.email)
        } else {
            router.replace('/login')
        }
    });
    return (
        <View style={styles.container}>
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: theme.colors.secondary,
                    },
                    headerTintColor: 'white',
                    headerBackVisible: true,
                    headerTitleAlign: 'center',
                    title: "Dogs Helper",
                }}
                initialRouteName='/'
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        padding: 10,
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
    }
})