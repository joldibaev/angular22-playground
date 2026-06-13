import { Component, input, ViewEncapsulation } from '@angular/core';

let nextInputErrorId = 0;

@Component({
  selector: 'ui-input-error',
  templateUrl: './ui-input-error.html',
  styleUrl: './ui-input-error.css',
  encapsulation: ViewEncapsulation.None,
})
export class UiInputError {
  readonly open = input(false);
  readonly messages = input<readonly string[]>([]);
  readonly panelId = input.required<string>();
  readonly anchorName = `--ui-input-error-${nextInputErrorId++}`;
}
