import { ShowcaseExample } from '../showcase-example/showcase-example';
import { Component, signal } from '@angular/core';
import { disabled, FormField, form, required } from '@angular/forms/signals';
import { UiRadio } from '../../../components/ui-radio/ui-radio';
import { UiRadioGroup } from '../../../components/ui-radio/ui-radio-group/ui-radio-group';
@Component({
  selector: 'app-radio-showcase',
  imports: [ShowcaseExample, FormField, UiRadio, UiRadioGroup],
  templateUrl: './radio-showcase.html',
  styleUrl: './radio-showcase.css',
})
export class RadioShowcase {
  readonly model = signal({ plan: '', approval: 'manual' });
  readonly formState = form(this.model, (path) => {
    required(path.plan, { message: 'Choose a billing plan' });
    disabled(path.approval, { when: 'Managed by workspace policy' });
  });
  protected readonly defaultCode = `<ui-radio-group
  label="Density"
  description="Choose the interface density."
  value="comfortable"
>
  <ui-radio value="compact">Compact</ui-radio>
  <ui-radio value="comfortable">Comfortable</ui-radio>
</ui-radio-group>`;
  protected readonly statesCode = `<ui-radio-group size="sm" label="Plan">\n  <ui-radio value="starter">Starter</ui-radio>\n  <ui-radio value="growth">Growth</ui-radio>\n  <ui-radio value="legacy" disabled>Legacy</ui-radio>\n</ui-radio-group>`;
  protected readonly validationCode = `import { signal } from '@angular/core';
import { form, required } from '@angular/forms/signals';

readonly model = signal({plan: ''});
readonly formState = form(this.model, path => {
  required(path.plan, {message: 'Choose a billing plan'});
});

<ui-radio-group label="Billing plan" withErrorMessage [formField]="formState.plan">
  <ui-radio value="starter">Starter</ui-radio>
  <ui-radio value="growth">Growth</ui-radio>
</ui-radio-group>`;
  protected readonly disabledCode = `import { signal } from '@angular/core';
import { disabled, form } from '@angular/forms/signals';

readonly model = signal({approval: 'manual'});
readonly formState = form(this.model, path => {
  disabled(path.approval, {when: 'Managed by workspace policy'});
});

<ui-radio-group label="Approval flow" [formField]="formState.approval">
  <ui-radio value="manual">Manual</ui-radio>
  <ui-radio value="automatic">Automatic</ui-radio>
</ui-radio-group>`;
}
