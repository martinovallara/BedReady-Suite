import { DateTime } from "luxon"

import { BeddingSetsStatesReport, BeddingSetsStateOnDate, BeddingSetsState, EventName, Event } from "./interfaces/bedding-sets-states-report.js";
import BeddingSets from "./domain/bedding-sets-state.js";


export type Booking = {
    checkInDate: Date;
    checkOutDate: Date;
    beddingSets: number;
};

type BrougthForCleaning = {
    date: Date;
    sets: number;
    cleaningTime: number;
};

type Pickup = {
    date: Date;
    sets: number;
};

export default class UseCaseBeddingSetsStatesReport {

    beddingSets: BeddingSets;

    bookingsConfirmed: Booking[];
    deliveries: BrougthForCleaning[];
    pickups: Pickup[];

    constructor() {
        this.beddingSets = new BeddingSets();
        this.bookingsConfirmed = [];
        this.deliveries = [];
        this.pickups = [];
    }

    addBeddingSets: (amountOfBeddingSets: number) => void = (amountOfBeddingSets: number) => {
        this.beddingSets.addBeddingSets(amountOfBeddingSets);
    };

    report: (date_zero: Date, forecastDays: number) => BeddingSetsStatesReport = (date_zero: Date, forecastDays: number) => {
        const date_time_zero = DateTime.fromJSDate(date_zero);

        const report: BeddingSetsStatesReport = {
            days: Array.from({ length: forecastDays + 1 }, (_, index) => {
                return this.beddingSetsStatus(date_time_zero, index);
            })
        }
        return report;
    };

    bookingConfirmed: (booking: Booking) => void = (booking: Booking) => {
        this.bookingsConfirmed.push(booking);
    };
    OnBrougthForCleaning(BrougthForCleaning: BrougthForCleaning) {
        this.deliveries.push(BrougthForCleaning);
    }

    onPickupLaundry(pickup: Pickup) {
        this.pickups.push(pickup);
    }

    beddingSetsStatus = (dateTimeZero: DateTime, days: number): BeddingSetsStateOnDate => {
        const current_date = dateTimeZero.plus({ days: days });

        const checkInBooking = this.bookingsConfirmed.find(booking => this.onCheckIn(booking, current_date));
        const checkOutBooking = this.bookingsConfirmed.find(booking => this.onCheckOut(booking, current_date));

        const BrougthForCleaning = this.deliveries.find(BrougthForCleaning => DateTime.fromJSDate(BrougthForCleaning.date).toMillis() === current_date.toMillis());
        const onFinishCleaning = this.deliveries.find(BrougthForCleaning => DateTime.fromJSDate(BrougthForCleaning.date).plus({ days: BrougthForCleaning.cleaningTime + 1 }).toMillis() === current_date.toMillis());

        const pickup = this.pickups.find(pickup => DateTime.fromJSDate(pickup.date).toMillis() === current_date.toMillis());

        if (checkInBooking) {
            this.beddingSets.onCheckIn(checkInBooking.beddingSets);
        }

        if (checkOutBooking) {
            this.beddingSets.onCheckOut(checkOutBooking.beddingSets);
        }

        if (BrougthForCleaning) {
            this.beddingSets.OnBrougthForCleaning(BrougthForCleaning.sets);
        }

        if (onFinishCleaning) {
            this.beddingSets.onFinishCleaning(onFinishCleaning.sets);
        }

        if (pickup) {
            this.beddingSets.onPickupLaundry(pickup.sets);
        }

        const { cleaned, in_use, dirty, cleaning, in_laundery } = this.beddingSets as BeddingSetsState;

        return {
            date: current_date.toJSDate(),
            events: this.getEvents(checkInBooking, checkOutBooking, BrougthForCleaning, pickup),
            cleaned,
            in_use,
            dirty,
            cleaning,
            in_laundery
        };
    };

    private onCheckOut: (booking: Booking, current_date: DateTime) => boolean = (booking: Booking, current_date: DateTime) => {
        const checkOut = DateTime.fromJSDate(booking.checkOutDate);
        return checkOut.toMillis() === current_date.toMillis();
    };

    private onCheckIn: (booking: Booking, current_date: DateTime) => boolean = (booking: Booking, current_date: DateTime) => {
        const checkIn = DateTime.fromJSDate(booking.checkInDate);
        return checkIn.toMillis() === current_date.toMillis();
    };

    getEvents(checkInBooking?: Booking, checkOutBooking?: Booking, BrougthForCleaning?: BrougthForCleaning, pickup?: Pickup): Event[] {
        const eventMappings: { condition: Booking | BrougthForCleaning | Pickup | undefined , name: EventName, sets: number | undefined }[] = [
            { condition: checkInBooking, name: 'Check In' as EventName, sets: checkInBooking?.beddingSets },
            { condition: checkOutBooking, name: 'Check Out' as EventName, sets: checkOutBooking?.beddingSets },
            { condition: BrougthForCleaning, name: 'BrougthForCleaning' as EventName, sets: BrougthForCleaning?.sets },
            { condition: pickup, name: 'Pickup' as EventName, sets: pickup?.sets }
        ];

        return eventMappings
            .filter(mapping => mapping.condition)
            .map(({ name, sets }) => ({ name, sets: sets ?? 0 }));
    }
}