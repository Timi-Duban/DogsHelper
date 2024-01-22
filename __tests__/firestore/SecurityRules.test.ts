import { RulesTestContext, RulesTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { createInitialDoc, getExistingGroup, getGroups, initializeSimilarEnv } from './__utils__/Helpers';

describe('Test root database access', () => {
    let testEnv: RulesTestEnvironment;
    let authenticatedUser: RulesTestContext;
    let unauthenticatedUser: RulesTestContext;

    beforeAll(async () => {
        testEnv = await initializeSimilarEnv();
    });

    beforeEach(async () => {
        // Setup initial user data
        await testEnv.clearFirestore();
        await createInitialDoc(testEnv);

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
        const readByAuthenticatedUser = getExistingGroup(authenticatedUser).get();
        await assertSucceeds(readByAuthenticatedUser);

        const readByUnauthenticatedUser = getExistingGroup(unauthenticatedUser).get();
        await assertFails(readByUnauthenticatedUser);
    });


    it('Only authenticated user can READ with list.', async () => {
        const readByAuthenticatedUser = getGroups(authenticatedUser).get();
        await assertSucceeds(readByAuthenticatedUser);

        const readByUnauthenticatedUser = getGroups(unauthenticatedUser).get();
        await assertFails(readByUnauthenticatedUser);
    });

    it('Only authenticated user can UPDATE.', async () => {
        const updateByAuthenticatedUser = getExistingGroup(authenticatedUser).update({ name: "authenticated name" });
        await assertSucceeds(updateByAuthenticatedUser);

        const updateByUnauthenticatedUser = getExistingGroup(unauthenticatedUser).update({ name: "authenticated name" });
        await assertFails(updateByUnauthenticatedUser);
    });

    it('Only authenticated user can DELETE.', async () => {
        const deleteByUnauthenticatedUser = getExistingGroup(unauthenticatedUser).delete();
        await assertFails(deleteByUnauthenticatedUser);

        const deleteByAuthenticatedUser = getExistingGroup(authenticatedUser).delete();
        await assertSucceeds(deleteByAuthenticatedUser);
    });
});