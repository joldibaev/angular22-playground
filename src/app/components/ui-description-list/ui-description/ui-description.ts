import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconName } from '../../ui-icon/data';
import { UiIcon } from '../../ui-icon/ui-icon';

// Restricting the directive to <div> preserves the native HTML grouping rule:
// each projected div is a direct child of <dl> and owns one <dt>/<dd> pair.
@Component({
  selector: 'div[uiDescription]',
  imports: [UiIcon],
  templateUrl: './ui-description.html',
  styleUrl: './ui-description.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ui-description',
  },
})
export class UiDescription {
  readonly label = input.required<string>({ alias: 'uiDescription' });
  readonly icon = input<IconName>();
}
