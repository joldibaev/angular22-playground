import { ShowcaseCode } from '../showcase-code/showcase-code';
import { Component } from '@angular/core';
import { UiCard } from '../../../components/ui-card/ui-card';
import { UiSkeleton } from '../../../components/ui-skeleton/ui-skeleton';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';
@Component({
  selector: 'app-skeleton-showcase',
  imports: [ShowcaseCode, UiCard, UiSkeleton, UiTab, UiTabItem],
  templateUrl: './skeleton-showcase.html',
  styleUrl: './skeleton-showcase.css',
})
export class SkeletonShowcase {
  protected readonly shapesCode = `<ui-skeleton class="line" />\n<ui-skeleton shape="circle" />\n<ui-skeleton class="rectangle" shape="rectangle" />`;
  protected readonly compositionCode = `<article class="profile" aria-busy="true" aria-label="Loading profile">\n  <ui-skeleton class="avatar" shape="circle" />\n  <div>\n    <ui-skeleton class="name" />\n    <ui-skeleton class="detail" />\n    <ui-skeleton class="short" />\n  </div>\n</article>`;
  protected readonly staticCode = `<ui-skeleton\n  class="rectangle"\n  shape="rectangle"\n  [withAnimation]="false"\n/>`;
}
