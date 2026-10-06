export const TIMEZONE_BRASILIA = 'America/Sao_Paulo';

export const DAY_OF_WEEK_NAMES_BR = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

export interface BrasiliaDateParts {
  year: number;
  month: number; // 1-12
  monthIndex: number; // 0-11
  day: number; // 1-31
  hour: number; // 0-23
  minute: number; // 0-59
  second: number; // 0-59
  yearStr: string; // '2026'
  monthStr: string; // '10'
  dayStr: string; // '05'
  dateStr: string; // '2026-10-05'
  monthKey: string; // '2026-10'
  timeStr: string; // '21:14'
  fullTimeStr: string; // '21:14:35'
  dayOfWeek: number; // 0-6
  dayOfWeekName: string; // 'Segunda-feira'
}

/**
 * Extracts comprehensive calendar date and time parts strictly according to
 * America/Sao_Paulo (Horário Oficial de Brasília).
 *
 * NEVER uses UTC directly to decide date boundaries or day turnover!
 */
export function getBrasiliaDateParts(inputDate: Date | number | string = new Date()): BrasiliaDateParts {
  let dateObj: Date;

  if (typeof inputDate === 'string') {
    // If YYYY-MM-DD format without time, parse directly in local date terms
    if (/^\d{4}-\d{2}-\d{2}$/.test(inputDate)) {
      const [y, m, d] = inputDate.split('-').map(Number);
      // Construct midday in UTC-3 to avoid any day boundary shift
      dateObj = new Date(`${inputDate}T12:00:00-03:00`);
    } else {
      dateObj = new Date(inputDate);
    }
  } else if (typeof inputDate === 'number') {
    dateObj = new Date(inputDate);
  } else {
    dateObj = inputDate;
  }

  // Fallback if invalid
  if (isNaN(dateObj.getTime())) {
    dateObj = new Date();
  }

  // Format parts in America/Sao_Paulo using en-CA locale (gives YYYY-MM-DD natively)
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE_BRASILIA,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(dateObj);
  const findPart = (t: string) => parts.find((p) => p.type === t)?.value || '00';

  const year = parseInt(findPart('year'), 10) || 2026;
  const month = parseInt(findPart('month'), 10) || 10;
  const day = parseInt(findPart('day'), 10) || 1;
  const hour = parseInt(findPart('hour'), 10) || 0;
  const minute = parseInt(findPart('minute'), 10) || 0;
  const second = parseInt(findPart('second'), 10) || 0;

  const yearStr = String(year).padStart(4, '0');
  const monthStr = String(month).padStart(2, '0');
  const dayStr = String(day).padStart(2, '0');
  const dateStr = `${yearStr}-${monthStr}-${dayStr}`;
  const monthKey = `${yearStr}-${monthStr}`;
  const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  const fullTimeStr = `${timeStr}:${String(second).padStart(2, '0')}`;

  // Day of week in Brasília:
  // Using Intl format with weekday: 'numeric' or weekday name
  const weekdayFormatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: TIMEZONE_BRASILIA,
    weekday: 'long',
  });
  const weekdayNameRaw = weekdayFormatter.format(dateObj);
  // Capitalize
  const dayOfWeekName = weekdayNameRaw.charAt(0).toUpperCase() + weekdayNameRaw.slice(1);

  // Day of week index 0-6
  // Construct a date at midday Brasília time to determine reliable dayOfWeek
  // Sunday = 0, Monday = 1, ...
  const refMidday = new Date(`${dateStr}T12:00:00-03:00`);
  const dayOfWeek = refMidday.getUTCDay(); // At 12:00-03:00, UTC is 15:00 on the same date, so getUTCDay() matches exactly

  return {
    year,
    month,
    monthIndex: month - 1,
    day,
    hour,
    minute,
    second,
    yearStr,
    monthStr,
    dayStr,
    dateStr,
    monthKey,
    timeStr,
    fullTimeStr,
    dayOfWeek,
    dayOfWeekName,
  };
}

/**
 * Returns today's date string in Brasília: 'YYYY-MM-DD'.
 *
 * Example:
 * 2026-10-05 21:00 -> '2026-10-05'
 * 2026-10-05 23:59 -> '2026-10-05'
 * 2026-10-05 23:59:59 -> '2026-10-05'
 * 2026-10-06 00:00:00 -> '2026-10-06'
 */
export function getTodayBrasilia(baseDate?: Date | number | string): string {
  return getBrasiliaDateParts(baseDate).dateStr;
}

/**
 * Returns current month string in Brasília: 'YYYY-MM'
 */
export function getCurrentMonthBrasilia(baseDate?: Date | number | string): string {
  return getBrasiliaDateParts(baseDate).monthKey;
}

/**
 * Returns current time string in Brasília: 'HH:mm'
 */
export function getCurrentTimeBrasilia(baseDate?: Date | number | string): string {
  return getBrasiliaDateParts(baseDate).timeStr;
}

/**
 * Formats a timestamp into Brasília formatted date-time string: 'DD/MM/YYYY às HH:mm:ss'
 */
export function formatBrasiliaDateTime(timestamp: number | Date = new Date(), includeSeconds: boolean = false): string {
  const parts = getBrasiliaDateParts(timestamp);
  return `${parts.dayStr}/${parts.monthStr}/${parts.yearStr} às ${includeSeconds ? parts.fullTimeStr : parts.timeStr}`;
}
