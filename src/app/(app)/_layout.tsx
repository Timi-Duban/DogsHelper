import { DogsStore } from '@/dogs/DogsStore';
import { PopulatedDogsStore } from '@/dogs/PopulatedDogsStore';
import { theme } from '@/global/theme';
import { ToursStore } from '@/tours/ToursStore';
import { Stack, router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from 'firebaseConfig';
import React, { createContext, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

const dogsStore = new DogsStore();
const toursStore = new ToursStore(null);
export const DogsStoreContext = createContext<DogsStore>(dogsStore);
export const ToursStoreContext = createContext<ToursStore>(toursStore);
export const PopulatedDogsStoreContext = createContext<PopulatedDogsStore>(new PopulatedDogsStore(dogsStore, toursStore));

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
    }
})