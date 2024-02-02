import { DogData } from "@/dogs/DogsService";
import Title from "@/global/components/Title";
import { router } from "expo-router";
import { useContext } from "react";
import { Alert, Button, StyleSheet, View } from "react-native";
//@ts-ignore
import { DogsStoreContext } from "../_layout";
import DogFields from "@/dogs/components/DogFields";

const CreateDog = () => {
    
    const dogsStore = useContext(DogsStoreContext);

    const createDog = async (dog: DogData) => {
        try {
            await dogsStore.createDog(dog);
            router.canGoBack() ? router.back() : router.replace('/dogs');
        } catch (error: any) {
            Alert.alert('Error', error.message)
        }
    }

    return (
        <View style={styles.mainView}>
            <Title>Create new dog</Title>
            <DogFields buttonTitle="Create" addOnPress={createDog} />
        </View>
    )
};

const styles = StyleSheet.create({
    mainView: {
        paddingHorizontal: 10,
    }
})

export default CreateDog;
