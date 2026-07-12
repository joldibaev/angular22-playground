import { ShowcaseExample } from '../showcase-example/showcase-example';
import { Component } from '@angular/core';
import { UiLoading } from '../../../components/ui-loading/ui-loading';

@Component({
  selector: 'app-loading-showcase',
  imports: [ShowcaseExample, UiLoading],
  templateUrl: './loading-showcase.html',
  styleUrl: './loading-showcase.css',
})
export class LoadingShowcase {
  protected readonly statusCode = `<ui-loading label="Loading results" [size]="24" />`;
  protected readonly sizesCode = `<ui-loading decorative [size]="16" />\n<ui-loading decorative [size]="24" />\n<ui-loading decorative [size]="32" />`;
}
