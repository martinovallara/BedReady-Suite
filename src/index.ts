import { DateTime } from 'luxon';
import { Booking } from './interfaces/bedding-sets-states-report';
import UseCaseBeddingSetsStatesReport from './use-case-bedding-sets-states-report';

import Table from 'cli-table3';
import CliTable3 from 'cli-table3';

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

// instantiate
const table_bedding_sets = new Table({
  head: ['data', 'pulite', 'in uso', 'sporche', 'in pulizia', 'in lavanderia'],
  style: { 'padding-left': 1, 'padding-right': 1, head: [], border: [] } // Add style property
});

const report = beddingSetsStatesReport.report(date_zero, 20);
// convert report days to table: array of arrays
const report_table = report.days.map((day) => {
  return [
    DateTime.fromJSDate(day.date).setLocale('it').toFormat('ccc dd LLL yyyy'),
    day.cleaned.toString(),
    day.in_use.toString(),
    day.dirty.toString(),
    day.cleaning.toString(),
    day.in_laundery.toString()
  ]
})

// table is an Array, so you can `push`, `unshift`, `splice` and friends
report_table.forEach((row) => {
  const row_trasformed = row.map((cell) => {
    return  { content: cell, hAlign: 'center' } as CliTable3.CellOptions; 
  })
  table_bedding_sets.push(row_trasformed);
});

console.log(table_bedding_sets.toString());