import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

export type UiSkeletonShape = 'text' | 'circle' | 'rectangle';

@Component({
  selector: 'ui-skeleton',
  templateUrl: './ui-skeleton.html',
  styleUrl: './ui-skeleton.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    // The parent loading region owns `aria-busy` and any announcement; each shape is visual only.
    'aria-hidden': 'true',
    '[class.ui-skeleton-text]': "shape() === 'text'",
    '[class.ui-skeleton-circle]': "shape() === 'circle'",
    '[class.ui-skeleton-rectangle]': "shape() === 'rectangle'",
    '[class.ui-skeleton-animated]': 'withAnimation()',
  },
})
export class UiSkeleton {
  readonly shape = input<UiSkeletonShape>('text');
  readonly withAnimation = input(true, { transform: booleanAttribute });
}
