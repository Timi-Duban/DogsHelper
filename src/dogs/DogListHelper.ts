import { Tour } from "@/tours/ToursStore";
import { Timestamp } from "firebase/firestore";
import { PopulatedDog } from "./PopulatedDogsStore";
import { getXDaysAgo } from "@/FirestoreService";

type SortingValue = "ascending" | "descending" | undefined;
export type SortingType = {
    name: SortingValue;
    lastTour: SortingValue;
    countWheel: SortingValue;
    countLead: SortingValue;
    distance: SortingValue;
};

export type Column = keyof SortingType;

export type DogTableData = {
    id: string;
    name: string;
    lastTour: string;
    lastTs?: Timestamp;
    distance: number;
    femaleInHeat: boolean;
    countWheel: number;
    countLead: number;
};

const getDataFromTours = (tours: Tour[], days: number) => {
    const minimalTs = Timestamp.fromDate(getXDaysAgo(days));
    let distance = 0;
    let countWheel = 0;
    let countLead = 0;
    let lastTs = undefined;
    for (const tour of tours) {
        if (tour.ts >= minimalTs) {
            distance += tour.length;
            if (lastTs === undefined || tour.ts > lastTs)
                lastTs = tour.ts;
            if (tour.position === 'wheel')
                countWheel += 1;
            if (tour.position === 'lead')
                countLead += 1;
        }
    }
    const lastTour = lastTs ? lastTs.toDate().toLocaleDateString('en-GB').slice(0, -5) : 'Long ago';
    return { lastTour, lastTs, distance, countWheel, countLead };
};

export const convPopDogsToTableData = (dogs: PopulatedDog[], days: number): DogTableData[] => {
    if (dogs.length == 0) {
        return [];
    }
    return dogs.map(dog => {
        const { lastTour, lastTs, distance, countWheel, countLead } = getDataFromTours(dog.tours, days);
        return {
            id: dog.id,
            name: dog.name,
            lastTour,
            lastTs,
            distance,
            femaleInHeat: dog.gender === 'female' && dog.heat,
            countWheel,
            countLead,
        };
    });
};

export const sortLastTour = (dog1: DogTableData, dog2: DogTableData, sorting: SortingValue) => {
    const lasTs1 = dog1.lastTs ?? new Timestamp(0, 0);
    const lasTs2 = dog2.lastTs ?? new Timestamp(0, 0);
    return sorting === 'ascending'
        ? lasTs1 < lasTs2 ? 1 : -1
        : lasTs1 > lasTs2 ? 1 : -1;
};

