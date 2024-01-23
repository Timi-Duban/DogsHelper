import { signOut } from "@/auth/AuthService";
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
                Create Dog
            </Link>
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
        color: theme.colors.text,
        fontSize: 16,
        fontWeight: '500',
        fontStyle: 'italic',
    },
})