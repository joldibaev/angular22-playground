import { Component, input } from '@angular/core';

export type UiCardVariant = 'glass' | 'outlined';

@Component({
  selector: 'ui-card',
  templateUrl: './ui-card.html',
  styleUrl: './ui-card.css',
  host: {
    '[class.ui-card-glass]': "variant() === 'glass'",
    '[class.ui-card-outlined]': "variant() === 'outlined'",
  },
})
export class UiCard {
  readonly variant = input<UiCardVariant>('glass');
}
