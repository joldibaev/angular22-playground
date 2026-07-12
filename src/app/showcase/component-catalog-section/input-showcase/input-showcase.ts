import { ShowcaseExample } from '../showcase-example/showcase-example';
import { Component, signal } from '@angular/core';
import { disabled, email, FormField, form, max, min, required } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { UiIcon } from '../../../components/ui-icon/ui-icon';
import { UiInput } from '../../../components/ui-input/ui-input';
import { UiMask } from '../../../components/ui-mask/ui-mask';
@Component({
  selector: 'app-input-showcase',
  imports: [ShowcaseExample, FormField, RouterLink, UiIcon, UiInput, UiMask],
  templateUrl: './input-showcase.html',
  styleUrl: './input-showcase.css',
})
export class InputShowcase {
  protected readonly passwordVisible = signal(false);
  protected readonly notes = signal('Confirm the delivery window with the customer.');
  protected readonly searchQuery = signal('Quarterly report');
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
  protected readonly slotsCode = `readonly searchQuery = signal('Quarterly report');

<ui-input label="Search">
  <ui-icon slot="start" name="outline-search" decorative />
  <input
    #searchInput
    type="search"
    [value]="searchQuery()"
    (input)="searchQuery.set(searchInput.value)"
  />
  <button
    slot="end"
    type="button"
    aria-label="Clear search"
    [disabled]="!searchQuery()"
    (click)="searchQuery.set('')"
  >
    <ui-icon name="outline-x" decorative />
  </button>
</ui-input>

<ui-input label="Shortcut">
  <input placeholder="Open command palette" />
  <kbd slot="end">⌘K</kbd>
</ui-input>

<ui-input label="Email">
  <span slot="start" aria-hidden="true">@</span>
  <input type="email" autocomplete="email" placeholder="name@example.com" />
</ui-input>

<ui-input label="Amount">
  <input inputmode="decimal" value="1250.00" />
  <span slot="end">USD</span>
</ui-input>

<ui-input label="Loading" loading>
  <ui-icon slot="start" name="outline-search" decorative />
  <input value="Refreshing records" />
  <!-- The loading indicator temporarily replaces custom end content. -->
  <ui-icon slot="end" name="outline-x" decorative />
</ui-input>

<ui-input label="Disabled">
  <ui-icon slot="start" name="outline-lock" decorative />
  <input disabled value="Managed by policy" />
  <span slot="end">SSO</span>
</ui-input>`;
  protected readonly passwordCode = `readonly passwordVisible = signal(false);

<ui-input label="Password">
  <input
    [type]="passwordVisible() ? 'text' : 'password'"
    autocomplete="current-password"
    value="correct horse battery staple"
  />
  <button
    slot="end"
    type="button"
    [attr.aria-label]="passwordVisible() ? 'Hide password' : 'Show password'"
    [attr.aria-pressed]="passwordVisible()"
    (click)="passwordVisible.update(visible => !visible)"
  >
    <ui-icon
      [name]="passwordVisible() ? 'outline-eye-off' : 'outline-eye'"
      decorative
    />
  </button>
</ui-input>`;
  protected readonly numberCode = `min(path.quantity, 1);
max(path.quantity, 100);

<ui-input label="Quantity" withErrorMessage>
  <input type="number" [formField]="formState.quantity" />
</ui-input>`;
  protected readonly textareaCode = `readonly notes = signal(
  'Confirm the delivery window with the customer.',
);

<ui-input label="Notes">
  <ui-icon slot="start" name="outline-notes" decorative />
  <textarea
    #notesInput
    placeholder="Add handoff notes"
    [value]="notes()"
    (input)="notes.set(notesInput.value)"
  ></textarea>
  <button
    slot="end"
    type="button"
    aria-label="Clear notes"
    [disabled]="!notes()"
    (click)="notes.set('')"
  >
    <ui-icon name="outline-x" decorative />
  </button>
</ui-input>`;
  protected readonly statesCode = `<ui-input label="Disabled"><input disabled value="Managed by SSO" /></ui-input>\n<ui-input label="Loading" loading><input value="Searching records" /></ui-input>`;
  protected readonly validationCode = `<ui-input label="Work email" withErrorMessage>\n  <input type="email" [formField]="formState.email" />\n</ui-input>`;
  protected readonly disabledCode = `disabled(path.identity, {when: 'Locked by identity provider'});\n\n<ui-input label="Identity">\n  <input [formField]="formState.identity" />\n</ui-input>`;
  protected readonly maskCode = `<ui-input label="Phone">\n  <input uiMask="+000 00 000-00-00" inputmode="tel" [formField]="formState.phone" />\n</ui-input>\n\n<ui-input label="Amount">\n  <input uiMask="separator.2" inputmode="decimal" [formField]="formState.amount" />\n</ui-input>`;
}
