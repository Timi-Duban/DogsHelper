import { Firestore, Timestamp, addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { DocType } from "../FirestoreService";

type Position = "head" | "back" | "normal";
export type TourType = { id: string, length: number, position: Position, ts: Timestamp, dogId: string }
const defGroup = (testDb?: Firestore) => doc(testDb ?? db, "groups", "1");

const extractTourFromDoc = (doc: DocType): TourType => {
    return { id: doc.id, ...doc.data } as TourType
}

export const createDbTour = async (dogId: string, length: number, position: Position, ts: Timestamp, testDb?: Firestore): Promise<TourType> => {
    if (dogId && length) {
        const docRef = await addDoc(collection(testDb ?? db, "groups/1/dogs", dogId, "tours"), { length, position, ts, dogId });
        return { id: docRef.id, length, position, ts, dogId };
    } else {
        throw new Error('Cannot create a tour with an empty dogId or length: ' + JSON.stringify({ dogId, length }))
    }
};

export const updateTour = async (dogId: string, newTour: TourType, testDb?: Firestore) => {
    return await updateDoc(
        doc(defGroup(testDb), "dogs", dogId, "tours", newTour.id),
        { length: newTour.length, position: newTour.position, ts: newTour.ts }
    );
};

export const deleteTour = async (dogId: string, id: string, testDb?: Firestore) => {
    return await deleteDoc(doc(defGroup(testDb), "dogs", dogId, "tours", id));
};
