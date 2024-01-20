import fs from 'fs';
import { RulesTestContext, RulesTestEnvironment, assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';

const initialDoc = {id: '1', data: { name: "default" }}
const getGroups = (user: RulesTestContext) => {
    return user.firestore().collection('groups');
}
const getExistingDoc = (user: RulesTestContext) => {
    return getGroups(user).doc(initialDoc.id);
}

describe('Test root database access', () => {
    let testEnv: RulesTestEnvironment;
    let authenticatedUser: RulesTestContext;
    let unauthenticatedUser: RulesTestContext;

    beforeAll(async () => {
        testEnv = await initializeTestEnvironment({
            projectId: "dogs-helper-firebase",
            firestore: {
                rules: fs.readFileSync("firestore.rules", "utf8"),
                host: 'localhost',
                port: 8080,
            }
        });
    });

    beforeEach(async () => {
        // Setup initial user data
        await testEnv.clearFirestore();
        await testEnv.withSecurityRulesDisabled(context => {
            const firestoreWithoutRule = context.firestore()
            return firestoreWithoutRule
                .collection('groups')
                .doc(initialDoc.id)
                .set(initialDoc.data)
        });

        // Create authenticated and unauthenticated users for testing
        authenticatedUser = testEnv.authenticatedContext("testUserId");
        unauthenticatedUser = testEnv.unauthenticatedContext();
    })

    it('Only authenticated user can CREATE.', async () => {
        // Authenticated user operation
        const createByAuthenticatedUser = getGroups(authenticatedUser)
            .doc('2')
            .set({ name: "authenticated" });
        // Expect to Succeed
        await assertSucceeds(createByAuthenticatedUser);

        // Unauthenticated user operation
        const createByUnauthenticatedUser = getGroups(unauthenticatedUser)
            .doc('3')
            .set({ name: "unauthenticated" });
        // Expect to Fail
        await assertFails(createByUnauthenticatedUser);
    });

    it('Only authenticated user can READ with get.', async () => {
        const readByAuthenticatedUser = getExistingDoc(authenticatedUser).get();
        await assertSucceeds(readByAuthenticatedUser);

        const readByUnauthenticatedUser = getExistingDoc(unauthenticatedUser).get();
        await assertFails(readByUnauthenticatedUser);
    });


    it('Only authenticated user can READ with list.', async () => {
        const readByAuthenticatedUser = getGroups(authenticatedUser).get();
        await assertSucceeds(readByAuthenticatedUser);

        const readByUnauthenticatedUser = getGroups(unauthenticatedUser).get();
        await assertFails(readByUnauthenticatedUser);
    });

    it('Only authenticated user can UPDATE.', async () => {
        const updateByAuthenticatedUser = getExistingDoc(authenticatedUser).update({ name: "authenticated name" });
        await assertSucceeds(updateByAuthenticatedUser);

        const updateByUnauthenticatedUser = getExistingDoc(unauthenticatedUser).update({ name: "authenticated name" });
        await assertFails(updateByUnauthenticatedUser);
    });

    it('Only authenticated user can DELETE.', async () => {
        const deleteByUnauthenticatedUser = getExistingDoc(unauthenticatedUser).delete();
        await assertFails(deleteByUnauthenticatedUser);

        const deleteByAuthenticatedUser = getExistingDoc(authenticatedUser).delete();
        await assertSucceeds(deleteByAuthenticatedUser);
    });
});