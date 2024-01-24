import { DogsStore } from '@/dogs/DogsStore';
import { theme } from '@/global/theme';
import { Stack, router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from 'firebaseConfig';
import React, { createContext, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

export const DogsStoreContext = createContext<DogsStore>(new DogsStore());

export default function AppLayout() {
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.replace('/')
            }
        });
    }, [])

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