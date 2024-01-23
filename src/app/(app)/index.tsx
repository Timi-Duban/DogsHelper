import { signOut } from "@/auth/AuthService";
import Title from "@/global/components/Title";
import { router } from "expo-router";
import { Button, StyleSheet, View } from "react-native";

export default function Page() {
    return (
        <>
            <Title>Welcome to Dogs Helper</Title>
            <View style={styles.buttonView}>
                <Button
                    title="Create dog"
                    onPress={() => {router.push('/dogs/create');}}
                />
            </View>
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
    },
    buttonView: {
        maxWidth: 200,
        alignSelf: 'center',
    },
})