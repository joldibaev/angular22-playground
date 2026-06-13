import { Component, inject, ViewEncapsulation } from '@angular/core';
import { UiFloatingContent } from '../ui-floating-content';

@Component({
  selector: 'ui-floating-content-panel',
  templateUrl: './ui-floating-content-panel.html',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'ui-floating-content-panel',
    '[class.ui-floating-content-panel-default]': 'floatingContent.variant() === "default"',
    '[class.ui-floating-content-panel-destructive]':
      'floatingContent.variant() === "destructive"',
    '[hidden]': '!floatingContent.open()',
    '[style.position-anchor]': 'floatingContent.anchorName',
  },
})
export class UiFloatingContentPanel {
  readonly floatingContent = inject(UiFloatingContent);
}
