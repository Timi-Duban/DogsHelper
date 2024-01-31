import { observer } from "mobx-react-lite";
import { useState } from "react";
import { View } from "react-native";
import { ToursStore } from "../ToursStore";
import TourComponent from "./TourComponent";

type TourListProps = {
    dogId: string;
}

const TourList = observer((props: TourListProps) => {
    const { dogId } = props;
    const [toursStore] = useState(() => new ToursStore(dogId));
    
    return (
        <View>
            {toursStore.tours.map(tour => <TourComponent tour={tour} key={tour.id} />)}
        </View>
    )
});

export default TourList;
