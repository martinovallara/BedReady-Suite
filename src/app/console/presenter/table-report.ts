import chalk, { Chalk } from "chalk";
import { DateTime } from "luxon";
import Table from 'cli-table3';
import useCaseBaddingSetStateReport from "../../../use-case-bedding-sets-states-report.js";
import EventsRepository from "../../../infrastructure/repositories/events-repository.js";
import { EventName } from "../../../interfaces/bedding-sets-states-report.js";

export default function showReport() {
  const eventsRepository = EventsRepository.getInstance();
  const beddingSetsReport = useCaseBaddingSetStateReport(eventsRepository);
  const report = beddingSetsReport.report(40);

  const reportTable = report.days.map((day) => {
    return [
      DateTime.fromJSDate(day.date).setLocale('it').toFormat('ccc dd LLL yyyy'),
      day.events.map((event) => {
        return `${getItEvent(event.name)} (${event.sets})`;
      }).join(',\n '),
      day.cleaned >= 0 ? positiveBeddingSetFormat(day.cleaned, chalk.greenBright) : negativeBeddingSetFormat(day.cleaned, chalk.redBright),
      day.inUse >= 0 ? positiveBeddingSetFormat(day.inUse, chalk.yellow) : negativeBeddingSetFormat(day.inUse, chalk.redBright),
      day.dirty >= 0 ? positiveBeddingSetFormat(day.dirty, chalk.redBright) : negativeBeddingSetFormat(day.dirty, chalk.redBright),
      day.cleaning >= 0 ? positiveBeddingSetFormat(day.cleaning, chalk.magenta) : negativeBeddingSetFormat(day.cleaning, chalk.redBright),
      day.inLaundery >= 0 ? positiveBeddingSetFormat(day.inLaundery, chalk.green) : negativeBeddingSetFormat(day.inLaundery, chalk.redBright),
      day.cleaned + day.inUse + day.dirty + day.cleaning + day.inLaundery
    ]
  })


  const tableBeddingSets = new Table({
    head: ['data', 'eventi', 'pulite', 'in uso', 'sporche', 'in pulizia', 'in lavanderia', 'sets'],
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

export function positiveBeddingSetFormat(items: number, chalkProperty: Chalk): string | undefined {
  return chalkProperty('■'.repeat(items)) + "(" + items + ")";
}


function negativeBeddingSetFormat(items: number, chalkProperty: Chalk): string {
  return chalkProperty('X'.repeat(-items));
}

function getItEvent(eventName: EventName) {
  // convert event name to italian evente name whit mapping

  type eventMapping = {
    name: EventName,
    it: string
  }

  const eventMapping: eventMapping[] = [
    {
      name: 'Check In',
      it: 'check in'
    },
    {
      name: 'Check Out',
      it: 'check out'
    },
    {
      name: 'In Cleaning',
      it: 'in pulizia'
    },
    {
      name: 'Finish Cleaning',
      it: 'pulizia finita'
    },
    {
      name: 'Pickup',
      it: 'ritiro'
    }
  ]

  return eventMapping.find((event) => event.name === eventName)?.it;

}