import { Component, input } from '@angular/core';

export type UiAlertVariant = 'default' | 'destructive';

@Component({
  selector: 'ui-alert',
  templateUrl: './ui-alert.html',
  styleUrl: './ui-alert.css',
  host: {
    '[class.ui-alert-default]': "variant() === 'default'",
    '[class.ui-alert-destructive]': "variant() === 'destructive'",
  },
})
export class UiAlert {
  readonly variant = input<UiAlertVariant>('default');
}
