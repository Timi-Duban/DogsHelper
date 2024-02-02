import { RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { Firestore, Timestamp } from 'firebase/firestore';
import { TourType, createDbTour, deleteTour, readRt15DaysTours, readRtToursByDogId, readToursByDogId, updateTour } from '../src/tours/ToursService';
import { createInitialTour, getDbTours, initialDog, initialTour, initializeSimilarEnv } from './firestore/__utils__/Helpers';

const dogId = initialDog.id;
const newTs = Timestamp.fromMillis(1600000000000);

describe('Test tours service', () => {
    let testEnv: RulesTestEnvironment;
    let firestore: Firestore;

    beforeAll(async () => {
        testEnv = await initializeSimilarEnv('tours');
    });

    beforeEach(async () => {
        await testEnv.clearFirestore();
        firestore = testEnv.authenticatedContext("testUserId").firestore() as unknown as Firestore;
        await createInitialTour(firestore);
    });

    it('Can CREATE tour.', async () => {
        const { id, ...tourData } = initialTour;
        const initialTours = await getDbTours(firestore);
        const newTour = await createDbTour(tourData, firestore);
        const finalTours = await getDbTours(firestore);
        expect(initialTours.length).toBeLessThan(finalTours.length);
        expect(finalTours.find(tour => tour.id === newTour.id)).toBeDefined;
    });

    it('Can READ tour list.', async () => {
        const tours = await readToursByDogId(dogId, firestore);
        expect(tours).toBeDefined();
        expect(tours.length).toEqual(1);
        expect(tours[0].id).toEqual(initialTour.id);
    });

    it('Can READ 15 days real-time tour list.', async () => {
        let callbackRun = false;
        const callback = (tours: TourType[]) => {
            expect(tours).toBeDefined();
            expect(tours.length).toEqual(1);
            expect(tours[0].id).toEqual(initialTour.id);
            callbackRun = true;
        }
        const stopListenning = readRt15DaysTours(callback, firestore);
        // Await some time for the callback to be called at first read
        await new Promise(r => setTimeout(r, 50));
        stopListenning();
        expect(callbackRun).toBe(true);
    });

    it('Can READ real-time tour list of a dog.', async () => {
        let callbackRun = false;
        const callback = (tours: TourType[]) => {
            expect(tours).toBeDefined();
            expect(tours.length).toEqual(1);
            expect(tours[0].id).toEqual(initialTour.id);
            callbackRun = true;
        }
        const stopListenning = readRtToursByDogId(dogId, callback, firestore);
        // Await some time for the callback to be called at first read
        await new Promise(r => setTimeout(r, 50));
        stopListenning();
        expect(callbackRun).toBe(true);
    });

    it('Can UPDATE tour.', async () => {
        const newTour: TourType = { ...initialTour, length: 100, ts: newTs };
        await updateTour(dogId, initialTour.id, newTour, firestore);
        const tour = (await getDbTours(firestore)).find(doc => doc.id === initialTour.id);
        expect(tour).toBeDefined();
        expect(tour!.id).toEqual(initialTour.id);
        expect(tour!.data().length).toEqual(newTour.length);
        expect(tour!.data().ts).toEqual(newTour.ts);
        expect(tour!.data().position).toEqual(initialTour.position);
    });

    it('Can DELETE tour.', async () => {
        await deleteTour(dogId, initialTour.id, firestore);
        const tours = await getDbTours(firestore);
        expect(tours.length).toEqual(0);
    });
});