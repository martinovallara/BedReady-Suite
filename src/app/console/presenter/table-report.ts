import chalk from "chalk";
import { DateTime } from "luxon";
import Table from 'cli-table3';
import { BeddingSetsStatesReport } from "../../../interfaces/bedding-sets-states-report.js";

export default function showReport(report: BeddingSetsStatesReport )  {

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