import { PopulatedDogsStoreContext } from "@/app/(app)/_layout";
import { Tour } from "@/tours/ToursStore";
import { router } from "expo-router";
import { Timestamp } from "firebase/firestore";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { DataTable } from 'react-native-paper';
import { PopulatedDog } from "../PopulatedDogsStore";

type SortingValue = "ascending" | "descending" | undefined
type SortingType = {
    name: SortingValue,
    lastTour: SortingValue,
    distance: SortingValue,
}
type Column = keyof SortingType
type DogData = {
    id: string,
    name: string,
    lastTour: string,
    lastTs?: Timestamp,
    distance: number,
}

const DogsList = observer(() => {
    const populatedDogsStore = useContext(PopulatedDogsStoreContext);
    const dogs = populatedDogsStore.popDogs;
    const [page, setPage] = useState<number>(0);

    const getLastTour = (tours: Tour[]) => {
        if (tours.length === 0) {
            return { lastTour: 'Long ago', lastTs: undefined }
        }
        const lastTs = tours.reduce((prev, curr) => prev.ts < curr.ts ? prev : curr).ts;
        const lastTour = lastTs.toDate().toLocaleDateString('en-GB').slice(0, -5);
        return { lastTour, lastTs };
    }
    const getDistance = (tours: Tour[]) => {
        return tours.reduce((sum, curr) => sum + curr.length, 0);
    }
    const convertDogsToData = (dogs: PopulatedDog[]): DogData[] => {
        return dogs.map(dog => {
            const { lastTour, lastTs } = getLastTour(dog.tours);
            return {
                id: dog.id,
                name: dog.name,
                lastTour,
                lastTs,
                distance: getDistance(dog.tours)
            }
        });
    }
    const [data, setData] = useState<DogData[]>([]);
    useEffect(() => {
        setData(convertDogsToData(dogs));
    }, [dogs])

    const initialSorting = { name: undefined, lastTour: undefined, distance: undefined };
    const [sorting, setSorting] = useState<SortingType>(initialSorting);

    const itemsPerPage = 5;
    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, dogs.length);

    const handleSort = (column: Column) => {
        if (sorting[column] === 'ascending') {
            setSorting({ ...initialSorting, [column]: 'descending' })
        } else {
            setSorting({ ...initialSorting, [column]: 'ascending' })
        }
        switch (column) {
            case 'lastTour':
                setData(data.sort((dog1, dog2) => {
                    const lasTs1 = dog1.lastTs ?? new Timestamp(0, 0);
                    const lasTs2 = dog2.lastTs ?? new Timestamp(0, 0);
                    return sorting.lastTour === 'ascending'
                        ? lasTs1 < lasTs2 ? 1 : -1
                        : lasTs1 > lasTs2 ? 1 : -1
                }
                ));
                break;
            default:
                setData(data.sort((dog1, dog2) => sorting[column] === 'ascending'
                    ? dog1[column] < dog2[column] ? 1 : -1
                    : dog1[column] > dog2[column] ? 1 : -1
                ));
                break;
        }
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title
                            onPress={() => handleSort('name')}
                            sortDirection={sorting.name}
                        >
                            Name
                        </DataTable.Title>
                        <DataTable.Title
                            onPress={() => handleSort('lastTour')}
                            sortDirection={sorting.lastTour}
                        >
                            last tour
                        </DataTable.Title>
                        <DataTable.Title
                            onPress={() => handleSort('distance')}
                            sortDirection={sorting.distance}
                            numeric
                        >
                            distance
                        </DataTable.Title>
                    </DataTable.Header>

                    {data.slice(from, to).map((dog) => (
                        <DataTable.Row key={dog.id}>
                            <DataTable.Cell
                                onPress={() => router.push({ pathname: "/dogs/[dogId]", params: { dogId: dog.id }, })}
                            >
                                {dog.name}
                            </DataTable.Cell>
                            <DataTable.Cell>{dog.lastTour}</DataTable.Cell>
                            <DataTable.Cell numeric>{dog.distance}</DataTable.Cell>
                        </DataTable.Row>
                    ))}

                    <DataTable.Pagination
                        page={page}
                        numberOfPages={Math.ceil(dogs.length / itemsPerPage)}
                        onPageChange={(page) => setPage(page)}
                        label={`${from + 1}-${to} of ${dogs.length}`}
                        numberOfItemsPerPage={itemsPerPage}
                    />
                </DataTable>
            </View>
        </ScrollView>
    )
});

const styles = StyleSheet.create({
    container: {
        margin: 20,
        borderRadius: 16,
        backgroundColor: 'black',
    },
})

export default DogsList;
