import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { disabled, email, FormField, form, minLength, required } from '@angular/forms/signals';
import { UiInput } from '../../../components/ui-input/ui-input';

@Component({
  selector: 'app-input-showcase',
  imports: [FormField, JsonPipe, UiInput],
  templateUrl: './input-showcase.html',
})
export class InputShowcase {
  readonly model = signal({
    requiredEmpty: '',
    requiredValid: 'ops@example.com',
    optionalEmpty: '',
    optionalFilled: 'platform-team',
    invalidEmail: 'not-an-email',
    shortCode: 'ab',
    notes: 'Escalate if the customer has no fallback owner.',
    requiredNotes: '',
    disabledField: 'Managed by SSO',
  });

  readonly formState = form(this.model, (path) => {
    required(path.requiredEmpty, { message: 'Email is required' });
    email(path.requiredEmpty, { message: 'Use a valid email' });
    required(path.requiredValid, { message: 'Email is required' });
    email(path.requiredValid, { message: 'Use a valid email' });
    email(path.invalidEmail, { message: 'Use a valid email' });
    minLength(path.shortCode, 4, { message: 'Use at least 4 characters' });
    required(path.requiredNotes, { message: 'Notes are required' });
    minLength(path.requiredNotes, 12, { message: 'Use at least 12 characters' });
    disabled(path.disabledField, { when: 'Locked by identity provider' });
  });
}
