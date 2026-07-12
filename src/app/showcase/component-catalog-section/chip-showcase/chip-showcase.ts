import { ShowcaseExample } from '../showcase-example/showcase-example';
import { Component, signal } from '@angular/core';
import { UiButton } from '../../../components/ui-button/ui-button';
import { UiChip } from '../../../components/ui-chip/ui-chip';
import { UiIcon } from '../../../components/ui-icon/ui-icon';

const INITIAL_TAGS = ['Design', 'Angular', 'CSS', 'A11y'];

@Component({
  selector: 'app-chip-showcase',
  imports: [ShowcaseExample, UiButton, UiChip, UiIcon],
  templateUrl: './chip-showcase.html',
  styleUrl: './chip-showcase.css',
})
export class ChipShowcase {
  protected readonly tags = signal(INITIAL_TAGS);
  protected readonly lastRemoved = signal('None');

  protected readonly defaultCode = `import { UiChip } from './components/ui-chip/ui-chip';

<ui-chip
  removeLabel="Remove Angular"
  (remove)="reportRemoval('Angular')"
>
  <ui-icon slot="start" name="outline-tag" decorative />
  <span>Angular</span>
  <span slot="end" aria-label="12 matching items">12</span>
</ui-chip>`;

  protected readonly variantCode = `<ui-chip removeLabel="Remove design" (remove)="reportRemoval('Design')">Design</ui-chip>
<ui-chip
  variant="destructive"
  removeLabel="Remove blocked"
  (remove)="reportRemoval('Blocked')"
>Blocked</ui-chip>`;

  protected readonly stateCode = `<ui-chip disabled removeLabel="Remove locked filter">Locked filter</ui-chip>

<div class="chip-width-limit">
  <ui-chip removeLabel="Remove long filter" (remove)="reportRemoval('Long filter')">
    Orders awaiting fulfillment from the primary warehouse
  </ui-chip>
</div>`;

  protected readonly removalCode = `readonly tags = signal(['Design', 'Angular', 'CSS', 'A11y']);

@for (tag of tags(); track tag) {
  <ui-chip
    [removeLabel]="'Remove ' + tag"
    (remove)="removeTag(tag)"
  >
    {{ tag }}
  </ui-chip>
} @empty {
  <span class="chip-empty">All tags removed</span>
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
