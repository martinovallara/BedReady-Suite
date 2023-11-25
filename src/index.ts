import { DateTime } from 'luxon';


import Table from 'cli-table3';
import UseCaseBeddingSetsStatesReport, { Booking } from './use-case-bedding-sets-states-report';
import chalk from 'chalk';

const date_zero = new Date(0);
const day = 24 * 3600 * 1000;
const amountOfBeddingSet = 9;
let beddingSetsStatesReport = new UseCaseBeddingSetsStatesReport();
beddingSetsStatesReport.addBeddingSets(amountOfBeddingSet);

const bookings: Booking[] = [
  {
    checkInDate: new Date(1 * day),
    checkOutDate: new Date(3 * day),
    beddingSets: 2
  },
  {
    checkInDate: new Date(3 * day),
    checkOutDate: new Date(5 * day),
    beddingSets: 2
  }
]

beddingSetsStatesReport.bookingConfirmed(bookings[0]);
beddingSetsStatesReport.bookingConfirmed(bookings[1]);
beddingSetsStatesReport.onDeliveryToLaundry({ date: new Date(4 * day), sets: 2, cleaningTime: 5 });

// instantiate
const table_bedding_sets = new Table({
  head: ['data', 'eventi', 'pulite', 'in uso', 'sporche', 'in pulizia', 'in lavanderia'],
  style: { 'padding-left': 1, 'padding-right': 1 } // Add style property
});

const report = beddingSetsStatesReport.report(date_zero, 20);
// convert report days to table: array of arrays
const report_table = report.days.map((day) => {
  return [
    DateTime.fromJSDate(day.date).setLocale('it').toFormat('ccc dd LLL yyyy'),
    day.events.toString(),
    chalk['greenBright']('■'.repeat(day.cleaned)),
    chalk['yellow']('■'.repeat(day.in_use)),
    chalk['redBright']('■'.repeat(day.dirty)),
    chalk['magenta']('■'.repeat(day.cleaning)),
    chalk['green']('■'.repeat(day.in_laundery))
  ]
})


// table is an Array, so you can `push`, `unshift`, `splice` and friends
report_table.forEach((row) => {
  const row_trasformed = row.map((cell, index) => {
    
    return { content: cell, hAlign: 'center' } as Table.CellOptions;
  })
  table_bedding_sets.push(row_trasformed);
});

console.log(table_bedding_sets.toString());