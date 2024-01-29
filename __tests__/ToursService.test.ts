import { RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { Firestore } from 'firebase/firestore';
import { TourType, createDbTour, deleteTour, updateTour } from '../src/tours/ToursService';
import { createInitialTour, getDbTours, initialDog, initialTour, initializeSimilarEnv } from './firestore/__utils__/Helpers';

const dogId = initialDog.id;

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
        const initialTours = await getDbTours(firestore);
        const newTour = await createDbTour(dogId, 10, "back", firestore);
        const finalTours = await getDbTours(firestore);
        expect(initialTours.length).toBeLessThan(finalTours.length);
        expect(finalTours.find(tour => tour.id === newTour.id)).toBeDefined;
    });

    it('Can UPDATE tour.', async () => {
        const newTour: TourType = { id: initialTour.id, length: 100, position: 'normal' };
        await updateTour(dogId, newTour, firestore);
        const tour = (await getDbTours(firestore)).find(doc => doc.id === initialTour.id);
        expect(tour).toBeDefined();
        expect(tour!.id).toEqual(initialTour.id);
        expect(tour!.data().length).toEqual(newTour.length);
        expect(tour!.data().position).toEqual(newTour.position);
    });

    it('Can DELETE tour.', async () => {
        await deleteTour(dogId, initialTour.id, firestore);
        const tours = await getDbTours(firestore);
        expect(tours.length).toEqual(0);
    });
});