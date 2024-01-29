import globalStyles from "@/global/GlobalStyle";
import Title from "@/global/components/Title";
import { router } from "expo-router";
import { useContext, useState } from "react";
import { Alert, Button, StyleSheet, TextInput, View } from "react-native";
import { DogsStoreContext } from "../_layout";

const create = () => {
    const [name, setName] = useState('');
    const dogsStore = useContext(DogsStoreContext);

    const onPress = async () => {
        try {
            await dogsStore.createDog(name);
            router.canGoBack() ? router.back() : router.replace('/dogs');
        } catch (error: any) {
            Alert.alert('Error', error.message)
        }
    }

    return (
        <View style={styles.mainView}>
            <Title>Create new dog</Title>
            <TextInput
                onChangeText={setName}
                value={name}
                placeholder="Name"
                autoCapitalize="words"
                style={globalStyles.input}
            />
            <Button title="Create" onPress={onPress} disabled={name === ""} />
        </View>
    )
};

const styles = StyleSheet.create({
    mainView: {
        paddingHorizontal: 10
    },
})

export default create;
