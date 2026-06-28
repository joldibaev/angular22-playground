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
import { UiLoading } from '../ui-loading/ui-loading';
import { UiInputError } from './ui-input-error/ui-input-error';

export type UiInputSize = 'sm' | 'md';

@Component({
  selector: 'ui-input',
  imports: [UiInputError, UiLoading],
  templateUrl: './ui-input.html',
  styleUrl: './ui-input.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.ui-input-sm]': "size() === 'sm'",
  },
})
export class UiInput {
  readonly label = input('');
  // Owns the control-size scale for the whole input family: the projected
  // control (input/textarea/[ngCombobox]) and any [uiInputControl] trigger read
  // the --ui-input-control-* tokens this sets, so select/autocomplete/date
  // pickers just forward `size` into their wrapped <ui-input>.
  readonly size = input<UiInputSize>('md');
  // `aria-busy` and `disabled` are deliberately separate: remote validation/search
  // must not steal focus or stop typing. Consumers can bind both when input is truly unavailable.
  readonly loading = input(false, { transform: booleanAttribute });
  readonly withErrorMessage = input(false, { transform: booleanAttribute });
  private readonly id = nextId();
  readonly labelId = `ui-input-label-${this.id}`;
  readonly controlId = `ui-input-control-${this.id}`;
  readonly errorTooltipId = `ui-input-error-${this.id}`;

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly projectedFormField = contentChild<FormField<unknown>>(FormField);
  private readonly hostFormField = inject<FormField<unknown> | null>(FORM_FIELD, { optional: true });

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

  readonly showErrorTooltip = computed(
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

      const labelledBy = control.getAttribute('aria-labelledby');
      const labelIds = labelledBy?.split(/\s+/).filter(Boolean) ?? [];

      if (!labelIds.includes(this.labelId)) {
        this.renderer.setAttribute(
          control,
          'aria-labelledby',
          [...labelIds, this.labelId].join(' '),
        );
      }
    }

    this.syncTokenAttribute(
      control,
      'aria-describedby',
      this.errorTooltipId,
      this.showErrorTooltip(),
    );

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
