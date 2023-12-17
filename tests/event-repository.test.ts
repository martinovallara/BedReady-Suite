import EventsRepository from '../src/infrastructure/repositories/events-repository.js';
import { Booking } from '../src/use-case-bedding-sets-states-report.js';
import { DateTime } from 'luxon';


// mock fs module: reads what he wrote.
let mockFileContent: string | undefined = undefined;

 // mock persistToDrive, readStorageFromDrive function
jest.mock('../src/infrastructure/services/google-drive-api.js', () => {
    return {
        persistToDrive: jest.fn((data) => {
            console.log("persist to mock: ", data);
            mockFileContent = data;
        }),
        readStorageFromDrive: jest.fn(() => {
            console.log("read from mock: ", mockFileContent);
            return mockFileContent 
        }),
    }
})

beforeAll(() => {
    mockFileContent = undefined;
})

describe('EventsRepository', () => {
    test('loadFromPersistence at creation', async () =>  {
        const eventsRepository = await EventsRepository.getInstance();

        const booking: Booking = {
            checkInDate: new Date(2023, 12 - 1, 1),
            checkOutDate: new Date(2023, 12 - 1, 2),
            beddingSets: 2
        }
        await eventsRepository.storeBookingConfirmed(booking);
        await eventsRepository.storeAddBeddingSets({ date: new Date(2023, 12 - 1, 1), sets: 10 });
        await eventsRepository.storeInitialState({ date: new Date(2023, 12 - 1, 1), cleaned: 9, inUse: 8, dirty: 7, cleaning: 6, inLaundery: 1 });
        await eventsRepository.storeBrougthForCleaningEvent({ date: new Date(2023, 12 - 1, 1), sets: 2, cleaningTime: 10 });
        await eventsRepository.storeOnPickupLaundry({ date: new Date(2023, 12 - 1, 1), sets: 2 });
        const expectedStartReportDate = { date: new Date(2023, 12 - 1, 11), };
        await eventsRepository.storeStartDateReport(expectedStartReportDate);

        expect(eventsRepository.startDateReport).toStrictEqual(expectedStartReportDate);
        const eventsRepositoryReloaded = await EventsRepository.renew();

        expect(eventsRepositoryReloaded.bookingsConfirmed.length).toBe(1);
        // expect checkIndate is a date
        expect(typeof eventsRepositoryReloaded.bookingsConfirmed[0].checkInDate).toBe('object');
        expect(eventsRepositoryReloaded.bookingsConfirmed[0].checkInDate).toStrictEqual(booking.checkInDate);

        const bookingReloaded = eventsRepositoryReloaded.findCheckInBookingEvents(DateTime.fromJSDate(new Date(2023, 12 - 1, 1)));
        expect(bookingReloaded.length).toBe(1);

        expect(eventsRepositoryReloaded.bookingsConfirmed).toStrictEqual(eventsRepository.bookingsConfirmed);
        expect(eventsRepositoryReloaded.additionBeddingSets).toStrictEqual(eventsRepository.additionBeddingSets);
        expect(eventsRepositoryReloaded.initialState).toStrictEqual(eventsRepository.initialState);
        expect(eventsRepositoryReloaded.cleaningDepots).toStrictEqual(eventsRepository.cleaningDepots);
        expect(eventsRepositoryReloaded.pickups).toStrictEqual(eventsRepository.pickups);
        expect(eventsRepositoryReloaded.startDateReport).toStrictEqual(eventsRepository.startDateReport);
    })
})