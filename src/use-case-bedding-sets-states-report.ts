import { DateTime } from "luxon"
import { BeddingSetsStatesReport, Booking, BeddingSetsStateOnDate, BeddingSetsState } from "./interfaces/bedding-sets-states-report"
import BeddingSets from "./domain/bedding-sets-state";

type delivery = {
    date: Date;
    sets: number;
    cleaningTime: number;
};

export default class UseCaseBeddingSetsStatesReport {

    bookingsConfirmed: Booking[];
    beddingSets: BeddingSets;
    deliveries: delivery[];

    constructor() {
        this.beddingSets = new BeddingSets();
        this.bookingsConfirmed = []; 
        this.deliveries = [];   
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
    onDeliveryToLaundry(Delivery: delivery) {
        this.deliveries.push(Delivery);
    }

    beddingSetsStatus = (dateTimeZero: DateTime, days: number): BeddingSetsStateOnDate => {
        const current_date = dateTimeZero.plus({ days: days });

        const checkInBooking = this.bookingsConfirmed.find(booking => this.onCheckIn(booking, current_date));
        const checkOutBooking = this.bookingsConfirmed.find(booking => this.onCheckOut(booking, current_date));

        const delivery = this.deliveries.find(delivery => DateTime.fromJSDate(delivery.date).toMillis() === current_date.toMillis());
        const onFinishCleaning = this.deliveries.find(delivery => DateTime.fromJSDate(delivery.date).plus({ days: delivery.cleaningTime + 1 }).toMillis() === current_date.toMillis());

        if (checkInBooking) {
            this.beddingSets.onCheckIn(checkInBooking.beddingSets);
        }

        if (checkOutBooking) {
            this.beddingSets.onCheckOut(checkOutBooking.beddingSets);
        }

        if (delivery) {
            this.beddingSets.onDeliveryToLaundry(delivery.sets);
        }

        if (onFinishCleaning) {
            this.beddingSets.onFinishCleaning(onFinishCleaning.sets);
        }

        const { cleaned, in_use, dirty, cleaning, in_laundery } = this.beddingSets as BeddingSetsState;

        return {
            date: current_date.toJSDate(),
            cleaned,
            in_use,
            dirty,
            cleaning,
            in_laundery
        };
    };

    private onCheckOut:  (booking: Booking, current_date: DateTime)=> boolean = (booking: Booking, current_date: DateTime) => {
        const checkOut = DateTime.fromJSDate(booking.checkOutDate);
        return checkOut.toMillis() === current_date.toMillis();
    };

    private onCheckIn: (booking: Booking, current_date: DateTime)=> boolean = (booking: Booking, current_date: DateTime) => {
        const checkIn = DateTime.fromJSDate(booking.checkInDate);
        return checkIn.toMillis() === current_date.toMillis();
    };

}