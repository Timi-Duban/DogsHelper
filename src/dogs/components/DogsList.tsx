import { theme } from "@/global/theme";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { DogType, getDogs } from "../DogsService";

const Dog = (props: {name: string}) => {
    return (
        <View style={styles.dogView}>
            <Text style={styles.dogText}>{props.name}</Text>
        </View>
    );
}

const DogsList = () => {
    const [dogs, setDogs] = useState<DogType[]>([]);
    useEffect( () => {
        getDogs().then( res => {
            setDogs(res.map(dog => {
                return {id: dog.id, name: dog.data?.name}
            }) as DogType[]);
        })
    }, [])

    return (
        <View style={styles.grid}>
            {dogs?.map(dog => <Dog name={dog.name} key={dog.id} />)}
        </View>
    )
};

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '95%',
        marginHorizontal: 'auto',
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
