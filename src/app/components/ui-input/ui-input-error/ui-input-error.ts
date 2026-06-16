import {
  afterRenderEffect,
  Component,
  ElementRef,
  input,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { nextId } from '../../../shared/unique-id';

@Component({
  selector: 'ui-input-error',
  templateUrl: './ui-input-error.html',
  styleUrls: ['../../../shared/arrow-panel.css', './ui-input-error.css'],
  encapsulation: ViewEncapsulation.None,
})
export class UiInputError {
  readonly open = input(false);
  readonly messages = input<readonly string[]>([]);
  readonly panelId = input.required<string>();
  readonly anchorName = `--ui-input-error-${nextId()}`;

  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');

  constructor() {
    // Toggle the manual popover from validation state. The effect re-runs as
    // open()/messages() change; the imperative call lets the shared CSS leave
    // transition play out (an @if would tear the element out first).
    afterRenderEffect(() => {
      const el = this.panel()?.nativeElement;

      if (el) {
        this.syncPopover(el, this.open() && this.messages().length > 0);
      }
    });
  }

  private syncPopover(el: HTMLElement, shouldShow: boolean): void {
    // A popover can only be toggled while connected. During SSR hydration the
    // element may be detached on the first pass, so retry on the next frame
    // instead of throwing and giving up.
    if (!el.isConnected) {
      if (shouldShow) {
        requestAnimationFrame(() =>
          this.syncPopover(el, this.open() && this.messages().length > 0),
        );
      }

      return;
    }

    const isShown = el.matches(':popover-open');

    if (shouldShow && !isShown) {
      el.showPopover();
    } else if (!shouldShow && isShown) {
      el.hidePopover();
    }
  }
}
