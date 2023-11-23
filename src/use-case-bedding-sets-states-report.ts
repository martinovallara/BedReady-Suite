import { DateTime } from "luxon"
import { BeddingSetsStatesReport, Booking, BeddingSetsStateOnDate, BeddingSetsState } from "./interfaces/bedding-sets-states-report"
import BeddingSets from "./domain/bedding-sets-state";

export default function useCaseBeddingSetsStatesReport() {

    const bookingConfirmed: Booking[] = [];

    let beddingSets =  new BeddingSets();

    const beddingSetsStatus = (dateTimeZero: DateTime, days: number): BeddingSetsStateOnDate => {        
        const current_date = dateTimeZero.plus({ days: days });

        const checkInBooking = bookingConfirmed.find(booking => onCheckIn(booking, current_date));
        const checkOutBooking = bookingConfirmed.find(booking => onCheckOut(booking, current_date));

        if (checkInBooking) {
            beddingSets.onCheckIn(checkInBooking.beddingSets);
        } 

        if (checkOutBooking) {
            beddingSets.onCheckOut(checkOutBooking.beddingSets);
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
        const checkOut = DateTime.fromJSDate(booking.checkOutDate);
        return checkOut.toMillis() === current_date.toMillis();
    };

    const onCheckIn = (booking: Booking, current_date: DateTime): boolean => {
        const checkIn = DateTime.fromJSDate(booking.checkInDate);
        return  checkIn.toMillis() === current_date.toMillis();
    };

    return {
        addBeddingSets: (amountOfBeddingSets: number): void => {
            beddingSets.addBeddingSets(amountOfBeddingSets);
        },

        report: (date_zero: Date, forecastDays: number): BeddingSetsStatesReport => {
            const date_time_zero = DateTime.fromJSDate(date_zero);

            const report: BeddingSetsStatesReport = {
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