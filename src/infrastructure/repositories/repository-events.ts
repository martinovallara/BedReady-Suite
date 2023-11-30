import { DateTime } from "luxon";
import { BeddingSetsState } from "../../interfaces/bedding-sets-states-report.js";
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
    };
    storeOnPickupLaundry(pickup: Pickup) {
        this.pickups.push(pickup);
    };

    storeInitialState: (initialState: BeddingSetsState) => void = (initialState: BeddingSetsState) => {
        this.initialState = initialState;
    }

    findAddBeddingSetsEvents(current_date: DateTime): AdditionBeddingSets[] {
        return this.additionBeddingSets.filter(addition => this.onAddBeddingSets(addition, current_date));
    }

    findCheckInBookingEvents(current_date: DateTime): Booking[] {
       return this.bookingsConfirmed.filter(booking => this.onCheckIn(booking, current_date));
    }

    findChecOutBookingEvents(current_date: DateTime): Booking[] {
        return this.bookingsConfirmed.filter(booking => this.onCheckOut(booking, current_date));
    }

    findCleaningDepotsEvents(current_date: DateTime): InCleaning[] {
        return this.cleaningDepots.filter(InCleaning => DateTime.fromJSDate(InCleaning.date).toMillis() === current_date.toMillis());
    }

    findFinishCleaningEvents(current_date: DateTime): InCleaning[] {
        return this.cleaningDepots.filter(InCleaning => DateTime.fromJSDate(InCleaning.date).plus({ days: InCleaning.cleaningTime + 1 }).toMillis() === current_date.toMillis());
    }

    findPickupEvents(current_date: DateTime): Pickup[] {
        return this.pickups.filter(pickup => DateTime.fromJSDate(pickup.date).toMillis() === current_date.toMillis());   
    }

    private onAddBeddingSets(addition: AdditionBeddingSets, current_date: DateTime): unknown {
        const addingBeddingSetDate = DateTime.fromJSDate(addition.date);
        return addingBeddingSetDate.toMillis() === current_date.toMillis();
    }

    private onCheckIn: (booking: Booking, current_date: DateTime) => boolean = (booking: Booking, current_date: DateTime) => {
        const checkIn = DateTime.fromJSDate(booking.checkInDate);
        return checkIn.toMillis() === current_date.toMillis();
    };

    private onCheckOut: (booking: Booking, current_date: DateTime) => boolean = (booking: Booking, current_date: DateTime) => {
        const checkOut = DateTime.fromJSDate(booking.checkOutDate);
        return checkOut.toMillis() === current_date.toMillis();
    };
}