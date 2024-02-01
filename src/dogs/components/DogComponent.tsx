import Link from "@/global/components/Link";
import { theme } from "@/global/theme";
import { observer } from "mobx-react-lite";
import { StyleSheet, Text, View } from "react-native";
import { PopulatedDog } from "../PopulatedDogsStore";

const DogComponent = observer((props: { dog: PopulatedDog }) => {
    const dog = props.dog;
    return (
        <Link
            href={{
                pathname: "/dogs/[dogId]",
                params: { dogId: dog.id },
            }}
            asChild
            customStyle={{}}
        >
            <View style={styles.container}>
                <Text style={styles.nameText}>{dog.name}</Text>
                <Text style={styles.bodyText}>{dog.tours.length} tours</Text>
            </View>
        </Link>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '46%',
        height: 60,
        borderWidth: 3,
        borderColor: theme.colors.secondary,
        borderRadius: 16,
        justifyContent: 'center',
        marginBottom: 10,
    },
    nameText: {
        fontSize: 16,
        textAlign: 'center',
    },
    bodyText: {
        fontSize: 14,
        textAlign: 'center',
    },
})

export default DogComponent;