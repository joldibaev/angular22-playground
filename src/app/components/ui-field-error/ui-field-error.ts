import {
  afterRenderEffect,
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  input,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { nextId } from '../../shared/unique-id';
import { syncPopover } from '../../shared/sync-popover';

@Component({
  selector: 'ui-field-error',
  templateUrl: './ui-field-error.html',
  styleUrls: ['../../shared/arrow-panel.css', './ui-field-error.css'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[style.anchor-name]': 'resolvedAnchorNames()',
  },
})
export class UiFieldError {
  readonly open = input(false, { transform: booleanAttribute });
  readonly messages = input<readonly string[]>([]);
  readonly panelId = input.required<string>();
  // A composed field can anchor its own popup to this same surface without
  // displacing the validation panel's unique anchor.
  readonly additionalAnchorName = input('');
  readonly anchorName = `--ui-field-error-${nextId()}`;
  readonly resolvedAnchorNames = computed(() =>
    [this.anchorName, this.additionalAnchorName()].filter(Boolean).join(', '),
  );

  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');

  constructor() {
    // Validation owns visibility, so this must stay a manual popover rather
    // than becoming an interest-triggered tooltip.
    afterRenderEffect((onCleanup) => {
      const element = this.panel()?.nativeElement;
      const shouldOpen = this.open() && this.messages().length > 0;

      if (!element) {
        return;
      }

      // Tab content and other embedded views can finish attaching after this
      // render effect. Waiting for the next frame avoids losing the initial
      // showPopover() attempt; cleanup prevents stale state from winning.
      const frame = requestAnimationFrame(() => syncPopover(element, shouldOpen));

      onCleanup(() => cancelAnimationFrame(frame));
    });
  }
}
