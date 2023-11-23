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




  describe('when booking is made with ', () => {
    const beddingSetsUsedTest = [2,4]

    beddingSetsUsedTest.forEach(beddingSetsUsed => {
      it(`should move ${beddingSetsUsed} bedding sets to in_use when check in occur`, () => {
        const amountOfBeddingSet = 9;
        const cleanedExpected = amountOfBeddingSet - beddingSetsUsed;

        const beddingSetsStatusReport = useCaseBeddingSetsStatusReport();
    
        beddingSetsStatusReport.addBeddingSets(amountOfBeddingSet);
    
        const booking: Booking = {
          checkInDate: new Date(1 * day),
          checkOutDate: new Date(2 * day),
          beddingSets: beddingSetsUsed
        }
    
        beddingSetsStatusReport.bookingConfirmed(booking);
    
        const report: BeddingSetsStatusReport = beddingSetsStatusReport.report(date_zero, 5);
    
        expect(report.days.length).toEqual(6);
    
        expect(report.days[0]).toEqual({ date: date_zero, cleaned: amountOfBeddingSet, in_use: 0, dirty: 0, in_laundery: 0 });

        expect(report.days[1]).toEqual({ date: new Date(1 * day), cleaned: cleanedExpected, in_use: beddingSetsUsed, dirty: 0, in_laundery: 0 });
        expect(report.days[2]).toEqual({ date: new Date(2 * day), cleaned: cleanedExpected, in_use: 0, dirty: beddingSetsUsed, in_laundery: 0 });
        expect(report.days[5]).toEqual({ date: new Date(5 * day), cleaned: cleanedExpected, in_use: 0, dirty: beddingSetsUsed, in_laundery: 0 });
      });
    })
  })
});

