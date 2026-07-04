import { Component } from '@angular/core';
import { UiCard } from '../../../components/ui-card/ui-card';
import { UiLoading } from '../../../components/ui-loading/ui-loading';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';

@Component({
  selector: 'app-loading-showcase',
  imports: [UiCard, UiLoading, UiTab, UiTabItem],
  templateUrl: './loading-showcase.html',
  styleUrl: './loading-showcase.css',
})
export class LoadingShowcase {
  protected readonly statusCode = `<ui-loading label="Loading results" [size]="24" />`;
  protected readonly sizesCode = `<ui-loading decorative [size]="16" />\n<ui-loading decorative [size]="24" />\n<ui-loading decorative [size]="32" />`;
}
