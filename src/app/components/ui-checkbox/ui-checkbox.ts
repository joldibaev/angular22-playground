import {
  afterRenderEffect,
  booleanAttribute,
  Component,
  ElementRef,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';
import {
  type DisabledReason,
  type FormCheckboxControl,
  type ValidationError,
  type WithOptionalFieldTree,
} from '@angular/forms/signals';
import { createFieldMessages } from '../../shared/field-messages';

export type UiCheckboxSize = 'sm' | 'md';

@Component({
  selector: 'ui-checkbox',
  templateUrl: './ui-checkbox.html',
  styleUrl: './ui-checkbox.css',
  host: {
    '[class.ui-checkbox-sm]': "size() === 'sm'",
  },
})
export class UiCheckbox implements FormCheckboxControl {
  checked = model(false);
  readonly size = input<UiCheckboxSize>('md');
  disabled = input(false, { transform: booleanAttribute });
  disabledReasons = input<readonly WithOptionalFieldTree<DisabledReason>[]>([]);
  hidden = input(false, { transform: booleanAttribute });
  invalid = input(false, { transform: booleanAttribute });
  errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  required = input(false, { transform: booleanAttribute });
  readonly indeterminate = input(false, { transform: booleanAttribute });
  readonly label = input('');
  readonly description = input('');
  readonly withErrorMessage = input(false, { transform: booleanAttribute });
  touch = output<void>();

  private readonly messages = createFieldMessages('ui-checkbox', this);
  readonly controlId = `ui-checkbox-control-${this.messages.id}`;
  readonly descriptionId = this.messages.descriptionId;
  readonly errorId = this.messages.errorId;
  readonly disabledReasonId = this.messages.disabledReasonId;
  readonly errorMessages = this.messages.errorMessages;
  readonly disabledReasonMessages = this.messages.disabledReasonMessages;
  readonly showErrorMessage = this.messages.showErrorMessage;
  readonly describedBy = this.messages.describedBy;

  private readonly control = viewChild<ElementRef<HTMLInputElement>>('control');

  constructor() {
    afterRenderEffect(() => {
      const control = this.control()?.nativeElement;

      if (control) {
        control.indeterminate = this.indeterminate();
      }
    });
  }

  onChange(event: Event): void {
    const control = event.target as HTMLInputElement;
    this.checked.set(control.checked);
  }

  focus(options?: FocusOptions): void {
    this.control()?.nativeElement.focus(options);
  }

  reset(): void {
    this.checked.set(false);
  }
}
