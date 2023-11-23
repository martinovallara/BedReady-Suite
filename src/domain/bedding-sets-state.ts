import { BeddingSetsState } from "../interfaces/bedding-sets-states-report";

export default class BeddingSets implements BeddingSetsState  {
    cleaned: number = 0;
    in_use: number = 0;
    dirty: number   = 0;
    in_laundery: number = 0;


    onCheckIn: (beddingSets: number) => void = (beddingSets: number) => {
        this.cleaned -= beddingSets;
        this.in_use += beddingSets;
    }

    onCheckOut: (beddingSets: number) => void = (beddingSets: number) => {
        this.in_use -= beddingSets;
        this.dirty += beddingSets;
    }

    addBeddingSets: (amountOfBeddingSets: number) => void = (amountOfBeddingSets: number) => {
        //beddingSets += amountOfBeddingSets;
        this.cleaned += amountOfBeddingSets;
    }
}