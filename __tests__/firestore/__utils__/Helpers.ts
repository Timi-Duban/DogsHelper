import { RulesTestContext, RulesTestEnvironment, initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { Firestore, Timestamp, collection, doc, getDocs, setDoc } from 'firebase/firestore';
import fs from "fs";
import { TourType } from '../../../src/tours/ToursService';
import { getTodayDate } from '../../../src/FirestoreService';
import { DogData, DogType } from '@/dogs/DogsService';

// ------------------------- Groups initialization -------------------------
export const initialGroup = { id: '1', data: { name: "default" } };
export const getGroups = (user: RulesTestContext) => {
    return user.firestore().collection('groups');
};
export const getExistingGroup = (user: RulesTestContext) => {
    return getGroups(user).doc(initialGroup.id);
};
export const createInitialDoc = async (testEnv: RulesTestEnvironment) => {
    await testEnv.withSecurityRulesDisabled(context => {
        const firestoreWithoutRule = context.firestore();
        return firestoreWithoutRule
            .collection('groups')
            .doc(initialGroup.id)
            .set(initialGroup.data);
    });
};

// ------------------------- Dogs initialization -------------------------
export const initialDogData: DogData = { name: 'Initial Dog', gender: 'male', heat: false, notes: '', temporaryNotes: '' };
export const initialDog: DogType = { id: '1', ...initialDogData};
export const createInitialDog = async (firestore: Firestore) => {
    await setDoc(doc(firestore, "groups", initialGroup.id, "dogs", initialDog.id), initialDogData);
};
export const getDbDogs = async (firestore: Firestore) => {
    return (await getDocs(collection(firestore, "groups", initialGroup.id, "dogs"))).docs;
};

// ------------------------- Tours initialization -------------------------
const ts = Timestamp.fromDate(getTodayDate());
export const initialTour: TourType = { id: '1', length: 25, position: "lead", ts, dogId: initialDog.id };
let {id, ...initialTourData} = initialTour;
export const createInitialTour = async (firestore: Firestore) => {
    await setDoc(
        doc(firestore, "groups", initialGroup.id, "dogs", initialDog.id, "tours", initialTour.id),initialTourData);
};
export const getDbTours = async (firestore: Firestore) => {
    return (await getDocs(collection(firestore, "groups", initialGroup.id, "dogs", initialDog.id, "tours"))).docs;
};


/**
 * Returns a test environmnent using real DB security rules
*/
export const initializeSimilarEnv = async (id: string) => {
    return await initializeTestEnvironment({
        projectId: "dogs-helper-firebase" + id,
        firestore: {
            rules: fs.readFileSync("firestore.rules", "utf8"),
            host: 'localhost',
            port: 8080,
        },
    });
}
