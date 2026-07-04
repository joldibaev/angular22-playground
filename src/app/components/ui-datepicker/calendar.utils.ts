import { parseInputDate, toInputDate } from '../../shared/date.utils';

export interface CalendarMonth {
  year: number;
  month: number;
}

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

export function monthFromDate(date: Date): CalendarMonth {
  return { year: date.getFullYear(), month: date.getMonth() };
}

export function addMonths(view: CalendarMonth, amount: number): CalendarMonth {
  return monthFromDate(new Date(view.year, view.month + amount, 1));
}

export function formatMonthLabel(view: CalendarMonth): string {
  return MONTH_LABEL_FORMATTER.format(new Date(view.year, view.month, 1));
}

export function formatDisplayDate(value: string): string {
  const date = parseInputDate(value);

  return date ? DISPLAY_DATE_FORMATTER.format(date) : '';
}

export function buildMonthGrid(
  view: CalendarMonth,
  options: {
    selected: string;
    today: string;
    min?: string;
    max?: string;
  },
): CalendarDay[][] {
  const firstOfMonth = new Date(view.year, view.month, 1);
  const mondayOffset = (firstOfMonth.getDay() + 6) % 7;
  const gridStart = new Date(view.year, view.month, 1 - mondayOffset);
  const focusTargetDate = pickFocusTarget(view, options.selected, options.today);
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

function pickFocusTarget(view: CalendarMonth, selected: string, today: string): string {
  const selectedInView = parseInputDate(selected);

  if (
    selectedInView &&
    selectedInView.getFullYear() === view.year &&
    selectedInView.getMonth() === view.month
  ) {
    return selected;
  }

  const todayInView = parseInputDate(today);

  if (
    todayInView &&
    todayInView.getFullYear() === view.year &&
    todayInView.getMonth() === view.month
  ) {
    return today;
  }

  return toInputDate(new Date(view.year, view.month, 1));
}
