import globalStyles from "@/global/GlobalStyle";
import Title from "@/global/components/Title";
import { theme } from "@/global/theme";
import TourList from "@/tours/components/TourList";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { DogsStoreContext } from "../_layout";
import DogFields from "@/dogs/components/DogFields";
import { Dog } from "@/dogs/DogsStore";
import { DogData } from "@/dogs/DogsService";

const DogProfile = () => {
    const { dogId } = useLocalSearchParams() as {dogId: string};
    const dogsStore = useContext(DogsStoreContext);
    const dog = dogsStore.dogs.find(e => e.id === dogId)

    const [name, setName] = useState('');

    useEffect(() => {
        setName(dog?.name ?? '');
    }, [])

    const onEdit = async (newData: DogData, initialDog?: Dog) => {
        try {
            await initialDog?.update(newData);
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
        <View style={styles.mainView}>
            <Title>Dog profile: {dog.name}</Title>
            <DogFields buttonTitle="Edit" addOnPress={onEdit} existingDog={dog} />
            <TourList dogId={dogId} />
            <View style={styles.deleteButton}>
                <Button title="Delete dog" color={theme.colors.danger} onPress={onDelete} />
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    mainView: {
        paddingHorizontal: 10,
    },
    deleteButton: {
        alignSelf: 'center',
        width: '35%',
        margin: 20,
    }
})
export default DogProfile;
