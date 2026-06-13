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

  readonly manyTabDetails: TabDemo[] = [
    {
      value: 'summary',
      label: 'Summary',
      title: 'Summary',
      description: 'A short tab used as a baseline next to longer labels.',
    },
    {
      value: 'workspace',
      label: 'Workspace access',
      title: 'Workspace access',
      description: 'Access controls, role assignment, and invite state for the workspace.',
    },
    {
      value: 'permissions',
      label: 'Permissions matrix',
      title: 'Permissions matrix',
      description: 'Dense permission groups with labels long enough to wrap in narrow layouts.',
    },
    {
      value: 'notifications',
      label: 'Notifications',
      title: 'Notifications',
      description: 'Email, product, and escalation notification preferences.',
    },
    {
      value: 'automations',
      label: 'Automation rules',
      title: 'Automation rules',
      description: 'Rule configuration, trigger states, and recent automation runs.',
    },
    {
      value: 'integrations',
      label: 'Connected integrations',
      title: 'Connected integrations',
      description: 'Provider connections, sync status, and authorization health.',
    },
    {
      value: 'imports',
      label: 'Imports',
      title: 'Imports',
      description: 'Queued uploads, mapping rules, and import validation output.',
    },
    {
      value: 'exports',
      label: 'Scheduled exports',
      title: 'Scheduled exports',
      description: 'Recurring exports, destinations, and delivery history.',
    },
    {
      value: 'audit',
      label: 'Audit trail',
      title: 'Audit trail',
      description: 'Recent events, actor details, and affected resource references.',
    },
    {
      value: 'security',
      label: 'Security posture',
      title: 'Security posture',
      description: 'Security checks, policy coverage, and account-level recommendations.',
    },
    {
      value: 'experiments',
      label: 'Experiments',
      title: 'Experiments',
      description: 'Feature flags, rollout cohorts, and experiment status.',
    },
    {
      value: 'advanced',
      label: 'Advanced configuration',
      title: 'Advanced configuration',
      description: 'Low-frequency settings that should remain reachable in crowded tab lists.',
    },
    {
      value: 'deprecated',
      label: 'Legacy options',
      title: 'Legacy options',
      description: 'Disabled legacy settings stay visible but cannot be selected.',
      disabled: true,
    },
  ];
}
