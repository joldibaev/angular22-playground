import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { disabled, FormField, form, required } from '@angular/forms/signals';
import { UiSwitch } from '../../../components/ui-switch/ui-switch';

@Component({
  selector: 'app-switch-showcase',
  imports: [FormField, JsonPipe, UiSwitch],
  templateUrl: './switch-showcase.html',
})
export class SwitchShowcase {
  readonly model = signal({
    requiredOff: false,
    enabled: true,
    disabled: true,
  });

  readonly formState = form(this.model, (path) => {
    required(path.requiredOff, { message: 'Enable this setting to continue' });
    disabled(path.disabled, { when: 'Managed by workspace policy' });
  });
}
