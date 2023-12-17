import { DateTime } from "luxon"
import { BeddingSetsStatesReport, BeddingSetsStateOnDate, EventName, Event } from "./interfaces/bedding-sets-states-report.js";
import BeddingSetsReadModel from "./domain/bedding-sets-state-read-model.js";
import EventsRepository from "./infrastructure/repositories/events-repository.js";
import { subtractUntilZero } from "./utils/remover-sets.js";

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
    private eventsRepository: EventsRepository;

    constructor(eventsRepository: EventsRepository) {
        this.eventsRepository = eventsRepository;
    }

    report(forecastDays: number): BeddingSetsStatesReport {
        const beddingSets = new BeddingSetsReadModel();

        const initialStateDate = this.eventsRepository.dateZero();
        beddingSets.setup(this.eventsRepository.initialState)

        const reportLengthDays = this.reportLengthDays(initialStateDate, forecastDays);

        const report: BeddingSetsStatesReport = {
            days: Array.from({ length: reportLengthDays + 1 }, (_, index) => {
                return this.beddingSetsStatus(beddingSets, initialStateDate, index);
            })
        };

        return {
            days: report.days.filter(day => DateTime.fromJSDate(day.date) >= this.eventsRepository.getStartDateReport())
        };
    }

    beddingSetsStatus = (beddingSets: BeddingSetsReadModel, dateZero: DateTime, days: number): BeddingSetsStateOnDate => {
        const currentDate = dateZero.plus({ days });

        const onAddBeddingSets = this.eventsRepository.findAddBeddingSetsEvents(currentDate);

        const checkInBooking = this.eventsRepository.findCheckInBookingEvents(currentDate);
        const checkOutBooking = this.eventsRepository.findCheckOutBookingEvents(currentDate);

        const InCleaning = this.eventsRepository.findCleaningDepotsEvents(currentDate);
        const onFinishCleaning = this.eventsRepository.findFinishCleaningEvents(currentDate);

        const pickup = this.eventsRepository.findPickupEvents(currentDate);

        if (onAddBeddingSets.length > 0) {
            onAddBeddingSets.forEach(addition => {
                beddingSets.addBeddingSets(addition.sets);
            })
        }

        if (checkInBooking.length >= 1) {
            beddingSets.onCheckIn(checkInBooking[0].beddingSets);
        }

        if (checkOutBooking.length >= 1) {
            beddingSets.onCheckOut(checkOutBooking[0].beddingSets);
        }

        if (InCleaning.length >= 1) {
            beddingSets.onBroughtForCleaning(InCleaning[0].sets);
        }

        if (onFinishCleaning.length >= 1) {
            beddingSets.onFinishCleaning(onFinishCleaning[0].sets);
        }

        if (pickup.length >= 1) {
            const subtractFromInCleaning = beddingSets.onPickupLaundry(pickup[0].sets);
            let setsToCanceldInSubsequenceEventOfFinishCleaning = subtractFromInCleaning;
            //TODO: questo command emette eventi su eventsReposiyory per eliminare cleaningDepots prelevati in anticipo
            if (subtractFromInCleaning > 0) {
                const subsequentCleaningFinish = this.eventsRepository.findFinishCleaningEventsBefore(currentDate)
                if (subsequentCleaningFinish.length > 0) {
                    let index = 0;
                    do {
                        const event = subsequentCleaningFinish[index];
                        const setsRest = subtractUntilZero(event.sets, setsToCanceldInSubsequenceEventOfFinishCleaning);
                        setsToCanceldInSubsequenceEventOfFinishCleaning = setsRest.rest;
                        event.sets = setsRest.remaining
                        index++;
                    } while (setsToCanceldInSubsequenceEventOfFinishCleaning < 0)
                    // TODO: remove other events while amount is equal to pickupsets
                }
            }
        }

        const { cleaned, inUse, dirty, cleaning, inLaundery } = beddingSets.state;

        return {
            date: currentDate.toJSDate(),
            events: this.getEvents(checkInBooking[0], checkOutBooking[0], InCleaning[0], onFinishCleaning[0], pickup[0]),
            cleaned,
            inUse: inUse,
            dirty,
            cleaning,
            inLaundery: inLaundery
        };
    };

    private reportLengthDays(date_Zero: DateTime, forecastDays: number) {
        const maxDate = DateTime.max(date_Zero, this.eventsRepository.getStartDateReport());
        const daysLengthFromDateZero = maxDate.diff(date_Zero, 'days').days;
        return daysLengthFromDateZero + forecastDays;
    }

    getEvents(checkInBooking?: Booking, checkOutBooking?: Booking, InCleaning?: InCleaning, OnFinishiCleaning?: InCleaning, pickup?: Pickup): Event[] {
        const eventMappings: { condition: Booking | InCleaning | Pickup | undefined, name: EventName, sets: number | undefined }[] = [
            { condition: checkInBooking, name: 'Check In' as EventName, sets: checkInBooking?.beddingSets },
            { condition: checkOutBooking, name: 'Check Out' as EventName, sets: checkOutBooking?.beddingSets },
            { condition: InCleaning, name: 'In Cleaning' as EventName, sets: InCleaning?.sets },
            { condition: OnFinishiCleaning, name: 'Finish Cleaning' as EventName, sets: OnFinishiCleaning?.sets },
            { condition: pickup, name: 'Pickup' as EventName, sets: pickup?.sets }
        ];

        return eventMappings
            .filter(mapping => mapping.condition)
            .map(({ name, sets }) => ({ name, sets: sets ?? 0 }));
    }

    async setStartDateReport(startDateReport: Date) {
        await this.eventsRepository.storeStartDateReport({ date: startDateReport });
    }
}

export default function useCaseBaddingSetStateReport(eventsRepository: EventsRepository) {
    return new UseCaseBeddingSetsStatesReport(eventsRepository);
} 