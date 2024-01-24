import { createDog } from "@/dogs/DogsService";
import Title from "@/global/components/Title";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Button, StyleSheet, TextInput, View } from "react-native";

const create = () => {
    const [name, setName] = useState('');

    const onPress = async () => {
        try {
            await createDog(name);
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
                style={styles.input}
            />
            <Button title="Create" onPress={onPress} disabled={name === ""} />
        </View>
    )
};

const styles = StyleSheet.create({
    mainView: {
        paddingHorizontal: 10
    },
    input: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: 'white'}
})

export default create;
