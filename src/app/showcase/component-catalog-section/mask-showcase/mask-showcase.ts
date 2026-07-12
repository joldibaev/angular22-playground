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

  protected readonly patternCode = `<ui-input label="Phone">
  <input
    uiMask="+000 00 000-00-00"
    inputmode="tel"
    autocomplete="tel"
    placeholder="+998 90 123-45-67"
    [formField]="formState.phone"
  />
</ui-input>

<ui-input label="Reference">
  <input
    uiMask="UU-0000"
    autocapitalize="characters"
    placeholder="AB-1234"
    [formField]="formState.reference"
  />
</ui-input>`;
  protected readonly separatorCode = `<ui-input label="Amount">
  <input
    uiMask="separator.2"
    thousandSeparator=" "
    decimalMarker="."
    inputmode="decimal"
    placeholder="0.00"
    [formField]="formState.amount"
  />
</ui-input>`;
}
