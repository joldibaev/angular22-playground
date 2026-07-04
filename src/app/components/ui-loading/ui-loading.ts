import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  numberAttribute,
} from '@angular/core';

@Component({
  selector: 'ui-loading',
  templateUrl: './ui-loading.html',
  styleUrl: './ui-loading.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.aria-hidden]': 'isDecorative() ? "true" : null',
    '[attr.aria-label]': 'isDecorative() ? null : accessibleLabel()',
    '[attr.role]': 'isDecorative() ? "presentation" : "status"',
  },
})
export class UiLoading {
  readonly label = input('');
  readonly decorative = input<boolean | undefined, unknown>(undefined, {
    transform: booleanAttribute,
  });
  readonly size = input(16, { transform: numberAttribute });

  // Loading indicators nested in an aria-busy control are visual only by default;
  // supplying a label opts a standalone indicator into status semantics.
  protected readonly accessibleLabel = computed(() => this.label().trim());
  protected readonly isDecorative = computed(() => this.decorative() ?? !this.accessibleLabel());
}
