import { booleanAttribute, Component, input, output } from '@angular/core';
import { UiIcon } from '../ui-icon/ui-icon';

export type UiChipVariant = 'secondary' | 'destructive';

@Component({
  selector: 'ui-chip',
  imports: [UiIcon],
  templateUrl: './ui-chip.html',
  styleUrl: './ui-chip.css',
  host: {
    '[class.ui-chip-destructive]': "variant() === 'destructive'",
    '[class.ui-chip-secondary]': "variant() === 'secondary'",
    '[class.ui-chip-disabled]': 'disabled()',
  },
})
export class UiChip {
  // A chip is specifically a removable token; passive labels and statuses belong to ui-badge.
  readonly variant = input<UiChipVariant>('secondary');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly removeLabel = input.required<string>();
  readonly remove = output<void>();

  protected onRemove(): void {
    if (!this.disabled()) {
      this.remove.emit();
    }
  }
}
