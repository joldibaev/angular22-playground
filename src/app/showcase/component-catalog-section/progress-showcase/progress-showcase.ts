import { Component } from '@angular/core';
import { UiCard } from '../../../components/ui-card/ui-card';
import { UiProgress } from '../../../components/ui-progress/ui-progress';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';
@Component({
  selector: 'app-progress-showcase',
  imports: [UiCard, UiProgress, UiTab, UiTabItem],
  templateUrl: './progress-showcase.html',
  styleUrl: './progress-showcase.css',
})
export class ProgressShowcase {
  protected readonly determinateCode = `<ui-progress label="Upload progress" [value]="35" />`;
  protected readonly maxCode = `<ui-progress label="Import progress" [value]="72" [max]="120" />`;
  protected readonly indeterminateCode = `<ui-progress label="Preparing report" />`;
}
