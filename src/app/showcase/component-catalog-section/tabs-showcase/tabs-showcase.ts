import { Component } from '@angular/core';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';

type TabDemo = {
  value: string;
  label: string;
  title: string;
  description: string;
  disabled?: boolean;
};

@Component({
  selector: 'app-tabs-showcase',
  imports: [UiTab, UiTabItem],
  templateUrl: './tabs-showcase.html',
  styles: `
    :host {
      display: block;
      min-width: 0;
    }
  `,
})
export class TabsShowcase {
  readonly tabDetails: TabDemo[] = [
    {
      value: 'docs',
      label: 'Docs',
      title: 'Documentation',
      description: 'Author-facing guidance, examples, and component anatomy notes.',
    },
    {
      value: 'usage',
      label: 'Usage',
      title: 'Usage examples',
      description: 'Common flows that show how tabs behave in dense product screens.',
    },
    {
      value: 'api',
      label: 'API',
      title: 'API reference',
      description: 'Inputs, model bindings, query-param sync, and keyboard behavior.',
    },
    {
      value: 'theming',
      label: 'Theming',
      title: 'Theme tokens',
      description: 'Color, radius, indicator, and focus-ring tokens exposed by the component.',
    },
    {
      value: 'a11y',
      label: 'Accessibility',
      title: 'Accessibility contract',
      description: 'Roles, focus management, disabled states, and panel labelling expectations.',
    },
    {
      value: 'disabled',
      label: 'Disabled',
      title: 'Disabled tabs',
      description: 'Disabled tabs stay visible but are skipped by keyboard and pointer selection.',
      disabled: true,
    },
  ];

  readonly enabledTabDetails: TabDemo[] = [
    {
      value: 'overview',
      label: 'Overview',
      title: 'Overview',
      description: 'A compact summary for dashboards and account sections.',
    },
    {
      value: 'metrics',
      label: 'Metrics',
      title: 'Metrics',
      description: 'Operational values, trend cards, and chart controls.',
    },
    {
      value: 'activity',
      label: 'Activity',
      title: 'Activity',
      description: 'Recent events, audit rows, and user-visible history.',
    },
    {
      value: 'settings',
      label: 'Settings',
      title: 'Settings',
      description: 'Configuration fields and secondary actions.',
    },
    {
      value: 'billing',
      label: 'Billing',
      title: 'Billing',
      description: 'Invoices, plan details, and payment method management.',
    },
  ];
}
