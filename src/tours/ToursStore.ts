import { Timestamp, Unsubscribe } from "firebase/firestore"
import { action, makeAutoObservable, makeObservable, observable, onBecomeObserved, onBecomeUnobserved } from "mobx"
import { Position, TourData, TourType, createDbTour, deleteTour, readRt30DaysTours, readRtToursByDogId } from "./ToursService"

/**
 * A Store that contains a tour list.
 * It can either be all the tours in DB for a specific dog or the last 30 days tours for all dogs.
 */
export class ToursStore {
    tours: Tour[] = []
    private stopListening = () => { }

    /**
     * Creates a Store that contains a tour list.
    * It can either be all the tours in DB for a specific dog or the last 30 days tours for all dogs if target is null.
     * @param target either the specific dogId or null. 
     */
    constructor(target: string | null) {
        makeObservable<this, "setTours" | "setStopListening">(this, {
            tours: observable,
            setTours: action,
            setStopListening: action,
        })

        onBecomeObserved(this, "tours", this.startListening.bind(this, target))
        onBecomeUnobserved(this, "tours", () => this.stopListening())
    }

    private startListening(target: string | null): void {
        const callback = (newDbTours: TourType[]) => {
            const newTours = newDbTours.map(tour => {
                return new Tour(this, tour);
            });
            this.setTours(newTours);
        }

        let stop: Unsubscribe
        if (target === null) {
            stop = readRt30DaysTours(callback);
        } else {
            stop = readRtToursByDogId(target, callback);
        }
        this.setStopListening(stop);
    }

    private setTours(tours: Tour[]) {
        this.tours = tours;
    }

    private setStopListening(func: Unsubscribe) {
        this.stopListening = func;
    }

    createTour(newTour: TourData & { id?: string }) {
        let { id, ...safeNewTour } = newTour;
        return createDbTour(safeNewTour);
    }
}

export class Tour {
    id: string; // Unique id of this Tour, immutable.
    length: number;
    position: Position;
    ts: Timestamp;
    dogId: string;
    store: ToursStore;

    constructor(store: ToursStore, tour: TourType) {
        makeAutoObservable(this, {
            id: false,
            store: false,
            dogId: false,
        })
        this.store = store;
        this.id = tour.id;
        this.length = tour.length;
        this.position = tour.position;
        this.ts = tour.ts;
        this.dogId = tour.dogId;
    }

    async delete() {
        return await deleteTour(this.dogId, this.id);
    }

    // TODO: Update tours
    // async update() {
    // }
}