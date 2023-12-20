import { describe, expect } from '@jest/globals';
import useCaseBeddingSetsStatesReport, { UseCaseBeddingSetsStatesReport, Booking } from '../src/use-case-bedding-sets-states-report';
import { BeddingSetsStatesReport, InitialState } from '../src/interfaces/bedding-sets-states-report';
import EventsRepository from '../src/infrastructure/repositories/events-repository.js';

const dateZero = new Date(0);
const day = 24 * 3600 * 1000;
const amountOfBeddingSet = 9;
let beddingSetsStatesReport: UseCaseBeddingSetsStatesReport;
let eventsRepository: EventsRepository;

let jsonEventsData: string | undefined = undefined;

 // mock persistToDrive, readStorageFromDrive function
 jest.mock('../src/infrastructure/services/google-drive-storage.js', () => {
  return {
      persistToDrive: jest.fn((data) => {
        //console.log("use-case-persist to mock: ", data);
          jsonEventsData = data;
      }),
      readStorageFromDrive: jest.fn(() => {
          //console.log("use-case-read from mock: ", jsonEventsData);
          return jsonEventsData 
      }),
  }
})

beforeEach(async () => {
  //console.log(" | use-caseBeforeEach |");
  jsonEventsData = undefined;

  eventsRepository = await EventsRepository.getInstance();
  beddingSetsStatesReport = useCaseBeddingSetsStatesReport(eventsRepository);

  await eventsRepository.storeInitialState(initialAmountOfBeddingSet(dateZero, amountOfBeddingSet));
})

afterEach(() => {
  jsonEventsData = undefined;
  //console.log("_ use-caseAfterEach _");
})

