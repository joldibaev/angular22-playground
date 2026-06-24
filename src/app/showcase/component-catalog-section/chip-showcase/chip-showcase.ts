import { Component, signal } from '@angular/core';
import { UiChip } from '../../../components/ui-chip/ui-chip';

const INITIAL_TAGS = ['Design', 'Angular', 'CSS', 'A11y'];

@Component({
  selector: 'app-chip-showcase',
  imports: [UiChip],
  templateUrl: './chip-showcase.html',
})
export class ChipShowcase {
  protected readonly tags = signal(INITIAL_TAGS);

  protected removeTag(tag: string): void {
    this.tags.update((tags) => tags.filter((current) => current !== tag));
  }

  protected reset(): void {
    this.tags.set(INITIAL_TAGS);
  }
}
