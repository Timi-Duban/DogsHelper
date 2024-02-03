import { Firestore, Timestamp, addDoc, collection, collectionGroup, deleteDoc, doc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { extractArrayFromQuerySnapchot, extractFromDoc, getXDaysAgo } from "../FirestoreService";

export type Position = "wheel" | "lead" | "normal";
export type TourData = { length: number, position: Position, ts: Timestamp, dogId: string }
export type TourType = TourData & { id: string }
const defGroup = (testDb?: Firestore) => doc(testDb ?? db, "groups", "1");

const getToursCollection = (testDb: Firestore | undefined, dogId: string) => {
    return collection(testDb ?? db, "groups", "1", "dogs", dogId, "tours");
}

const getTourDoc = (testDb: Firestore | undefined, dogId: string, id: string) => {
    return doc(defGroup(testDb), "dogs", dogId, "tours", id);
}

export const createDbTour = async (tourData: TourData, testDb?: Firestore): Promise<TourType> => {
    if (tourData.dogId) {
        const docRef = await addDoc(getToursCollection(testDb, tourData.dogId), tourData);
        return { ...tourData, id: docRef.id };
    } else {
        throw new Error('Cannot create a tour with an empty dogId: ' + JSON.stringify(tourData))
    }
};

export const readToursByDogId = async (dogId: string, testDb?: Firestore) => {
    const snap = await getDocs(getToursCollection(testDb, dogId));
    const docs = extractArrayFromQuerySnapchot(snap.docs);
    const tours = docs.map(doc => extractFromDoc<TourType>(doc));
    return tours;
};

const get30DaysToursQuery = (testDb?: Firestore) => {
    const toursCollectionGroup = collectionGroup(testDb ?? db, 'tours');
    const date = Timestamp.fromDate(getXDaysAgo(30));
    const toursQuery = query(toursCollectionGroup, where('ts', '>', date));
    return toursQuery;
}

export type ReadRtToursCallbackType = (tours: TourType[]) => void;

export const readRtToursByDogId = (dogId: string, callback: ReadRtToursCallbackType, testDb?: Firestore) => {
    const unsubscribe = onSnapshot(getToursCollection(testDb, dogId), (snap) => {
        const docs = extractArrayFromQuerySnapchot(snap.docs);
        const tours = docs.map(doc => extractFromDoc<TourType>(doc));
        callback(tours)
    });
    return unsubscribe;
};

export const readRt30DaysTours = (callback: ReadRtToursCallbackType, testDb?: Firestore) => {
    const toursQuery = get30DaysToursQuery(testDb);
    const unsubscribe = onSnapshot(toursQuery, (snap) => {
        const docs = extractArrayFromQuerySnapchot(snap.docs);
        const tours = docs.map(doc => extractFromDoc<TourType>(doc));
        callback(tours);
    });
    return unsubscribe;
};

export const updateTour = async (dogId: string, id: string, newTour: Partial<TourType>, testDb?: Firestore) => {
    // Cannot change a tour's dogId or id
    const { id: tourId, dogId: tourDogId, ...safeNewTour } = newTour;
    return await updateDoc(getTourDoc(testDb, dogId, id), safeNewTour);
};

export const deleteTour = async (dogId: string, id: string, testDb?: Firestore) => {
    return await deleteDoc(getTourDoc(testDb, dogId, id));
};
