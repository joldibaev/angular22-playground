import { ShowcaseCode } from '../showcase-code/showcase-code';
import { Component } from '@angular/core';
import { UiCard } from '../../../components/ui-card/ui-card';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';
@Component({
  selector: 'app-card-showcase',
  imports: [ShowcaseCode, UiCard, UiTab, UiTabItem],
  templateUrl: './card-showcase.html',
  styleUrl: './card-showcase.css',
})
export class CardShowcase {
  protected readonly elevatedCode = `<ui-card>Account summary</ui-card>`;
  protected readonly outlinedCode = `<ui-card variant="outlined">Team access</ui-card>`;
  protected readonly paddingCode = `<ui-card class="compact" variant="outlined">Compact repeated item</ui-card>\n\n.compact { --ui-card-padding: .875rem; }`;
}
