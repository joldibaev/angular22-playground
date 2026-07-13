import { ShowcaseExample } from '../showcase-example/showcase-example';
import { Component, signal } from '@angular/core';
import { UiAccordion } from '../../../components/ui-accordion/ui-accordion';
import { UiAccordionItem } from '../../../components/ui-accordion/ui-accordion-item/ui-accordion-item';
import { UiButton } from '../../../components/ui-button/ui-button';
import { UiIcon } from '../../../components/ui-icon/ui-icon';

@Component({
  selector: 'app-accordion-showcase',
  imports: [ShowcaseExample, UiAccordion, UiAccordionItem, UiButton, UiIcon],
  templateUrl: './accordion-showcase.html',
  styleUrl: './accordion-showcase.css',
})
export class AccordionShowcase {
  protected readonly billingExpanded = signal(true);
  protected readonly securityExpanded = signal(false);

  protected readonly defaultCode = `<ui-accordion [multi]="false">
  <ui-accordion-item label="What is Angular ARIA?" [expanded]="true">
    <ui-icon slot="start" name="outline-info-circle" decorative />
    <span slot="end">Guide</span>
    Headless directives that provide accessible behavior without prescribing styles.
  </ui-accordion-item>
  <ui-accordion-item label="Does it support keyboard navigation?">
    Yes. Use Arrow Up/Down, Home, End, Enter, and Space.
  </ui-accordion-item>
</ui-accordion>`;

  protected readonly multiCode = `import { signal } from '@angular/core';

readonly billingExpanded = signal(true);
readonly securityExpanded = signal(false);

<ui-accordion multi>
  <ui-accordion-item label="Billing" [(expanded)]="billingExpanded">
    Review invoices, payment methods, and billing contacts.
  </ui-accordion-item>
  <ui-accordion-item label="Security" [(expanded)]="securityExpanded">
    Manage workspace access, sessions, and sign-in requirements.
  </ui-accordion-item>
</ui-accordion>`;

  protected readonly statesCode = `<ui-accordion #accordion multi wrap>
  <ui-accordion-item label="Available section">
    This section is available to the current user.
  </ui-accordion-item>
  <ui-accordion-item label="Unavailable section" disabled>
    This section is disabled by workspace policy.
  </ui-accordion-item>
</ui-accordion>

<button (click)="accordion.expandAll()">Expand all</button>
<button (click)="accordion.collapseAll()">Collapse all</button>`;
}
