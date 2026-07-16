import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  model,
  numberAttribute,
  output,
  viewChild,
} from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';
import { UiIcon } from '../../ui-icon/ui-icon';

// POS-oriented body-cell editor: the native number field keeps direct keyboard entry, while the
// adjacent buttons provide touch-friendly stepping. It is not a replacement for header filters.
@Component({
  selector: 'ui-table-input-number',
  imports: [UiIcon],
  templateUrl: './ui-table-input-number.html',
  styleUrl: './ui-table-input-number.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.ui-table-input-number-disabled]': 'disabled()',
    '[class.ui-table-input-number-invalid]': 'invalid()',
  },
})
export class UiTableInputNumber implements FormValueControl<number> {
  readonly control = viewChild.required<ElementRef<HTMLInputElement>>('control');

  readonly value = model(0);
  readonly min = input<number | undefined, unknown>(undefined, { transform: optionalNumber });
  readonly max = input<number | undefined, unknown>(undefined, { transform: optionalNumber });
  readonly step = input(1, { transform: numberAttribute });
  readonly ariaLabel = input.required<string>();
  readonly decrementLabel = input('Уменьшить');
  readonly incrementLabel = input('Увеличить');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly touch = output<void>();

  protected readonly safeStep = computed(() => {
    const step = this.step();
    return Number.isFinite(step) && step > 0 ? step : 1;
  });
  protected readonly canDecrement = computed(() => {
    const min = this.min();
    return !this.disabled() && (min === undefined || this.value() > min);
  });
  protected readonly canIncrement = computed(() => {
    const max = this.max();
    return !this.disabled() && (max === undefined || this.value() < max);
  });

  protected decrement(): void {
    this.commit(this.value() - this.safeStep());
  }

  protected increment(): void {
    this.commit(this.value() + this.safeStep());
  }

  protected updateValue(event: Event): void {
    const nextValue = (event.target as HTMLInputElement).valueAsNumber;

    if (Number.isFinite(nextValue)) {
      this.commit(nextValue);
    }
  }

  protected normalizeInput(): void {
    this.commit(this.value());
    this.touch.emit();
  }

  focus(options?: FocusOptions): void {
    this.control().nativeElement.focus(options);
  }

  reset(): void {
    this.commit(this.min() ?? 0);
  }

  private commit(value: number): void {
    const min = this.min() ?? Number.NEGATIVE_INFINITY;
    const max = this.max() ?? Number.POSITIVE_INFINITY;
    const clamped = Math.min(max, Math.max(min, value));
    const precision = decimalPlaces(this.safeStep());
    this.value.set(Number(clamped.toFixed(precision)));
  }
}

function optionalNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const parsed = numberAttribute(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function decimalPlaces(value: number): number {
  const [, fraction = ''] = String(value).split('.');
  return Math.min(fraction.length, 10);
}
