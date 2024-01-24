import { DocumentData, Firestore, QuerySnapshot, addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { DocType, extractArrayFromQuerySnapchot, extractDocFromQuerySnapchot } from "../FirestoreService";

export type DogType = { id: string, name: string }
const dogsCollection = (testDb?: Firestore) => collection(testDb ?? db, "groups", "1", "dogs");
const defGroup = (testDb?: Firestore) => doc(testDb ?? db, "groups", "1");

const extractDogFromDoc = (doc: DocType): DogType => {
    return { id: doc.id, name: doc.data?.name }
}

export const createDog = async (name: string, testDb?: Firestore): Promise<DogType> => {
    if (name) {
        const docRef = await addDoc(collection(testDb ?? db, "groups/1/dogs"), { name });
        return { id: docRef.id, name };
    } else {
        throw new Error('Cannot create a dog with an empty name')
    }
};

export const readDogs = async (testDb?: Firestore) => {
    const snap = await getDocs(dogsCollection(testDb));
    const docs = extractArrayFromQuerySnapchot(snap.docs);
    const dogs = docs.map(doc => extractDogFromDoc(doc));
    return dogs;
};

export type GetRtDogsCallbackType = (dogs: DogType[]) => void
export const getRtDogs = (callback: GetRtDogsCallbackType, testDb?: Firestore) => {
    const unsubscribe = onSnapshot(dogsCollection(testDb), (snap) => {
        const docs = extractArrayFromQuerySnapchot(snap.docs);
        const dogs = docs.map(doc => extractDogFromDoc(doc));
        callback(dogs);
    });
    return unsubscribe;
};

export const getDog = async (id: string, testDb?: Firestore) => {
    const snap = await getDoc(doc(defGroup(testDb), "dogs", id));
    const document = extractDocFromQuerySnapchot(snap);
    return extractDogFromDoc(document);
};

export type GetRtDogCallbackType = (dog: DogType) => void
export const getRtDog = (callback: GetRtDogCallbackType, id: string, testDb?: Firestore) => {
    const unsubscribe = onSnapshot(doc(defGroup(testDb), "dogs", id), (snap) => {
        const document = extractDocFromQuerySnapchot(snap);
        const dog = extractDogFromDoc(document);
        callback(dog);
    });
    return unsubscribe;
};

export const updateDogName = async (id: string, name: string, testDb?: Firestore) => {
    return await updateDoc(doc(defGroup(testDb), "dogs", id), { name });
};

export const deleteDog = async (id: string, testDb?: Firestore) => {
    return await deleteDoc(doc(defGroup(testDb), "dogs", id));
};
