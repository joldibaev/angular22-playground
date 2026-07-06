import { buildMonthGrid, formatDisplayDate, formatMonthLabel } from './calendar.utils';

describe('calendar utilities', () => {
  it('formats the month label through its first day', () => {
    expect(formatMonthLabel(Temporal.PlainYearMonth.from('2026-06'))).toBe('июнь 2026 г.');
  });

  it('formats valid input dates and rejects impossible dates', () => {
    expect(formatDisplayDate('2026-06-15')).toBe('15 июн. 2026 г.');
    expect(formatDisplayDate('2026-02-31')).toBe('');
  });

  it('builds a six-week Monday-first grid with selection and boundaries', () => {
    const weeks = buildMonthGrid(Temporal.PlainYearMonth.from('2026-06'), {
      selected: '2026-06-15',
      today: '2026-06-20',
      min: '2026-06-05',
      max: '2026-06-25',
    });
    const days = weeks.flat();

    expect(weeks).toHaveLength(6);
    expect(weeks.every((week) => week.length === 7)).toBe(true);
    expect(days[0].date).toBe('2026-06-01');
    expect(days.find((day) => day.date === '2026-06-15')).toEqual(
      expect.objectContaining({ isSelected: true, isFocusTarget: true, disabled: false }),
    );
    expect(days.find((day) => day.date === '2026-06-04')?.disabled).toBe(true);
    expect(days.find((day) => day.date === '2026-06-26')?.disabled).toBe(true);
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
