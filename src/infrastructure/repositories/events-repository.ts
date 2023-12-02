import { DateTime } from "luxon";
import { InitialState } from "../../interfaces/bedding-sets-states-report.js";
import { AdditionBeddingSets, Booking, InCleaning, Pickup } from "../../use-case-bedding-sets-states-report.js";
import fs from 'fs';


export default class EventsRepository {
    dateTimeZero(): Date {
        return this.initialState?.date as Date
    }
    getEvents(): boolean {
        // return true if some array is not empty
        return this.additionBeddingSets.length > 0 || this.bookingsConfirmed.length > 0 || this.cleaningDepots.length > 0 || this.pickups.length > 0 || this.initialState !== undefined
    }

    additionBeddingSets: AdditionBeddingSets[]
    bookingsConfirmed: Booking[];
    cleaningDepots: InCleaning[];
    pickups: Pickup[];
    initialState: InitialState | undefined

    static EVENTS_STORAGE_PATH: () => string = () => process.env.EVENTS_STORAGE_PATH as string

    static instance: EventsRepository | null;
    static getInstance(): EventsRepository {

        //console.log('EventsRepository --> EVENTS_STORAGE_PATH:', EventsRepository.EVENTS_STORAGE_PATH());

        if (!EventsRepository.instance) {
            EventsRepository.instance = new EventsRepository();
            // deserialize from file if exists
            if (fs.existsSync(EventsRepository.EVENTS_STORAGE_PATH())) {
                const jsonData = fs.readFileSync(EventsRepository.EVENTS_STORAGE_PATH(), 'utf8');
                const data = JSON.parse(jsonData) as EventsRepository;

                EventsRepository.deserialize(EventsRepository.instance, data);

            }
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

    storeAddBeddingSets: (amountOfBeddingSets: AdditionBeddingSets) => void = (amountOfBeddingSets: AdditionBeddingSets) => {
        this.additionBeddingSets.push(amountOfBeddingSets);
        this.persistToFile(EventsRepository.EVENTS_STORAGE_PATH());
    };

    storeBookingConfirmed: (booking: Booking) => void = (booking: Booking) => {
        this.bookingsConfirmed.push(booking);
        this.persistToFile(EventsRepository.EVENTS_STORAGE_PATH());
    };
    storeBrougthForCleaningEvent(InCleaning: InCleaning) {
        this.cleaningDepots.push(InCleaning);
        this.persistToFile(EventsRepository.EVENTS_STORAGE_PATH());
    };
    storeOnPickupLaundry(pickup: Pickup) {
        this.pickups.push(pickup);
        this.persistToFile(EventsRepository.EVENTS_STORAGE_PATH());
    };

    storeInitialState: (initialState: InitialState) => void = (initialState: InitialState) => {
        this.initialState = initialState;
        this.persistToFile(EventsRepository.EVENTS_STORAGE_PATH());
    }

    findAddBeddingSetsEvents(current_date: DateTime): AdditionBeddingSets[] {
        return this.additionBeddingSets.filter(addition => this.onAddBeddingSets(addition, current_date));
    }

    findCheckInBookingEvents(current_date: DateTime): Booking[] {
        return this.bookingsConfirmed.filter(booking => this.onCheckIn(booking, current_date));
    }

    findCheckOutBookingEvents(current_date: DateTime): Booking[] {
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

    public persistToFile(filename: string): void {
        const data = JSON.stringify(this);
        fs.writeFileSync(filename, data);
    }

    private static deserialize(instance: EventsRepository, data: EventsRepository) {
        instance.bookingsConfirmed = data["bookingsConfirmed"].map((booking: Booking) => {
            return {
                ...booking,
                checkInDate: new Date(booking.checkInDate),
                checkOutDate: new Date(booking.checkOutDate)
            } as Booking;
        });

        instance.additionBeddingSets = data["additionBeddingSets"].map((additionBeddingSets: AdditionBeddingSets) => {
            return {
                ...additionBeddingSets,
                date: new Date(additionBeddingSets.date)
            } as AdditionBeddingSets;
        });

        instance.cleaningDepots = data["cleaningDepots"].map((cleaningDepot: InCleaning) => {
            return {
                ...cleaningDepot,
                date: new Date(cleaningDepot.date)
            } as InCleaning;
        });

        instance.pickups = data["pickups"].map((pickup: Pickup) => {
            return {
                ...pickup,
                date: new Date(pickup.date)
            } as Pickup;
        });

        const initialState = data["initialState"] as InitialState;
        instance.initialState = {
            ...initialState,
            date: new Date(initialState.date)
        } as InitialState;
    };
}
