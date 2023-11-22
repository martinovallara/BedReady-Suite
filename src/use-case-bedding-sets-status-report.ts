import { DateTime } from "luxon"
import { BeddingSetsStatusReport } from "./interfaces/bedding-sets-status-report"

export default function useCaseBeddingSetsStatusReport() {
    return {
        addBeddingSets: (amountOfBeddingSets: number) => {

        },

        report: (date_zero: Date, forecastDays: number): BeddingSetsStatusReport => {
            const luxon_date_zero = DateTime.fromJSDate(date_zero);

            const report: BeddingSetsStatusReport = {
                days: [
                    { date: luxon_date_zero.toJSDate() },
                    { date: luxon_date_zero.plus({ days: 1 }).toJSDate() },
                    { date: luxon_date_zero.plus({ days: 2 }).toJSDate() },
                    { date: luxon_date_zero.plus({ days: 3 }).toJSDate() },
                    { date: luxon_date_zero.plus({ days: 4 }).toJSDate() },
                    { date: luxon_date_zero.plus({ days: 5 }).toJSDate() }
                ]
            }

            return report;
        }
    }
}