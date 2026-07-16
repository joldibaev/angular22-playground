import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';

export type UiTableInputType = 'email' | 'search' | 'tel' | 'text' | 'url';

// Compact editor for a value inside a body cell. Header filters intentionally keep using UiInput,
// which already owns labels, messages, slots, and the broader form-field accessibility contract.
@Component({
  selector: 'ui-table-input',
  templateUrl: './ui-table-input.html',
  styleUrl: './ui-table-input.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.ui-table-input-disabled]': 'disabled()',
    '[class.ui-table-input-invalid]': 'invalid()',
  },
})
export class UiTableInput implements FormValueControl<string> {
  readonly control = viewChild.required<ElementRef<HTMLInputElement>>('control');

  readonly value = model('');
  readonly type = input<UiTableInputType>('text');
  readonly placeholder = input('');
  readonly ariaLabel = input<string>();
  readonly ariaLabelledBy = input<string>();
  readonly autocomplete = input('off');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly touch = output<void>();

  protected updateValue(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }

  focus(options?: FocusOptions): void {
    this.control().nativeElement.focus(options);
  }

  reset(): void {
    this.value.set('');
  }
}
