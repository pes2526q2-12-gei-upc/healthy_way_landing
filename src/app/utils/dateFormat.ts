const DISPLAY_DATE_RE = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;

function isValidCalendarDate(day: number, month: number, year: number): boolean {
  if (month < 1 || month > 12 || day < 1 || year < 1000 || year > 9999) return false;
  const d = new Date(year, month - 1, day);
  return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
}

function toDisplayParts(day: number, month: number, year: number): string {
  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
}

/** Shown in labels and inputs. */
export const DATE_DISPLAY_PLACEHOLDER = 'dd/mm/yyyy';

/** Format API/ISO timestamps for display (dd/mm/yyyy). */
export function formatDateDdMmYyyy(value: string | null | undefined): string {
  if (!value) return '—';

  const trimmed = value.trim();
  const displayMatch = trimmed.match(DISPLAY_DATE_RE);
  if (displayMatch) {
    const day = Number(displayMatch[1]);
    const month = Number(displayMatch[2]);
    const year = Number(displayMatch[3]);
    if (isValidCalendarDate(day, month, year)) {
      return toDisplayParts(day, month, year);
    }
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    const [year, month, day] = trimmed.slice(0, 10).split('-').map(Number);
    if (isValidCalendarDate(day, month, year)) {
      return toDisplayParts(day, month, year);
    }
  }

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return toDisplayParts(parsed.getDate(), parsed.getMonth() + 1, parsed.getFullYear());
  }

  return trimmed.slice(0, 10);
}

/** API/ISO → form field value (dd/mm/yyyy). */
export function apiDateToDisplay(value: string | null | undefined): string {
  if (!value) return '';
  const formatted = formatDateDdMmYyyy(value);
  return formatted === '—' ? '' : formatted;
}

/** Form value (dd/mm/yyyy) → yyyy-mm-dd for the API. */
export function displayDateToApi(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const displayMatch = trimmed.match(DISPLAY_DATE_RE);
  if (displayMatch) {
    const day = Number(displayMatch[1]);
    const month = Number(displayMatch[2]);
    const year = Number(displayMatch[3]);
    if (!isValidCalendarDate(day, month, year)) return null;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    return trimmed.slice(0, 10);
  }

  return null;
}

export function parseDisplayDate(value: string): Date | null {
  const iso = displayDateToApi(value);
  if (!iso) return null;
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}
