import { describe, expect, test } from '@jest/globals';


import useCaseBeddingSetsStatusReport from '../src/use-case-bedding-sets-status-report';
import { BeddingSetsStatusReport } from '../src/interfaces/bedding-sets-status-report';
const date_zero = new Date(0);
const day = 24 * 3600 * 1000;

describe('beddingSetStatusReport', () => {
  it('should return all bedding sets cleaned at begin of process', () => {
    // Test input
    const amountOfBeddingSet = 9;

    // Call the function
    useCaseBeddingSetsStatusReport().addBeddingSets(amountOfBeddingSet);

    const report: BeddingSetsStatusReport = useCaseBeddingSetsStatusReport().report(date_zero, 5);

    // Assert the result
    expect(report.days.length).toEqual(6);
    
    expect(report.days[0]).toEqual({ date: date_zero });
    expect(report.days[1]).toEqual({ date: new Date(1 * day) });
    expect(report.days[4]).toEqual({ date: new Date(4 * day) });
  });
});

