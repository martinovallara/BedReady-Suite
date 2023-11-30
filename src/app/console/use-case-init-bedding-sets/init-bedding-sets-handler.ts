import useCaseBaddingSetStateReport from "../../../use-case-bedding-sets-states-report.js";
import { input } from "@inquirer/prompts";
import { BeddingSetsState } from "../../../interfaces/bedding-sets-states-report.js";
import { DateTime } from "luxon";
import RepositoryDateZero from "../../../infrastructure/repositories/repository-date-zero.js";
import parseDate from "../../../utils/datetime-parser.js";

export default async function useCaseInitBeddingSets() {
  const beddingSetsReport = useCaseBaddingSetStateReport();

  // crea sequenza di input per creare un BeddingSetsState
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

  const in_use = await input({
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

  const in_laundery = await input({
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

  const state: BeddingSetsState = {
    cleaned: parseInt(cleaned),
    in_use: parseInt(in_use),
    dirty: parseInt(dirty),
    cleaning: parseInt(cleaning),
    in_laundery: parseInt(in_laundery)
  }

  beddingSetsReport.InitialState(state);
  RepositoryDateZero.setDateZero(parseDate(dateZero));
}