import { DateTime } from "luxon"

import { BeddingSetsStatesReport, BeddingSetsStateOnDate, BeddingSetsState, EventName, Event } from "./interfaces/bedding-sets-states-report.js";
import BeddingSetsReadModel from "./domain/bedding-sets-state-read-model.js";
import RepositoryDateZero from "./infrastructure/repositories/date-zero-repository.js";
import EventsRepository from "./infrastructure/repositories/events-repository.js";


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
    
    eventsRepository: EventsRepository;

    constructor(eventsRepository: EventsRepository ) {
        this.eventsRepository = eventsRepository;
    }

    report(forecastDays: number): BeddingSetsStatesReport {
        const beddingSets = new BeddingSetsReadModel();
        const date_time_zero = DateTime.fromJSDate(RepositoryDateZero.getDateZero());
        beddingSets.setup(this.eventsRepository.initialState)

        const report: BeddingSetsStatesReport = {
            days: Array.from({ length: forecastDays + 1 }, (_, index) => {
                return this.beddingSetsStatus(beddingSets, date_time_zero, index);
            })
        }
        return report;
    };

    beddingSetsStatus = (beddingSets: BeddingSetsReadModel, dateTimeZero: DateTime, days: number): BeddingSetsStateOnDate => {
        const current_date = dateTimeZero.plus({ days: days });

        const onAddBeddingSets = this.eventsRepository.findAddBeddingSetsEvents(current_date); 

        const checkInBooking = this.eventsRepository.findCheckInBookingEvents(current_date);
        const checkOutBooking = this.eventsRepository.findCheckOutBookingEvents(current_date);

        const InCleaning = this.eventsRepository.findCleaningDepotsEvents(current_date);
        const onFinishCleaning = this.eventsRepository.findFinishCleaningEvents(current_date);

        const pickup = this.eventsRepository.findPickupEvents(current_date);

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

        if (InCleaning.length >=1) {
            beddingSets.OnBrougthForCleaning(InCleaning[0].sets);
        }

        if (onFinishCleaning.length >=1) {
            beddingSets.onFinishCleaning(onFinishCleaning[0].sets);
        }

        if (pickup.length >=1) {
            beddingSets.onPickupLaundry(pickup[0].sets);
        }

        const { cleaned, in_use, dirty, cleaning, in_laundery } = beddingSets as BeddingSetsState;

        return {
            date: current_date.toJSDate(),
            events: this.getEvents(checkInBooking[0], checkOutBooking[0], InCleaning[0], pickup[0]),
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
    return new UseCaseBeddingSetsStatesReport(eventsRepository);
} 