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

    const sortedTours = toursStore.tours.slice().sort((tour1, tour2) => tour1.ts < tour2.ts ? 1 : -1);
    
    return (
        <View>
            {sortedTours.map(tour => <TourComponent tour={tour} key={tour.id} />)}
        </View>
    )
});

export default TourList;
