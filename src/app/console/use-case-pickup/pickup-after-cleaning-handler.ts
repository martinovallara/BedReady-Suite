// gestione ciclo di input per creare un pickupAfterCleaning Event

import { DateTime } from 'luxon';
import { input } from '@inquirer/prompts';
import { Pickup } from '../../../use-case-bedding-sets-states-report.js';
import { parseJSDate } from '../../../utils/datetime-parser.js';
import EventsRepostiory from '../../../infrastructure/repositories/events-repository.js';

export default async function useCasePickupAfterCleaningInput() {
    const repositoryEvents = await EventsRepostiory.getInstance();

    const pickupAfterCleaningDate: string = await input({
        message: "data a cui corrisponde il ritiro dei sets matrimoniali dopo la pulizia",
        default: DateTime.now().toFormat("dd/LL/yy"),
        validate: (input) => {
            const date = DateTime.fromFormat(input, "dd/LL/yy");
            return date.isValid ? true : "formato non valido! es. dd/MM/yy";
        }
    })

    const pickupAfterCleaning = await input({
        message: "sets matrimoniali ritirati dopo la pulizia",
        default: "2",
        validate: (input) => {
            if (isNaN(parseInt(input))) {
                return "input non valido. inserisci un numero intero > 1";
            }
            return parseInt(input) > 0 ? true : "numero minimo di set ritirato 1";
        },
    })

    const pickupAfterCleaningInput: Pickup = {
        date: parseJSDate(pickupAfterCleaningDate, "dd/LL/yy"),
        sets: parseInt(pickupAfterCleaning),
    }

    await repositoryEvents.storeOnPickupLaundry(pickupAfterCleaningInput);

}