import { Firestore, Timestamp, addDoc, collection, collectionGroup, deleteDoc, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { DocType, extractArrayFromQuerySnapchot, getXDaysAgo } from "../FirestoreService";

export type Position = "head" | "back" | "normal";
export type TourType = { id: string, length: number, position: Position, ts: Timestamp, dogId: string }
const defGroup = (testDb?: Firestore) => doc(testDb ?? db, "groups", "1");

const extractTourFromDoc = (doc: DocType): TourType => {
    return { id: doc.id, ...doc.data } as TourType
}

const getToursCollection = (testDb: Firestore | undefined, dogId: string) => {
    return collection(testDb ?? db, "groups", "1", "dogs", dogId, "tours");
}

const getTourDoc = (testDb: Firestore | undefined, dogId: string, id: string) => {
    return doc(defGroup(testDb), "dogs", dogId, "tours", id);
}

export const createDbTour = async (dogId: string, length: number, position: Position, ts: Timestamp, testDb?: Firestore): Promise<TourType> => {
    if (dogId && length) {
        const docRef = await addDoc(getToursCollection(testDb, dogId), { length, position, ts, dogId });
        return { id: docRef.id, length, position, ts, dogId };
    } else {
        throw new Error('Cannot create a tour with an empty dogId or length: ' + JSON.stringify({ dogId, length }))
    }
};

const get15DaysToursQuery = (testDb?: Firestore) => {
    const toursCollectionGroup = collectionGroup(testDb ?? db, 'tours');
    const date = Timestamp.fromDate(getXDaysAgo(15));
    const toursQuery = query(toursCollectionGroup, where('ts', '>', date));
    return toursQuery;
}

export type ReadRtToursCallbackType = (tours: TourType[]) => void;

export const readRtToursByDogId = (dogId: string, callback: ReadRtToursCallbackType, testDb?: Firestore) => {
    const unsubscribe = onSnapshot(getToursCollection(testDb, dogId), (snap) => {
        const docs = extractArrayFromQuerySnapchot(snap.docs);
        const tours = docs.map(doc => extractTourFromDoc(doc));
        callback(tours)
    });
    return unsubscribe;
};

export const readRt15DaysTours = (callback: ReadRtToursCallbackType, testDb?: Firestore) => {
    const toursQuery = get15DaysToursQuery(testDb);
    const unsubscribe = onSnapshot(toursQuery, (snap) => {
        const docs = extractArrayFromQuerySnapchot(snap.docs);
        const tours = docs.map(doc => extractTourFromDoc(doc));
        callback(tours);
    });
    return unsubscribe;
};

export const updateTour = async (dogId: string, newTour: TourType, testDb?: Firestore) => {
    return await updateDoc(
        getTourDoc(testDb, dogId, newTour.id),
        { length: newTour.length, position: newTour.position, ts: newTour.ts }
    );
};

export const deleteTour = async (dogId: string, id: string, testDb?: Firestore) => {
    return await deleteDoc(getTourDoc(testDb, dogId, id));
};
