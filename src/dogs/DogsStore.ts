import { createAtom, makeAutoObservable } from "mobx"

export class DogsStore {
    atom
    dogs: Dog[] = []

    constructor() {
        this.atom = createAtom(
            "DogsStore", // Atom's name, for debugging purposes.
            // 2nd (optional) parameter:
            // - Callback for when this atom transitions from unobserved to observed.
            () => this.startListening(),
            // 3rd (optional) parameter:
            // - Callback for when this atom transitions from observed to unobserved.
            () => this.stopListening()
            // The same atom transitions between these two states multiple times.
        )
    }

    stopListening(): void {
    }
    startListening(): void {
        this.dogs = [new Dog(this, '1', 'test intial dog name')]
    }

    getDogs() {
        this.atom.reportObserved();
        return this.dogs
    }

    // Fetches all Dogs from the server.
    // loadDogs() {
    // }

    createDog(id: string, name: string) {
        this.dogs.push(new Dog(this, id, name));
        this.atom.reportChanged();
    }

    // Creates a fresh Dog on the client and the server.
    // createDog(name: string) {
    //     // Create dog on backend and retrieve Id
    //     const id = 'GetId'
    //     const dog = new Dog(this, id, name)
    //     this.dogs.push(dog)
    //     return dog
    // }

    // A Dog was somehow deleted, clean it from the client memory.
    // removeDog(dog: Dog) {
    //     this.dogs.splice(this.dogs.indexOf(dog), 1)
    // }
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

    // Remove this Dog from the client and the server.
    delete() {
        // Remove from server using DogsService
        // this.store.removeDog(this) // Useless since observer will return updated list?
    }

    get asJson() {
        return {
            id: this.id,
            name: this.name,
        }
    }

    // Update this Dog with information from the server.
    // updateFromJson(json: any) {
    //     this.name = json.name
    // }
}