import { DateTime } from "luxon";
import { BeddingSetsState, EventName } from "../../interfaces/bedding-sets-states-report.js";
import { AdditionBeddingSets, Booking, InCleaning, Pickup } from "../../use-case-bedding-sets-states-report.js";
import RepositoryDateZero from "./repository-date-zero.js";

export default class EventsRepository {


    additionBeddingSets: AdditionBeddingSets[]
    bookingsConfirmed: Booking[];
    cleaningDepots: InCleaning[];
    pickups: Pickup[];
    initialState: BeddingSetsState | undefined

    static instance: EventsRepository | null;
    static getInstance(): EventsRepository {
        if (!EventsRepository.instance) {
            EventsRepository.instance = new EventsRepository();
        }
        return EventsRepository.instance;
    }

    static renew() {
        EventsRepository.instance = null;
        return EventsRepository.getInstance();
    }

    private constructor() {
        this.additionBeddingSets = [];
        this.bookingsConfirmed = [];
        this.cleaningDepots = [];
        this.pickups = [];
    }

    storeAddBeddingSets: (amountOfBeddingSets: number) => void = (amountOfBeddingSets: number) => {
        this.additionBeddingSets.push({
            date: RepositoryDateZero.getDateZero(),
            sets: amountOfBeddingSets
        });
    };

    storeBookingConfirmed: (booking: Booking) => void = (booking: Booking) => {
        this.bookingsConfirmed.push(booking);
    };
    storeBrougthForCleaningEvent(InCleaning: InCleaning) {
        this.cleaningDepots.push(InCleaning);
    }

    storeOnPickupLaundry(pickup: Pickup) {
        this.pickups.push(pickup);
    }

    findEvents(eventName: EventName, current_date: DateTime): AdditionBeddingSets[] {
        return this.additionBeddingSets.filter(addition => this.onAddBeddingSets(addition, current_date));
    }

    private onAddBeddingSets(addition: AdditionBeddingSets, current_date: DateTime): unknown {
        const addingBeddingSetDate = DateTime.fromJSDate(addition.date);
        return addingBeddingSetDate.toMillis() === current_date.toMillis();
    }
}