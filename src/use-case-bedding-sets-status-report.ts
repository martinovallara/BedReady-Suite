import { DateTime } from "luxon"
import { BeddingSetsStatusReport } from "./interfaces/bedding-sets-status-report"

export default function useCaseBeddingSetsStatusReport() {
    return {
        addBeddingSets: (amountOfBeddingSets: number) => {

        },

        report: (date_zero: Date, forecastDays: number): BeddingSetsStatusReport => {
            const date_time_zero = DateTime.fromJSDate(date_zero);

            const report: BeddingSetsStatusReport = {
                days: Array.from({ length: forecastDays + 1 }, (_, index) => {
                    return {
                        date: date_time_zero.plus({ days: index }).toJSDate()
                    };
                })
            }

            return report;
        }
    }
}