import { AccordionContent, AccordionPanel, AccordionTrigger } from '@angular/aria/accordion';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  numberAttribute,
} from '@angular/core';
import { UiIcon } from '../../ui-icon/ui-icon';

@Component({
  selector: 'ui-accordion-item',
  imports: [AccordionContent, AccordionPanel, AccordionTrigger, UiIcon],
  templateUrl: './ui-accordion-item.html',
  styleUrl: './ui-accordion-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.ui-accordion-item-disabled]': 'disabled()',
  },
})
export class UiAccordionItem {
  readonly label = input.required<string>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly expanded = model(false);
  readonly headingLevel = input(3, { transform: numberAttribute });
}
