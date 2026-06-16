import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { disabled, FormField, form, required } from '@angular/forms/signals';
import { UiRadio } from '../../../components/ui-radio/ui-radio';
import { UiRadioGroup } from '../../../components/ui-radio/ui-radio-group/ui-radio-group';

@Component({
  selector: 'app-radio-showcase',
  imports: [FormField, JsonPipe, UiRadio, UiRadioGroup],
  templateUrl: './radio-showcase.html',
})
export class RadioShowcase {
  readonly model = signal({
    plan: '',
    density: 'comfortable',
    approvalFlow: 'manual',
  });

  readonly formState = form(this.model, (path) => {
    required(path.plan, { message: 'Choose a billing plan' });
    disabled(path.approvalFlow, { when: 'Managed by workspace policy' });
  });
}
