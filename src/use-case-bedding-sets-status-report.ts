import { DateTime } from "luxon"
import { BeddingSetsStatusReport, Booking, BeddingSetsStatus, BeddingSetsState } from "./interfaces/bedding-sets-status-report"
import BeddingSets from "./domain/bedding-sets-state";

export default function useCaseBeddingSetsStatusReport() {

    const bookingConfirmed: Booking[] = [];

    //let beddingSets: number = 0;

    let beddingSets =  new BeddingSets();

    const beddingSetsStatus = (dateTimeZero: DateTime, days: number): BeddingSetsStatus => {        
        const current_date = dateTimeZero.plus({ days: days });

        if (bookingConfirmed.some(booking => onCheckIn(booking, current_date))) {
            beddingSets.onCheckIn(2);
        } 

        if (bookingConfirmed.some(booking => onCheckOut(booking, current_date))) {
            beddingSets.onCheckOut(2)
        }

        const { cleaned, in_use, dirty, in_laundery } = beddingSets as BeddingSetsState;

        return {
          date: current_date.toJSDate(),
          cleaned,
          in_use,
          dirty,
          in_laundery
        };
    }

    const onCheckOut = (booking: Booking, current_date: DateTime): boolean => {
        return booking.check_out_date.getTime() === current_date.toJSDate().getTime();
    };

    const onCheckIn = (booking: Booking, current_date: DateTime): boolean => {
        return booking.check_in_date.getTime() === current_date.toJSDate().getTime();
    };

    return {
        addBeddingSets: (amountOfBeddingSets: number): void => {
            beddingSets.addBeddingSets(amountOfBeddingSets);
        },

        report: (date_zero: Date, forecastDays: number): BeddingSetsStatusReport => {
            const date_time_zero = DateTime.fromJSDate(date_zero);

            const report: BeddingSetsStatusReport = {
                days: Array.from({ length: forecastDays + 1 }, (_, index) => {
                    return beddingSetsStatus(date_time_zero, index);
                })
            }
            return report;
        },

        bookingConfirmed: (booking: Booking) : void => {
            bookingConfirmed.push(booking);
        }
    }
}