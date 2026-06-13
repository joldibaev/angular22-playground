import { Component, signal } from '@angular/core';
import { UiButton } from '../../../components/ui-button/ui-button';
import { UiPopover } from '../../../components/ui-popover/ui-popover';

@Component({
  selector: 'app-popover-showcase',
  imports: [UiButton, UiPopover],
  templateUrl: './popover-showcase.html',
  styleUrl: './popover-showcase.css',
})
export class PopoverShowcase {
  readonly contentOpen = signal(false);
}
