import { Component, input, ViewEncapsulation } from '@angular/core';
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
}
