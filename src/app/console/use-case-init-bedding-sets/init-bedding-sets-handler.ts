import { input } from "@inquirer/prompts";
import { InitialState } from "../../../interfaces/bedding-sets-states-report.js";
import { DateTime } from "luxon";
import { parseJSDate } from "../../../utils/datetime-parser.js";
import EventsRepository from "../../../infrastructure/repositories/events-repository.js";

export default async function useCaseInitBeddingSets() {
  const eventsRepository = EventsRepository.getInstance();

  const dateZero: string = await input({
    message: "data a cui corrisponde lo stato iniziale dei sets matrimoniali",
    default: DateTime.now().toFormat('dd/LL/yy'),
    validate: (input) => {
      const date = DateTime.fromFormat(input, 'dd/LL/yy');
      return date.isValid ? true : 'formato non valido! es. dd/MM/yy';
    },
  })

  const cleaned = await input({
    message: "pulite",
    default: "0",
    validate: (input) => {
      // test se e un numero
      if (isNaN(parseInt(input))) {
        return "input non valido. inserisci un numero intero >=0";
      }
      return parseInt(input) >= 0 ? true : "numero minimo di pulite 0";
    },
  })

  const inUse = await input({
    message: "in uso",
    default: "0",
    validate: (input) => {
      // test se e un numero
      if (isNaN(parseInt(input))) {
        return "input non valido. inserisci un numero intero >=0";
      }
      return parseInt(input) >= 0 ? true : "numero minimo di in uso 0";
    }
  })

  const dirty = await input({
    message: "sporche",
    default: "0",
    validate: (input) => {
      // test se e un numero
      if (isNaN(parseInt(input))) {
        return "input non valido. inserisci un numero intero >=0";
      }
      return parseInt(input) >= 0 ? true : "numero minimo di sporche 0";
    }
  })

  const cleaning = await input({
    message: "in pulizia",
    default: "0",
    validate: (input) => {
      // test se e un numero
      if (isNaN(parseInt(input))) {
        return "input non valido. inserisci un numero intero >=0";
      }
      return parseInt(input) >= 0 ? true : "numero minimo di in pulizia 0";
    }
  })

  const inLaundery = await input({
    message: "in lavanderia",
    default: "0",
    validate: (input) => {
      // test se e un numero
      if (isNaN(parseInt(input))) {
        return "input non valido. inserisci un numero intero >=0";
      }
      return parseInt(input) >= 0 ? true : "numero minimo di in lavanderia 0";
    }
  })

  const state: InitialState = {
    date: parseJSDate(dateZero),
    cleaned: parseInt(cleaned),
    inUse: parseInt(inUse),
    dirty: parseInt(dirty),
    cleaning: parseInt(cleaning),
    inLaundery: parseInt(inLaundery)
  }

  eventsRepository.storeInitialState(state);
  
}