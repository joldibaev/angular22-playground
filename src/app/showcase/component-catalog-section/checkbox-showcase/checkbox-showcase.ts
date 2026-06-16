import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { disabled, FormField, form, required } from '@angular/forms/signals';
import { UiCheckbox } from '../../../components/ui-checkbox/ui-checkbox';

@Component({
  selector: 'app-checkbox-showcase',
  imports: [FormField, JsonPipe, UiCheckbox],
  templateUrl: './checkbox-showcase.html',
})
export class CheckboxShowcase {
  readonly model = signal({
    requiredEmpty: false,
    selected: true,
    indeterminate: false,
    disabled: true,
  });

  readonly formState = form(this.model, (path) => {
    required(path.requiredEmpty, { message: 'Accept the terms to continue' });
    disabled(path.disabled, { when: 'Managed by workspace policy' });
  });
}
