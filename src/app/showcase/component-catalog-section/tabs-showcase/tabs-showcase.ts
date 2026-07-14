import { ShowcaseExample } from '../showcase-example/showcase-example';
import { Component, signal } from '@angular/core';
import { UiIcon } from '../../../components/ui-icon/ui-icon';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';
import { UiTabLabel } from '../../../components/ui-tab/ui-tab-item/ui-tab-label';
import { UiTabQueryParam } from '../../../components/ui-tab/ui-tab-query-param/ui-tab-query-param';

@Component({
  selector: 'app-tabs-showcase',
  imports: [ShowcaseExample, UiIcon, UiTab, UiTabItem, UiTabLabel, UiTabQueryParam],
  templateUrl: './tabs-showcase.html',
  styleUrl: './tabs-showcase.css',
})
export class TabsShowcase {
  protected readonly selected = signal<string | undefined>('overview');
  protected readonly defaultCode = `<ui-tab aria-label="Account sections">
  <ui-tab-item value="overview">
    <ng-template uiTabLabel>
      <ui-icon slot="start" name="outline-user" decorative />
      <span>Overview</span>
      <span slot="end" aria-label="3 notifications">3</span>
    </ng-template>
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
  protected readonly controlledCode = `import { signal } from '@angular/core';

readonly selected = signal<string | undefined>('overview');

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
