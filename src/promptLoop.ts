import select from '@inquirer/select';
import useCaseBookingInput from './app/console/use-case-booking/booking-handler.js';
import useCaseInitBeddingSets from './app/console/use-case-init-bedding-sets/init-bedding-sets-handler.js';
import { Separator } from '@inquirer/prompts';
import useCaseBaddingSetStateReport from './use-case-bedding-sets-states-report.js';
import showReport from './app/console/presenter/table-report.js';
import useCaseInCleaningInput from './app/console/use-case-in-cleaning/in-cleaning-handler.js';
import useCasePickupAfterCleaningInput from './app/console/use-case-pickup/pickup-after-cleaning-handler.js';
import EventsRepository from './infrastructure/repositories/events-repository.js';

export async function promptLoop() {

  type Command = 'store-initBeddingSets' | 'store-booking' | 'store-inCleaning' | 'store-pickupAfterCleaning' |'exit';
  function askCommand(): Promise<Command> {
    
    
    const eventsRepository = EventsRepository.getInstance();
    if (eventsRepository.getEvents()) {
      const beddingSetsReport = useCaseBaddingSetStateReport(eventsRepository);
      const report = beddingSetsReport.report(20)
      showReport(report);
    }

    return select({
      message: 'Seleziona il comando da eseguire',
      choices: [
        {
          name: 'setup',
          value: 'store-initBeddingSets',
          description: 'Imposta il numero di sets matrimoniali in ogni stato (pulite, in uso, sporche, in pulizia, in lavanderia) ',
        },
        {
          name: 'booking',
          value: 'store-booking',
          description: 'registra la prenotazione, con data check-in, set matrimoniali, e data di check-out.',
        },
        {
          name: 'consegna set matrimoniali per la pulizia',
          value: 'store-inCleaning',
          description: 'registra la consenga dei sets matrimoniali per la pulizia.',
        },
        {
          name: 'ritiro set matrimoniali',
          value: 'store-pickupAfterCleaning',
          description: 'registra il ritiro dei sets matrimoniali puliti.',
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
    if (answer === 'store-initBeddingSets') {
      await useCaseInitBeddingSets();
    };

    if (answer === 'store-inCleaning') {
      await useCaseInCleaningInput();
    }

    if (answer === 'store-booking') {
      await useCaseBookingInput();
    };

    if (answer === 'store-pickupAfterCleaning') {
      await useCasePickupAfterCleaningInput();
    }

    const beddingSetsReport = useCaseBaddingSetStateReport(EventsRepository.getInstance());
    const report = beddingSetsReport.report(20);
    showReport(report);
    
    answer = await askCommand();
  }
}





