import { DateTime } from 'luxon';
import select from '@inquirer/select';
import useCaseBaddingSetStateReport, { Booking } from './use-case-bedding-sets-states-report.js';
import Table from 'cli-table3';
import input from '@inquirer/input';
import parseDate from './utils/datetime-parser.js';
import { BeddingSetsStatesReport } from './interfaces/bedding-sets-states-report.js';
import chalk from 'chalk';

export async function promptLoop() {

  const beddingSetsReport = useCaseBaddingSetStateReport();

  const answer = await select({
    message: 'Seleziona il comando da eseguire',
    choices: [
      {
        name: 'setup',
        value: 'InitBeddingSets',
        description: 'Imposta il numero di sets matrimoniali in ogni stato (pulite, in uso, sporche, in pulizia, in lavanderia) ',
      },
      {
        name: 'booking',
        value: 'booking',
        description: 'registra la prenotazione, con data check-in, set matrimoniali, e data di check-out.',
      },
    ]
  });

  console.log(answer);

  if (answer === 'booking') {
    const checkInDate = await input({
      message: 'data check-in',
      default: DateTime.now().toFormat('dd/LL/yy'),
      validate: (input) => {
        const date = DateTime.fromFormat(input, 'dd/LL/yy');
        return date.isValid ? true : 'formato non valido! es. dd/MM/yy';
      },

    })

    const checkOutDate = await input({
      message: 'data check-out',
      default: DateTime.now().plus({ days: 2 }).toFormat('dd/LL/yy'),
      validate: (input) => {
        const date = DateTime.fromFormat(input, 'dd/LL/yy');
        return date.isValid;
      }
    })

    const beddingSets = await input({
      message: "sets matrimoniali",
      default: "2",
      validate: (input) => {
        // test se e un numero
        if (isNaN(parseInt(input))) {
          return "input non valido. inserisci un numero intero >=1"
        }
        return parseInt(input) >= 1 ? true : "numero minimo di sets 2"
      }
    })

    const bookingInput: Booking = {
      checkInDate: parseDate(checkInDate),
      checkOutDate: parseDate(checkOutDate),
      beddingSets: parseInt(beddingSets),
    };

    console.log(JSON.stringify(bookingInput, null, 2));
    console.log(bookingInput.checkInDate.toLocaleDateString());

    beddingSetsReport.bookingConfirmed(bookingInput);

    showReport(beddingSetsReport.report(bookingInput.checkInDate, 20));

  };
}

function showReport(report: BeddingSetsStatesReport )  {
  //const report = beddingSetsStatesReport.report(date_zero, 20);
  // convert report days to table: array of arrays
  const report_table = report.days.map((day) => {
    return [
      DateTime.fromJSDate(day.date).setLocale('it').toFormat('ccc dd LLL yyyy'),
      day.events.map((event) => {
        return `${event.name} (${event.sets})`;
      }).toString(),
      day.cleaned >= 0 ? chalk['greenBright']('■'.repeat(day.cleaned)) : chalk['redBright']('X'.repeat(-day.cleaned)),
      chalk['yellow']('■'.repeat(day.in_use)),
      chalk['redBright']('■'.repeat(day.dirty)),
      chalk['magenta']('■'.repeat(day.cleaning)),
      chalk['green']('■'.repeat(day.in_laundery))
    ]
  })

  // instantiate
const table_bedding_sets = new Table({
  head: ['data', 'eventi', 'pulite', 'in uso', 'sporche', 'in pulizia', 'in lavanderia'],
  style: { 'padding-left': 1, 'padding-right': 1 } // Add style property
});

  // table is an Array, so you can `push`, `unshift`, `splice` and friends
  report_table.forEach((row) => {
    const row_trasformed = row.map((cell, index) => {

      return { content: cell, hAlign: 'center' } as Table.CellOptions;
    })
    table_bedding_sets.push(row_trasformed);
  });

  console.log(table_bedding_sets.toString());

}

