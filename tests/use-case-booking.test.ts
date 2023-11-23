import { describe, expect, test } from '@jest/globals';
import useCaseBeddingSetsStatesReport from '../src/use-case-bedding-sets-states-report';
import { BeddingSetsStatesReport, Booking } from '../src/interfaces/bedding-sets-states-report';

const date_zero = new Date(0);
const day = 24 * 3600 * 1000;
let report: BeddingSetsStatesReport;
const amountOfBeddingSet = 9;
let beddingSetsstatesReport;

beforeEach(() => {
  beddingSetsstatesReport = useCaseBeddingSetsStatesReport();
  beddingSetsstatesReport.addBeddingSets(amountOfBeddingSet);

  report = beddingSetsstatesReport.report(date_zero, 5);
})

describe('beddingSetstatesReport', () => {
  it('should return all bedding sets cleaned at begin of process', () => {
    expect(report.days.length).toEqual(6);

    expect(report.days[0]).toEqual({ date: date_zero, cleaned: 9, in_use: 0, dirty: 0, in_laundery: 0 });
    expect(report.days[1]).toEqual({ date: new Date(1 * day), cleaned: 9, in_use: 0, dirty: 0, in_laundery: 0 });
    expect(report.days[5]).toEqual({ date: new Date(5 * day), cleaned: 9, in_use: 0, dirty: 0, in_laundery: 0 });
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

      beddingSetsstatesReport.bookingConfirmed(booking);

      const report: BeddingSetsStatesReport = beddingSetsstatesReport.report(date_zero, 5);

      expect(report.days.length).toEqual(6);

      expect(report.days[0]).toEqual({ date: date_zero, cleaned: amountOfBeddingSet, in_use: 0, dirty: 0, in_laundery: 0 });
      expect(report.days[1]).toEqual({ date: new Date(1 * day), cleaned: cleanedExpected, in_use: sets, dirty: 0, in_laundery: 0 });
      expect(report.days[2]).toEqual({ date: new Date(2 * day), cleaned: cleanedExpected, in_use: 0, dirty: sets, in_laundery: 0 });
      expect(report.days[5]).toEqual({ date: new Date(5 * day), cleaned: cleanedExpected, in_use: 0, dirty: sets, in_laundery: 0 });
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

      beddingSetsstatesReport.bookingConfirmed(booking);

      const report: BeddingSetsStatesReport = beddingSetsstatesReport.report(date_zero, 5);

      expect(report.days.length).toEqual(6);

      expect(report.days[0]).toEqual({ date: date_zero, cleaned: amountOfBeddingSet, in_use: 0, dirty: 0, in_laundery: 0 });
      expect(report.days[1]).toEqual({ date: new Date(1 * day), cleaned: cleanedExpected, in_use: sets, dirty: 0, in_laundery: 0 });
      expect(report.days[2]).toEqual({ date: new Date(2 * day), cleaned: cleanedExpected, in_use: sets, dirty: 0, in_laundery: 0 });
      expect(report.days[3]).toEqual({ date: new Date(3 * day), cleaned: cleanedExpected, in_use: 0, dirty: sets, in_laundery: 0 });
      expect(report.days[5]).toEqual({ date: new Date(5 * day), cleaned: cleanedExpected, in_use: 0, dirty: sets, in_laundery: 0 });
    });
  });
})


