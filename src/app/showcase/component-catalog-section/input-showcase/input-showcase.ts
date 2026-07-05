import { Component, signal } from '@angular/core';
import { disabled, email, FormField, form, required } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { UiCard } from '../../../components/ui-card/ui-card';
import { UiInput } from '../../../components/ui-input/ui-input';
import { UiMask } from '../../../components/ui-mask/ui-mask';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';
@Component({
  selector: 'app-input-showcase',
  imports: [FormField, RouterLink, UiCard, UiInput, UiMask, UiTab, UiTabItem],
  templateUrl: './input-showcase.html',
  styleUrl: './input-showcase.css',
})
export class InputShowcase {
  readonly model = signal({
    amount: '1250000.50',
    email: 'not-an-email',
    identity: 'Managed by SSO',
    phone: '998901234567',
  });
  readonly formState = form(this.model, (path) => {
    required(path.email, { message: 'Email is required' });
    email(path.email, { message: 'Use a valid email' });
    disabled(path.identity, { when: 'Locked by identity provider' });
  });
  protected readonly defaultCode = `<ui-input label="Email">\n  <input type="email" autocomplete="email" />\n</ui-input>`;
  protected readonly textareaCode = `<ui-input label="Notes">\n  <textarea placeholder="Add handoff notes"></textarea>\n</ui-input>`;
  protected readonly statesCode = `<ui-input size="sm">…</ui-input>\n<ui-input><input disabled /></ui-input>\n<ui-input loading>…</ui-input>`;
  protected readonly validationCode = `<ui-input label="Work email" withErrorMessage>\n  <input type="email" [formField]="formState.email" />\n</ui-input>`;
  protected readonly disabledCode = `disabled(path.identity, {when: 'Locked by identity provider'});\n\n<ui-input label="Identity">\n  <input [formField]="formState.identity" />\n</ui-input>`;
  protected readonly maskCode = `<ui-input label="Phone">\n  <input uiMask="+000 00 000-00-00" inputmode="tel" [formField]="formState.phone" />\n</ui-input>\n\n<ui-input label="Amount">\n  <input uiMask="separator.2" inputmode="decimal" [formField]="formState.amount" />\n</ui-input>`;
}
