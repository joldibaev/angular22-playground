import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  numberAttribute,
} from '@angular/core';

function optionalNumberAttribute(value: unknown): number | undefined {
  return value === null || value === undefined ? undefined : numberAttribute(value);
}

@Component({
  selector: 'ui-progress',
  templateUrl: './ui-progress.html',
  styleUrl: './ui-progress.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.ui-progress-indeterminate]': 'normalizedValue() === undefined',
    '[class.ui-progress-with-value]': 'withValue() && normalizedValue() !== undefined',
    '[style.--ui-progress-ratio]': 'ratio()',
  },
})
export class UiProgress {
  readonly value = input<number | undefined, unknown>(undefined, {
    transform: optionalNumberAttribute,
  });
  readonly max = input(100, { transform: numberAttribute });
  readonly label = input('');
  readonly withValue = input(false, { transform: booleanAttribute });
  readonly decorative = input<boolean | undefined, unknown>(undefined, {
    transform: booleanAttribute,
  });

  // Match ui-loading: an unlabeled indicator is visual-only unless the caller supplies context.
  protected readonly accessibleLabel = computed(() => this.label().trim());
  protected readonly isDecorative = computed(
    () => this.decorative() === true || !this.accessibleLabel(),
  );
  protected readonly normalizedMax = computed(() => {
    const max = this.max();
    return Number.isFinite(max) && max > 0 ? max : 1;
  });
  protected readonly normalizedValue = computed(() => {
    const value = this.value();

    if (value === undefined || !Number.isFinite(value)) {
      return undefined;
    }

    return Math.min(Math.max(value, 0), this.normalizedMax());
  });
  protected readonly ratio = computed(() => (this.normalizedValue() ?? 0) / this.normalizedMax());
  protected readonly percentage = computed(() => Math.round(this.ratio() * 100));
  // Key digits by place value from the right. Growing from 9 to 10 inserts only
  // the tens column, while the existing ones column rolls to its new value.
  protected readonly percentageDigits = computed(() => {
    const digits = `${this.percentage()}`.split('');

    return digits.map((digit, index) => ({
      offset: Number(digit) * -1,
      place: digits.length - 1 - index,
    }));
  });
  protected readonly digitValues = Array.from({ length: 10 }, (_, digit) => digit);
}
