import { PopulatedDogsStoreContext } from "@/app/(app)/_layout";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import DogComponent from "./DogComponent";

const DogsList = observer(() => {
    const populatedDogsStore = useContext(PopulatedDogsStoreContext);
    const dogs = populatedDogsStore.popDogs;

    return (
        <View style={styles.grid}>
            {dogs.map(dog => <DogComponent dog={dog} key={dog.id} />)}
        </View>
    )
});

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '95%',
        marginHorizontal: 'auto',
        paddingHorizontal: 5,
        alignSelf: 'center',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
})

export default DogsList;
