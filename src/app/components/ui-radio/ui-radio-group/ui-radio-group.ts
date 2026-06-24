import {
  booleanAttribute,
  Component,
  computed,
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
import { nextId } from '../../../shared/unique-id';
import { UI_RADIO_GROUP, type UiRadioGroupControl } from './ui-radio-group.token';

@Component({
  selector: 'ui-radio-group',
  providers: [{ provide: UI_RADIO_GROUP, useExisting: forwardRef(() => UiRadioGroup) }],
  templateUrl: './ui-radio-group.html',
  styleUrl: './ui-radio-group.css',
})
export class UiRadioGroup implements FormValueControl<string>, UiRadioGroupControl {
  value = model('');
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

  private readonly id = nextId();
  readonly descriptionId = `ui-radio-group-description-${this.id}`;
  readonly errorId = `ui-radio-group-error-${this.id}`;
  readonly disabledReasonId = `ui-radio-group-disabled-reason-${this.id}`;

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly errorMessages = computed(() => {
    return this.errors()
      .map((error) => error.message ?? `Invalid value: ${error.kind}`)
      .filter((message) => message.length > 0);
  });

  readonly disabledReasonMessages = computed(() => {
    return this.disabledReasons()
      .map((reason) => reason.message ?? 'This field is disabled')
      .filter((message) => message.length > 0);
  });

  readonly showErrorMessage = computed(
    () => this.withErrorMessage() && this.invalid() && this.errorMessages().length > 0,
  );

  readonly describedBy = computed(() => {
    const ids: string[] = [];

    if (this.description()) {
      ids.push(this.descriptionId);
    }

    if (this.showErrorMessage()) {
      ids.push(this.errorId);
    }

    if (this.disabledReasonMessages().length) {
      ids.push(this.disabledReasonId);
    }

    return ids.join(' ') || null;
  });

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
