import { booleanAttribute, Component, input, output } from '@angular/core';
import { UiIcon } from '../ui-icon/ui-icon';

export type UiChipVariant =
  | 'default'
  | 'brand'
  | 'outline'
  | 'destructive'
  | 'secondary';
export type UiChipSize = 'sm' | 'md';

@Component({
  selector: 'ui-chip',
  imports: [UiIcon],
  templateUrl: './ui-chip.html',
  styleUrl: './ui-chip.css',
  host: {
    '[class.ui-chip-default]': "variant() === 'default'",
    '[class.ui-chip-brand]': "variant() === 'brand'",
    '[class.ui-chip-outline]': "variant() === 'outline'",
    '[class.ui-chip-destructive]': "variant() === 'destructive'",
    '[class.ui-chip-secondary]': "variant() === 'secondary'",
    '[class.ui-chip-sm]': "size() === 'sm'",
    '[class.ui-chip-md]': "size() === 'md'",
    '[class.ui-chip-disabled]': 'disabled()',
  },
})
export class UiChip {
  // Shared semantic variant names keep the component family predictable.
  readonly variant = input<UiChipVariant>('default');
  readonly size = input<UiChipSize>('md');
  readonly withDot = input(false, { transform: booleanAttribute });
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
