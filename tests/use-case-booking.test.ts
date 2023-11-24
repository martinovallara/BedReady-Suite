import { describe, expect } from '@jest/globals';
import UseCaseBeddingSetsStatesReport from '../src/use-case-bedding-sets-states-report';
import { BeddingSetsStatesReport, Booking } from '../src/interfaces/bedding-sets-states-report';

const date_zero = new Date(0);
const day = 24 * 3600 * 1000;
const amountOfBeddingSet = 9;
let beddingSetsStatesReport: UseCaseBeddingSetsStatesReport;

beforeEach(() => {
  beddingSetsStatesReport = new UseCaseBeddingSetsStatesReport();
  beddingSetsStatesReport.addBeddingSets(amountOfBeddingSet);
})

describe('beddingSetstatesReport', () => {
  it('should return all bedding sets cleaned at begin of process', () => {

    const report: BeddingSetsStatesReport = beddingSetsStatesReport.report(date_zero, 5);
    expect(report.days.length).toEqual(6);

    expect(report.days[0]).toEqual({ date: date_zero, cleaned: 9, in_use: 0, dirty: 0, cleaning: 0, in_laundery: 0 });
    expect(report.days[1]).toEqual({ date: new Date(1 * day), cleaned: 9, in_use: 0, dirty: 0, cleaning: 0, in_laundery: 0 });
    expect(report.days[5]).toEqual({ date: new Date(5 * day), cleaned: 9, in_use: 0, dirty: 0, cleaning: 0, in_laundery: 0 });
  });

  type BookingEvents = { sets: number }
  describe('when booking is made with ', () => {
    it.each([
      { sets: 2 },
      { sets: 4 }
    ])('1 days and $sets bedding sets, should move it to in_use/dirty when check-in/check-out occur', ({ sets }) => {

      const cleanedExpected = amountOfBeddingSet - sets;

      const booking: Booking = {
        checkInDate: new Date(1 * day),
        checkOutDate: new Date(2 * day),
        beddingSets: sets
      }

      beddingSetsStatesReport.bookingConfirmed(booking);

      const report: BeddingSetsStatesReport = beddingSetsStatesReport.report(date_zero, 5);

      expect(report.days.length).toEqual(6);

      expect(report.days[0]).toEqual({ date: date_zero, cleaned: amountOfBeddingSet, in_use: 0, dirty: 0, cleaning: 0, in_laundery: 0 });
      expect(report.days[1]).toEqual({ date: new Date(1 * day), cleaned: cleanedExpected, in_use: sets, dirty: 0, cleaning: 0, in_laundery: 0 });
      expect(report.days[2]).toEqual({ date: new Date(2 * day), cleaned: cleanedExpected, in_use: 0, dirty: sets, cleaning: 0, in_laundery: 0 });
      expect(report.days[5]).toEqual({ date: new Date(5 * day), cleaned: cleanedExpected, in_use: 0, dirty: sets, cleaning: 0, in_laundery: 0 });
    });


    it.each([
      { sets: 2 },
      { sets: 4 }
    ])('2 days and $sets bedding sets, should move it to in_use/dirty when check-in/check-out occur', ({ sets }) => {
      const cleanedExpected = amountOfBeddingSet - sets;

      const booking: Booking = {
        checkInDate: new Date(1 * day),
        checkOutDate: new Date(3 * day),
        beddingSets: sets
      }

      beddingSetsStatesReport.bookingConfirmed(booking);

      const report: BeddingSetsStatesReport = beddingSetsStatesReport.report(date_zero, 5);


      expect(report.days[0]).toEqual({ date: date_zero, cleaned: amountOfBeddingSet, in_use: 0, dirty: 0, cleaning: 0, in_laundery: 0 });
      expect(report.days[1]).toEqual({ date: new Date(1 * day), cleaned: cleanedExpected, in_use: sets, dirty: 0, cleaning: 0, in_laundery: 0 });
      expect(report.days[2]).toEqual({ date: new Date(2 * day), cleaned: cleanedExpected, in_use: sets, dirty: 0, cleaning: 0, in_laundery: 0 });
      expect(report.days[3]).toEqual({ date: new Date(3 * day), cleaned: cleanedExpected, in_use: 0, dirty: sets, cleaning: 0, in_laundery: 0 });
      expect(report.days[5]).toEqual({ date: new Date(5 * day), cleaned: cleanedExpected, in_use: 0, dirty: sets, cleaning: 0, in_laundery: 0 });
    });

    it('2 bookings with 2 days each', () => {


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

      beddingSetsStatesReport.bookingConfirmed(bookings[0]);
      beddingSetsStatesReport.bookingConfirmed(bookings[1]);

      const report: BeddingSetsStatesReport = beddingSetsStatesReport.report(date_zero, 5);

      expect(report.days[0]).toEqual({ date: date_zero, cleaned: amountOfBeddingSet, in_use: 0, dirty: 0, cleaning: 0, in_laundery: 0 });
      expect(report.days[1]).toEqual({ date: new Date(1 * day), cleaned: 7, in_use: 2, dirty: 0, cleaning: 0, in_laundery: 0 });
      expect(report.days[2]).toEqual({ date: new Date(2 * day), cleaned: 7, in_use: 2, dirty: 0, cleaning: 0, in_laundery: 0 });
      expect(report.days[3]).toEqual({ date: new Date(3 * day), cleaned: 5, in_use: 2, dirty: 2, cleaning: 0, in_laundery: 0 });
      expect(report.days[5]).toEqual({ date: new Date(5 * day), cleaned: 5, in_use: 0, dirty: 4, cleaning: 0, in_laundery: 0 });
    });


    it('when sets is to delivery to laundry only after 7 days the sets become ready to pickup', () => {

      const bookings: Booking[] = [
        {
          checkInDate: new Date(1 * day),
          checkOutDate: new Date(2 * day),
          beddingSets: 1
        }
      ]

      beddingSetsStatesReport.bookingConfirmed(bookings[0]);

      beddingSetsStatesReport.onDeliveryToLaundry({ date: new Date(2 * day), sets: 1, cleaningTime: 7 });

      const report: BeddingSetsStatesReport = beddingSetsStatesReport.report(date_zero, 10);

      expect(report.days[0]).toEqual({ date: date_zero, cleaned: amountOfBeddingSet, in_use: 0, dirty: 0, cleaning: 0, in_laundery: 0 });
      expect(report.days[1]).toEqual({ date: new Date(1 * day), cleaned: 8, in_use: 1, dirty: 0, cleaning: 0, in_laundery: 0 });
      expect(report.days[2]).toEqual({ date: new Date(2 * day), cleaned: 8, in_use: 0, dirty: 0, cleaning: 1, in_laundery: 0 });
      expect(report.days[9]).toEqual({ date: new Date(9 * day), cleaned: 8, in_use: 0, dirty: 0, cleaning: 1, in_laundery: 0 });
      expect(report.days[10]).toEqual({ date: new Date(10 * day), cleaned: 8, in_use: 0, dirty: 0, cleaning: 0, in_laundery: 1 });

    });

    it('when sets is in laundry when pickup the sets become cleaned and ready for check in', () => {

      const bookings: Booking[] = [
        {
          checkInDate: new Date(1 * day),
          checkOutDate: new Date(2 * day),
          beddingSets: 1
        }
      ]

      beddingSetsStatesReport.bookingConfirmed(bookings[0]);

      beddingSetsStatesReport.onDeliveryToLaundry({ date: new Date(2 * day), sets: 1, cleaningTime: 1 });
      beddingSetsStatesReport.onPickupLaundry({ date: new Date(4 * day), sets: 1});

      const report: BeddingSetsStatesReport = beddingSetsStatesReport.report(date_zero, 5);

      expect(report.days[0]).toEqual({ date: date_zero, cleaned: amountOfBeddingSet, in_use: 0, dirty: 0, cleaning: 0, in_laundery: 0 });
      expect(report.days[1]).toEqual({ date: new Date(1 * day), cleaned: 8, in_use: 1, dirty: 0, cleaning: 0, in_laundery: 0 });
      expect(report.days[2]).toEqual({ date: new Date(2 * day), cleaned: 8, in_use: 0, dirty: 0, cleaning: 1, in_laundery: 0 });
      expect(report.days[3]).toEqual({ date: new Date(3 * day), cleaned: 8, in_use: 0, dirty: 0, cleaning: 1, in_laundery: 0 });
      expect(report.days[4]).toEqual({ date: new Date(4 * day), cleaned: 9, in_use: 0, dirty: 0, cleaning: 0, in_laundery: 0 });

    });
  });
})


