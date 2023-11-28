import select from '@inquirer/select';
import useCaseBookingInput from './app/console/use-case-booking/booking-handler.js';
import useCaseInitBeddingSets from './app/console/use-case-init-bedding-sets/init-bedding-sets-handler.js';

export async function promptLoop() {
  const answer: 'initBeddingSets' | 'booking' = await select({
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
    ]
  });

  console.log(answer);

  if(answer === 'initBeddingSets') {
    await useCaseInitBeddingSets();
  };

  if (answer === 'booking') {
    await useCaseBookingInput();
  };



  
}





