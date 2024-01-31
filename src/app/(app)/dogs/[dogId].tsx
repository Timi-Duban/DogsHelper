import globalStyles from "@/global/GlobalStyle";
import Title from "@/global/components/Title";
import { theme } from "@/global/theme";
import TourList from "@/tours/components/TourList";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { DogsStoreContext } from "../_layout";

const DogProfile = () => {
    const { dogId } = useLocalSearchParams() as {dogId: string};
    const dogsStore = useContext(DogsStoreContext);
    const dog = dogsStore.dogs.find(e => e.id === dogId)

    const [name, setName] = useState('');

    useEffect(() => {
        setName(dog?.name ?? '');
    }, [])

    const onEdit = async () => {
        try {
            await dog?.updateName(name);
            router.canGoBack() ? router.back() : router.replace('/dogs');
        } catch (error: any) {
            Alert.alert('Error', error.message)
        }
    }

    const onDelete = async () => {
        try {
            await dog?.delete();
            router.canGoBack() ? router.back() : router.replace('/dogs');
        } catch (error: any) {
            Alert.alert('Error', error.message)
        }
    }

    if (!dog) {
        return <Text>Dog not found, please try again.</Text>
    }
    return (
        <View>
            <Title>Dog profile: {dog.name}</Title>

            <View style={styles.row}>
                <TextInput
                    onChangeText={setName}
                    value={name}
                    placeholder="Name"
                    autoCapitalize="words"
                    style={globalStyles.input}
                />
                <Button title="Update name" onPress={onEdit} disabled={name === ""} />
            </View>
            <View style={styles.deleteButton}>
                <Button title="Delete dog" color={theme.colors.danger} onPress={onDelete} />
            </View>
            <TourList dogId={dogId} />
        </View>
    )
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    deleteButton: {
        alignSelf: 'center',
        width: '35%',
        margin: 20,
    }
})
export default DogProfile;
