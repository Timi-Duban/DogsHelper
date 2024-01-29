import { RulesTestContext, RulesTestEnvironment, initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { Firestore, collection, doc, getDocs, setDoc } from 'firebase/firestore';
import fs from "fs";

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
export const initialDog = { id: '1', name: "initial Dog" };
export const createInitialDog = async (firestore: Firestore) => {
    await setDoc(doc(firestore, "groups", initialGroup.id, "dogs", initialDog.id), { name: initialDog.name });
};
export const getDbDogs = async (firestore: Firestore) => {
    return (await getDocs(collection(firestore, "groups", initialGroup.id, "dogs"))).docs;
};

// ------------------------- Tours initialization -------------------------
export const initialTour = { id: '1', length: 25, position: "head" };
export const createInitialTour = async (firestore: Firestore) => {
    await setDoc(
        doc(firestore, "groups", initialGroup.id, "dogs", initialDog.id, "tours", initialTour.id),
        { length: initialTour.length, position: initialTour.position }
    );
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
