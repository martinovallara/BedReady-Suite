import { parseJSDate } from '../src/utils/datetime-parser';


describe('parseJSDate', () => {
    test('parser from string format dd/LL/yy', () => {
        const date = parseJSDate('31/12/23');
        expect(date).toStrictEqual(new Date(2023, 12-1, 31));
   })

    test('parser from string format dd-LL-yy', () => {
        const date = parseJSDate('31-12-23', 'dd-LL-yy');
        expect(date).toStrictEqual(new Date(2023, 12-1, 31));
    })
})
