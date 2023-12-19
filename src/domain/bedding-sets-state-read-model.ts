import { BeddingSetsState } from "../interfaces/bedding-sets-states-report.js";
import { Containers, subtractFromContainers } from "../utils/remover-sets.js";

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

    onBroughtForCleaning(sets: number) {
        const containers: Containers = new Map<string, number>([
            ['dirty', this.dirty],
            ['cleaned', this.cleaned]
        ]);
        
        const subtractResult = subtractFromContainers(containers, sets);

        this.dirty = subtractResult.get('dirty') as number; 
        this.cleaned = subtractResult.get('cleaned') as number;

        this.cleaning += sets;
    }



    onFinishCleaning(sets: number) {
        const containers = new Map<string, number>([
            ['cleaning', this.cleaning ]
        ]);
        const inCleaningAfterSubtract = subtractFromContainers(containers, sets).get('cleaning') as number;

        this.cleaning = Math.max(0, inCleaningAfterSubtract);
        this.inLaundery += inCleaningAfterSubtract >= 0 ? sets: -inCleaningAfterSubtract;
    }

    onPickupLaundry(sets: number): number {

        const containers =new Map<string, number>([
            [ 'inLaundery',  this.inLaundery ],
            [ 'cleaning',  this.cleaning ]
        ]);
        const subtractResult = subtractFromContainers(containers, sets);

        this.inLaundery = subtractResult.get('inLaundery') as number;
        
        const inCleaningAfterSubtract = subtractResult.get('cleaning') as number;
        const subtractFromCleaning = this.cleaning - inCleaningAfterSubtract;

        this.cleaning = inCleaningAfterSubtract;
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