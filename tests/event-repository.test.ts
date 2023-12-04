import EventsRepository from '../src/infrastructure/repositories/events-repository.js';
import fs from 'fs';
import { Booking } from '../src/use-case-bedding-sets-states-report.js';
import { DateTime } from 'luxon';

const storagePath: string = process.env.EVENTS_STORAGE_PATH as string;

beforeAll(() => {
    if (fs.existsSync(storagePath)) {
        fs.unlinkSync(storagePath);
    }
})

describe('EventsRepository', () => {
    test('persistToFile', () => {
        const eventsRepository = EventsRepository.getInstance();
        eventsRepository.persistToFile(storagePath);

        expect(fs.existsSync(storagePath)).toBe(true);
    })

  
    test('loadFromFile at creation', () => {
        const eventsRepository = EventsRepository.getInstance();

        expect(EventsRepository.EVENTS_STORAGE_PATH()).toBe(storagePath);

        const booking: Booking = {
            checkInDate: new Date(2023, 12 - 1, 1),
            checkOutDate: new Date(2023, 12 - 1, 2),
            beddingSets: 2
        }
        eventsRepository.storeBookingConfirmed(booking);
        eventsRepository.storeAddBeddingSets({ date: new Date(2023, 12 - 1, 1), sets: 10});
        eventsRepository.storeInitialState({ date: new Date(2023, 12 - 1, 1) ,cleaned: 9, inUse: 8, dirty: 7, cleaning: 6, inLaundery: 1 });
        eventsRepository.storeBrougthForCleaningEvent({ date: new Date(2023, 12 - 1, 1), sets: 2, cleaningTime: 10 });
        eventsRepository.storeOnPickupLaundry({ date: new Date(2023, 12 - 1, 1), sets: 2 });

        const eventsRepositoryReloaded = EventsRepository.renew();

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
    })
})