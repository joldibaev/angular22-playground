import { parseInputDate, toInputDate } from '../../shared/date.utils';
import {
  addMonths,
  type CalendarMonth,
  formatDisplayDate,
  monthFromDate,
} from '../ui-datepicker/calendar.utils';

export interface UiDateRangeValue {
  start: string;
  end: string;
}

export interface RangeDay {
  date: string;
  day: number;
  ariaLabel: string;
  inCurrentMonth: boolean;
  isToday: boolean;
  isStart: boolean;
  isEnd: boolean;
  isInRange: boolean;
  isPendingStart: boolean;
  isPendingInRange: boolean;
  isPendingRangeStart: boolean;
  isPendingRangeEnd: boolean;
  isFocusTarget: boolean;
  disabled: boolean;
}

export interface RangePreset {
  label: string;
  range: () => UiDateRangeValue;
}

const ARIA_LABEL_FORMATTER = new Intl.DateTimeFormat('ru-RU', { dateStyle: 'full' });

export function emptyRange(): UiDateRangeValue {
  return { start: '', end: '' };
}

export function normalizeRange(range: UiDateRangeValue): UiDateRangeValue {
  if (!range.start || !range.end || range.start <= range.end) {
    return range;
  }

  return { start: range.end, end: range.start };
}

export function formatRangeDisplay(range: UiDateRangeValue): string {
  if (!range.start && !range.end) {
    return '';
  }

  if (range.start && range.end) {
    return `${formatDay(range.start)} — ${formatDay(range.end)}`;
  }

  return range.start ? `С ${formatDay(range.start)}` : `До ${formatDay(range.end)}`;
}

export function rangeToView(range: UiDateRangeValue, today: string): CalendarMonth {
  const start = parseInputDate(range.start);
  const end = parseInputDate(range.end);
  const anchor = end ?? start ?? parseInputDate(today)!;
  const sameMonth =
    start &&
    end &&
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth();

  return addMonths(monthFromDate(anchor), !sameMonth && start && end ? -1 : 0);
}

export function rightView(view: CalendarMonth): CalendarMonth {
  return addMonths(view, 1);
}

export function buildRangeMonthGrid(
  view: CalendarMonth,
  options: {
    range: UiDateRangeValue;
    pending: { start: string; hover: string; selectingEnd: boolean };
    today: string;
    min?: string;
    max?: string;
  },
): RangeDay[][] {
  const firstOfMonth = new Date(view.year, view.month, 1);
  const mondayOffset = (firstOfMonth.getDay() + 6) % 7;
  const gridStart = new Date(view.year, view.month, 1 - mondayOffset);
  const focusTargetDate = pickFocusTarget(view, options.range, options.pending.start, options.today);
  const pendingRange = pendingPreviewRange(options.pending);
  const min = normalizeInputDate(options.min);
  const max = normalizeInputDate(options.max);

  const flat = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(
      gridStart.getFullYear(),
      gridStart.getMonth(),
      gridStart.getDate() + index,
    );
    const inputDate = toInputDate(date);
    const disabled =
      (min !== undefined && inputDate < min) || (max !== undefined && inputDate > max);

    return {
      date: inputDate,
      day: date.getDate(),
      ariaLabel: ARIA_LABEL_FORMATTER.format(date),
      inCurrentMonth: date.getMonth() === view.month,
      isToday: inputDate === options.today,
      isStart: inputDate === options.range.start,
      isEnd: inputDate === options.range.end,
      isInRange: isBetween(inputDate, options.range),
      isPendingStart: options.pending.selectingEnd && inputDate === options.pending.start,
      isPendingInRange: pendingRange ? isBetween(inputDate, pendingRange, true) : false,
      isPendingRangeStart: inputDate === pendingRange?.start,
      isPendingRangeEnd: inputDate === pendingRange?.end,
      isFocusTarget: inputDate === focusTargetDate,
      disabled,
    };
  });

  const weeks: RangeDay[][] = [];

  for (let i = 0; i < flat.length; i += 7) {
    weeks.push(flat.slice(i, i + 7));
  }

  return weeks;
}

export function buildPresets(today: () => Date): RangePreset[] {
  return [
    { label: 'Сегодня', range: () => single(today()) },
    { label: 'Вчера', range: () => single(shift(today(), -1)) },
    { label: 'Последние 7 дней', range: () => span(shift(today(), -6), today()) },
    { label: 'Последние 30 дней', range: () => span(shift(today(), -29), today()) },
    {
      label: 'Этот месяц',
      range: () => {
        const now = today();

        return span(
          new Date(now.getFullYear(), now.getMonth(), 1),
          new Date(now.getFullYear(), now.getMonth() + 1, 0),
        );
      },
    },
    {
      label: 'Прошлый месяц',
      range: () => {
        const now = today();

        return span(
          new Date(now.getFullYear(), now.getMonth() - 1, 1),
          new Date(now.getFullYear(), now.getMonth(), 0),
        );
      },
    },
  ];
}

function normalizeInputDate(value: string | undefined): string | undefined {
  return value && parseInputDate(value) ? value : undefined;
}

function pickFocusTarget(
  view: CalendarMonth,
  range: UiDateRangeValue,
  pendingStart: string,
  today: string,
): string {
  const candidates = [pendingStart, range.start, range.end, today];

  for (const candidate of candidates) {
    const date = parseInputDate(candidate);

    if (date && date.getFullYear() === view.year && date.getMonth() === view.month) {
      return candidate;
    }
  }

  return toInputDate(new Date(view.year, view.month, 1));
}

function pendingPreviewRange(pending: {
  start: string;
  hover: string;
  selectingEnd: boolean;
}): UiDateRangeValue | null {
  // A preview needs two distinct endpoints. When the hover lands back on the
  // start (e.g. the start cell takes focus right after the first click, firing
  // focusin), skip the degenerate one-day range so the lone start pill shows no
  // trailing fill.
  if (
    !pending.selectingEnd ||
    !pending.start ||
    !pending.hover ||
    pending.start === pending.hover
  ) {
    return null;
  }

  return normalizeRange({ start: pending.start, end: pending.hover });
}

function isBetween(date: string, range: UiDateRangeValue, inclusive = false): boolean {
  if (!range.start || !range.end) {
    return false;
  }

  return inclusive
    ? date >= range.start && date <= range.end
    : date > range.start && date < range.end;
}

function formatDay(value: string): string {
  return formatDisplayDate(value) || value;
}

function shift(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function single(date: Date): UiDateRangeValue {
  return { start: toInputDate(date), end: toInputDate(date) };
}

function span(start: Date, end: Date): UiDateRangeValue {
  return { start: toInputDate(start), end: toInputDate(end) };
}
