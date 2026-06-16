import {
  afterRenderEffect,
  Component,
  ElementRef,
  input,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { nextId } from '../../../shared/unique-id';
import { syncPopover } from '../../../shared/sync-popover';

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
    // open()/messages() change. Keeping the element mounted lets the shared
    // popover enter animation play without hand-wiring a trigger.
    afterRenderEffect(() => {
      const el = this.panel()?.nativeElement;

      if (el) {
        syncPopover(el, () => this.open() && this.messages().length > 0);
      }
    });
  }
}
