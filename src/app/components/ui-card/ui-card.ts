import { Component, input } from '@angular/core';

export type UiCardVariant = 'elevated' | 'outline';

@Component({
  selector: 'ui-card',
  templateUrl: './ui-card.html',
  styleUrl: './ui-card.css',
  host: {
    '[class.ui-card-elevated]': "variant() === 'elevated'",
    '[class.ui-card-outline]': "variant() === 'outline'",
  },
})
export class UiCard {
  readonly variant = input<UiCardVariant>('elevated');
}
