import { AD2BS } from 'bikram-sambat';
import { toNepaliDigits } from './nepali-digits';

export function toBsDateString(adDate: string | Date): string {
  const date = typeof adDate === 'string' ? new Date(adDate) : adDate;
  const bs = AD2BS({ year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() });
  const year = toNepaliDigits(bs.year);
  const month = toNepaliDigits(bs.month);
  const day = toNepaliDigits(bs.day);
  return `${year} ${bs.strMonth} ${day}`;
}
