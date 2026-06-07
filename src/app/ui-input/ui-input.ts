import { booleanAttribute, Component, computed, contentChild, inject, input } from '@angular/core';
import {
  FORM_FIELD,
  FormField,
  type FieldState,
  type ValidationError,
} from '@angular/forms/signals';
import { UiTooltip, UiTooltipSurface } from '../ui-tooltip/ui-tooltip';

@Component({
  selector: 'ui-input',
  imports: [UiTooltip, UiTooltipSurface],
  templateUrl: './ui-input.html',
  styleUrl: './ui-input.css',
})
export class UiInput {
  readonly label = input('');
  readonly showError = input(false, { transform: booleanAttribute });

  private readonly projectedFormField = contentChild<FormField<string>>(FormField);
  private readonly hostFormField = inject<FormField<string> | null>(FORM_FIELD, { optional: true });

  readonly state = computed<FieldState<string> | undefined>(
    () => this.projectedFormField()?.field()() ?? this.hostFormField?.field()(),
  );
  readonly hidden = computed(() => this.state()?.hidden() ?? false);
  readonly required = computed(() => this.state()?.required() ?? false);
  readonly invalid = computed(() => this.state()?.invalid() ?? false);
  readonly disabled = computed(() => this.state()?.disabled() ?? false);

  readonly errorMessages = computed(() => {
    const state = this.state();

    return (
      state
        ?.errors()
        .map((error) => this.getMessage(error))
        .filter((message) => message.length > 0) ?? []
    );
  });

  readonly disabledReasonMessages = computed(() => {
    const state = this.state();

    return (
      state
        ?.disabledReasons()
        .map((reason) => reason.message ?? 'This field is disabled')
        .filter((message) => message.length > 0) ?? []
    );
  });

  readonly showErrorTooltip = computed(
    () => this.showError() && this.invalid() && this.errorMessages().length > 0,
  );

  private getMessage(error: ValidationError.WithFieldTree) {
    return error.message ?? `Invalid value: ${error.kind}`;
  }
}
