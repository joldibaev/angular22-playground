// The pattern guard keeps the public `yyyy-mm-dd` contract strict:
// Temporal.PlainDate.from() alone would also accept other ISO forms
// (e.g. '2026-06-15T10:00'), which the pickers must reject.
const INPUT_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function parseInputDate(value: string): Temporal.PlainDate | null {
  if (!INPUT_DATE_PATTERN.test(value)) {
    return null;
  }

  try {
    return Temporal.PlainDate.from(value);
  } catch {
    // Well-formed but impossible dates ('2026-02-31') throw a RangeError.
    return null;
  }
}
