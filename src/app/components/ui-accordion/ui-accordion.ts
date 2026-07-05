import { AccordionGroup } from '@angular/aria/accordion';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-accordion',
  templateUrl: './ui-accordion.html',
  styleUrl: './ui-accordion.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: AccordionGroup,
      inputs: ['disabled', 'multiExpandable: multi', 'softDisabled', 'wrap'],
    },
  ],
})
export class UiAccordion {
  private readonly accordionGroup: AccordionGroup;

  constructor(accordionGroup: AccordionGroup) {
    this.accordionGroup = accordionGroup;
  }

  expandAll(): void {
    this.accordionGroup.expandAll();
  }

  collapseAll(): void {
    this.accordionGroup.collapseAll();
  }
}
