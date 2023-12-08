import { BeddingSetsState } from "../interfaces/bedding-sets-states-report.js";

export default class BeddingSetsReadModel implements BeddingSetsState {

    cleaned: number = 0;
    inUse: number = 0;
    dirty: number = 0;
    cleaning: number = 0;
    inLaundery: number = 0;

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
    }

    onPickupLaundry(sets: number) {
        this.inLaundery -= sets;
        this.cleaned += sets;

        if (this.inLaundery < 0) {
            this.pickUpFromCleaning();
        }
    }

    pickUpFromCleaning() {
        this.cleaning += this.inLaundery;
        this.inLaundery = 0;
    }
}