import { Component } from '@angular/core';
import { UiDescription } from '../../../components/ui-description-list/ui-description/ui-description';
import { UiDescriptionList } from '../../../components/ui-description-list/ui-description-list';
import { ShowcaseExample } from '../showcase-example/showcase-example';

@Component({
  selector: 'app-description-list-showcase',
  imports: [ShowcaseExample, UiDescriptionList, UiDescription],
  templateUrl: './description-list-showcase.html',
  styleUrl: './description-list-showcase.css',
})
export class DescriptionListShowcase {
  protected readonly defaultCode = `<ui-description-list aria-label="Account details">
  <div uiDescription="Username" icon="outline-at">anji</div>
  <div uiDescription="Role" icon="outline-shield-lock">Administrator</div>
</ui-description-list>`;

  protected readonly responsiveCode = `<ui-description-list aria-label="Session details">
  <div uiDescription="Device">Checkout terminal 04</div>
  <div uiDescription="Last active">July 16, 2026 at 14:32</div>
</ui-description-list>`;
}
