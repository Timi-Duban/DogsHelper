import App from './app/(auth)';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Page() {
    return (
        <SafeAreaProvider>
            <App />
        </SafeAreaProvider>
    );
}