import { signOut } from "@/auth/AuthService";
import { Button, View } from "react-native";

export default function Page() {
    return (
        <>
            <View style={{marginTop: "auto", margin: 5}}>
                <Button
                    title="Sign out"
                    onPress={signOut}
                />
            </View>
        </>
    );
}
