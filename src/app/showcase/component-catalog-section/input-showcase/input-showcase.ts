import { ShowcaseCode } from '../showcase-code/showcase-code';
import { Component, signal } from '@angular/core';
import { disabled, email, FormField, form, max, min, required } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { UiCard } from '../../../components/ui-card/ui-card';
import { UiInput } from '../../../components/ui-input/ui-input';
import { UiMask } from '../../../components/ui-mask/ui-mask';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';
@Component({
  selector: 'app-input-showcase',
  imports: [ShowcaseCode, FormField, RouterLink, UiCard, UiInput, UiMask, UiTab, UiTabItem],
  templateUrl: './input-showcase.html',
  styleUrl: './input-showcase.css',
})
export class InputShowcase {
  readonly model = signal({
    amount: '1250000.50',
    email: 'not-an-email',
    identity: 'Managed by SSO',
    phone: '998901234567',
    quantity: 12,
  });
  readonly formState = form(this.model, (path) => {
    required(path.email, { message: 'Email is required' });
    email(path.email, { message: 'Use a valid email' });
    disabled(path.identity, { when: 'Locked by identity provider' });
    min(path.quantity, 1, { message: 'Quantity must be at least 1' });
    max(path.quantity, 100, { message: 'Quantity cannot exceed 100' });
  });
  protected readonly defaultCode = `<ui-input label="Email">\n  <input type="email" autocomplete="email" />\n</ui-input>`;
  protected readonly numberCode = `min(path.quantity, 1);
max(path.quantity, 100);

<ui-input label="Quantity" withErrorMessage>
  <input type="number" [formField]="formState.quantity" />
</ui-input>`;
  protected readonly textareaCode = `<ui-input label="Notes">\n  <textarea placeholder="Add handoff notes"></textarea>\n</ui-input>`;
  protected readonly statesCode = `<ui-input label="Small" size="sm"><input placeholder="Compact field" /></ui-input>\n<ui-input label="Disabled"><input disabled value="Managed by SSO" /></ui-input>\n<ui-input label="Loading" loading><input value="Searching records" /></ui-input>`;
  protected readonly validationCode = `<ui-input label="Work email" withErrorMessage>\n  <input type="email" [formField]="formState.email" />\n</ui-input>`;
  protected readonly disabledCode = `disabled(path.identity, {when: 'Locked by identity provider'});\n\n<ui-input label="Identity">\n  <input [formField]="formState.identity" />\n</ui-input>`;
  protected readonly maskCode = `<ui-input label="Phone">\n  <input uiMask="+000 00 000-00-00" inputmode="tel" [formField]="formState.phone" />\n</ui-input>\n\n<ui-input label="Amount">\n  <input uiMask="separator.2" inputmode="decimal" [formField]="formState.amount" />\n</ui-input>`;
}
