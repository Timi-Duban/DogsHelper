import { signOut } from "@/auth/AuthService";
import DogsList from "@/dogs/components/DogsList";
import Title from "@/global/components/Title";
import { theme } from "@/global/theme";
import { Link } from "expo-router";
import { Button, StyleSheet, View } from "react-native";

export default function Page() {
    return (
        <>
            <Title>Welcome to Dogs Helper</Title>
            <Link 
                href="/dogs/create"
                style={styles.linkStyle}
            >
                Create new dog
            </Link>
            <DogsList />
            <View style={styles.bottomView}>
                <Button
                    title="Sign out"
                    onPress={signOut}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    bottomView: {
        margin: 5,
        marginTop: 'auto',
        marginBottom: 30,
    },
    linkStyle: {
        alignSelf: 'center',
        color: theme.colors.surface,
        backgroundColor: theme.colors.secondary,
        borderRadius: 4,
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        padding: 10,
    },
})