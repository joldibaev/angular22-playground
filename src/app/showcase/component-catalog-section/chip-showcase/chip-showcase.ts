import { Component, signal } from '@angular/core';
import { UiButton } from '../../../components/ui-button/ui-button';
import { UiCard } from '../../../components/ui-card/ui-card';
import { UiChip } from '../../../components/ui-chip/ui-chip';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';

const INITIAL_TAGS = ['Design', 'Angular', 'CSS', 'A11y'];

@Component({
  selector: 'app-chip-showcase',
  imports: [UiButton, UiCard, UiChip, UiTab, UiTabItem],
  templateUrl: './chip-showcase.html',
  styleUrl: './chip-showcase.css',
})
export class ChipShowcase {
  protected readonly tags = signal(INITIAL_TAGS);
  protected readonly lastRemoved = signal('None');

  protected readonly defaultCode = `import { UiChip } from './components/ui-chip/ui-chip';

<ui-chip
  removeLabel="Remove Angular"
  (remove)="removeTag('Angular')"
>
  Angular
</ui-chip>`;

  protected readonly variantCode = `<ui-chip removeLabel="Remove design">Design</ui-chip>
<ui-chip variant="destructive" removeLabel="Remove blocked">Blocked</ui-chip>`;

  protected readonly stateCode = `<ui-chip disabled removeLabel="Remove locked filter">Locked filter</ui-chip>

<div class="chip-width-limit">
  <ui-chip removeLabel="Remove long filter">
    Orders awaiting fulfillment from the primary warehouse
  </ui-chip>
</div>`;

  protected readonly removalCode = `readonly tags = signal(['Design', 'Angular', 'CSS', 'A11y']);

@for (tag of tags(); track tag) {
  <ui-chip
    [removeLabel]="'Remove ' + tag"
    (remove)="tags.update(tags => tags.filter(item => item !== tag))"
  >
    {{ tag }}
  </ui-chip>
}`;

  protected removeTag(tag: string): void {
    this.tags.update((tags) => tags.filter((current) => current !== tag));
    this.lastRemoved.set(tag);
  }

  protected reportRemoval(label: string): void {
    this.lastRemoved.set(label);
  }

  protected reset(): void {
    this.tags.set(INITIAL_TAGS);
    this.lastRemoved.set('None');
  }
}
