import {
  buildMonthGrid,
  formatDisplayDate,
  formatDisplayDateParts,
  formatMonthLabel,
} from './calendar.utils';

describe('calendar utilities', () => {
  it('formats the month label through its first day', () => {
    expect(formatMonthLabel(Temporal.PlainYearMonth.from('2026-06'))).toBe('июнь 2026 г.');
  });

  it('formats valid input dates and rejects impossible dates', () => {
    expect(formatDisplayDate('2026-06-15')).toBe('15 июн. 2026 г.');
    expect(formatDisplayDate('2026-02-31')).toBe('');
  });

  it('formats display dates into stable independently animated parts', () => {
    const parts = formatDisplayDateParts('2026-06-15');

    expect(parts.map((part) => part.value).join('')).toBe(formatDisplayDate('2026-06-15'));
    expect(parts.find((part) => part.key === 'day-0')?.value).toBe('15');
    expect(parts.find((part) => part.key === 'year-0')?.value).toContain('г.');
    expect(parts.at(-1)?.key).toBe('year-0');
    expect(formatDisplayDateParts('2026-02-31')).toEqual([]);
  });

  it('builds a Monday-first grid with selection and boundaries', () => {
    const weeks = buildMonthGrid(Temporal.PlainYearMonth.from('2026-06'), {
      selected: '2026-06-15',
      today: '2026-06-20',
      min: '2026-06-05',
      max: '2026-06-25',
    });
    const days = weeks.flat();

    expect(weeks).toHaveLength(5);
    expect(weeks.every((week) => week.length === 7)).toBe(true);
    expect(days[0].date).toBe('2026-06-01');
    expect(days.find((day) => day.date === '2026-06-15')).toEqual(
      expect.objectContaining({ isSelected: true, isFocusTarget: true, disabled: false }),
    );
    expect(days.find((day) => day.date === '2026-06-04')?.disabled).toBe(true);
    expect(days.find((day) => day.date === '2026-06-26')?.disabled).toBe(true);
  });

  it.each([
    ['2021-02', 4],
    ['2026-06', 5],
    ['2026-08', 6],
  ])('renders only the weeks required by %s', (month, expectedWeeks) => {
    const weeks = buildMonthGrid(Temporal.PlainYearMonth.from(month), {
      selected: '',
      today: '2026-07-11',
    });

    expect(weeks).toHaveLength(expectedWeeks);
  });

  it('falls back from selection to today and then the first day for focus', () => {
    const todayGrid = buildMonthGrid(Temporal.PlainYearMonth.from('2026-06'), {
      selected: '2026-05-01',
      today: '2026-06-20',
    });
    const firstGrid = buildMonthGrid(Temporal.PlainYearMonth.from('2026-06'), {
      selected: '',
      today: '2026-07-01',
    });

    expect(todayGrid.flat().find((day) => day.isFocusTarget)?.date).toBe('2026-06-20');
    expect(firstGrid.flat().find((day) => day.isFocusTarget)?.date).toBe('2026-06-01');
  });
});
