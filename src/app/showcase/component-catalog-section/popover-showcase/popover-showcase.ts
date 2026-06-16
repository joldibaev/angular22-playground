import { Component, signal } from '@angular/core';
import { UiButton } from '../../../components/ui-button/ui-button';
import { type UiPopoverPlacement, UiPopover } from '../../../components/ui-popover/ui-popover';

@Component({
  selector: 'app-popover-showcase',
  imports: [UiButton, UiPopover],
  templateUrl: './popover-showcase.html',
  styleUrl: './popover-showcase.css',
})
export class PopoverShowcase {
  readonly contentOpen = signal(false);
  readonly placements: readonly UiPopoverPlacement[] = ['top', 'right', 'bottom', 'left'];
  readonly fallbackStates = [
    { label: 'Fallback on', value: true },
    { label: 'Fallback off', value: false },
  ] as const;
}
