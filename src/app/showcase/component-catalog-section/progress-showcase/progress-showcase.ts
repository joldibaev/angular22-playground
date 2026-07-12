import { ShowcaseCode } from '../showcase-code/showcase-code';
import { Component, signal } from '@angular/core';
import { UiButton } from '../../../components/ui-button/ui-button';
import { UiCard } from '../../../components/ui-card/ui-card';
import { UiProgress } from '../../../components/ui-progress/ui-progress';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';
@Component({
  selector: 'app-progress-showcase',
  imports: [ShowcaseCode, UiButton, UiCard, UiProgress, UiTab, UiTabItem],
  templateUrl: './progress-showcase.html',
  styleUrl: './progress-showcase.css',
})
export class ProgressShowcase {
  protected readonly progress = signal(40);
  protected readonly determinateCode = `readonly progress = signal(40);\n\n<ui-progress label="Animated progress" [value]="progress()" withValue withAnimation />\n<ui-progress label="Static progress" [value]="progress()" withValue />\n<button (click)="decreaseProgress()">Decrease</button>\n<button (click)="increaseProgress()">Increase</button>`;
  protected readonly maxCode = `<ui-progress label="Import progress" [value]="72" [max]="120" />`;
  protected readonly indeterminateCode = `<ui-progress label="Preparing report" />`;

  protected decreaseProgress(): void {
    this.progress.update((value) => Math.max(0, value - 20));
  }

  protected increaseProgress(): void {
    this.progress.update((value) => Math.min(100, value + 20));
  }
}
