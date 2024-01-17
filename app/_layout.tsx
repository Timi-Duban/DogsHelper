import { StatusBar } from 'expo-status-bar';
import { Slot } from 'expo-router';
import { View } from 'react-native';

export default function RootLayout() {
    return (
        <View style={{padding:2, backgroundColor: 'purple'}}>
            <Slot />
            <StatusBar style="auto" />
        </View>
    );

}