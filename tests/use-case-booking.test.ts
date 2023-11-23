import { describe, expect, test } from '@jest/globals';


import useCaseBeddingSetsStatusReport from '../src/use-case-bedding-sets-status-report';
import { BeddingSetsStatusReport, Booking } from '../src/interfaces/bedding-sets-status-report';
const date_zero = new Date(0);
const day = 24 * 3600 * 1000;

describe('beddingSetStatusReport', () => {
  it('should return all bedding sets cleaned at begin of process', () => {
    const amountOfBeddingSet = 9;

    const beddingSetsStatusReport = useCaseBeddingSetsStatusReport();

    beddingSetsStatusReport.addBeddingSets(amountOfBeddingSet);

    const report: BeddingSetsStatusReport = beddingSetsStatusReport.report(date_zero, 5);

    expect(report.days.length).toEqual(6);

    expect(report.days[0]).toEqual({ date: date_zero, cleaned: 9, in_use: 0, dirty: 0, in_laundery: 0 });
    expect(report.days[1]).toEqual({ date: new Date(1 * day), cleaned: 9, in_use: 0, dirty: 0, in_laundery: 0 });
    expect(report.days[5]).toEqual({ date: new Date(5 * day), cleaned: 9, in_use: 0, dirty: 0, in_laundery: 0 });
  });

  it('should move 2 bedding sets to in_use when booking is made', () => {
    const amountOfBeddingSet = 9;

    const beddingSetsStatusReport = useCaseBeddingSetsStatusReport();

    beddingSetsStatusReport.addBeddingSets(amountOfBeddingSet);

    const booking: Booking = {
      check_in_date: new Date(1 * day),
      check_out_date: new Date(2 * day),
      bedding_sets: 2
    }

    beddingSetsStatusReport.bookingConfirmed(booking);

    const report: BeddingSetsStatusReport = beddingSetsStatusReport.report(date_zero, 5);

    expect(report.days.length).toEqual(6);

    expect(report.days[0]).toEqual({ date: date_zero, cleaned: 9, in_use: 0, dirty: 0, in_laundery: 0 });
    expect(report.days[1]).toEqual({ date: new Date(1 * day), cleaned: 7, in_use: 2, dirty: 0, in_laundery: 0 });
    expect(report.days[2]).toEqual({ date: new Date(2 * day), cleaned: 7, in_use: 0, dirty: 2, in_laundery: 0 });
    expect(report.days[5]).toEqual({ date: new Date(5 * day), cleaned: 7, in_use: 0, dirty: 2, in_laundery: 0 });
  });
});

