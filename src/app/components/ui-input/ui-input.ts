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
  ViewEncapsulation,
} from '@angular/core';
import {
  FORM_FIELD,
  FormField,
  type FieldState,
  type ValidationError,
} from '@angular/forms/signals';
import { nextId } from '../../shared/unique-id';
import { UiFieldError } from '../ui-field-error/ui-field-error';
import { UiLoading } from '../ui-loading/ui-loading';

@Component({
  selector: 'ui-input',
  imports: [UiFieldError, UiLoading],
  templateUrl: './ui-input.html',
  styleUrl: './ui-input.css',
  encapsulation: ViewEncapsulation.None,
})
export class UiInput {
  readonly label = input('');
  // `aria-busy` and `disabled` are deliberately separate: remote validation/search
  // must not steal focus or stop typing. Consumers can bind both when input is truly unavailable.
  readonly loading = input(false, { transform: booleanAttribute });
  readonly withErrorMessage = input(false, { transform: booleanAttribute });
  // Composed popup controls anchor to the complete field surface, not the
  // middle grid cell, so anchor-size(width) includes both adornment columns.
  readonly popupAnchorName = input('');
  private readonly id = nextId();
  readonly labelId = `ui-input-label-${this.id}`;
  readonly controlId = `ui-input-control-${this.id}`;
  readonly errorId = `ui-field-error-${this.id}`;

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly projectedFormField = contentChild<FormField<unknown>>(FormField);
  private readonly hostFormField = inject<FormField<unknown> | null>(FORM_FIELD, {
    optional: true,
  });

  readonly state = computed<FieldState<unknown> | undefined>(
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

  readonly showErrorMessage = computed(
    () => this.withErrorMessage() && this.invalid() && this.errorMessages().length > 0,
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
    const control = this.element.nativeElement.querySelector<HTMLElement>(
      'input, textarea, [ngCombobox], [uiInputControl]',
    );

    if (!control) {
      return;
    }

    const controlId = control.id || this.controlId;

    this.renderer.setAttribute(control, 'id', controlId);

    if (this.label()) {
      this.syncLabelFor(controlId);
    }

    this.syncTokenAttribute(control, 'aria-labelledby', this.labelId, Boolean(this.label()));

    this.syncTokenAttribute(
      control,
      'aria-errormessage',
      this.errorId,
      this.showErrorMessage(),
    );

    if (this.invalid()) {
      this.renderer.setAttribute(control, 'aria-invalid', 'true');
    } else {
      this.renderer.removeAttribute(control, 'aria-invalid');
    }

    if (this.loading()) {
      this.renderer.setAttribute(control, 'aria-busy', 'true');
    } else {
      this.renderer.removeAttribute(control, 'aria-busy');
    }
  }

  private syncLabelFor(controlId: string) {
    const label = this.element.nativeElement.querySelector<HTMLLabelElement>(`#${this.labelId}`);

    if (label) {
      this.renderer.setAttribute(label, 'for', controlId);
    }
  }

  private syncTokenAttribute(
    element: HTMLElement,
    attribute: string,
    token: string,
    shouldInclude: boolean,
  ): void {
    const tokens = element.getAttribute(attribute)?.split(/\s+/).filter(Boolean) ?? [];
    const nextTokens = shouldInclude
      ? [...new Set([...tokens, token])]
      : tokens.filter((currentToken) => currentToken !== token);

    if (nextTokens.length) {
      this.renderer.setAttribute(element, attribute, nextTokens.join(' '));
    } else {
      this.renderer.removeAttribute(element, attribute);
    }
  }
}
