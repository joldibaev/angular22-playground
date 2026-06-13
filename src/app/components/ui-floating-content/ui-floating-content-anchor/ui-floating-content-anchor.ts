import { DestroyRef, Directive, inject } from '@angular/core';
import { UiFloatingContent } from '../ui-floating-content';

@Directive({
  selector: '[uiFloatingContentAnchor]',
  host: {
    '[style.anchor-name]': 'floatingContent.anchorName',
  },
})
export class UiFloatingContentAnchor {
  readonly floatingContent = inject(UiFloatingContent);

  constructor() {
    const destroyRef = inject(DestroyRef);

    this.floatingContent.registerAnchor();
    destroyRef.onDestroy(() => this.floatingContent.unregisterAnchor());
  }
}
