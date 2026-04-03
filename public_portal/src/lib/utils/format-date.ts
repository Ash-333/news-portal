import { formatDistanceToNow } from 'date-fns';
import { toBsDateString } from './bikram-sambat';
import { toNepaliDigits } from './nepali-digits';

export type DateDisplayMode = 'relative' | 'full' | 'nepali';

export function formatDateDisplay(date: string, mode: DateDisplayMode, lang: 'ne' | 'en'): string {
  const d = new Date(date);

  if (mode === 'nepali') {
    return toBsDateString(d);
  }

  if (mode === 'relative') {
    const base = formatDistanceToNow(d, { addSuffix: true });
    return lang === 'ne' ? toNepaliDigits(base) : base;
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const formatted = d.toLocaleDateString(lang === 'ne' ? 'ne-NP' : 'en-US', options);
  return lang === 'ne' ? toNepaliDigits(formatted) : formatted;
}
