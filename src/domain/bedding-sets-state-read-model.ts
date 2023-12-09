import { BeddingSetsState } from "../interfaces/bedding-sets-states-report.js";

export default class BeddingSetsReadModel  {

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
        this.cleaning += sets;
        this.dirty -= sets;
    }

    onFinishCleaning(sets: number) {
        this.cleaning -= sets;
        this.inLaundery += sets;
        if (this.cleaning < 0) {
            this.inLaundery += this.cleaning;
            this.cleaning = 0;
        } // TODO: use removerSet
    }

    onPickupLaundry(sets: number): number {
        this.inLaundery -= sets;
        this.cleaned += sets;
        const inLaunderyBeforeCompensation = this.inLaundery;
        if (this.inLaundery < 0) {
            this.pickUpFromCleaning();
        } // TODO: use removerSet

        return inLaunderyBeforeCompensation
    }

    pickUpFromCleaning() {
        this.cleaning += this.inLaundery;
        this.inLaundery = 0;
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
}