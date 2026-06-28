import {
  booleanAttribute,
  Component,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import {
  type DisabledReason,
  type FormValueControl,
  type ValidationError,
  type WithOptionalFieldTree,
} from '@angular/forms/signals';
import { createFieldMessages } from '../../../shared/field-messages';
import { nextId } from '../../../shared/unique-id';
import { UI_RADIO_GROUP, type UiRadioGroupControl, type UiRadioSize } from './ui-radio-group.token';

@Component({
  selector: 'ui-radio-group',
  providers: [{ provide: UI_RADIO_GROUP, useExisting: forwardRef(() => UiRadioGroup) }],
  templateUrl: './ui-radio-group.html',
  styleUrl: './ui-radio-group.css',
})
export class UiRadioGroup implements FormValueControl<string>, UiRadioGroupControl {
  value = model('');
  readonly size = input<UiRadioSize>('md');
  disabled = input(false, { transform: booleanAttribute });
  disabledReasons = input<readonly WithOptionalFieldTree<DisabledReason>[]>([]);
  hidden = input(false, { transform: booleanAttribute });
  invalid = input(false, { transform: booleanAttribute });
  errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  required = input(false, { transform: booleanAttribute });
  readonly label = input('');
  readonly name = input(`ui-radio-group-${nextId()}`);
  readonly description = input('');
  readonly withErrorMessage = input(false, { transform: booleanAttribute });
  touch = output<void>();

  private readonly messages = createFieldMessages('ui-radio-group', this);
  readonly descriptionId = this.messages.descriptionId;
  readonly errorId = this.messages.errorId;
  readonly disabledReasonId = this.messages.disabledReasonId;
  readonly errorMessages = this.messages.errorMessages;
  readonly disabledReasonMessages = this.messages.disabledReasonMessages;
  readonly showErrorMessage = this.messages.showErrorMessage;
  readonly describedBy = this.messages.describedBy;

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  select(value: string): void {
    this.value.set(value);
  }

  markTouched(): void {
    this.touch.emit();
  }

  focus(options?: FocusOptions): void {
    this.element.nativeElement.querySelector<HTMLInputElement>('input[type="radio"]')?.focus(options);
  }

  reset(): void {
    this.value.set('');
  }
}
