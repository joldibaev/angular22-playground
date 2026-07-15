import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ui-description-list',
  templateUrl: './ui-description-list.html',
  styleUrl: './ui-description-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiDescriptionList {
  // The public attributes are forwarded to the inner native <dl>, which owns
  // the description-list semantics and therefore its accessible name.
  readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' });
  readonly ariaLabelledby = input<string | undefined>(undefined, { alias: 'aria-labelledby' });
}
