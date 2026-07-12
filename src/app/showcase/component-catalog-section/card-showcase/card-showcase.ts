import { ShowcaseExample } from '../showcase-example/showcase-example';
import { Component } from '@angular/core';
import { UiCard } from '../../../components/ui-card/ui-card';

@Component({
  selector: 'app-card-showcase',
  imports: [ShowcaseExample, UiCard],
  templateUrl: './card-showcase.html',
  styleUrl: './card-showcase.css',
})
export class CardShowcase {
  protected readonly glassCode = `<ui-card>Account summary</ui-card>`;
  protected readonly outlinedCode = `<ui-card variant="outlined">Team access</ui-card>`;
  protected readonly paddingCode = `<ui-card class="compact" variant="outlined">Compact repeated item</ui-card>\n\n.compact { --ui-card-padding: .875rem; }`;
}
