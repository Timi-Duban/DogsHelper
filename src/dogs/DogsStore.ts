import { deleteTour, readToursByDogId } from "@/tours/ToursService"
import { Unsubscribe } from "firebase/firestore"
import { action, makeObservable, observable, onBecomeObserved, onBecomeUnobserved } from "mobx"
import { DogData, DogType, Gender, createDbDog, deleteDog, readRtDogs, updateDog } from "./DogsService"

export class DogsStore {
    dogs: Dog[] = []
    private stopListening = () => { }

    constructor() {
        makeObservable<this, "setDogs" | "setStopListening">(this, {
            dogs: observable,
            setDogs: action,
            setStopListening: action,
        })

        onBecomeObserved(this, "dogs", this.startListening.bind(this))
        onBecomeUnobserved(this, "dogs", () => this.stopListening())
    }

    private startListening(): void {
        const stop = readRtDogs((newDbDogs: DogType[]) => {
            const newDogs = newDbDogs.map(dog => {
                return new Dog(this, dog);
            });
            this.setDogs(newDogs);
        })
        this.setStopListening(stop);
    }

    private setDogs(dogs: Dog[]) {
        this.dogs = dogs;
    }

    private setStopListening(func: Unsubscribe) {
        this.stopListening = func;
    }

    createDog(newDog: DogData & { id?: string }) {
        let { id, ...safeNewDog } = newDog;
        return createDbDog(safeNewDog);
    }
}

export class Dog {
    id: string;
    store: DogsStore;
    name: string;
    gender: Gender;
    notes: string;
    temporaryNotes: string;
    heat: boolean;

    constructor(store: DogsStore, dog: DogType) {
        makeObservable(this, {
            name: observable,
            gender: observable,
            notes: observable,
            temporaryNotes: observable,
            heat: observable,
            update: action,
        })
        this.store = store;
        this.id = dog.id;
        this.name = dog.name;
        this.gender = dog.gender;
        this.notes = dog.notes;
        this.temporaryNotes = dog.temporaryNotes;
        this.heat = dog.heat;
    }

    /**
     * Delete a dog and all its tours from DB
     */
    async delete() {
        const tours = await readToursByDogId(this.id);
        tours.forEach(tour => {
            deleteTour(this.id, tour.id);
        })
        return await deleteDog(this.id);
    }

    async update(newDog: Partial<DogType>) {
        if (newDog.name) {
            newDog.name = newDog.name?.trim();
        }
        return await updateDog(this.id, newDog);
    }
}