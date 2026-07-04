import { Component, signal } from '@angular/core';
import { UiCard } from '../../../components/ui-card/ui-card';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';
@Component({
  selector: 'app-tabs-showcase',
  imports: [UiCard, UiTab, UiTabItem],
  templateUrl: './tabs-showcase.html',
  styleUrl: './tabs-showcase.css',
})
export class TabsShowcase {
  protected readonly selected = signal<string | undefined>('overview');
  protected readonly defaultCode = `<ui-tab aria-label="Account sections">\n  <ui-tab-item value="overview" label="Overview">Overview content</ui-tab-item>\n  <ui-tab-item value="activity" label="Activity">Activity content</ui-tab-item>\n</ui-tab>`;
  protected readonly variantsCode = `<ui-tab variant="pills" size="md">...</ui-tab>\n<ui-tab variant="line" size="sm">...</ui-tab>`;
  protected readonly verticalCode = `<ui-tab orientation="vertical" aria-label="Settings sections">...</ui-tab>`;
  protected readonly behaviorCode = `<ui-tab selectionMode="explicit" [wrap]="false" [softDisabled]="true">\n  <ui-tab-item value="overview" label="Overview">...</ui-tab-item>\n  <ui-tab-item value="billing" label="Billing" disabled>...</ui-tab-item>\n</ui-tab>`;
  protected readonly controlledCode = `readonly selected = signal<string | undefined>('overview');\n\n<ui-tab [(selectedTab)]="selected" queryParam="settings-tab" fluid>...</ui-tab>`;
}
