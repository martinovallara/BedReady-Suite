import select from '@inquirer/select';
import useCaseBookingInput from './app/console/use-case-booking/booking-handler.js';
import useCaseInitBeddingSets from './app/console/use-case-init-bedding-sets/init-bedding-sets-handler.js';
import { Separator } from '@inquirer/prompts';

export async function promptLoop() {

  type Command = 'initBeddingSets' | 'booking' | 'exit';
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

    if (answer === 'booking') {
      await useCaseBookingInput();
    };

    answer = await askCommand();
  }

}





