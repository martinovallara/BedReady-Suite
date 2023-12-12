import { BeddingSetsState } from "../interfaces/bedding-sets-states-report.js";
import { subtractFromContainers } from "../utils/remover-sets.js";

export default class BeddingSetsReadModel {

    private cleaned: number = 0;
    private inUse: number = 0;
    private dirty: number = 0;
    private cleaning: number = 0;
    private inLaundery: number = 0;

    setup(initialState: BeddingSetsState | undefined) {
        initialState && Object.assign(this, initialState);
    }

    onCheckIn: (beddingSets: number) => void = (beddingSets: number) => {
        this.cleaned -= beddingSets;
        this.inUse += beddingSets;
    }

    onCheckOut: (beddingSets: number) => void = (beddingSets: number) => {
        this.inUse -= beddingSets;
        this.dirty += beddingSets;
    }

    addBeddingSets: (amountOfBeddingSets: number) => void = (amountOfBeddingSets: number) => {
        this.cleaned += amountOfBeddingSets;
    }

    OnBrougthForCleaning(sets: number) {

        const containers = [this.dirty, this.inUse, this.cleaned];

        const subtractResult = subtractFromContainers(containers, sets);

        this.dirty = subtractResult[0];
        this.inUse = subtractResult[1];
        this.cleaned = subtractResult[2];

        this.cleaning += sets;

    }

    onFinishCleaning(sets: number) {
        const containers = [this.cleaning];
        const subtractResult = subtractFromContainers(containers, sets);

        this.cleaning = Math.max(0, subtractResult[0]);
        this.inLaundery += subtractResult[0] < 0 ? -subtractResult[0] : sets;
    }

    onPickupLaundry(sets: number): number {

        const containers = [this.inLaundery, this.cleaning];
        const subtractResult = subtractFromContainers(containers, sets);

        this.inLaundery = subtractResult[0];
        const subtractFromCleaning = this.cleaning - subtractResult[1];
        this.cleaning = subtractResult[1];
        this.cleaned += sets;

        return subtractFromCleaning;
    }


    get state(): BeddingSetsState {
        return {
            cleaned: this.cleaned,
            inUse: this.inUse,
            dirty: this.dirty,
            cleaning: this.cleaning,
            inLaundery: this.inLaundery
        }
    }

    private removeOnlyThosePresent(rest: number) {
        this.inLaundery -= rest;
    }

    private inCleaningMissing(rest: number) {
        return rest > 0;
    }

    private pickUpFromCleaning(rest: number) {
        this.cleaning -= rest;
    }

    private cleanedNotEnought(rest: number) {
        return rest > 0;
    }
}