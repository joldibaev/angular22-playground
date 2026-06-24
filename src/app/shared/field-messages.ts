import { computed, type Signal } from '@angular/core';
import {
  type DisabledReason,
  type ValidationError,
  type WithOptionalFieldTree,
} from '@angular/forms/signals';
import { nextId } from './unique-id';

/**
 * Signals every form-control component must expose for its validation/description
 * wiring. Any component whose host implements `FormCheckboxControl` /
 * `FormValueControl` already declares these as inputs, so it can pass `this`.
 */
export interface FieldMessagesSource {
  readonly errors: Signal<readonly ValidationError.WithOptionalFieldTree[]>;
  readonly disabledReasons: Signal<readonly WithOptionalFieldTree<DisabledReason>[]>;
  readonly description: Signal<string>;
  readonly invalid: Signal<boolean>;
  readonly withErrorMessage: Signal<boolean>;
}

export interface FieldMessages {
  /** Stable per-instance id; reuse it for any other ids the component needs (e.g. controlId). */
  readonly id: number;
  readonly descriptionId: string;
  readonly errorId: string;
  readonly disabledReasonId: string;
  readonly errorMessages: Signal<string[]>;
  readonly disabledReasonMessages: Signal<string[]>;
  readonly showErrorMessage: Signal<boolean>;
  /** Space-joined `aria-describedby` token list, or `null` when there is nothing to describe. */
  readonly describedBy: Signal<string | null>;
}

/**
 * Builds the validation-message / disabled-reason / `aria-describedby` derivations
 * shared by every form-control component (checkbox, switch, radio-group, …). This
 * was copy-pasted verbatim across components; keep the single source of truth here.
 *
 * `prefix` namespaces the generated ids (e.g. `'ui-checkbox'`).
 */
export function createFieldMessages(prefix: string, source: FieldMessagesSource): FieldMessages {
  const id = nextId();
  const descriptionId = `${prefix}-description-${id}`;
  const errorId = `${prefix}-error-${id}`;
  const disabledReasonId = `${prefix}-disabled-reason-${id}`;

  const errorMessages = computed(() =>
    source
      .errors()
      .map((error) => error.message ?? `Invalid value: ${error.kind}`)
      .filter((message) => message.length > 0),
  );

  const disabledReasonMessages = computed(() =>
    source
      .disabledReasons()
      .map((reason) => reason.message ?? 'This field is disabled')
      .filter((message) => message.length > 0),
  );

  const showErrorMessage = computed(
    () => source.withErrorMessage() && source.invalid() && errorMessages().length > 0,
  );

  const describedBy = computed(() => {
    const ids: string[] = [];

    if (source.description()) {
      ids.push(descriptionId);
    }

    if (showErrorMessage()) {
      ids.push(errorId);
    }

    if (disabledReasonMessages().length) {
      ids.push(disabledReasonId);
    }

    return ids.join(' ') || null;
  });

  return {
    id,
    descriptionId,
    errorId,
    disabledReasonId,
    errorMessages,
    disabledReasonMessages,
    showErrorMessage,
    describedBy,
  };
}
