import { PopulatedDogsStoreContext } from "@/app/(app)/_layout";
import globalStyles from "@/global/GlobalStyle";
import { theme } from "@/global/theme";
import { router } from "expo-router";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { DataTable } from 'react-native-paper';
import { Column, DogTableData, SortingType, convPopDogsToTableData, sortLastTour } from "../DogListHelper";

const DogsList = observer(() => {
    const populatedDogsStore = useContext(PopulatedDogsStoreContext);
    const dogs = populatedDogsStore.popDogs;
    const [page, setPage] = useState<number>(0);

    const [days, setDays] = useState(30);
    const [daysInput, setdaysInput] = useState(days.toString());
    useEffect(() => {
        parseInt(daysInput) && setDays(Math.min(parseInt(daysInput), 30));
    }, [daysInput])

    const [data, setData] = useState<DogTableData[]>([]);
    useEffect(() => {
        setData(convPopDogsToTableData(dogs, days));
    }, [dogs, days])

    const initialSorting = { name: undefined, lastTour: undefined, countWheel: undefined, countLead: undefined, distance: undefined };
    const [sorting, setSorting] = useState<SortingType>(initialSorting);

    const itemsPerPage = 60;
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
                setData(data.sort((dog1, dog2) => sortLastTour(dog1, dog2, sorting.lastTour)));
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
        <View style={styles.container}>
            <View style={styles.row}>
                <Text>Number of days:</Text>
                <TextInput
                    onChangeText={setdaysInput}
                    value={daysInput}
                    keyboardType="numeric"
                    style={{ ...globalStyles.input, ...styles.numberInput }}
                />
            </View>
            <ScrollView>
                <DataTable>
                    <DataTable.Header theme={theme}>
                        <DataTable.Title
                            onPress={() => handleSort('name')}
                            sortDirection={sorting.name}
                            theme={theme}
                            style={{ flex: 1.5 }}
                        >
                            Name
                        </DataTable.Title>
                        <DataTable.Title
                            onPress={() => handleSort('lastTour')}
                            sortDirection={sorting.lastTour}
                            theme={theme}
                            style={styles.centered}
                        >
                            last tour
                        </DataTable.Title>
                        <DataTable.Title
                            onPress={() => handleSort('countWheel')}
                            sortDirection={sorting.countWheel}
                            theme={theme}
                            style={{ ...styles.centered, flex: 0.7 }}
                        >
                            wheel
                        </DataTable.Title>
                        <DataTable.Title
                            onPress={() => handleSort('countLead')}
                            sortDirection={sorting.countLead}
                            theme={theme}
                            style={{ ...styles.centered, flex: 0.7 }}
                        >
                            lead
                        </DataTable.Title>
                        <DataTable.Title
                            onPress={() => handleSort('distance')}
                            sortDirection={sorting.distance}
                            numeric
                            theme={theme}
                            style={styles.centered}
                        >
                            distance
                        </DataTable.Title>
                    </DataTable.Header>

                    {data.slice(from, to).map((dog) => (
                        <DataTable.Row
                            key={dog.id}
                            theme={theme}
                            style={{ opacity: dog.femaleInHeat ? 0.4 : 1 }}
                        >
                            <DataTable.Cell
                                onPress={() => router.push({ pathname: "/dogs/[dogId]", params: { dogId: dog.id }, })}
                                textStyle={styles.cellTextStyle}
                                style={{ flex: 1.5 }}
                            >
                                {dog.name}
                            </DataTable.Cell>
                            <DataTable.Cell
                                textStyle={styles.cellTextStyle}
                                style={styles.centered}
                            >{dog.lastTour}</DataTable.Cell>
                            <DataTable.Cell
                                textStyle={styles.cellTextStyle}
                                style={{ ...styles.centered, flex: 0.7 }}
                            >{dog.countWheel || ''}</DataTable.Cell>
                            <DataTable.Cell
                                textStyle={styles.cellTextStyle}
                                style={{ ...styles.centered, flex: 0.7 }}
                            >{dog.countLead || ''}</DataTable.Cell>
                            <DataTable.Cell
                                textStyle={styles.cellTextStyle}
                                style={styles.centered}
                                numeric
                            >{dog.distance}</DataTable.Cell>
                        </DataTable.Row>
                    ))}

                    <DataTable.Pagination
                        page={page}
                        numberOfPages={Math.ceil(dogs.length / itemsPerPage)}
                        onPageChange={(page) => setPage(page)}
                        label={`${from + 1}-${to} of ${dogs.length}`}
                        numberOfItemsPerPage={itemsPerPage}
                        theme={theme}
                    />
                </DataTable>
            </ScrollView>
        </View>
    )
});

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        borderRadius: 16,
        flex: 1,
    },
    centered: {
        justifyContent: 'center'
    },
    cellTextStyle: {
        color: theme.colors.text,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    numberInput: {
        marginLeft: 5,
        width: 50,
        borderRadius: 8,
        height: 40,
    },
})

export default DogsList;
