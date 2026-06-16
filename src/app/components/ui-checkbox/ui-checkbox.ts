import {
  afterRenderEffect,
  booleanAttribute,
  Component,
  computed,
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
import { nextId } from '../../shared/unique-id';

@Component({
  selector: 'ui-checkbox',
  templateUrl: './ui-checkbox.html',
  styleUrl: './ui-checkbox.css',
})
export class UiCheckbox implements FormCheckboxControl {
  checked = model(false);
  disabled = input(false, { transform: booleanAttribute });
  disabledReasons = input<readonly WithOptionalFieldTree<DisabledReason>[]>([]);
  hidden = input(false, { transform: booleanAttribute });
  invalid = input(false, { transform: booleanAttribute });
  errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  required = input(false, { transform: booleanAttribute });
  readonly indeterminate = input(false, { transform: booleanAttribute });
  readonly label = input('');
  readonly description = input('');
  readonly showError = input(false, { transform: booleanAttribute });
  touch = output<void>();

  private readonly id = nextId();
  readonly controlId = `ui-checkbox-control-${this.id}`;
  readonly descriptionId = `ui-checkbox-description-${this.id}`;
  readonly errorId = `ui-checkbox-error-${this.id}`;
  readonly disabledReasonId = `ui-checkbox-disabled-reason-${this.id}`;

  private readonly control = viewChild<ElementRef<HTMLInputElement>>('control');

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
    () => this.showError() && this.invalid() && this.errorMessages().length > 0,
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
