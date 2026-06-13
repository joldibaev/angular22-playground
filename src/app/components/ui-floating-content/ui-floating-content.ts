import {
  booleanAttribute,
  Component,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';

let nextFloatingContentId = 0;

export type UiFloatingContentVariant = 'default' | 'destructive';

@Component({
  selector: 'ui-floating-content',
  templateUrl: './ui-floating-content.html',
  styleUrl: './ui-floating-content.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'ui-floating-content',
    '[style.anchor-name]': 'anchorCount() === 0 ? anchorName : null',
  },
})
export class UiFloatingContent {
  readonly anchorName = `--ui-floating-content-${nextFloatingContentId++}`;
  readonly open = input(false, { transform: booleanAttribute });
  readonly variant = input<UiFloatingContentVariant>('default');
  readonly anchorCount = signal(0);

  registerAnchor(): void {
    this.anchorCount.update((count) => count + 1);
  }

  unregisterAnchor(): void {
    this.anchorCount.update((count) => Math.max(0, count - 1));
  }
}
