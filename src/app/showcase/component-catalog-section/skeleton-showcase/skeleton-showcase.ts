import { ShowcaseExample } from '../showcase-example/showcase-example';
import { Component } from '@angular/core';
import { UiSkeleton } from '../../../components/ui-skeleton/ui-skeleton';
@Component({
  selector: 'app-skeleton-showcase',
  imports: [ShowcaseExample, UiSkeleton],
  templateUrl: './skeleton-showcase.html',
  styleUrl: './skeleton-showcase.css',
})
export class SkeletonShowcase {
  protected readonly shapesCode = `<ui-skeleton class="line" />\n<ui-skeleton shape="circle" />\n<ui-skeleton class="rectangle" shape="rectangle" />`;
  protected readonly compositionCode = `<article class="profile" aria-busy="true" aria-label="Loading profile">\n  <ui-skeleton class="avatar" shape="circle" />\n  <div>\n    <ui-skeleton class="name" />\n    <ui-skeleton class="detail" />\n    <ui-skeleton class="short" />\n  </div>\n</article>`;
  protected readonly staticCode = `<ui-skeleton\n  class="rectangle"\n  shape="rectangle"\n  [withAnimation]="false"\n/>`;
}
