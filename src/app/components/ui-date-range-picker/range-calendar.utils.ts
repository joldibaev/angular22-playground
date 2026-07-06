import { parseInputDate } from '../../shared/date.utils';
import { formatDisplayDate } from '../ui-datepicker/calendar.utils';

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

export function rangeToView(range: UiDateRangeValue, today: string): Temporal.PlainYearMonth {
  const start = parseInputDate(range.start);
  const end = parseInputDate(range.end);
  const anchor = end ?? start ?? parseInputDate(today)!;
  const sameMonth = start && end && start.toPlainYearMonth().equals(end.toPlainYearMonth());
  const view = anchor.toPlainYearMonth();

  return !sameMonth && start && end ? view.subtract({ months: 1 }) : view;
}

export function buildRangeMonthGrid(
  view: Temporal.PlainYearMonth,
  options: {
    range: UiDateRangeValue;
    pending: { start: string; hover: string; selectingEnd: boolean };
    today: string;
    min?: string;
    max?: string;
  },
): RangeDay[][] {
  const firstOfMonth = view.toPlainDate({ day: 1 });
  // dayOfWeek is ISO: 1 = Monday … 7 = Sunday, matching the Monday-first grid.
  const gridStart = firstOfMonth.subtract({ days: firstOfMonth.dayOfWeek - 1 });
  const focusTargetDate = pickFocusTarget(
    view,
    options.range,
    options.pending.start,
    options.today,
  );
  const pendingRange = pendingPreviewRange(options.pending);
  const min = normalizeInputDate(options.min);
  const max = normalizeInputDate(options.max);

  const flat = Array.from({ length: 42 }, (_, index) => {
    const date = gridStart.add({ days: index });
    const inputDate = date.toString();
    const disabled =
      (min !== undefined && inputDate < min) || (max !== undefined && inputDate > max);

    return {
      date: inputDate,
      day: date.day,
      ariaLabel: ARIA_LABEL_FORMATTER.format(date),
      inCurrentMonth: view.equals(date.toPlainYearMonth()),
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

export function buildPresets(today: () => Temporal.PlainDate): RangePreset[] {
  return [
    { label: 'Сегодня', range: () => single(today()) },
    { label: 'Вчера', range: () => single(today().subtract({ days: 1 })) },
    { label: 'Последние 7 дней', range: () => span(today().subtract({ days: 6 }), today()) },
    { label: 'Последние 30 дней', range: () => span(today().subtract({ days: 29 }), today()) },
    {
      label: 'Этот месяц',
      range: () => {
        const now = today();

        return span(now.with({ day: 1 }), now.with({ day: now.daysInMonth }));
      },
    },
    {
      label: 'Прошлый месяц',
      range: () => {
        const prev = today().toPlainYearMonth().subtract({ months: 1 });

        return span(prev.toPlainDate({ day: 1 }), prev.toPlainDate({ day: prev.daysInMonth }));
      },
    },
  ];
}

function normalizeInputDate(value: string | undefined): string | undefined {
  return value && parseInputDate(value) ? value : undefined;
}

function pickFocusTarget(
  view: Temporal.PlainYearMonth,
  range: UiDateRangeValue,
  pendingStart: string,
  today: string,
): string {
  const candidates = [pendingStart, range.start, range.end, today];

  for (const candidate of candidates) {
    const date = parseInputDate(candidate);

    if (date && view.equals(date.toPlainYearMonth())) {
      return candidate;
    }
  }

  return view.toPlainDate({ day: 1 }).toString();
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

function single(date: Temporal.PlainDate): UiDateRangeValue {
  return { start: date.toString(), end: date.toString() };
}

function span(start: Temporal.PlainDate, end: Temporal.PlainDate): UiDateRangeValue {
  return { start: start.toString(), end: end.toString() };
}
