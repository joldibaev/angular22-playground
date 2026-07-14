import {
  afterRenderEffect,
  booleanAttribute,
  Component,
  computed,
  contentChildren,
  ElementRef,
  input,
  model,
  output,
  viewChildren,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Tab, TabContent, TabList, TabPanel, Tabs } from '@angular/aria/tabs';
import { UiTabItem } from './ui-tab-item/ui-tab-item';
import { nextId } from '../../shared/unique-id';

export type UiTabSize = 'sm' | 'md';

@Component({
  selector: 'ui-tab',
  imports: [NgTemplateOutlet, Tabs, TabList, Tab, TabPanel, TabContent],
  templateUrl: './ui-tab.html',
  styleUrl: './ui-tab.css',
  host: {
    '[class.ui-tab-fluid]': 'fluid()',
    '[class.ui-tab-line]': "variant() === 'line'",
    '[class.ui-tab-pills]': "variant() === 'pills'",
    '[class.ui-tab-sm]': "size() === 'sm'",
  },
})
export class UiTab {
  private readonly anchorId = nextId();

  selectedTab = model<string | undefined>(undefined);
  readonly tabSelected = output<string>();

  selectionMode = input<'follow' | 'explicit'>('follow');
  orientation = input<'horizontal' | 'vertical'>('horizontal');
  wrap = input(true, { transform: booleanAttribute });
  softDisabled = input(true, { transform: booleanAttribute });
  preserveContent = input(true, { transform: booleanAttribute });
  variant = input<'pills' | 'line'>('pills');
  size = input<UiTabSize>('md');
  fluid = input(false, { transform: booleanAttribute });
  ariaLabel = input('', { alias: 'aria-label' });
  ariaLabelledby = input('', { alias: 'aria-labelledby' });

  readonly items = contentChildren(UiTabItem);
  private readonly tabTriggers = viewChildren<ElementRef<HTMLButtonElement>>('tabTrigger');

  readonly enabledItems = computed(() => this.items().filter((item) => !item.disabled()));
  readonly activeAnchorName = computed(() => {
    const selectedTab = this.selectedTab();
    const index = this.items().findIndex((item) => item.value() === selectedTab);

    return index >= 0 ? this.tabAnchorName(index) : null;
  });

  constructor() {
    afterRenderEffect(() => {
      const firstEnabledItem = this.enabledItems()[0];

      if (firstEnabledItem && this.selectedTab() === undefined) {
        this.selectedTab.set(firstEnabledItem.value());
      }
    });

    afterRenderEffect(() => {
      const selectedTab = this.selectedTab();
      const selectedIndex = this.items().findIndex((item) => item.value() === selectedTab);

      this.tabTriggers()[selectedIndex]?.nativeElement.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
      });
    });
  }

  onSelectedTabChange(value: string | undefined) {
    if (!value || value === this.selectedTab()) {
      return;
    }

    this.selectedTab.set(value);
    this.tabSelected.emit(value);
  }

  tabAnchorName(index: number): string {
    return `--ui-tab-${this.anchorId}-${index}`;
  }
}
