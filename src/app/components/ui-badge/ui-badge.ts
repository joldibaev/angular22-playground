import { booleanAttribute, Component, input } from '@angular/core';

export type UiBadgeVariant = 'contrast' | 'brand' | 'outline' | 'destructive' | 'secondary';

@Component({
  selector: 'ui-badge',
  templateUrl: './ui-badge.html',
  styleUrl: './ui-badge.css',
  host: {
    '[class.ui-badge-contrast]': "variant() === 'contrast'",
    '[class.ui-badge-brand]': "variant() === 'brand'",
    '[class.ui-badge-outline]': "variant() === 'outline'",
    '[class.ui-badge-destructive]': "variant() === 'destructive'",
    '[class.ui-badge-secondary]': "variant() === 'secondary'",
    '[class.ui-badge-notification]': 'withNotificationAnimation()',
    '[class.ui-badge-notification-visible]': 'withNotificationAnimation() && visible()',
    '[attr.aria-hidden]': 'withNotificationAnimation() && !visible() ? "true" : null',
  },
})
export class UiBadge {
  // A passive label should recede by default; stronger variants are deliberate status emphasis.
  readonly variant = input<UiBadgeVariant>('secondary');
  readonly withDot = input(false, { transform: booleanAttribute });
  readonly withNotificationAnimation = input(false, { transform: booleanAttribute });
  readonly visible = input(true, { transform: booleanAttribute });
}
