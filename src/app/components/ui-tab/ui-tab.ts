import {
  afterRenderEffect,
  booleanAttribute,
  Component,
  computed,
  contentChildren,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Tab, TabContent, TabList, TabPanel, Tabs } from '@angular/aria/tabs';
import { UiTabItem } from './ui-tab-item/ui-tab-item';

@Component({
  selector: 'ui-tab',
  imports: [
    NgTemplateOutlet,
    Tabs,
    TabList,
    Tab,
    TabPanel,
    TabContent,
  ],
  templateUrl: './ui-tab.html',
  styleUrl: './ui-tab.css',
  host: {
    '[class.ui-tab-fluid]': 'fluid()',
    '[class.ui-tab-line]': "appearance() === 'line'",
    '[class.ui-tab-pills]': "appearance() === 'pills'",
  },
})
export class UiTab {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly queryParamMap = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });
  private readonly tabListInteracted = signal(false);
  private readonly userSelectedTab = signal(false);

  selectedTab = model<string | undefined>(undefined);

  selectionMode = input<'follow' | 'explicit'>('follow');
  orientation = input<'horizontal' | 'vertical'>('horizontal');
  wrap = input(true);
  softDisabled = input(true);
  preserveContent = input(true);
  queryParam = input<string>();
  appearance = input<'pills' | 'line'>('pills');
  fluid = input(false, { transform: booleanAttribute });
  ariaLabel = input('', { alias: 'aria-label' });
  ariaLabelledby = input('', { alias: 'aria-labelledby' });

  readonly items = contentChildren(UiTabItem);

  readonly enabledItems = computed(() => this.items().filter((item) => !item.disabled()));
  private readonly queryParamValue = computed(() => {
    const queryParam = this.queryParam();

    return queryParam ? (this.queryParamMap().get(queryParam) ?? undefined) : undefined;
  });

  constructor() {
    afterRenderEffect(() => {
      const firstEnabledItem = this.enabledItems()[0];

      if (!firstEnabledItem) {
        return;
      }

      const queryParamValue = this.queryParamValue();

      if (queryParamValue && this.isEnabledTabValue(queryParamValue)) {
        this.selectedTab.set(queryParamValue);
        return;
      }

      if (this.selectedTab() !== undefined) {
        return;
      }

      this.selectedTab.set(firstEnabledItem.value());
    });

    afterRenderEffect(() => {
      const queryParam = this.queryParam();
      const selectedTab = this.selectedTab();
      const queryParamValue = this.queryParamValue();

      if (
        !queryParam ||
        !selectedTab ||
        !this.userSelectedTab() ||
        queryParamValue === selectedTab
      ) {
        return;
      }

      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { [queryParam]: selectedTab },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });
  }

  onSelectedTabChange(value: string | undefined) {
    if (!value || !this.tabListInteracted()) {
      return;
    }

    this.selectedTab.set(value);
    this.userSelectedTab.set(true);
  }

  onTabListInteraction() {
    this.tabListInteracted.set(true);
  }

  private isEnabledTabValue(value: string): boolean {
    return this.enabledItems().some((item) => item.value() === value);
  }
}
