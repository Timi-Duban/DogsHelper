import { Firestore, addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const dogsCollection = (testDb?: Firestore) => collection(testDb ?? db, "groups", "1", "dogs");
const defGroup = (testDb?: Firestore) => doc(testDb ?? db, "groups", "1");

export const createDog = async (name: string, testDb?: Firestore) => {
    if (name) {
        const docRef = await addDoc(collection(testDb ?? db, "groups/1/dogs"), {name});
        return { id: docRef.id, data: {name} };
    } else {
        throw new Error('Cannot create a dog with an empty name')
    }
};

export const getDogs = async (testDb?: Firestore) => {
    const docs = await getDocs(dogsCollection(testDb));
    return docs.docs;
};

export const getDog = async (id: string, testDb?: Firestore) => {
    const entry = await getDoc(doc(defGroup(testDb), "dogs", id));
    return {id, data: entry.data()};
};

export const updateDogName = async (id: string, name: string, testDb?: Firestore) => {
    return await updateDoc(doc(defGroup(testDb), "dogs", id), { name });
};

export const deleteDog = async (id: string, testDb?: Firestore) => {
    return await deleteDoc(doc(defGroup(testDb), "dogs", id));
};
