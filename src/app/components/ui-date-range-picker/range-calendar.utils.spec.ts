import {
  buildPresets,
  buildRangeMonthGrid,
  formatRangeDisplay,
  normalizeRange,
  rangeToView,
} from './range-calendar.utils';

describe('range calendar utilities', () => {
  it('normalizes reversed ranges and formats complete and partial values', () => {
    expect(normalizeRange({ start: '2026-06-20', end: '2026-06-10' })).toEqual({
      start: '2026-06-10',
      end: '2026-06-20',
    });
    expect(formatRangeDisplay({ start: '2026-06-10', end: '2026-06-20' })).toBe(
      '10 июн. 2026 г. — 20 июн. 2026 г.',
    );
    expect(formatRangeDisplay({ start: '2026-06-10', end: '' })).toBe('С 10 июн. 2026 г.');
  });

  it('chooses a two-month view that contains both range endpoints', () => {
    expect(rangeToView({ start: '2026-05-20', end: '2026-06-10' }, '2026-01-01').toString()).toBe(
      '2026-05',
    );
  });

  it('marks committed and reversed pending ranges without including endpoints', () => {
    const days = buildRangeMonthGrid(
      Temporal.PlainYearMonth.from('2026-06'),
      {
        range: { start: '2026-06-10', end: '2026-06-15' },
        pending: { start: '2026-06-25', hover: '2026-06-20', selectingEnd: true },
        today: '2026-06-12',
      },
    ).flat();

    expect(days.find((day) => day.date === '2026-06-10')).toEqual(
      expect.objectContaining({ isStart: true, isInRange: false }),
    );
    expect(days.find((day) => day.date === '2026-06-12')).toEqual(
      expect.objectContaining({ isToday: true, isInRange: true }),
    );
    expect(days.find((day) => day.date === '2026-06-22')).toEqual(
      expect.objectContaining({ isPendingInRange: true }),
    );
    expect(days.find((day) => day.date === '2026-06-20')?.isPendingRangeStart).toBe(true);
    expect(days.find((day) => day.date === '2026-06-25')?.isPendingRangeEnd).toBe(true);
  });

  it.each([
    ['2021-02', 4],
    ['2026-06', 5],
    ['2026-08', 6],
  ])('renders only the weeks required by %s', (month, expectedWeeks) => {
    const weeks = buildRangeMonthGrid(Temporal.PlainYearMonth.from(month), {
      range: { start: '', end: '' },
      pending: { start: '', hover: '', selectingEnd: false },
      today: '2026-07-11',
    });

    expect(weeks).toHaveLength(expectedWeeks);
  });

  it('builds deterministic presets from the supplied clock', () => {
    const presets = buildPresets(() => Temporal.PlainDate.from('2026-07-06'));

    expect(presets.map((preset) => preset.label)).toEqual([
      'Сегодня',
      'Вчера',
      'Последние 7 дней',
      'Последние 30 дней',
      'Этот месяц',
      'Прошлый месяц',
    ]);
    expect(presets[2].range()).toEqual({ start: '2026-06-30', end: '2026-07-06' });
    expect(presets[5].range()).toEqual({ start: '2026-06-01', end: '2026-06-30' });
  });
});
