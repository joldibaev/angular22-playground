import { ShowcaseCode } from '../showcase-code/showcase-code';
import { Component, signal } from '@angular/core';
import { UiCard } from '../../../components/ui-card/ui-card';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';
@Component({
  selector: 'app-tabs-showcase',
  imports: [ShowcaseCode, UiCard, UiTab, UiTabItem],
  templateUrl: './tabs-showcase.html',
  styleUrl: './tabs-showcase.css',
})
export class TabsShowcase {
  protected readonly selected = signal<string | undefined>('overview');
  protected readonly defaultCode = `<ui-tab aria-label="Account sections">
  <ui-tab-item value="overview" label="Overview">
    <p>Account summary and current plan.</p>
  </ui-tab-item>
  <ui-tab-item value="activity" label="Activity">
    <p>Recent account activity.</p>
  </ui-tab-item>
</ui-tab>`;
  protected readonly variantsCode = `<ui-tab variant="pills" aria-label="Pill tabs">
  <ui-tab-item value="one" label="Overview">Pill content</ui-tab-item>
  <ui-tab-item value="two" label="Metrics">Metrics content</ui-tab-item>
</ui-tab>
<ui-tab variant="line" size="sm" aria-label="Line tabs">
  <ui-tab-item value="one" label="Overview">Line content</ui-tab-item>
  <ui-tab-item value="two" label="Metrics">Metrics content</ui-tab-item>
</ui-tab>`;
  protected readonly verticalCode = `<ui-tab orientation="vertical" aria-label="Settings sections">
  <ui-tab-item value="profile" label="Profile">Profile settings</ui-tab-item>
  <ui-tab-item value="security" label="Security">Security settings</ui-tab-item>
  <ui-tab-item value="billing" label="Billing">Billing settings</ui-tab-item>
</ui-tab>`;
  protected readonly behaviorCode = `<ui-tab
  selectionMode="explicit"
  [wrap]="false"
  [softDisabled]="true"
  aria-label="Explicit tabs"
>
  <ui-tab-item value="overview" label="Overview">
    Use arrows to focus and Enter or Space to select.
  </ui-tab-item>
  <ui-tab-item value="activity" label="Activity">Activity content</ui-tab-item>
  <ui-tab-item value="billing" label="Billing" disabled>Unavailable</ui-tab-item>
</ui-tab>`;
 protected readonly controlledCode = `readonly selected = signal<string | undefined>('overview');

<ui-tab
  [(selectedTab)]="selected"
  queryParam="settings-tab"
  fluid
  aria-label="URL synced settings"
>
  <ui-tab-item value="overview" label="Overview">Overview</ui-tab-item>
  <ui-tab-item value="activity" label="Activity">Activity</ui-tab-item>
  <ui-tab-item value="settings" label="Settings">Settings</ui-tab-item>
</ui-tab>
<output>Selected: {{ selected() }}</output>`;
}
