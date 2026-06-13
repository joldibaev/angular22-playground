import { Component, signal } from '@angular/core';
import { UiFloatingContent } from '../../../components/ui-floating-content/ui-floating-content';
import { UiFloatingContentPanel } from '../../../components/ui-floating-content/ui-floating-content-panel/ui-floating-content-panel';

@Component({
  selector: 'app-floating-content-showcase',
  imports: [UiFloatingContent, UiFloatingContentPanel],
  templateUrl: './floating-content-showcase.html',
  styleUrl: './floating-content-showcase.css',
})
export class FloatingContentShowcase {
  readonly contentOpen = signal(true);
}
