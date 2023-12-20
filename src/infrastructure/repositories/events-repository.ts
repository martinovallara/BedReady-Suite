import { DateTime } from "luxon";
import { InitialState } from "../../interfaces/bedding-sets-states-report.js";
import { AdditionBeddingSets, Booking, InCleaning, Pickup } from "../../use-case-bedding-sets-states-report.js";
import { persistToDrive, readStorageFromDrive } from "../services/google-drive-storage.js";

type StartDateReport = {
    date: Date;
};

export default class EventsRepository {
    startDateReport: StartDateReport = { date: new Date(0) };

    dateZero(): DateTime {
        return DateTime.fromJSDate(this.initialState?.date as Date)
    }
    getEvents(): boolean {
        return this.additionBeddingSets.length > 0 || this.bookingsConfirmed.length > 0 || this.cleaningDepots.length > 0 || this.pickups.length > 0 || this.initialState !== undefined
    }

    additionBeddingSets: AdditionBeddingSets[]
    bookingsConfirmed: Booking[];
    cleaningDepots: InCleaning[];
    pickups: Pickup[];
    initialState: InitialState | undefined

    static async getInstance(): Promise<EventsRepository> {
        const instance = new EventsRepository();

        await EventsRepository.readFromDriveAndDeserialize(instance)

        return instance;
    }

    static readFromDriveAndDeserialize = async (instance: EventsRepository) => {
        const jsonData = await readStorageFromDrive();
        if (jsonData !== undefined) {
            //console.log("Read from DRIVE: \n" + JSON.stringify(jsonData));
            const data = JSON.parse(jsonData) as EventsRepository;
            //console.log("parse json: \n" , data);
            EventsRepository.deserialize(instance, data as EventsRepository);
        } else {
            //console.log("====>>>> No data found on drive");
        }
    }

    private constructor() {
        this.additionBeddingSets = [];
        this.bookingsConfirmed = [];
        this.cleaningDepots = [];
        this.pickups = [];
    }

    async storeAddBeddingSets(amountOfBeddingSets: AdditionBeddingSets) {
        this.additionBeddingSets.push(amountOfBeddingSets);
        await this.persistToFile();
    }

    async storeBookingConfirmed(booking: Booking) {
        this.bookingsConfirmed.push(booking);
        await this.persistToFile();
    }
    async storeBrougthForCleaningEvent(InCleaning: InCleaning) {
        this.cleaningDepots.push(InCleaning);
        await this.persistToFile();
    }
    async storeOnPickupLaundry(pickup: Pickup) {
        this.pickups.push(pickup);
        await this.persistToFile();
    }

    async storeInitialState(initialState: InitialState) {
        this.initialState = initialState;
        await this.persistToFile();
    }

    async storeStartDateReport(dateStartReport: { date: Date; }) {
        this.startDateReport = dateStartReport;
        await this.persistToFile();
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

    findFinishCleaningEventsBefore(current_date: DateTime): InCleaning[] {
        return this.cleaningDepots.filter(InCleaning => DateTime.fromJSDate(InCleaning.date).plus({ days: InCleaning.cleaningTime + 1 }).toMillis() > current_date.toMillis());
    }

    findPickupEvents(current_date: DateTime): Pickup[] {
        return this.pickups.filter(pickup => DateTime.fromJSDate(pickup.date).toMillis() === current_date.toMillis());
    }

    getStartDateReport(): DateTime {
        return DateTime.fromJSDate(this.startDateReport.date);
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

    public async persistToFile(): Promise<void> {
        const data = JSON.stringify(this);
        await persistToDrive(data);
    }

    private static deserialize(instance: EventsRepository, data: EventsRepository) {
        //console.log("xxxx DESERIALIZING xxxx:\n" + JSON.stringify(data));
        //console.log("data['bookingsConfirmed']", data["bookingsConfirmed"]);

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

        const startDateReport = data["startDateReport"];
        instance.startDateReport = {
            date: startDateReport?.date ? new Date(startDateReport.date) : new Date(0)
        }

        const initialState = data["initialState"] as InitialState;
        instance.initialState = {
            ...initialState,
            date: new Date(initialState.date)
        } as InitialState;
    }
}
