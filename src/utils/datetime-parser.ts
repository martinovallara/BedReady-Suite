import { DateTime } from 'luxon';

export function parseJSDate(date: string, format = 'dd/LL/yy') : Date {
    return parseLxDate(date, format).toJSDate();
}

export function parseLxDate(date: string, format: string) : DateTime {
    return DateTime.fromFormat(date, format);
}

export function toDateLx(date: Date) : DateTime {
    return DateTime.fromJSDate(date);
}
