import { signOut } from "@/auth/services/AuthService";
import { Button } from "react-native";

export default function Page() {
    return <Button title="Sign out" onPress={() => signOut()} />;
}
