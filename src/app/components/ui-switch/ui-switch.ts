import {
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

@Component({
  selector: 'ui-switch',
  templateUrl: './ui-switch.html',
  styleUrl: './ui-switch.css',
})
export class UiSwitch implements FormCheckboxControl {
  checked = model(false);
  disabled = input(false, { transform: booleanAttribute });
  disabledReasons = input<readonly WithOptionalFieldTree<DisabledReason>[]>([]);
  hidden = input(false, { transform: booleanAttribute });
  invalid = input(false, { transform: booleanAttribute });
  errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  required = input(false, { transform: booleanAttribute });
  readonly label = input('');
  readonly description = input('');
  readonly withErrorMessage = input(false, { transform: booleanAttribute });
  touch = output<void>();

  private readonly messages = createFieldMessages('ui-switch', this);
  readonly controlId = `ui-switch-control-${this.messages.id}`;
  readonly descriptionId = this.messages.descriptionId;
  readonly errorId = this.messages.errorId;
  readonly disabledReasonId = this.messages.disabledReasonId;
  readonly errorMessages = this.messages.errorMessages;
  readonly disabledReasonMessages = this.messages.disabledReasonMessages;
  readonly showErrorMessage = this.messages.showErrorMessage;
  readonly describedBy = this.messages.describedBy;

  private readonly control = viewChild<ElementRef<HTMLInputElement>>('control');

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
