import { DogsStoreContext } from "@/app/(app)/_layout";
import Link from "@/global/components/Link";
import { theme } from "@/global/theme";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dog } from "../DogsStore";

const DogComponent = (props: { dog: Dog }) => {
    const dog = props.dog;
    return (
        <View style={styles.dogView}>
            <Link
                href={{
                    pathname: "/dogs/[dogId]",
                    params: { dogId: dog.id },
                }}
                asChild
                customStyle={{}}
            >
                <Text style={styles.dogText}>{dog.name}</Text>
            </Link>
        </View>
    );
}


const DogsList = observer(() => {
    const dogsStore = useContext(DogsStoreContext);
    let dogs = dogsStore.dogs;

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
    dogView: {
        width: '46%',
        height: 60,
        borderWidth: 3,
        borderColor: theme.colors.secondary,
        borderRadius: 16,
        justifyContent: 'center',
        marginBottom: 10,
    },
    dogText: {
        fontSize: 16,
        textAlign: 'center',
    }
})

export default DogsList;
