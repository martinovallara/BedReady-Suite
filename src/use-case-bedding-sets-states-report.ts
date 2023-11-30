import { DateTime } from "luxon"

import { BeddingSetsStatesReport, BeddingSetsStateOnDate, BeddingSetsState, EventName, Event } from "./interfaces/bedding-sets-states-report.js";
import BeddingSetsReadModel from "./domain/bedding-sets-state-read-model.js";
import RepositoryDateZero from "./infrastructure/repositories/repository-date-zero.js";
import EventsRepository from "./infrastructure/repositories/repository-events.js";


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

    //bookingsConfirmed: Booking[];
    cleaningDepots: InCleaning[];
    pickups: Pickup[];
    initialState: BeddingSetsState | undefined
    eventsRepository: EventsRepository;

    private constructor(eventsRepository: EventsRepository ) {
        this.cleaningDepots = [];
        this.pickups = [];
        this.eventsRepository = eventsRepository;
    }

    public static getInstance(eventsRepository: EventsRepository): UseCaseBeddingSetsStatesReport {
        if (!UseCaseBeddingSetsStatesReport.instance) {
            UseCaseBeddingSetsStatesReport.instance = new UseCaseBeddingSetsStatesReport(eventsRepository);
        }
        return UseCaseBeddingSetsStatesReport.instance;
    }

    renew(eventsRepository: EventsRepository): UseCaseBeddingSetsStatesReport {
        UseCaseBeddingSetsStatesReport.instance = null;
        return UseCaseBeddingSetsStatesReport.getInstance(eventsRepository);
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


    storeBrougthForCleaningEvent(InCleaning: InCleaning) {
        this.cleaningDepots.push(InCleaning);
    }

    storeOnPickupLaundry(pickup: Pickup) {
        this.pickups.push(pickup);
    }

    beddingSetsStatus = (beddingSets: BeddingSetsReadModel, dateTimeZero: DateTime, days: number): BeddingSetsStateOnDate => {
        const current_date = dateTimeZero.plus({ days: days });

        //const onAddBeddingSets = this.additionBeddingSets.filter(addition => this.onAddBeddingSets(addition, current_date));
        // assegna onAddBeddingSets chiamando EventsRepository
        const onAddBeddingSets = this.eventsRepository.findAddBeddingSetsEvents(current_date); 

        const checkInBooking = this.eventsRepository.findCheckInBookingEvents(current_date);
        const checkOutBooking = this.eventsRepository.findChecOutBookingEvents(current_date);

        const InCleaning = this.cleaningDepots.find(InCleaning => DateTime.fromJSDate(InCleaning.date).toMillis() === current_date.toMillis());
        const onFinishCleaning = this.cleaningDepots.find(InCleaning => DateTime.fromJSDate(InCleaning.date).plus({ days: InCleaning.cleaningTime + 1 }).toMillis() === current_date.toMillis());

        const pickup = this.pickups.find(pickup => DateTime.fromJSDate(pickup.date).toMillis() === current_date.toMillis());

        if (onAddBeddingSets.length > 0) {
            onAddBeddingSets.forEach(addition => {
                beddingSets.addBeddingSets(addition.sets);
            })
        }

        if (checkInBooking.length >=1) {
            beddingSets.onCheckIn(checkInBooking[0].beddingSets);
        }

        if (checkOutBooking.length >=1) {
            beddingSets.onCheckOut(checkOutBooking[0].beddingSets);
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
            events: this.getEvents(checkInBooking[0], checkOutBooking[0], InCleaning, pickup),
            cleaned,
            in_use,
            dirty,
            cleaning,
            in_laundery
        };
    };

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

export default function useCaseBaddingSetStateReport(eventsRepository: EventsRepository) {
    return UseCaseBeddingSetsStatesReport.getInstance(eventsRepository);
} 