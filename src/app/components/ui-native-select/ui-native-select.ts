import {
  booleanAttribute,
  Component,
  ElementRef,
  input,
  model,
  output,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';
import { UiIcon } from '../ui-icon/ui-icon';
import { UiInput } from '../ui-input/ui-input';

/**
 * Chrome 150 native select. The platform owns keyboard navigation, focus,
 * form semantics, top-layer placement, light dismiss, and option selection.
 */
@Component({
  selector: 'ui-native-select',
  imports: [UiIcon, UiInput],
  templateUrl: './ui-native-select.html',
  styleUrl: './ui-native-select.css',
  encapsulation: ViewEncapsulation.None,
})
export class UiNativeSelect implements FormValueControl<string> {
  readonly value = model('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly label = input('Выбор');
  readonly placeholder = input('Выберите значение');
  readonly withErrorMessage = input(false, { transform: booleanAttribute });
  readonly touch = output<void>();

  private readonly control = viewChild<ElementRef<HTMLSelectElement>>('control');

  protected onChange(event: Event): void {
    this.value.set((event.target as HTMLSelectElement).value);
  }

  focus(options?: FocusOptions): void {
    this.control()?.nativeElement.focus(options);
  }

  reset(): void {
    this.value.set('');
  }
}
