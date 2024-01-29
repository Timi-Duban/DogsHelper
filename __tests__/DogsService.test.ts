import { RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { Firestore } from 'firebase/firestore';
import { createDbDog, deleteDog, getDog, readDogs, updateDogName } from '../src/dogs/DogsService';
import { createInitialDog, getDbDogs, initialDog, initializeSimilarEnv } from './firestore/__utils__/Helpers';

describe('Test dogs service', () => {
    let testEnv: RulesTestEnvironment;
    let firestore: Firestore;

    beforeAll(async () => {
        testEnv = await initializeSimilarEnv('dogs');
    });

    beforeEach(async () => {
        await testEnv.clearFirestore();
        firestore = testEnv.authenticatedContext("testUserId").firestore() as unknown as Firestore;
        await createInitialDog(firestore);
    })

    it('Can CREATE dog.', async () => {
        const initialDogs = await getDbDogs(firestore);
        const newDog = await createDbDog('newDog', firestore);
        const finalDogs = await getDbDogs(firestore);
        expect(initialDogs.length).toBeLessThan(finalDogs.length);
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