import { ShowcaseCode } from '../showcase-code/showcase-code';
import { Component, signal } from '@angular/core';
import { disabled, FormField, form, required } from '@angular/forms/signals';
import { UiCard } from '../../../components/ui-card/ui-card';
import { UiSwitch } from '../../../components/ui-switch/ui-switch';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';
@Component({
  selector: 'app-switch-showcase',
  imports: [ShowcaseCode, FormField, UiCard, UiSwitch, UiTab, UiTabItem],
  templateUrl: './switch-showcase.html',
  styleUrl: './switch-showcase.css',
})
export class SwitchShowcase {
  readonly model = signal({ protection: false, audit: true });
  readonly formState = form(this.model, (path) => {
    required(path.protection, { message: 'Enable protection to continue' });
    disabled(path.audit, { when: 'Managed by workspace policy' });
  });
  protected readonly statesCode = `<ui-switch label="Product updates" />\n<ui-switch label="Two-factor authentication" [checked]="true" />`;
  protected readonly sizesCode = `<ui-switch size="sm" label="Small" />\n<ui-switch label="Medium" />`;
  protected readonly validationCode = `<ui-switch withErrorMessage [formField]="formState.protection" />`;
  protected readonly disabledCode = `disabled(path.audit, {when: 'Managed by workspace policy'});\n<ui-switch [formField]="formState.audit" />`;
}
