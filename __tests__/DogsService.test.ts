import { RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { Firestore } from 'firebase/firestore';
import { DogData, DogType, createDbDog, deleteDog, readDog, readDogs, readRtDog, readRtDogs, updateDog } from '../src/dogs/DogsService';
import { createInitialDog, getDbDogs, initialDog, initializeSimilarEnv } from './firestore/__utils__/Helpers';

const newDogData: DogData = {name: 'New Dog', gender: 'female', heat: true, notes: 'new notes', temporaryNotes: 'temp notes'}

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
        const newDog = await createDbDog(newDogData, firestore);
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

    it('Can READ dog list real-time.', async () => {
        let callbackRun = false;
        const callback = (dogs: DogType[]) => {
            expect(dogs).toBeDefined();
            expect(dogs.length).toEqual(1);
            expect(dogs[0].name).toEqual(initialDog.name);
            expect(dogs[0].id).toEqual(initialDog.id);
            callbackRun = true;
        }
        const stopListenning = readRtDogs(callback, firestore);
        // Await some time for the callback to be called at first read
        await new Promise(r => setTimeout(r, 50));
        stopListenning();
        expect(callbackRun).toBe(true);
    });

    it('Can READ specific dog.', async () => {
        const dog = await readDog(initialDog.id, firestore);
        expect(dog).toBeDefined();
        expect(dog.id).toEqual(initialDog.id);
        expect(dog.name).toEqual(initialDog.name);
    });

    it('Can READ specific dog real-time.', async () => {
        let callbackRun = false;
        const callback = (dog: DogType) => {
            expect(dog).toBeDefined();
            expect(dog?.id).toEqual(initialDog.id);
            expect(dog?.name).toEqual(initialDog.name);
            callbackRun = true;
        }
        const stopListenning = readRtDog(callback, initialDog.id, firestore);
        // Await some time for the callback to be called at first read
        await new Promise(r => setTimeout(r, 50));
        stopListenning();
        expect(callbackRun).toBe(true);
    });

    it('Can UPDATE dog.', async () => {
        await updateDog(initialDog.id, {...newDogData, id: 'new id'}, firestore);
        const dog = (await getDbDogs(firestore)).find(doc => doc.id === initialDog.id);
        expect(dog).toBeDefined();
        expect(dog!.id).toEqual(initialDog.id);
        expect(dog!.data().name).toEqual(newDogData.name);
    });

    it('Can DELETE dog.', async () => {
        await deleteDog(initialDog.id, firestore);
        const dogs = await getDbDogs(firestore);
        expect(dogs.length).toEqual(0);
    });
});