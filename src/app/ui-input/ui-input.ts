import {
  afterRenderEffect,
  booleanAttribute,
  Component,
  computed,
  contentChild,
  ElementRef,
  inject,
  input,
  Renderer2,
} from '@angular/core';
import {
  FORM_FIELD,
  FormField,
  type FieldState,
  type ValidationError,
} from '@angular/forms/signals';
import { UiTooltip, UiTooltipSurface } from '../ui-tooltip/ui-tooltip';

let nextInputId = 0;

@Component({
  selector: 'ui-input',
  imports: [UiTooltip, UiTooltipSurface],
  templateUrl: './ui-input.html',
  styleUrl: './ui-input.css',
})
export class UiInput {
  readonly label = input('');
  readonly showError = input(false, { transform: booleanAttribute });
  readonly labelId = `ui-input-label-${nextInputId}`;
  readonly controlId = `ui-input-control-${nextInputId++}`;

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
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

  constructor() {
    afterRenderEffect(() => {
      this.syncLabelledControl();
    });
  }

  private getMessage(error: ValidationError.WithFieldTree) {
    return error.message ?? `Invalid value: ${error.kind}`;
  }

  private syncLabelledControl() {
    if (!this.label()) {
      return;
    }

    const control = this.element.nativeElement.querySelector<HTMLElement>('input, [ngCombobox]');

    if (!control) {
      return;
    }

    const controlId = control.id || this.controlId;

    this.renderer.setAttribute(control, 'id', controlId);
    this.syncLabelFor(controlId);

    const labelledBy = control.getAttribute('aria-labelledby');
    const labelIds = labelledBy?.split(/\s+/).filter(Boolean) ?? [];

    if (!labelIds.includes(this.labelId)) {
      this.renderer.setAttribute(control, 'aria-labelledby', [...labelIds, this.labelId].join(' '));
    }
  }

  private syncLabelFor(controlId: string) {
    const label = this.element.nativeElement.querySelector<HTMLLabelElement>(`#${this.labelId}`);

    if (label) {
      this.renderer.setAttribute(label, 'for', controlId);
    }
  }
}
