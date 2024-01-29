import { Unsubscribe } from "firebase/firestore"
import { action, makeAutoObservable, makeObservable, observable, onBecomeObserved, onBecomeUnobserved } from "mobx"
import { DogType, createDbDog, deleteDog, getRtDogs, updateDogName } from "./DogsService"

export class DogsStore {
    dogs: Dog[] = []
    private stopListening = () => { }

    constructor() {
        makeObservable<this, "addDog" | "resetDogs" | "setStopListening" >(this, {
            dogs: observable,
            addDog: action,
            setStopListening: action,
            resetDogs: action,
        })

        onBecomeObserved(this, "dogs", this.startListening.bind(this))
        onBecomeUnobserved(this, "dogs", () => this.stopListening())
    }

    private startListening(): void {
        const stop = getRtDogs((newDogs: DogType[]) => {
            this.resetDogs();
            newDogs.forEach(dog => {
                this.addDog(new Dog(this, dog.id, dog.name));
            })
        })
        this.setStopListening(stop);
    }

    private addDog(dog: Dog) {
        this.dogs.push(dog);
    }

    private resetDogs() {
        this.dogs = [];
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
        makeAutoObservable(this, {
            id: false,
            store: false,
        })
        this.store = store;
        this.id = id;
        this.name = name;
    }

    async delete() {
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