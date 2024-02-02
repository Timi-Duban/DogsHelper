import { Tour, ToursStore } from "@/tours/ToursStore";
import { computed, makeObservable, observable } from "mobx";
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
        let dogs: PopulatedDog[] = this.dogsStore.dogs.map(dog => new PopulatedDog(dog, []));
        this.toursStore.tours.forEach(tour => {
            const dog = dogs.find(d => d.id === tour.dogId);
            dog?.tours.push(tour);
        })
        return dogs;
    }
}

export class PopulatedDog extends Dog {
    tours: Tour[];

    constructor(dog: Dog, tours: Tour[]) {
        super(dog.store, dog);
        makeObservable(this, {
            tours: observable,
        })
        this.tours = tours;
    }
}