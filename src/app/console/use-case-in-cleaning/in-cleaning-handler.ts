import { input } from "@inquirer/prompts";
import useCaseBaddingSetStateReport, { InCleaning } from "../../../use-case-bedding-sets-states-report.js";
import { DateTime } from "luxon";
import parseDate from "../../../utils/datetime-parser.js";

export default async function useCaseInCleaning() {
    const beddingSetsReport = useCaseBaddingSetStateReport();
  
    // crea sequenza di input per creare/registrare un inCleaning Event

    const inCleaningDate: string = await input({
        message: "data a cui corrisponde la consegna del set matrimoniale per la pulizia",
        default: DateTime.now().toFormat("dd/LL/yy"),
        validate: (input) => {
            const date = DateTime.fromFormat(input, "dd/LL/yy");
            return date.isValid ? true : "formato non valido! es. dd/MM/yy";
        }
    })
    const cleaned = await input({
      message: "set matrimoniali consegnate per la pulizia",
      default: "2",
      validate: (input) => {
        if (isNaN(parseInt(input))) {
          return "input non valido. inserisci un numero intero > 0";
        }
        return parseInt(input) > 0 ? true : "numero minimo di set consegnati 1";
      },
    });

    const cleaningTime = await input({
      message: "giorni per la pulizia",
      default: "7",
      validate: (input) => {
        if (isNaN(parseInt(input))) {
          return "input non valido. inserisci un numero intero > 0";
        }
        return parseInt(input) >= 0 ? true : "numero minimo di giorni 1";
      },
    })

    const inCleaning: InCleaning = {
      date: parseDate(inCleaningDate),
      sets: parseInt(cleaned),
      cleaningTime: parseInt(cleaningTime),
    };

    beddingSetsReport.storeBrougthForCleaningEvent(inCleaning);
}