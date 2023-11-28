// test DateTime parsing from string fortmat 'dd/LL/yy'

import { DateTime } from 'luxon';
import parseDate from '../src/utils/datetime-parser.js';

describe('DateTime', () => {
    test('parser from string format dd/LL/yy', () => {
        const date = parseDate('31/12/23');
        expect(date).toStrictEqual(new Date(2023, 12-1, 31));
        expect(date.toLocaleDateString()).toBe('31/12/2023');
   })

    test('parser from string format dd-LL-yy', () => {
        const date = parseDate('31-12-23', 'dd-LL-yy');
        expect(date).toStrictEqual(new Date(2023, 12-1, 31));
    })

    test('spike', () => {
        console.log("test:",DateTime.fromFormatExplain('31/12/2023', 'dd/LL/yyyy'))
        console.log("test:", new Date(2023, 12, 31).toISOString())
        expect(DateTime.fromFormat('31/12/2023', 'dd/LL/yyyy').toJSDate()).toStrictEqual(new Date(2023, 11, 31));
    })
})