describe('beddingSetstatesReport', () => {
  it('should return all bedding sets cleaned at begin of process', () => {

    const forecastDays = 5;
    const report: BeddingSetsStatesReport = beddingSetsStatesReport.report(forecastDays);
    expect(report.days.length).toEqual(forecastDays + 1);

    expect(report.days[0]).toMatchObject({ date: dateZero, cleaned: 9, inUse: 0, dirty: 0, cleaning: 0, inLaundery: 0 });
    expect(report.days[1]).toMatchObject({ date: new Date(1 * day), cleaned: 9, inUse: 0, dirty: 0, cleaning: 0, inLaundery: 0 });
    expect(report.days[5]).toMatchObject({ date: new Date(5 * day), cleaned: 9, inUse: 0, dirty: 0, cleaning: 0, inLaundery: 0 });
  });

  describe('when booking is made with ', () => {
    it.each([
      { sets: 2 },
      { sets: 4 }
    ])('1 days and $sets bedding sets, should move it to inUse/dirty when check-in/check-out occur', async ({ sets }) => {

      const cleanedExpected = amountOfBeddingSet - sets;

      const booking: Booking = {
        checkInDate: new Date(1 * day),
        checkOutDate: new Date(2 * day),
        beddingSets: sets
      }

      await eventsRepository.storeBookingConfirmed(booking);

      const report: BeddingSetsStatesReport = beddingSetsStatesReport.report(5);

      expect(report.days[0]).toMatchObject({ date: dateZero, cleaned: amountOfBeddingSet, inUse: 0, dirty: 0, cleaning: 0, inLaundery: 0 });
      expect(report.days[1]).toMatchObject({ date: new Date(1 * day), cleaned: cleanedExpected, inUse: sets, dirty: 0, cleaning: 0, inLaundery: 0 });
      expect(report.days[2]).toMatchObject({ date: new Date(2 * day), cleaned: cleanedExpected, inUse: 0, dirty: sets, cleaning: 0, inLaundery: 0 });
      expect(report.days[5]).toMatchObject({ date: new Date(5 * day), cleaned: cleanedExpected, inUse: 0, dirty: sets, cleaning: 0, inLaundery: 0 });
    });


    it.each([
      { sets: 2 },
      { sets: 4 }
    ])('2 days and $sets bedding sets, should move it to inUse/dirty when check-in/check-out occur', async ({ sets }) => {
      const cleanedExpected = amountOfBeddingSet - sets;

      const booking: Booking = {
        checkInDate: new Date(1 * day),
        checkOutDate: new Date(3 * day),
        beddingSets: sets
      }

      await eventsRepository.storeBookingConfirmed(booking);

      const report: BeddingSetsStatesReport = beddingSetsStatesReport.report(5);


      expect(report.days[0]).toMatchObject({ date: dateZero, cleaned: amountOfBeddingSet, inUse: 0, dirty: 0, cleaning: 0, inLaundery: 0 });
      expect(report.days[1]).toMatchObject({ date: new Date(1 * day), cleaned: cleanedExpected, inUse: sets, dirty: 0, cleaning: 0, inLaundery: 0 });
      expect(report.days[2]).toMatchObject({ date: new Date(2 * day), cleaned: cleanedExpected, inUse: sets, dirty: 0, cleaning: 0, inLaundery: 0 });
      expect(report.days[3]).toMatchObject({ date: new Date(3 * day), cleaned: cleanedExpected, inUse: 0, dirty: sets, cleaning: 0, inLaundery: 0 });
      expect(report.days[5]).toMatchObject({ date: new Date(5 * day), cleaned: cleanedExpected, inUse: 0, dirty: sets, cleaning: 0, inLaundery: 0 });
    });

    it('2 bookings with 2 days each', async () => {


      const bookings: Booking[] = [
        {
          checkInDate: new Date(1 * day),
          checkOutDate: new Date(3 * day),
          beddingSets: 2
        },
        {
          checkInDate: new Date(3 * day),
          checkOutDate: new Date(5 * day),
          beddingSets: 2
        }
      ]

      await eventsRepository.storeBookingConfirmed(bookings[0]);
      await eventsRepository.storeBookingConfirmed(bookings[1]);

      const report: BeddingSetsStatesReport = beddingSetsStatesReport.report(5);

      expect(report.days[0]).toMatchObject({ date: dateZero, cleaned: amountOfBeddingSet, inUse: 0, dirty: 0, cleaning: 0, inLaundery: 0 });
      expect(report.days[1]).toMatchObject({ date: new Date(1 * day), cleaned: 7, inUse: 2, dirty: 0, cleaning: 0, inLaundery: 0 });
      expect(report.days[2]).toMatchObject({ date: new Date(2 * day), cleaned: 7, inUse: 2, dirty: 0, cleaning: 0, inLaundery: 0 });
      expect(report.days[3]).toMatchObject({ date: new Date(3 * day), cleaned: 5, inUse: 2, dirty: 2, cleaning: 0, inLaundery: 0 });
      expect(report.days[5]).toMatchObject({ date: new Date(5 * day), cleaned: 5, inUse: 0, dirty: 4, cleaning: 0, inLaundery: 0 });
    });


    it('when sets is brougth for cleaning to laundry only after 7 days the sets become ready to pickup', async () => {

      const bookings: Booking[] = [
        {
          checkInDate: new Date(1 * day),
          checkOutDate: new Date(2 * day),
          beddingSets: 1
        }
      ]

      await eventsRepository.storeBookingConfirmed(bookings[0]);

      await eventsRepository.storeBrougthForCleaningEvent({ date: new Date(2 * day), sets: 1, cleaningTime: 7 });

      const report: BeddingSetsStatesReport = beddingSetsStatesReport.report(10);

      expect(report.days[0]).toMatchObject({ date: dateZero, cleaned: amountOfBeddingSet, inUse: 0, dirty: 0, cleaning: 0, inLaundery: 0 });
      expect(report.days[1]).toMatchObject({ date: new Date(1 * day), cleaned: 8, inUse: 1, dirty: 0, cleaning: 0, inLaundery: 0 });
      expect(report.days[2]).toMatchObject({ date: new Date(2 * day), cleaned: 8, inUse: 0, dirty: 0, cleaning: 1, inLaundery: 0 });
      expect(report.days[9]).toMatchObject({ date: new Date(9 * day), cleaned: 8, inUse: 0, dirty: 0, cleaning: 1, inLaundery: 0 });
      expect(report.days[10]).toMatchObject({ date: new Date(10 * day), cleaned: 8, inUse: 0, dirty: 0, cleaning: 0, inLaundery: 1 });

    });
  });

  it('when set is picked up from laundry increase the sets cleaned', async () => {

    const bookings: Booking[] = [
      {
        checkInDate: new Date(1 * day),
        checkOutDate: new Date(2 * day),
        beddingSets: 1
      }
    ]

    await eventsRepository.storeBookingConfirmed(bookings[0]);

    await eventsRepository.storeBrougthForCleaningEvent({ date: new Date(2 * day), sets: 1, cleaningTime: 1 });
    await eventsRepository.storeOnPickupLaundry({ date: new Date(5 * day), sets: 1 });

    const report: BeddingSetsStatesReport = beddingSetsStatesReport.report(5);

    expect(report.days[0]).toMatchObject({ date: dateZero, cleaned: amountOfBeddingSet, inUse: 0, dirty: 0, cleaning: 0, inLaundery: 0 });
    expect(report.days[1]).toMatchObject({ date: new Date(1 * day), cleaned: 8, inUse: 1, dirty: 0, cleaning: 0, inLaundery: 0 });
    expect(report.days[2]).toMatchObject({ date: new Date(2 * day), cleaned: 8, inUse: 0, dirty: 0, cleaning: 1, inLaundery: 0 });
    expect(report.days[3]).toMatchObject({ date: new Date(3 * day), cleaned: 8, inUse: 0, dirty: 0, cleaning: 1, inLaundery: 0 });
    expect(report.days[4]).toMatchObject({ date: new Date(4 * day), cleaned: 8, inUse: 0, dirty: 0, cleaning: 0, inLaundery: 1 });
    expect(report.days[5]).toMatchObject({ date: new Date(5 * day), cleaned: 9, inUse: 0, dirty: 0, cleaning: 0, inLaundery: 0 });
  });

  it('when set is picked up before cleaning time increase the sets cleaned should removes sets from in cleaning and from finished events', async () => {

    const bookings: Booking[] = [
      {
        checkInDate: new Date(1 * day),
        checkOutDate: new Date(2 * day),
        beddingSets: 3
      }
    ]

    await eventsRepository.storeBookingConfirmed(bookings[0]);

    await eventsRepository.storeBrougthForCleaningEvent({ date: new Date(2 * day), sets: 2, cleaningTime: 2 });
    await eventsRepository.storeOnPickupLaundry({ date: new Date(3 * day), sets: 2 });
    await eventsRepository.storeBrougthForCleaningEvent({ date: new Date(4 * day), sets: 1, cleaningTime: 1 });
    const report: BeddingSetsStatesReport = beddingSetsStatesReport.report(6);

    expect(report.days[0]).toMatchObject({ date: dateZero, cleaned: amountOfBeddingSet, inUse: 0, dirty: 0, cleaning: 0, inLaundery: 0 });
    expect(report.days[1]).toMatchObject({ date: new Date(1 * day), cleaned: 6, inUse: 3, dirty: 0, cleaning: 0, inLaundery: 0 });
    expect(report.days[2]).toMatchObject({ date: new Date(2 * day), cleaned: 6, inUse: 0, dirty: 1, cleaning: 2, inLaundery: 0 });
    expect(report.days[3]).toMatchObject({ date: new Date(3 * day), cleaned: 8, inUse: 0, dirty: 1, cleaning: 0, inLaundery: 0 });
    expect(report.days[4]).toMatchObject({ date: new Date(4 * day), cleaned: 8, inUse: 0, dirty: 0, cleaning: 1, inLaundery: 0 });
    expect(report.days[5]).toMatchObject({ date: new Date(5 * day), events: [{ name: 'Finish Cleaning', sets: 0 }],cleaned: 8, inUse: 0, dirty: 0, cleaning: 1, inLaundery: 0 });
    expect(report.days[6]).toMatchObject({
      date: new Date(6 * day), events: [{ name: 'Finish Cleaning', sets: 1 }],
      cleaned: 8, inUse: 0, dirty: 0, cleaning: 0, inLaundery: 1
    });

  });

  it('show events', async () => {

    const bookings: Booking[] = [
      {
        checkInDate: new Date(1 * day),
        checkOutDate: new Date(2 * day),
        beddingSets: 1
      }
    ]

    await eventsRepository.storeBookingConfirmed(bookings[0]);

    await eventsRepository.storeBrougthForCleaningEvent({ date: new Date(2 * day), sets: 1, cleaningTime: 1 });
    await eventsRepository.storeOnPickupLaundry({ date: new Date(5 * day), sets: 1 });

    const report: BeddingSetsStatesReport = beddingSetsStatesReport.report(5);

    expect(report.days[0]).toMatchObject({ date: dateZero, cleaned: amountOfBeddingSet, inUse: 0, dirty: 0, cleaning: 0, inLaundery: 0 });
    expect(report.days[1]).toMatchObject({ date: new Date(1 * day), events: [{ name: 'Check In', sets: 1 }] });
    expect(report.days[2]).toMatchObject({ date: new Date(2 * day), events: [{ name: 'Check Out', sets: 1 }, { name: 'In Cleaning', sets: 1 }] });
    expect(report.days[4]).toMatchObject({ date: new Date(4 * day), events: [{ name: 'Finish Cleaning', sets: 1 }] });
    expect(report.days[5]).toMatchObject({ date: new Date(5 * day), events: [{ name: 'Pickup', sets: 1 }] });
  });

  it('initial state', async () => {
    await eventsRepository.storeAddBeddingSets({ date: new Date(1 * day), sets: -amountOfBeddingSet }); // reset the initial amount of set
    const initialState: InitialState = {
      date: dateZero,
      cleaned: 10,
      inUse: 9,
      dirty: 8,
      cleaning: 7,
      inLaundery: 6
    }

    await eventsRepository.storeInitialState(initialState);

    const report: BeddingSetsStatesReport = beddingSetsStatesReport.report(0);

    expect(report.days[0]).toMatchObject({ date: dateZero, cleaned: 10, inUse: 9, dirty: 8, cleaning: 7, inLaundery: 6 });
  })

  it('report rebuild when called more than once', async () => {

    const bookings: Booking[] = [
      {
        checkInDate: new Date(1 * day),
        checkOutDate: new Date(2 * day),
        beddingSets: 1
      }
    ]
    await eventsRepository.storeBookingConfirmed(bookings[0]);
    beddingSetsStatesReport.report(2);
    const report: BeddingSetsStatesReport = beddingSetsStatesReport.report(2);

    expect(report.days[1]).toMatchObject({ date: new Date(1 * day), cleaned: amountOfBeddingSet - 1, inUse: 1, dirty: 0, cleaning: 0, inLaundery: 0 });
  })

  it('report start at date defined in startDateReport', () => {
    beddingSetsStatesReport.setStartDateReport(new Date(10 * day));
    const forecastDays = 10;
    const report: BeddingSetsStatesReport = beddingSetsStatesReport.report(forecastDays);
    expect(report.days.length).toEqual(forecastDays + 1);
    expect(report.days[0]).toMatchObject({ date: new Date(10 * day) });
  })
})

function initialAmountOfBeddingSet(date_zero: Date, amountOfBeddingSet: number): InitialState {
  return {
    date: date_zero,
    cleaned: amountOfBeddingSet,
    inUse: 0,
    dirty: 0,
    cleaning: 0,
    inLaundery: 0
  }
}


