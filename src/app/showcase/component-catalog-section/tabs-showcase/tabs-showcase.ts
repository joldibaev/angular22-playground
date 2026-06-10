import { Component } from '@angular/core';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';

type TabDemo = {
  value: string;
  label: string;
  title: string;
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
    },
    {
      value: 'usage',
      label: 'Usage',
      title: 'Usage examples',
    },
    {
      value: 'disabled',
      label: 'Disabled',
      title: 'Disabled tabs',
      disabled: true,
    },
  ];
}
