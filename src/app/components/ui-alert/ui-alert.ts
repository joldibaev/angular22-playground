import { Component, computed, input } from '@angular/core';
import { UiIcon } from '../ui-icon/ui-icon';

export type UiAlertVariant = 'default' | 'destructive';

@Component({
  selector: 'ui-alert',
  imports: [UiIcon],
  templateUrl: './ui-alert.html',
  styleUrl: './ui-alert.css',
  host: {
    '[class.ui-alert-default]': "variant() === 'default'",
    '[class.ui-alert-destructive]': "variant() === 'destructive'",
  },
})
export class UiAlert {
  readonly title = input.required<string>();
  // Severity controls presentation only: callers opt into role="alert" when a dynamic message
  // is genuinely urgent, so static destructive guidance does not interrupt screen readers.
  readonly variant = input<UiAlertVariant>('default');

  protected readonly icon = computed(() =>
    this.variant() === 'destructive' ? 'outline-alert-circle' : 'outline-info-circle',
  );
}
