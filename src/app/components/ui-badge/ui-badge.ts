import { booleanAttribute, Component, input } from '@angular/core';

export type UiBadgeVariant =
  | 'default'
  | 'brand'
  | 'outline'
  | 'destructive'
  | 'secondary';
export type UiBadgeSize = 'sm' | 'md';

@Component({
  selector: 'ui-badge',
  templateUrl: './ui-badge.html',
  styleUrl: './ui-badge.css',
  host: {
    '[class.ui-badge-default]': "variant() === 'default'",
    '[class.ui-badge-brand]': "variant() === 'brand'",
    '[class.ui-badge-outline]': "variant() === 'outline'",
    '[class.ui-badge-destructive]': "variant() === 'destructive'",
    '[class.ui-badge-secondary]': "variant() === 'secondary'",
    '[class.ui-badge-rounded]': 'rounded()',
    '[class.ui-badge-sm]': "size() === 'sm'",
    '[class.ui-badge-md]': "size() === 'md'",
  },
})
export class UiBadge {
  // Reuses ui-button's surface recipes, excluding ghost/link because a badge is not interactive.
  readonly variant = input<UiBadgeVariant>('default');
  readonly size = input<UiBadgeSize>('md');
  readonly rounded = input(false, { transform: booleanAttribute });
  readonly withDot = input(false, { transform: booleanAttribute });
}
