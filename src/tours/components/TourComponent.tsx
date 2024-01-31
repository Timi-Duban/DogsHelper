import { theme } from "@/global/theme";
import { observer } from "mobx-react-lite";
import { StyleSheet, Text, View } from "react-native";
import { Tour } from "../ToursStore";

type TourComponentProps = {
    tour: Tour;
}

const TourComponent = observer((props: TourComponentProps) => {
    const { tour } = props;
    return (
        <View style={styles.container}>
            <Text>Position: {tour.position}</Text>
            <Text>Length: {tour.length}</Text>
            <Text>Date: {tour.ts.toDate().toDateString()}</Text>
        </View>
    )
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.surface,
        margin: 10,
        padding: 10,
        borderRadius: 16,
        alignItems: 'center',
    }
})
export default TourComponent;
