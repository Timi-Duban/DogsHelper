import { Tour, ToursStore } from "@/tours/ToursStore";
import { computed, makeAutoObservable, makeObservable } from "mobx";
import { Dog, DogsStore } from "./DogsStore";

export class PopulatedDogsStore {
    private dogsStore: DogsStore;
    private toursStore: ToursStore;

    constructor(dogsStore: DogsStore, toursStore: ToursStore) {
        makeObservable<this, "popDogs">(this, {
            popDogs: computed,
        })
        this.dogsStore = dogsStore;
        this.toursStore = toursStore;
    }


    get popDogs() {
        let dogs: PopulatedDog[] = this.dogsStore.dogs.map(dog => ({...dog, tours: []}));
        this.toursStore.tours.forEach(tour => {
            const dog = dogs.find(d => d.id === tour.dogId);
            dog?.tours?.push(tour);
        })
        return dogs;
    }
}

export class PopulatedDog {
    id: string;
    name: string;
    store: DogsStore;
    tours: Tour[];

    constructor(dog: Dog, tours: Tour[]) {
        makeAutoObservable(this, {
            id: false,
            store: false,
        })
        this.store = dog.store;
        this.id = dog.id;
        this.name = dog.name;
        this.tours = tours;
    }
}