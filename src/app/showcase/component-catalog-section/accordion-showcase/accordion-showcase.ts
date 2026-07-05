import { Component, signal } from '@angular/core';
import { UiAccordion } from '../../../components/ui-accordion/ui-accordion';
import { UiAccordionItem } from '../../../components/ui-accordion/ui-accordion-item/ui-accordion-item';
import { UiButton } from '../../../components/ui-button/ui-button';
import { UiCard } from '../../../components/ui-card/ui-card';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';

@Component({
  selector: 'app-accordion-showcase',
  imports: [UiAccordion, UiAccordionItem, UiButton, UiCard, UiTab, UiTabItem],
  templateUrl: './accordion-showcase.html',
  styleUrl: './accordion-showcase.css',
})
export class AccordionShowcase {
  protected readonly billingExpanded = signal(true);
  protected readonly securityExpanded = signal(false);

  protected readonly defaultCode = `<ui-accordion [multi]="false">
  <ui-accordion-item label="What is Angular ARIA?" [expanded]="true">
    Headless directives that provide accessible behavior without prescribing styles.
  </ui-accordion-item>
  <ui-accordion-item label="Does it support keyboard navigation?">
    Yes. Use Arrow Up/Down, Home, End, Enter, and Space.
  </ui-accordion-item>
</ui-accordion>`;

  protected readonly multiCode = `<ui-accordion multi>
  <ui-accordion-item label="Billing" [(expanded)]="billingExpanded">...</ui-accordion-item>
  <ui-accordion-item label="Security" [(expanded)]="securityExpanded">...</ui-accordion-item>
</ui-accordion>`;

  protected readonly statesCode = `<ui-accordion #accordion multi wrap>
  <ui-accordion-item label="Available section">...</ui-accordion-item>
  <ui-accordion-item label="Unavailable section" disabled>...</ui-accordion-item>
</ui-accordion>

<button (click)="accordion.expandAll()">Expand all</button>
<button (click)="accordion.collapseAll()">Collapse all</button>`;
}
