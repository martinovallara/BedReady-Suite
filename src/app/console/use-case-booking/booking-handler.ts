import { input } from "@inquirer/prompts";
import { DateTime } from "luxon";
import useCaseBaddingSetStateReport, { Booking } from "../../../use-case-bedding-sets-states-report.js";
import parseDate from "../../../utils/datetime-parser.js";


export default async function useCaseBookingInput() {
  const beddingSetsReport = useCaseBaddingSetStateReport();

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
    checkInDate: parseDate(checkInDate),
    checkOutDate: parseDate(checkOutDate),
    beddingSets: parseInt(beddingSets),
  };

  console.log(JSON.stringify(bookingInput, null, 2));
  console.log(bookingInput.checkInDate.toLocaleDateString());

  beddingSetsReport.storeBookingConfirmed(bookingInput);

  function isDateTimeValid(): ((value: string) => string | boolean | Promise<string | boolean>) | undefined {
    return (input) => {
      const date = DateTime.fromFormat(input, 'dd/LL/yy');
      return date.isValid ? true : 'formato non valido! es. dd/MM/yy';
    };
  }
}


