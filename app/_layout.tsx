import { StatusBar } from 'expo-status-bar';
import { Slot } from 'expo-router';

export default function RootLayout() {
    return (
        <>
            <Slot />
            <StatusBar style="auto" />
        </>
    );

}