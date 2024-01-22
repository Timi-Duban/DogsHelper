import { RulesTestContext, RulesTestEnvironment, initializeTestEnvironment } from '@firebase/rules-unit-testing';
import fs from "fs";

export const initialGroup = { id: '1', data: { name: "default" } };

export const getGroups = (user: RulesTestContext) => {
    return user.firestore().collection('groups');
};
export const getExistingGroup = (user: RulesTestContext) => {
    return getGroups(user).doc(initialGroup.id);
};

/**
 * Returns a test environmnent using real DB security rules
*/ 
export const initializeSimilarEnv = async () => {
    return await initializeTestEnvironment({
        projectId: "dogs-helper-firebase",
        firestore: {
            rules: fs.readFileSync("firestore.rules", "utf8"),
            host: 'localhost',
            port: 8080,
        },
    });
}

export const createInitialDoc = async (testEnv: RulesTestEnvironment) => {
    await testEnv.withSecurityRulesDisabled(context => {
        const firestoreWithoutRule = context.firestore();
        return firestoreWithoutRule
            .collection('groups')
            .doc(initialGroup.id)
            .set(initialGroup.data);
    });
};
