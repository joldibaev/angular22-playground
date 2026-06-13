import { Component, computed, input } from '@angular/core';

export type UiCardAppearance = 'elevated' | 'outlined';

@Component({
  selector: 'ui-card',
  templateUrl: './ui-card.html',
  styleUrl: './ui-card.css',
  host: {
    '[class.ui-card-elevated]': "resolvedAppearance() === 'elevated'",
    '[class.ui-card-outlined]': "resolvedAppearance() === 'outlined'",
  },
})
export class UiCard {
  readonly appearance = input<UiCardAppearance>('elevated');
  readonly variant = input<UiCardAppearance | undefined>(undefined);

  readonly resolvedAppearance = computed(() => this.variant() ?? this.appearance());
}
