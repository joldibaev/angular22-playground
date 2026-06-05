import {
  afterRenderEffect,
  Component,
  computed,
  contentChildren,
  input,
  model,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Tab, TabContent, TabList, TabPanel, Tabs } from '@angular/aria/tabs';
import { UiTabItem } from './ui-tab-item/ui-tab-item';

@Component({
  selector: 'ui-tab',
  imports: [NgTemplateOutlet, Tabs, TabList, Tab, TabPanel, TabContent],
  templateUrl: './ui-tab.html',
  styleUrl: './ui-tab.css',
})
export class UiTab {
  selectedTab = model<string | undefined>(undefined);

  selectionMode = input<'follow' | 'explicit'>('follow');
  orientation = input<'horizontal' | 'vertical'>('horizontal');
  wrap = input(true);
  softDisabled = input(true);
  preserveContent = input(true);

  readonly items = contentChildren(UiTabItem);

  readonly enabledItems = computed(() => this.items().filter((item) => !item.disabled()));

  constructor() {
    afterRenderEffect(() => {
      if (this.selectedTab() !== undefined) {
        return;
      }

      const firstEnabledItem = this.enabledItems()[0];

      if (firstEnabledItem) {
        this.selectedTab.set(firstEnabledItem.value());
      }
    });
  }
}
