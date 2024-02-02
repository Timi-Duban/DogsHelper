import { Firestore, addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { extractArrayFromQuerySnapchot, extractDocFromQuerySnapchot, extractFromDoc } from "../FirestoreService";

export type Gender = "male" | "female"
export type DogData = { name: string, gender: Gender, notes: string, temporaryNotes: string, heat: boolean }
export type DogType = DogData & { id: string }
const dogsCollection = (testDb?: Firestore) => collection(testDb ?? db, "groups", "1", "dogs");
const defGroup = (testDb?: Firestore) => doc(testDb ?? db, "groups", "1");

export const createDbDog = async (dogData: DogData, testDb?: Firestore): Promise<DogType> => {
    const docRef = await addDoc(collection(testDb ?? db, "groups/1/dogs"), dogData);
    return { ...dogData, id: docRef.id };
};

export const readDogs = async (testDb?: Firestore) => {
    const snap = await getDocs(dogsCollection(testDb));
    const docs = extractArrayFromQuerySnapchot(snap.docs);
    const dogs = docs.map(doc => extractFromDoc<DogType>(doc));
    return dogs;
};

export type ReadRtDogsCallbackType = (dogs: DogType[]) => void
export const readRtDogs = (callback: ReadRtDogsCallbackType, testDb?: Firestore) => {
    const unsubscribe = onSnapshot(dogsCollection(testDb), (snap) => {
        const docs = extractArrayFromQuerySnapchot(snap.docs);
        const dogs = docs.map(doc => extractFromDoc<DogType>(doc));
        callback(dogs);
    });
    return unsubscribe;
};

export const readDog = async (id: string, testDb?: Firestore) => {
    const snap = await getDoc(doc(defGroup(testDb), "dogs", id));
    const document = extractDocFromQuerySnapchot(snap);
    return extractFromDoc<DogType>(document);
};

export type ReadRtDogCallbackType = (dog: DogType) => void
export const readRtDog = (callback: ReadRtDogCallbackType, id: string, testDb?: Firestore) => {
    const unsubscribe = onSnapshot(doc(defGroup(testDb), "dogs", id), (snap) => {
        const document = extractDocFromQuerySnapchot(snap);
        const dog = extractFromDoc<DogType>(document);
        callback(dog);
    });
    return unsubscribe;
};

export const updateDog = async (id: string, newDog: Partial<DogType>, testDb?: Firestore) => {
    // Cannot change the id
    const { id: dogId, ...safeNewDog } = newDog;
    return await updateDoc(doc(defGroup(testDb), "dogs", id), safeNewDog);
};

export const deleteDog = async (id: string, testDb?: Firestore) => {
    return await deleteDoc(doc(defGroup(testDb), "dogs", id));
};
