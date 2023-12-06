import { DateTime } from "luxon";
import useCaseBaddingSetStateReport from "../../../use-case-bedding-sets-states-report.js";
import { parseJSDate } from "../../../utils/datetime-parser.js";
import EventsRepository from "../../../infrastructure/repositories/events-repository.js";
import { input } from "@inquirer/prompts";

export default async function useCaseStartDateInput() {
    const startDate = await input({
      message: "data inizio",
      default: DateTime.now().toFormat("dd/LL/yy"),
      validate: (input: string) => {
        const date = DateTime.fromFormat(input, "dd/LL/yy");
        return date.isValid ? true : "formato non valido! es. dd/MM/yy";
      },
    });

    useCaseBaddingSetStateReport(EventsRepository.getInstance()).setStartDateReport(parseJSDate(startDate, "dd/LL/yy"));
  }
  