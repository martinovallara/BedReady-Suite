import chalk from "chalk";
import { DateTime } from "luxon";
import Table from 'cli-table3';
import useCaseBaddingSetStateReport from "../../../use-case-bedding-sets-states-report.js";
import EventsRepository from "../../../infrastructure/repositories/events-repository.js";

export default function showReport() {
  const eventsRepository = EventsRepository.getInstance();
  const beddingSetsReport = useCaseBaddingSetStateReport(eventsRepository);
  const report = beddingSetsReport.report(40);

  const reportTable = report.days.map((day) => {
    return [
      DateTime.fromJSDate(day.date).setLocale('it').toFormat('ccc dd LLL yyyy'),
      day.events.map((event) => {
        return `${event.name} (${event.sets})`;
      }).toString(),
      day.cleaned >= 0 ? chalk['greenBright']('■'.repeat(day.cleaned)) : chalk['redBright']('X'.repeat(-day.cleaned)),
      chalk['yellow']('■'.repeat(day.inUse)),
      chalk['redBright']('■'.repeat(day.dirty)),
      chalk['magenta']('■'.repeat(day.cleaning)),
      chalk['green']('■'.repeat(day.inLaundery))
    ]
  })


  const tableBeddingSets = new Table({
    head: ['data', 'eventi', 'pulite', 'in uso', 'sporche', 'in pulizia', 'in lavanderia'],
    style: { 'padding-left': 1, 'padding-right': 1 } // Add style property
  });

  reportTable.forEach((row) => {
    const rowTrasformed = row.map((cell) => {

      return { content: cell, hAlign: 'center' } as Table.CellOptions;
    })
    tableBeddingSets.push(rowTrasformed);
  });

  console.log(tableBeddingSets.toString());
}