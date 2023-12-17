import { input } from "@inquirer/prompts";
import { DateTime } from "luxon";
import { Booking } from "../../../use-case-bedding-sets-states-report.js";
import { parseJSDate } from "../../../utils/datetime-parser.js";
import EventsRepository from "../../../infrastructure/repositories/events-repository.js";


export default async function useCaseBookingInput() {
  const eventsRepository = await EventsRepository.getInstance();
  const isDateTimeValid = (): ((value: string) => string | boolean | Promise<string | boolean>) | undefined => {
    return (input) => {
      const date = DateTime.fromFormat(input, 'dd/LL/yy');
      return date.isValid ? true : 'formato non valido! es. dd/MM/yy';
    };
  }

  const checkInDate = await input({
    message: 'data check-in',
    default: DateTime.now().toFormat('dd/LL/yy'),
    validate: isDateTimeValid(),
  });

  const checkOutDate = await input({
    message: 'data check-out',
    default: DateTime.now().plus({ days: 2 }).toFormat('dd/LL/yy'),
    validate: isDateTimeValid()
  });

  const beddingSets = await input({
    message: "sets matrimoniali",
    default: "2",
    validate: (input) => {
      if (isNaN(parseInt(input))) {
        return "input non valido. inserisci un numero intero >=1";
      }
      return parseInt(input) >= 1 ? true : "numero minimo di sets 2";
    }
  });

  const bookingInput: Booking = {
    checkInDate: parseJSDate(checkInDate),
    checkOutDate: parseJSDate(checkOutDate),
    beddingSets: parseInt(beddingSets),
  };

  console.log(JSON.stringify(bookingInput, null, 2));
  console.log(bookingInput.checkInDate.toLocaleDateString());

  await eventsRepository.storeBookingConfirmed(bookingInput);

}


