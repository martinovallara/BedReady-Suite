import {describe, expect, test} from '@jest/globals';

import useCaseBooking from '../src/use-case-booking';
import useCaseBeddingSetsStatusReport from '../src/use-case-bedding-sets-status-report';

const date_zero = new Date(0);

/*
xdescribe('useCaseBooking', () => {
  it('should return the correct booking information', () => {
    // Test input
    const bookingData = {
      date: date_zero,
    };

    // Expected output
    const expectedBookingInfo = {
      // ... expected output ...
    };

    // Call the function
    const result = useCaseBooking(bookingData);

    // Assert the result
    expect(result).toEqual(expectedBookingInfo);
  });
});
*/

describe('beddingSetStatusReport', () => {
  it('should return all bedding sets cleaned at begin of process', () => {
    // Test input
    const amountOfBeddingSet = 9;

    // Call the function
    useCaseBeddingSetsStatusReport().addBeddingSets(amountOfBeddingSet);

    const report =useCaseBeddingSetsStatusReport().report(5)

    // Assert the result
    expect(report.days.length).toEqual(5);

  });
});

