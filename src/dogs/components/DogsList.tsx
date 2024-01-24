import { DogsStoreContext } from "@/app/(app)/_layout";
import { theme } from "@/global/theme";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";

const DogComponent = (props: { name: string }) => {
    return (
        <View style={styles.dogView}>
            <Text style={styles.dogText}>{props.name}</Text>
        </View>
    );
}


const DogsList = observer(() => {
    const dogsStore = useContext(DogsStoreContext);
    return (
        <View style={styles.grid}>
            {dogsStore.getDogs().map(dog => <DogComponent name={dog.name} key={dog.id} />)}
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
