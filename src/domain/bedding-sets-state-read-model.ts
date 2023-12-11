import { BeddingSetsState } from "../interfaces/bedding-sets-states-report.js";
import subtractUntilZero from "../utils/removerSets.js";

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
        const subtractResult = subtractUntilZero(this.dirty, sets);
        this.dirty = subtractResult.remaining;
        this.cleaning += sets;
        if(subtractResult.rest > 0) {
            const subtractResult = subtractUntilZero(this.inUse, sets);
            this.inUse = subtractResult.remaining;
            if (subtractResult.rest > 0) {
                const subtractResult = subtractUntilZero(this.cleaned, sets);
                this.cleaned = subtractResult.remaining;                
            }
        }
    }

    onFinishCleaning(sets: number) {
        const subtractResult = subtractUntilZero(this.cleaning, sets);
        this.cleaning = subtractResult.remaining;
        this.inLaundery += sets;
        if (this.inCleaningMissing(subtractResult.rest)) {
            this.removeOnlyThosePresent(subtractResult.rest);
        }
    }

    onPickupLaundry(sets: number): number {
        const subtractResult = subtractUntilZero(this.inLaundery, sets);
        this.inLaundery = subtractResult.remaining;
        this.cleaned += sets;
        if (this.cleanedNotEnought(subtractResult.rest)) {
            this.pickUpFromCleaning(subtractResult.rest);
        }
        return subtractResult.rest
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
    
    private pickUpFromCleaning(rest : number) {
        this.cleaning -= rest;
    }
    
    private cleanedNotEnought(rest: number) {
        return rest > 0;
    }
}