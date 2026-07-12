import { ShowcaseCode } from '../showcase-code/showcase-code';
import { Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { UiCard } from '../../../components/ui-card/ui-card';
import { UiInput } from '../../../components/ui-input/ui-input';
import { UiMask } from '../../../components/ui-mask/ui-mask';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';
import { UiTable } from '../../../components/ui-table/ui-table';
import { UiTableViewport } from '../../../components/ui-table/ui-table-viewport/ui-table-viewport';

@Component({
  selector: 'app-mask-showcase',
  imports: [ShowcaseCode, FormField, UiCard, UiInput, UiMask, UiTab, UiTabItem, UiTable, UiTableViewport],
  templateUrl: './mask-showcase.html',
  styleUrl: './mask-showcase.css',
})
export class MaskShowcase {
  readonly model = signal({
    amount: '1250000.50',
    phone: '998901234567',
    reference: 'ab1234',
  });
  readonly formState = form(this.model);

  protected readonly patternCode = `<ui-input label="Phone">\n  <input uiMask="+000 00 000-00-00" inputmode="tel" [formField]="formState.phone" />\n</ui-input>\n\n<ui-input label="Reference">\n  <input uiMask="UU-0000" [formField]="formState.reference" />\n</ui-input>`;
  protected readonly separatorCode = `<ui-input label="Amount">\n  <input\n    uiMask="separator.2"\n    thousandSeparator=" "\n    decimalMarker="."\n    inputmode="decimal"\n    [formField]="formState.amount"\n  />\n</ui-input>`;
}
