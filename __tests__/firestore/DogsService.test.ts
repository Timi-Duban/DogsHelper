import { RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { Firestore, collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { createDbDog, deleteDog, getDog, readDogs, updateDogName } from '../../src/dogs/DogsService';
import { initializeSimilarEnv } from './__utils__/Helpers';

const initialDog = { id: '1', name: "initial Dog" }
const createInitialDog = async (firestore: Firestore) => {
    await setDoc(doc(firestore, "groups/1/dogs", initialDog.id), { name: initialDog.name });
}
const getDbDogs = async (firestore: Firestore) => {
    return (await getDocs(collection(firestore, "groups", "1", "dogs"))).docs;
}

describe('Test dogs service', () => {
    let testEnv: RulesTestEnvironment;
    let firestore: Firestore;

    beforeAll(async () => {
        testEnv = await initializeSimilarEnv();
    });

    beforeEach(async () => {
        await testEnv.clearFirestore();
        firestore = testEnv.authenticatedContext("testUserId").firestore() as unknown as Firestore;
        await createInitialDog(firestore);
    })

    it('Can CREATE dog.', async () => {
        const initialDogs = await getDbDogs(firestore);
        const initialDogsLength = initialDogs.length;
        const newDog = await createDbDog('newDog', firestore);
        const finalDogs = await getDbDogs(firestore);
        expect(initialDogsLength).toBeLessThan(finalDogs.length);
        expect(finalDogs.find(dog => dog.id === newDog.id)).toBeDefined;
    });

    it('Can READ dog list.', async () => {
        const dogs = await readDogs(firestore);
        expect(dogs).toBeDefined();
        expect(dogs.length).toEqual(1);
        expect(dogs[0].name).toEqual(initialDog.name);
        expect(dogs[0].id).toEqual(initialDog.id);
    });

    it('Can READ specific dog.', async () => {
        const dog = await getDog(initialDog.id, firestore);
        expect(dog).toBeDefined();
        expect(dog.id).toEqual(initialDog.id);
        expect(dog.name).toEqual(initialDog.name);
    });

    it('Can UPDATE dog.', async () => {
        await updateDogName(initialDog.id, 'updatedName', firestore);
        const dog = (await getDbDogs(firestore)).find(doc => doc.id === initialDog.id);
        expect(dog).toBeDefined();
        expect(dog!.id).toEqual(initialDog.id);
        expect(dog!.data().name).toEqual('updatedName');
    });

    it('Can DELETE dog.', async () => {
        await deleteDog(initialDog.id, firestore);
        const dogs = await getDbDogs(firestore);
        expect(dogs.length).toEqual(0);
    });
});