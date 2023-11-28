import { DateTime } from 'luxon';

export default function parseDate(date: string, format = 'dd/LL/yy') : Date {
    return DateTime.fromFormat(date, format).toJSDate();
}