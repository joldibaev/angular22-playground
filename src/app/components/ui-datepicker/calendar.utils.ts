import { parseInputDate } from '../../shared/date.utils';

export interface CalendarDay {
  date: string;
  day: number;
  ariaLabel: string;
  inCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isFocusTarget: boolean;
  disabled: boolean;
}

const ARIA_LABEL_FORMATTER = new Intl.DateTimeFormat('ru-RU', { dateStyle: 'full' });
const MONTH_LABEL_FORMATTER = new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' });
const DISPLAY_DATE_FORMATTER = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

export const WEEKDAYS_MON_FIRST: readonly string[] = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

export function formatMonthLabel(view: Temporal.PlainYearMonth): string {
  // Intl rejects an iso8601 PlainYearMonth when the locale's default calendar
  // differs (ru-RU is gregory), so format the month through its first day.
  return MONTH_LABEL_FORMATTER.format(view.toPlainDate({ day: 1 }));
}

export function formatDisplayDate(value: string): string {
  const date = parseInputDate(value);

  return date ? DISPLAY_DATE_FORMATTER.format(date) : '';
}

export function buildMonthGrid(
  view: Temporal.PlainYearMonth,
  options: {
    selected: string;
    today: string;
    min?: string;
    max?: string;
  },
): CalendarDay[][] {
  const firstOfMonth = view.toPlainDate({ day: 1 });
  // dayOfWeek is ISO: 1 = Monday … 7 = Sunday, matching the Monday-first grid.
  const gridStart = firstOfMonth.subtract({ days: firstOfMonth.dayOfWeek - 1 });
  const focusTargetDate = pickFocusTarget(view, options.selected, options.today);
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
      isSelected: inputDate === options.selected,
      isFocusTarget: inputDate === focusTargetDate,
      disabled,
    };
  });

  const weeks: CalendarDay[][] = [];

  for (let i = 0; i < flat.length; i += 7) {
    weeks.push(flat.slice(i, i + 7));
  }

  return weeks;
}

function normalizeInputDate(value: string | undefined): string | undefined {
  return value && parseInputDate(value) ? value : undefined;
}

function pickFocusTarget(view: Temporal.PlainYearMonth, selected: string, today: string): string {
  const selectedInView = parseInputDate(selected);

  if (selectedInView && view.equals(selectedInView.toPlainYearMonth())) {
    return selected;
  }

  const todayInView = parseInputDate(today);

  if (todayInView && view.equals(todayInView.toPlainYearMonth())) {
    return today;
  }

  return view.toPlainDate({ day: 1 }).toString();
}
