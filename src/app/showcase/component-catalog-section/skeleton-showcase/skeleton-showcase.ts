import { Component } from '@angular/core';
import { UiCard } from '../../../components/ui-card/ui-card';
import { UiSkeleton } from '../../../components/ui-skeleton/ui-skeleton';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';
@Component({
  selector: 'app-skeleton-showcase',
  imports: [UiCard, UiSkeleton, UiTab, UiTabItem],
  templateUrl: './skeleton-showcase.html',
  styleUrl: './skeleton-showcase.css',
})
export class SkeletonShowcase {
  protected readonly shapesCode = `<ui-skeleton />\n<ui-skeleton shape="circle" />\n<ui-skeleton shape="rectangle" />`;
  protected readonly compositionCode = `<article aria-busy="true" aria-label="Loading profile">\n  <ui-skeleton shape="circle" />\n  <ui-skeleton />\n</article>`;
  protected readonly staticCode = `<ui-skeleton shape="rectangle" [withAnimation]="false" />`;
}
