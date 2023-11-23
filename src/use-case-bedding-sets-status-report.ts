import { DateTime } from "luxon"
import { BeddingSetsStatusReport, Booking, BeddingSetsStatus } from "./interfaces/bedding-sets-status-report"

export default function useCaseBeddingSetsStatusReport() {

    const bookingConfirmed: Booking[] = [];

    let beddingSets: number = 0;
    let cleaned = 0;
    let in_use = 0;
    let dirty = 0;

    const beddingSetsStatus = (date_time_zero: DateTime, days: number): BeddingSetsStatus => {        
        const current_date = date_time_zero.plus({ days: days });

        if (bookingConfirmed.some(booking => booking.check_in_date.getTime() === current_date.toJSDate().getTime())) {
            cleaned -= 2;
            in_use += 2;
        } 

        if (bookingConfirmed.some(booking => booking.check_out_date.getTime() === current_date.toJSDate().getTime())) {
            in_use -= 2;
            dirty += 2; 
        }

        return {
            date: current_date.toJSDate(),
            cleaned: cleaned,
            in_use: in_use,
            dirty: dirty,
            in_laundery: 0
        };
    }

    return {
        addBeddingSets: (amountOfBeddingSets: number): void => {
            beddingSets += amountOfBeddingSets;
            cleaned += amountOfBeddingSets;
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