import { Firestore, addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { DocType, extractArrayFromQuerySnapchot, extractDocFromQuerySnapchot } from "../FirestoreService";

export type DogType = {id: string, name: string}
const dogsCollection = (testDb?: Firestore) => collection(testDb ?? db, "groups", "1", "dogs");
const defGroup = (testDb?: Firestore) => doc(testDb ?? db, "groups", "1");

const extractDogFromDoc = (doc: DocType): DogType => {
    return {id: doc.id, name: doc.data?.name}
}

export const createDog = async (name: string, testDb?: Firestore): Promise<DogType> => {
    if (name) {
        const docRef = await addDoc(collection(testDb ?? db, "groups/1/dogs"), {name});
        return { id: docRef.id, name };
    } else {
        throw new Error('Cannot create a dog with an empty name')
    }
};

export const getDogs = async (testDb?: Firestore) => {
    const snap = await getDocs(dogsCollection(testDb));
    const docs = extractArrayFromQuerySnapchot(snap.docs);
    const dogs = docs.map(doc => extractDogFromDoc(doc));
    return dogs;
};

export const getDog = async (id: string, testDb?: Firestore) => {
    const entry = await getDoc(doc(defGroup(testDb), "dogs", id));
    const document = extractDocFromQuerySnapchot(entry);
    return extractDogFromDoc(document);
};

export const updateDogName = async (id: string, name: string, testDb?: Firestore) => {
    return await updateDoc(doc(defGroup(testDb), "dogs", id), { name });
};

export const deleteDog = async (id: string, testDb?: Firestore) => {
    return await deleteDoc(doc(defGroup(testDb), "dogs", id));
};
