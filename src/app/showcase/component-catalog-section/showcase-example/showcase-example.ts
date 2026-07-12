import { Component, input } from '@angular/core';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';
import { nextId } from '../../../shared/unique-id';
import { ShowcaseCode, ShowcaseCodeLanguage } from '../showcase-code/showcase-code';

@Component({
  selector: 'app-showcase-example',
  imports: [ShowcaseCode, UiTab, UiTabItem],
  templateUrl: './showcase-example.html',
  styleUrl: './showcase-example.css',
})
export class ShowcaseExample {
  private readonly headingId = `showcase-example-${nextId()}`;

  readonly heading = input.required<string>();
  readonly ariaLabel = input.required<string>({ alias: 'aria-label' });
  readonly code = input.required<string>();
  readonly language = input<ShowcaseCodeLanguage>('auto');

  protected readonly labelledBy = this.headingId;
}
