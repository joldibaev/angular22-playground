import { ShowcaseExample } from '../showcase-example/showcase-example';
import { Component, signal } from '@angular/core';
import { disabled, FormField, form, required } from '@angular/forms/signals';
import { UiSwitch } from '../../../components/ui-switch/ui-switch';
@Component({
  selector: 'app-switch-showcase',
  imports: [ShowcaseExample, FormField, UiSwitch],
  templateUrl: './switch-showcase.html',
  styleUrl: './switch-showcase.css',
})
export class SwitchShowcase {
  readonly model = signal({ protection: false, audit: true });
  readonly formState = form(this.model, (path) => {
    required(path.protection, { message: 'Enable protection to continue' });
    disabled(path.audit, { when: 'Managed by workspace policy' });
  });
  protected readonly statesCode = `<ui-switch label="Product updates" description="Receive release announcements." />\n<ui-switch label="Two-factor authentication" [checked]="true" />`;
  protected readonly sizesCode = `<ui-switch size="sm" label="Small" [checked]="true" />\n<ui-switch label="Medium" [checked]="true" />`;
  protected readonly validationCode = `import { signal } from '@angular/core';
import { form, required } from '@angular/forms/signals';

readonly model = signal({protection: false});
readonly formState = form(this.model, path => {
  required(path.protection, {message: 'Enable protection to continue'});
});

<ui-switch label="Account protection" withErrorMessage [formField]="formState.protection" />`;
  protected readonly disabledCode = `import { signal } from '@angular/core';
import { disabled, form } from '@angular/forms/signals';

readonly model = signal({audit: true});
readonly formState = form(this.model, path => {
  disabled(path.audit, {when: 'Managed by workspace policy'});
});

<ui-switch label="Audit mode" [formField]="formState.audit" />`;
}
