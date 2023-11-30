import { DateTime } from "luxon"

import { BeddingSetsStatesReport, BeddingSetsStateOnDate, BeddingSetsState, EventName, Event } from "./interfaces/bedding-sets-states-report.js";
import BeddingSetsReadModel from "./domain/bedding-sets-state-read-model.js";
import RepositoryDateZero from "./infrastructure/repositories/repository-date-zero.js";


export type Booking = {
    checkInDate: Date;
    checkOutDate: Date;
    beddingSets: number;
};

export type InCleaning = {
    date: Date;
    sets: number;
    cleaningTime: number;
};

export type Pickup = {
    date: Date;
    sets: number;
};

export type AdditionBeddingSets = {
    date: Date,
    sets: number
}

export class UseCaseBeddingSetsStatesReport {

    private static instance: UseCaseBeddingSetsStatesReport | null;

    additionBeddingSets: AdditionBeddingSets[]
    bookingsConfirmed: Booking[];
    cleaningDepots: InCleaning[];
    pickups: Pickup[];
    initialState: BeddingSetsState | undefined

    private constructor() {
        this.additionBeddingSets = [];
        this.bookingsConfirmed = [];
        this.cleaningDepots = [];
        this.pickups = [];
    }

    public static getInstance(): UseCaseBeddingSetsStatesReport {
        if (!UseCaseBeddingSetsStatesReport.instance) {
            UseCaseBeddingSetsStatesReport.instance = new UseCaseBeddingSetsStatesReport();
        }
        return UseCaseBeddingSetsStatesReport.instance;
    }

    renew(): UseCaseBeddingSetsStatesReport {
        UseCaseBeddingSetsStatesReport.instance = null;
        return UseCaseBeddingSetsStatesReport.getInstance();
    }


    InitialState(InitialState: BeddingSetsState) {
        this.initialState = InitialState;
    }

    report(forecastDays: number): BeddingSetsStatesReport {
        const beddingSets = new BeddingSetsReadModel();
        const date_time_zero = DateTime.fromJSDate(RepositoryDateZero.getDateZero());
        if (this.initialState !== undefined) beddingSets.setup(this.initialState)

        const report: BeddingSetsStatesReport = {
            days: Array.from({ length: forecastDays + 1 }, (_, index) => {
                return this.beddingSetsStatus(beddingSets, date_time_zero, index);
            })
        }
        return report;
    };

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

    beddingSetsStatus = (beddingSets: BeddingSetsReadModel, dateTimeZero: DateTime, days: number): BeddingSetsStateOnDate => {
        const current_date = dateTimeZero.plus({ days: days });

        const onAddBeddingSets = this.additionBeddingSets.filter(addition => this.onAddBeddingSets(addition, current_date));

        const checkInBooking = this.bookingsConfirmed.find(booking => this.onCheckIn(booking, current_date));
        const checkOutBooking = this.bookingsConfirmed.find(booking => this.onCheckOut(booking, current_date));

        const InCleaning = this.cleaningDepots.find(InCleaning => DateTime.fromJSDate(InCleaning.date).toMillis() === current_date.toMillis());
        const onFinishCleaning = this.cleaningDepots.find(InCleaning => DateTime.fromJSDate(InCleaning.date).plus({ days: InCleaning.cleaningTime + 1 }).toMillis() === current_date.toMillis());

        const pickup = this.pickups.find(pickup => DateTime.fromJSDate(pickup.date).toMillis() === current_date.toMillis());

        if (onAddBeddingSets.length > 0) {
            onAddBeddingSets.forEach(addition => {
                beddingSets.addBeddingSets(addition.sets);
            })
        }

        if (checkInBooking) {
            beddingSets.onCheckIn(checkInBooking.beddingSets);
        }

        if (checkOutBooking) {
            beddingSets.onCheckOut(checkOutBooking.beddingSets);
        }

        if (InCleaning) {
            beddingSets.OnBrougthForCleaning(InCleaning.sets);
        }

        if (onFinishCleaning) {
            beddingSets.onFinishCleaning(onFinishCleaning.sets);
        }

        if (pickup) {
            beddingSets.onPickupLaundry(pickup.sets);
        }

        const { cleaned, in_use, dirty, cleaning, in_laundery } = beddingSets as BeddingSetsState;

        return {
            date: current_date.toJSDate(),
            events: this.getEvents(checkInBooking, checkOutBooking, InCleaning, pickup),
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

    private onAddBeddingSets(addition: AdditionBeddingSets, current_date: DateTime): unknown {
        const addingBeddingSetDate = DateTime.fromJSDate(addition.date);
        return addingBeddingSetDate.toMillis() === current_date.toMillis();
    }

    getEvents(checkInBooking?: Booking, checkOutBooking?: Booking, InCleaning?: InCleaning, pickup?: Pickup): Event[] {
        const eventMappings: { condition: Booking | InCleaning | Pickup | undefined, name: EventName, sets: number | undefined }[] = [
            { condition: checkInBooking, name: 'Check In' as EventName, sets: checkInBooking?.beddingSets },
            { condition: checkOutBooking, name: 'Check Out' as EventName, sets: checkOutBooking?.beddingSets },
            { condition: InCleaning, name: 'InCleaning' as EventName, sets: InCleaning?.sets },
            { condition: pickup, name: 'Pickup' as EventName, sets: pickup?.sets }
        ];

        return eventMappings
            .filter(mapping => mapping.condition)
            .map(({ name, sets }) => ({ name, sets: sets ?? 0 }));
    }
}

export default function useCaseBaddingSetStateReport() {
    return UseCaseBeddingSetsStatesReport.getInstance();
} 