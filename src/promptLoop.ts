import select from '@inquirer/select';
import useCaseBookingInput from './app/console/use-case-booking/booking-handler.js';
import useCaseInitBeddingSets from './app/console/use-case-init-bedding-sets/init-bedding-sets-handler.js';
import { Separator } from '@inquirer/prompts';
import useCaseBaddingSetStateReport from './use-case-bedding-sets-states-report.js';
import showReport from './app/console/presenter/table-report.js';
import useCaseInCleaning from './app/console/use-case-in-cleaning/in-cleaning-handler.js';

export async function promptLoop() {

  type Command = 'initBeddingSets' | 'booking' | 'inCleaning' | 'exit';
  function askCommand(): Promise<Command> {
    return select({
      message: 'Seleziona il comando da eseguire',
      choices: [
        {
          name: 'setup',
          value: 'initBeddingSets',
          description: 'Imposta il numero di sets matrimoniali in ogni stato (pulite, in uso, sporche, in pulizia, in lavanderia) ',
        },
        {
          name: 'booking',
          value: 'booking',
          description: 'registra la prenotazione, con data check-in, set matrimoniali, e data di check-out.',
        },
        {
          name: 'consegna set matrimoniali per la pulizia',
          value: 'inCleaning',
          description: 'registra la consenga del sets matrimoniali per la pulizia.',
        },
        new Separator(),
        {
          name: 'exit',
          value: 'exit',
          description: 'esci',
        }
      ]
    });
  }

  let answer = await askCommand();

  while (answer !== 'exit') {
    if (answer === 'initBeddingSets') {
      await useCaseInitBeddingSets();
    };

    if (answer === 'inCleaning') {
      await useCaseInCleaning();
    }

    if (answer === 'booking') {
      await useCaseBookingInput();
    };

    const beddingSetsReport = useCaseBaddingSetStateReport();
    const report = beddingSetsReport.report(20);
    showReport(report);
    
    answer = await askCommand();
  }
}





