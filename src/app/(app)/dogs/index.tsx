import { signOut } from "@/auth/AuthService";
import DogsList from "@/dogs/components/DogsList";
import Link from "@/global/components/Link";
import Title from "@/global/components/Title";
import { Button, StyleSheet, View } from "react-native";

export default function Page() {
    return (
        <>
            <Title>Welcome to Dogs Helper</Title>
            <Link
                href="/dogs/create"
            >
                Create new dog
            </Link>
            <Link href="/tours/create">
                Create new tour
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
})