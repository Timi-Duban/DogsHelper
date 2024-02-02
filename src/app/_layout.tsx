import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
    return (
        <SafeAreaView style={{flex: 1}}>
            <PaperProvider>
            <Slot />
            <StatusBar style="auto" />
            </PaperProvider>
        </SafeAreaView>
    );
}