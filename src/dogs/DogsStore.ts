import { Unsubscribe } from "firebase/firestore"
import { action, makeObservable, observable, onBecomeObserved, onBecomeUnobserved } from "mobx"
import { DogType, createDbDog, deleteDog, readRtDogs, updateDogName } from "./DogsService"

export class DogsStore {
    dogs: Dog[] = []
    private stopListening = () => { }

    constructor() {
        makeObservable<this, "setDogs" | "setStopListening" >(this, {
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
                return new Dog(this, dog.id, dog.name);
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

    createDog(name: string) {
        return createDbDog(name);
    }
}

export class Dog {
    id: string; // Unique id of this Dog, immutable.
    name: string;
    store: DogsStore;

    constructor(store: DogsStore, id: string, name: string) {
        makeObservable(this, {
            name: observable,
            updateName: action,
        })
        this.store = store;
        this.id = id;
        this.name = name;
    }

    async delete() {
        // TODO: delete its tours as well
        return await deleteDog(this.id);
    }

    async updateName(input: string) {
        const name = input.trim();
        if (!name) {
            throw new Error('Dog\'s name cannot be empty');
        }
        return await updateDogName(this.id, name);
    }
}