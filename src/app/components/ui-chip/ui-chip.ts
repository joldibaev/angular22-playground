import { booleanAttribute, Component, input, output } from '@angular/core';
import { UiIcon } from '../ui-icon/ui-icon';

export type UiChipVariant = 'neutral' | 'brand';
export type UiChipSize = 'sm' | 'md';

@Component({
  selector: 'ui-chip',
  imports: [UiIcon],
  templateUrl: './ui-chip.html',
  styleUrl: './ui-chip.css',
  host: {
    '[class.ui-chip-neutral]': "variant() === 'neutral'",
    '[class.ui-chip-brand]': "variant() === 'brand'",
    '[class.ui-chip-sm]': "size() === 'sm'",
    '[class.ui-chip-md]': "size() === 'md'",
    '[class.ui-chip-disabled]': 'disabled()',
  },
})
export class UiChip {
  readonly variant = input<UiChipVariant>('neutral');
  readonly size = input<UiChipSize>('md');
  readonly withRemove = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly removeLabel = input('Remove');
  readonly remove = output<void>();

  protected removeIconSize(): number {
    return this.size() === 'sm' ? 12 : 14;
  }

  protected onRemove(): void {
    if (!this.disabled()) {
      this.remove.emit();
    }
  }
}
