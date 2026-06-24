import { Component, input } from '@angular/core';

export type UiBadgeVariant = 'neutral' | 'brand' | 'destructive' | 'outline';
export type UiBadgeSize = 'sm' | 'md';

@Component({
  selector: 'ui-badge',
  templateUrl: './ui-badge.html',
  styleUrl: './ui-badge.css',
  host: {
    '[class.ui-badge-neutral]': "variant() === 'neutral'",
    '[class.ui-badge-brand]': "variant() === 'brand'",
    '[class.ui-badge-destructive]': "variant() === 'destructive'",
    '[class.ui-badge-outline]': "variant() === 'outline'",
    '[class.ui-badge-sm]': "size() === 'sm'",
    '[class.ui-badge-md]': "size() === 'md'",
  },
})
export class UiBadge {
  readonly variant = input<UiBadgeVariant>('neutral');
  readonly size = input<UiBadgeSize>('md');
}
