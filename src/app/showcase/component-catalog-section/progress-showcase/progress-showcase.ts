import { ShowcaseExample } from '../showcase-example/showcase-example';
import { Component, signal } from '@angular/core';
import { UiButton } from '../../../components/ui-button/ui-button';
import { UiProgress } from '../../../components/ui-progress/ui-progress';
@Component({
  selector: 'app-progress-showcase',
  imports: [ShowcaseExample, UiButton, UiProgress],
  templateUrl: './progress-showcase.html',
  styleUrl: './progress-showcase.css',
})
export class ProgressShowcase {
  protected readonly progress = signal(40);
  protected readonly determinateCode = `readonly progress = signal(40);

<div class="progress-variant">
  <span>Animated value</span>
  <ui-progress label="Animated progress" [value]="progress()" withValue withAnimation />
</div>
<div class="progress-variant">
  <span>Without animation</span>
  <ui-progress label="Static progress" [value]="progress()" withValue />
</div>
<div class="progress-actions">
  <button
    uiButton
    type="button"
    size="sm"
    variant="ghost"
    data-progress-decrease
    [disabled]="progress() === 0"
    (click)="decreaseProgress()"
  >
    Decrease
  </button>
  <button
    uiButton
    type="button"
    size="sm"
    variant="secondary"
    data-progress-increase
    [disabled]="progress() === 100"
    (click)="increaseProgress()"
  >
    Increase
  </button>
</div>`;
  protected readonly maxCode = `<ui-progress label="Import progress" [value]="72" [max]="120" />`;
  protected readonly indeterminateCode = `<span>Preparing report</span>
<ui-progress label="Preparing report" />`;

  protected decreaseProgress(): void {
    this.progress.update((value) => Math.max(0, value - 20));
  }

  protected increaseProgress(): void {
    this.progress.update((value) => Math.min(100, value + 20));
  }
}
